// ChordSync ES6 Worker
import Essentia from 'essentia.js/dist/essentia.js-core.es.js';
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';
import { matchAllFrames } from './chord-matcher';
import { Romanizer } from '@/services/romanizer/romanizer';
import { parseChord } from '@/services/romanizer/chord-parser';

const essentia = new Essentia(EssentiaWASM);
const BEAT_GROUP = 2;

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;
  if (msg.type !== 'analyze') return;

  try {
    const audioData = new Float32Array(msg.audioBuffer);
    const sr: number = msg.sampleRate;
    const signalVec = essentia.arrayToVector(audioData);

    // Key
    self.postMessage({type:'log',msg:'Key...'});
    const keyResult = essentia.KeyExtractor(signalVec,true,4096,4096,12,3500,60,25,0.2,'temperley',sr,0.0001,440,'cosine','hann');

    // BPM
    self.postMessage({type:'log',msg:'Beat...'});
    const beatResult = essentia.BeatTrackerMultiFeature(signalVec,208,40);
    const tickArr = essentia.vectorToArray(beatResult.ticks);
    let bpm = 120;
    if (tickArr.length >= 2) {
      const iv: number[] = [];
      for (let i=1;i<tickArr.length;i++) iv.push(tickArr[i]-tickArr[i-1]);
      iv.sort((a,b)=>a-b); bpm = Math.round(60/iv[Math.floor(iv.length/2)]);
    }
    const beatList: {time:number;isDownbeat:boolean}[] = tickArr.map((t:number,i:number)=>({time:t,isDownbeat:i%4===0}));

    // HPCP
    self.postMessage({type:'log',msg:`HPCP: ${keyResult.key} ${keyResult.scale} ${bpm}BPM`});
    const frameSize=4096,hop=2048;
    const numFrames = Math.floor((audioData.length-frameSize)/hop)+1;
    const chromaFrames: Float32Array[] = [];
    let peakErr=0;
    for (let i=0;i<numFrames;i++) {
      if (i%2000===0) self.postMessage({type:'log',msg:`Frame ${i}/${numFrames}...`});
      const fv = essentia.arrayToVector(audioData.slice(i*hop,i*hop+frameSize));
      try {
        const w=essentia.Windowing(fv,true,frameSize,'hann',0,true);
        const sp=essentia.Spectrum(w.frame,frameSize);
        const p=essentia.SpectralPeaks(sp.spectrum,0,5000,100,40,'frequency',sr);
        if ((p.frequencies as any).size()<1) continue;
        const h=essentia.HPCP(p.frequencies,p.magnitudes,true,500,0,5000,false,40,true,'unitMax',440,sr,12,'cosine',1.0);
        chromaFrames.push(essentia.vectorToArray(h.hpcp) as Float32Array);
      } catch { peakErr++; }
    }

    // Chord matching
    self.postMessage({type:'log',msg:`HPCP done: ${chromaFrames.length} fr, err=${peakErr}`});
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
        const rom=new Romanizer(keyResult.key,false);
        const ann=rom.annotateProgression(parsed);
        chordSegments=rs.map((s,i)=>({startTime:s.s,endTime:s.e,chord:s.c,degree:ann[i]?.roman||s.c,confidence:0.7}));
      }
    }

    self.postMessage({type:'log',msg:`Done: ${chordSegments.length} chords`});
    self.postMessage({type:'result',features:{
      key:keyResult.key||'C',scale:keyResult.scale||'major',
      keyStrength:keyResult.strength||0,bpm,ticks:tickArr,
      beatList,chordSegments,hopSize:hop,
    }});
  } catch(err:any) {
    self.postMessage({type:'error',error:err.message||String(err)});
  }
};
