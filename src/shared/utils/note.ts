/**
 * 音名工具：转调（关系大调）与调性标签格式化。
 *
 * 单一来源：网页版（useChordAnalysis）与引擎版（AnalysisResultCard）共用，
 * 保证同一首小调歌两处拼写逐字符一致（如 A minor -> C major）。
 *
 * @module shared/utils/note
 */

const NOTE_SEMITONES_MAP: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const NOTE_LETTERS_ARR = ["C", "D", "E", "F", "G", "A", "B"];

/** 音名上行指定半音数（用于 Minor -> 相对大调显示）。 */
export function transposeSemitones(note: string, semitones: number): string {
  if (!note) return "C";
  const letter = note.charAt(0).toUpperCase();
  const acc = (note.match(/#/g) || []).length - (note.match(/b/g) || []).length;
  const basePc = NOTE_SEMITONES_MAP[letter] ?? 0;
  const targetPc = (((basePc + acc + semitones) % 12) + 12) % 12;
  const steps = Math.round((semitones * 7) / 12);
  const idx = (NOTE_LETTERS_ARR.indexOf(letter) + steps) % 7;
  const targetLetter = NOTE_LETTERS_ARR[idx >= 0 ? idx : idx + 7];
  const naturalPc = NOTE_SEMITONES_MAP[targetLetter] ?? 0;
  let diff = (((targetPc - naturalPc) % 12) + 12) % 12;
  if (diff > 6) diff -= 12;
  return (
    targetLetter +
    (diff === 0 ? "" : diff > 0 ? "#".repeat(diff) : "b".repeat(-diff))
  );
}

/**
 * 调性标签格式化：
 * - 小调 -> "X minor / Y major"（Y 为关系大调，与网页版一致）
 * - 大调 -> "X major"
 * - 非标准 / null / 空 -> 原样或空串
 */
export function formatKeyLabel(key: string | null | undefined): string {
  if (!key) return "";
  const m = key.trim().match(/^([A-G][#b]?)\s+(minor|major)$/i);
  if (!m) return key;
  const tonic = m[1];
  const scale = m[2].toLowerCase();
  if (scale === "minor") {
    const relative = transposeSemitones(tonic, 3);
    return `${tonic} minor / ${relative} major`;
  }
  return `${tonic} major`;
}
