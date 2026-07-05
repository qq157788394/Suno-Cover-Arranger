// ChordSync ES6 Worker
import Essentia from 'essentia.js/dist/essentia.js-core.es.js';
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';
import { matchAllFrames } from './chord-matcher';
import { Romanizer } from '@/services/romanizer/romanizer';
import { parseChord } from '@/services/romanizer/chord-parser';

const essentia = new Essentia(EssentiaWASM);
const BEAT_GROUP = 2;

/** 自然音名 + 半音值映射（用于相对大调计算） */
const NOTE_SEMITONES: Record<string, number> = {
  C:0, D:2, E:4, F:5, G:7, A:9, B:11,
};
const NOTE_LETTERS = ['C','D','E','F','G','A','B'];
const SHARP_TO_FLAT: Record<string, string> = {
  'C#':'Db','D#':'Eb','F#':'Gb','G#':'Ab','A#':'Bb',
};

/** 音名上行指定半音数 */
function transposeSemitones(note: string, semitones: number): string {
  const letter = note.charAt(0).toUpperCase();
  const acc = (note.match(/#/g)||[]).length - (note.match(/b/g)||[]).length;
  const basePc = NOTE_SEMITONES[letter] ?? 0;
  const targetPc = ((basePc + acc + semitones) % 12 + 12) % 12;
  const steps = Math.round(semitones * 7 / 12); // 近似自然音名步数
  const targetLetterIdx = (NOTE_LETTERS.indexOf(letter) + steps) % 7;
  const targetLetter = NOTE_LETTERS[targetLetterIdx >= 0 ? targetLetterIdx : targetLetterIdx+7];
  const naturalPc = NOTE_SEMITONES[targetLetter] ?? 0;
  let diff = ((targetPc - naturalPc) % 12 + 12) % 12;
  if (diff > 6) diff -= 12;
  const accStr = diff === 0 ? '' : diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff);
  return targetLetter + accStr;
}

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;
  if (msg.type !== 'analyze') return;

  try {
    const audioData = new Float32Array(msg.audioBuffer);
    const sr: number = msg.sampleRate;
    const signalVec = essentia.arrayToVector(audioData);

    // Key — KeyExtractor 参数按 essentia.js 官方文档顺序
    // https://essentia.upf.edu/reference/std_KeyExtractor.html
    self.postMessage({type:'log',msg:'Key...'});
    const keyParams = {
      averageDetuningCorrection: true,
      frameSize: 4096,
      hopSize: 4096,
      hpcpSize: 12,              // 12 半音色度
      maxFrequency: 3500,        // 高频截止（Hz），和弦信息集中在中低频
      maximumSpectralPeaks: 60,  // 最大频谱峰值数量
      minFrequency: 80,           // 低频截止（Hz），低于 E2=82Hz 的和弦根音极少
      pcpThreshold: 0.2,        // HPCP 归一化阈值
      profileType: 'temperley' as const, // Krumhansl-Kessler 调性轮廓
      sampleRate: sr,
      spectralPeaksThreshold: 0.0001,
      tuningFrequency: 440,     // A4 = 440Hz
      weightType: 'cosine' as const,    // 余弦加权
      windowType: 'hann' as const,      // Hann 窗
    };
    const keyResult = essentia.KeyExtractor(
      signalVec,
      keyParams.averageDetuningCorrection,
      keyParams.frameSize,
      keyParams.hopSize,
      keyParams.hpcpSize,
      keyParams.maxFrequency,
      keyParams.maximumSpectralPeaks,
      keyParams.minFrequency,
      keyParams.pcpThreshold,
      keyParams.profileType,
      keyParams.sampleRate,
      keyParams.spectralPeaksThreshold,
      keyParams.tuningFrequency,
      keyParams.weightType,
      keyParams.windowType,
    );

    // BPM — maxTempo=208 / minTempo=40
    self.postMessage({type:'log',msg:'Beat...'});
    const beatResult = essentia.BeatTrackerMultiFeature(signalVec,208,40);
    const tickArr = essentia.vectorToArray(beatResult.ticks);
    let bpm = 120, bpmConfidence = 0.6;
    if (tickArr.length >= 2) {
      const iv: number[] = [];
      for (let i=1;i<tickArr.length;i++) {
        const d = tickArr[i]-tickArr[i-1];
        if (d >= 0.15 && d <= 2.0) iv.push(d); // 过滤异常间隔（30-400 BPM 范围）
      }
      if (iv.length >= 2) {
        iv.sort((a,b)=>a-b);
        bpm = Math.round(60 / iv[Math.floor(iv.length/2)]);
        bpmConfidence = Math.min(0.95, 0.5 + iv.length / (tickArr.length - 1));
      }
    }
    const beatList: {time:number;isDownbeat:boolean}[] = tickArr.map((t:number,i:number)=>({time:t,isDownbeat:i%4===0}));

    // HPCP — 逐帧提取 12-bin 色度，frameSize=4096 / hop=2048（50% 重叠）
    self.postMessage({type:'log',msg:`HPCP: ${keyResult.key} ${keyResult.scale} ${bpm}BPM`});
    const frameSize=4096,hop=2048;
    const numFrames = Math.floor((audioData.length-frameSize)/hop)+1;
    const chromaFrames: Float32Array[] = [];
    let peakErr=0, skipCount=0;
    for (let i=0;i<numFrames;i++) {
      if (i%2000===0) self.postMessage({type:'log',msg:`Frame ${i}/${numFrames}...`});
      const fv = essentia.arrayToVector(audioData.slice(i*hop,i*hop+frameSize));
      try {
        // Windowing: 归一化 Hann 窗，零填充
        const w=essentia.Windowing(fv,true,frameSize,'hann',0,true);
        // Spectrum → SpectralPeaks: 提取 100 个最强峰值（0-5000Hz）
        const sp=essentia.Spectrum(w.frame,frameSize);
        const p=essentia.SpectralPeaks(sp.spectrum,0,5000,100,80,'frequency',sr);
        if ((p.frequencies as any).size()<1) {
          // 无频谱峰值（静音/极低频），插入零向量占位保持时间线连续
          chromaFrames.push(new Float32Array(12));
          skipCount++;
          continue;
        }
        const h=essentia.HPCP(
          p.frequencies, p.magnitudes,  // 频谱峰值频率/幅值
          true,       // bandPreset: 使用预定义频带分割
          500,        // bandSplitFrequency（Hz）
          0,          // harmonics: 0=不用谐波填充 bins
          5000,       // maxFrequency（Hz）
          false,      // maxShifted
          80,         // minFrequency（Hz），低于 E2 的和弦根音极少
          true,       // nonLinear: 非线性映射
          'unitMax',  // normalized: 单位最大值归一化
          440,        // referenceFrequency: A4=440Hz
          sr,         // sampleRate
          12,         // size: 12 半音色度
          'cosine',   // weightType: 余弦窗
          1.0,        // windowSize
        );
        chromaFrames.push(essentia.vectorToArray(h.hpcp) as Float32Array);
      } catch {
        // HPCP 异常，插入零向量占位 + 计数
        chromaFrames.push(new Float32Array(12));
        peakErr++;
      }
    }

    // Chord matching
    self.postMessage({
      type:'log',
      msg:`HPCP done: ${chromaFrames.length} fr, err=${peakErr}, skip=${skipCount}`
    });
    let chordSegments:{startTime:number;endTime:number;chord:string;degree:string;confidence:number}[]=[];
    if (chromaFrames.length>0) {
      const matched = matchAllFrames(chromaFrames);
      const fd = hop/sr;
      // 5-frame median
      const fc:string[]=[];
      for(let i=0;i<matched.length;i++){
        const s=Math.max(0,i-2),e=Math.min(matched.length,i+3);
        const cnt:Record<string,number>={};
        for(let j=s;j<e;j++){const c=matched[j].chord;cnt[c]=(cnt[c]||0)+matched[j].confidence;}
        fc.push(Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0]?.[0]||'N');
      }
      // Beat aggregation
      const bc:string[]=[], bt:{s:number;e:number}[]=[];
      for(let bi=0;bi+BEAT_GROUP<=tickArr.length;bi+=BEAT_GROUP){
        const ts=tickArr[bi], te=tickArr[Math.min(bi+BEAT_GROUP,tickArr.length-1)];
        if(te-ts<0.3) continue;
        const f0=Math.max(0,Math.floor(ts/fd)), f1=Math.min(fc.length,Math.ceil(te/fd));
        const cnt:Record<string,number>={};
        for(let fi=f0;fi<f1;fi++){const c=fc[fi]||'N';cnt[c]=(cnt[c]||0)+1;}
        const best=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
        if(best&&best[0]!=='N'){bc.push(best[0]);bt.push({s:ts,e:te});}
      }
      // Merge + Romanize
      if(bc.length>0){
        const rs:{c:string;s:number;e:number}[]=[];
        let seg={c:bc[0],s:bt[0].s,e:bt[0].e};
        for(let i=1;i<bc.length;i++){if(bc[i]===seg.c)seg.e=bt[i].e;else{rs.push(seg);seg={c:bc[i],s:bt[i].s,e:bt[i].e};}}
        rs.push(seg);
        const parsed=rs.map(s=>parseChord(s.c)).filter(Boolean);
        // Minor → 相对大调转调：功能级数始终以大调为参照
        // F minor(3个b) 的相对大调是 Ab major(4个b)，用 Ab 推算
        const romanizerKey = keyResult.scale === 'minor'
          ? transposeSemitones(keyResult.key, 3)  // minor → 上行小三度 = 相对大调
          : keyResult.key;
        const rom=new Romanizer(romanizerKey,false);
        const ann=rom.annotateProgression(parsed);
        chordSegments=rs.map((s,i)=>({startTime:s.s,endTime:s.e,chord:s.c,degree:ann[i]?.roman||s.c,confidence:0.7}));
      }
    }

    self.postMessage({type:'log',msg:`Done: ${chordSegments.length} chords`});
    self.postMessage({type:'result',features:{
      key:keyResult.key||'C',scale:keyResult.scale||'major',
      keyStrength:keyResult.strength||0,bpm,bpmConfidence,ticks:tickArr,
      beatList,chordSegments,hopSize:hop,
    }});
  } catch(err:any) {
    self.postMessage({type:'error',error:err.message||String(err)});
  }
};
