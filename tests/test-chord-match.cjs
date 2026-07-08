// Step 3: 和弦匹配测试
// 从 tests/chord-features.json 加载特征 → chord-matcher → viterbi → segmenter

const fs = require("node:fs");
const testData = JSON.parse(
  fs.readFileSync("tests/chord-features.json", "utf8"),
);

console.log(
  `Loaded ${testData.chromaFrames.length} chroma frames, key=${testData.key} ${testData.scale}, bpm=${testData.bpm}`,
);

// 导入自己的 chord-matcher 和 viterbi
// 这些是 ES 模块，需要用 ts-node 或 tsx 运行
// 先在这里用 JS 实现简版验证逻辑

// 和弦模板（从 chord-templates.ts 提取）
const CHORD_TEMPLATES = {
  C: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  "C#": [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  D: [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  Eb: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  E: [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  F: [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  "F#": [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  G: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  Ab: [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  A: [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  Bb: [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  B: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
  Cm: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  "C#m": [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  Dm: [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  Ebm: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  Em: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  Fm: [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  "F#m": [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  Gm: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  Abm: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  Am: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  Bbm: [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  Bm: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
};

// 余弦相似度匹配
function matchFrame(chroma) {
  let bestChord = "N";
  let bestScore = -Infinity;
  for (const [name, tmpl] of Object.entries(CHORD_TEMPLATES)) {
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < 12; i++) {
      dot += chroma[i] * tmpl[i];
      normA += chroma[i] * chroma[i];
      normB += tmpl[i] * tmpl[i];
    }
    if (normA === 0 || normB === 0) continue;
    const score = dot / Math.sqrt(normA * normB);
    if (score > bestScore) {
      bestScore = score;
      bestChord = name;
    }
  }
  return { chord: bestChord, confidence: bestScore };
}

// 逐帧匹配
const frames = testData.chromaFrames;
const matched = [];
for (let i = 0; i < frames.length; i++) {
  const m = matchFrame(frames[i]);
  matched.push(m);
}

// 统计和弦分布
const counts = {};
for (const m of matched) {
  counts[m.chord] = (counts[m.chord] || 0) + 1;
}

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log(`\nTop 10 chords across ${matched.length} frames:`);
sorted.slice(0, 10).forEach(([chord, count]) => {
  console.log(
    `  ${chord}: ${count} frames (${((count / matched.length) * 100).toFixed(1)}%)`,
  );
});

// 简单段落合并
const segments = [];
for (let i = 0; i < matched.length; i++) {
  const seg = { ...matched[i], startFrame: i, endFrame: i };
  if (
    segments.length > 0 &&
    segments[segments.length - 1].chord === seg.chord
  ) {
    segments[segments.length - 1].endFrame = i;
  } else {
    segments.push(seg);
  }
}

const frameDuration = testData.hopSize / testData.sampleRate;
console.log(`\nChord segments (${segments.length} total, showing first 20):`);
segments.slice(0, 20).forEach((s) => {
  console.log(
    `  ${s.chord} | ${(s.startFrame * frameDuration).toFixed(1)}s-${((s.endFrame + 1) * frameDuration).toFixed(1)}s`,
  );
});
