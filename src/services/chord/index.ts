/**
 * 和弦检测服务 — 统一导出
 *
 * 和弦识别流水线：
 *   帧级匹配 → 中值滤波 → Beat 聚合 → Romanizer（和弦→级数）
 * 信号处理（HPCP 色度提取）由 Essentia.js 在 Worker 中完成。
 *
 * @module services/chord
 */

// ── 和弦模板 ──
export {
  generateTemplates,
  EXTENDED_CHORD_NAMES,
  CHORD_QUALITIES,
  NOTES,
} from './chord-templates';
export type {
  ChordTemplate,
  ChordQuality,
  ChordQualityType,
  VocabularyLevel,
} from './chord-templates';

// ── 帧级匹配 ──
export { matchFrame, matchAllFrames } from './chord-matcher';
export type { MatchedFrame } from './chord-matcher';
