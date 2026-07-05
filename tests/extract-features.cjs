const essentia = require('essentia.js');
const fs = require('node:fs');
const { execSync } = require('node:child_process');

// 1. 解码 MP3 → WAV
const mp3 =
  '/Users/xiakeyao/Documents/trae_projects/Suno-Cover-Arranger/prd/百年孤寂 - 王菲.mp3';
const wav = '/tmp/test_chord.wav';
execSync(
  `afconvert -f WAVE -d LEI16 -c 1 -r 16000 "${mp3}" "${wav}" 2>/dev/null`,
);

const wavBuffer = fs.readFileSync(wav);
const pcm = new Int16Array(wavBuffer.buffer.slice(44));
const floatData = new Float32Array(pcm.length);
for (let i = 0; i < pcm.length; i++) floatData[i] = pcm[i] / 32768;
const sr = 16000;

const e = new essentia.Essentia(essentia.EssentiaWASM);
const signalVec = e.arrayToVector(Array.from(floatData));

// Key
const keyResult = e.KeyExtractor(
  signalVec,
  true,
  4096,
  4096,
  12,
  3500,
  60,
  25,
  0.2,
  'temperley',
  sr,
  0.0001,
  440,
  'cosine',
  'hann',
);

// BPM
const beats = e.BeatTrackerMultiFeature(signalVec, 208, 40);
const tickArr = e.vectorToArray(beats.ticks);
let bpm = 120;
if (tickArr.length >= 2) {
  const intervals = [];
  for (let i = 1; i < tickArr.length; i++)
    intervals.push(tickArr[i] - tickArr[i - 1]);
  intervals.sort((a, b) => a - b);
  bpm = Math.round(60 / intervals[Math.floor(intervals.length / 2)]);
}

// Per-frame HPCP (12-bin chroma for our chord-matcher)
const frameSize = 4096,
  hop = 2048;
const numFrames = Math.floor((floatData.length - frameSize) / hop) + 1;
const chromaFrames = [];
let peakErr = 0;

console.log(`Processing ${numFrames} frames...`);
for (let i = 0; i < numFrames; i++) {
  if (i % 1000 === 0) console.log(`  Frame ${i}/${numFrames}...`);
  const sl = floatData.slice(i * hop, i * hop + frameSize);
  const fv = e.arrayToVector(Array.from(sl));
  try {
    const w = e.Windowing(fv, true, frameSize, 'hann', 0, true);
    const s = e.Spectrum(w.frame, frameSize);
    const p = e.SpectralPeaks(s.spectrum, 0, 5000, 100, 40, 'frequency', sr);
    if (p.frequencies.size() < 1) continue;
    const h = e.HPCP(
      p.frequencies,
      p.magnitudes,
      true,
      500,
      0,
      5000,
      false,
      40,
      true,
      'unitMax',
      440,
      sr,
      12,
      'cosine',
      1.0,
    );
    chromaFrames.push(Array.from(e.vectorToArray(h.hpcp)));
  } catch {
    peakErr++;
  }
}

// 保存
const testData = {
  fileName: '百年孤寂 - 王菲.mp3',
  sampleRate: sr,
  duration: floatData.length / sr,
  key: keyResult.key,
  scale: keyResult.scale,
  keyStrength: keyResult.strength,
  bpm,
  ticks: tickArr,
  hopSize: hop,
  frameCount: chromaFrames.length,
  peakErrors: peakErr,
  chromaFrames: chromaFrames.slice(0, 500),
};

const outPath =
  '/Users/xiakeyao/Documents/trae_projects/Suno-Cover-Arranger/tests/chord-features.json';
fs.writeFileSync(outPath, JSON.stringify(testData, null, 2));
console.log(
  `\nSaved: ${chromaFrames.length} chroma frames, key=${keyResult.key} ${keyResult.scale}, bpm=${bpm}`,
);
console.log(
  `File: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)}KB)`,
);
