/**
 * 和弦检测服务 — 统一导出
 *
 * 翻写自 Chordino (C4DM) 的和弦匹配 + HMM/Viterbi 解码层。
 * 信号处理层（NNLS Chroma 提取）由 Essentia.js HPCP 替代。
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

// ── Viterbi 解码 ──
export { viterbiDecode, decodeChordSequence } from './viterbi';

// ── 段落合并 ──
export { mergeSegments } from './segmenter';
export type { RawSegment } from './segmenter';

// ── 分析流水线 ──
export { analyzePipeline } from './pipeline';
export type { ProgressCallback } from './pipeline';

// ── 缓存 ──
export {
  getCachedAnalysis,
  cacheAnalysis,
  cleanExpired,
  getCacheStats,
  clearAllCache,
} from './cache';
