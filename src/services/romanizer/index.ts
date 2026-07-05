/**
 * 和弦 → 级数映射服务 — 统一导出
 *
 * 完整翻译自 chord-romanizer (MIT, 1298 行 Python)。
 * 提供和弦解析、音名拼写、罗马数字级数标注功能。
 *
 * @module services/romanizer
 * @see https://pypi.org/project/chord-romanizer/ — 原作 (MIT)
 */

// ── 和弦解析 ──
export {
  parseChord,
  normalizeNotePc,
  NOTE_LETTERS,
  NOTE_NAMES,
  SEMITONE_MAP,
} from './chord-parser';
export type { ParsedChord } from './chord-parser';

// ── 音名拼写 ──
export { NoteSpeller } from './note-speller';

// ── 级数映射 ──
export { Romanizer } from './romanizer';
export type { RomanizedChord } from './romanizer';
