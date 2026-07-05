/**
 * 和弦分析流程编排
 *
 * 纯函数，可在 Worker 和主线程中均可调用。
 * 编排完整分析流水线：essentia 特征提取 → 帧级匹配 → Viterbi 解码 →
 * 段落合并 → 级数映射。
 *
 * @module services/chord/pipeline
 */

import type { SongAnalysis, ChordSegment } from '@/shared/types/types';
// essentia 静态 import 导致 Mako 崩溃，改为动态 import
import { matchAllFrames, type MatchedFrame } from './chord-matcher';
import { decodeChordSequence } from './viterbi';
import { mergeSegments } from './segmenter';
import {
  parseChord,
  type ParsedChord,
} from '@/services/romanizer/chord-parser';
import { Romanizer } from '@/services/romanizer/romanizer';

/** 进度回调类型 */
export type ProgressCallback = (
  step: 'hpcp' | 'key_bpm' | 'chord_match' | 'viterbi' | 'romanize' | 'done',
  percent: number,
) => void;

/**
 * 和弦分析流水线
 *
 * 全流程：
 *   1. extractFeatures（HPCP + Key + BPM）→ 20-40%
 *   2. matchAllFrames（余弦相似度匹配）→ 40-55%
 *   3. decodeChordSequence（Viterbi 解码）→ 55-70%
 *   4. mergeSegments（段落合并）→ 70-80%
 *   5. Romanizer.annotateProgression（级数映射）→ 80-95%
 *   6. 组装返回 → 100%
 *
 * @param audioBuffer - 已解码的 AudioBuffer
 * @param fileName - 原始文件名
 * @param fileHash - SHA-256 文件哈希
 * @param fileSize - 文件大小（字节）
 * @param onProgress - 进度回调
 * @returns 完整分析结果
 */
export async function analyzePipeline(
  audioBuffer: AudioBuffer,
  fileName: string,
  fileHash: string,
  fileSize: number,
  onProgress?: ProgressCallback,
  // essentia 特征提取器由调用方注入，绕开 Mako 打包崩溃
  extractFeaturesFn?: (...args: any[]) => any,
): Promise<SongAnalysis> {
  const startTime = performance.now();
  const sampleRate = audioBuffer.sampleRate;
  const duration = audioBuffer.duration;

  // ── Step 1: Essentia 特征提取 ──
  if (!extractFeaturesFn) {
    throw new Error('extractFeatures 未注入');
  }
  onProgress?.('hpcp', 10);
  const features = await extractFeaturesFn(audioBuffer);

  onProgress?.('key_bpm', 35);

  // ── Step 2: 帧级和弦匹配（使用 12-bin chroma）──
  onProgress?.('chord_match', 40);
  const frameMatches: MatchedFrame[] = matchAllFrames(features.chroma);

  // ── Step 3: Viterbi 解码 ──
  onProgress?.('viterbi', 55);
  const frameChords = decodeChordSequence(frameMatches);

  // ── Step 4: 段落合并 ──
  const hopSize = 2048;
  const frameDuration = hopSize / sampleRate;
  const rawSegments = mergeSegments(frameChords, frameDuration);
  onProgress?.('viterbi', 65);  // mergeSegments 完成
  // ── Step 5: 级数映射（完整 chord-romanizer 翻写）──
  onProgress?.('romanize', 70);

  const keyRoot = features.key || 'C';
  const romanizer = new Romanizer(keyRoot);

  // 提取非 N 和弦的索引-和弦对（保留 N 占位，不破坏索引）
  const chordNames = rawSegments.map((s) => s.chord);
  const indexPairs: { index: number; chord: ParsedChord }[] = [];
  for (let i = 0; i < chordNames.length; i++) {
    const c = chordNames[i];
    if (c === 'N' || c === 'N.C.') continue;
    const parsed = parseChord(c);
    if (parsed) {
      indexPairs.push({ index: i, chord: parsed });
    }
  }

  // Romanizer 只处理有效和弦
  const romanizedResults =
    indexPairs.length > 0
      ? romanizer.annotateProgression(indexPairs.map((p) => p.chord))
      : [];

  // 建立 原始索引 → RomanizedChord 的映射
  const romanizedMap = new Map(
    indexPairs.map((p, ri) => [p.index, romanizedResults[ri]]),
  );

  // 组装最终 ChordSegment 列表
  const chordSegments: ChordSegment[] = rawSegments.map((seg, i) => {
    const romanized = romanizedMap.get(i);
    return {
      chord: seg.chord,
      degree: romanized?.roman ?? seg.chord,
      startTime: seg.startTime,
      endTime: seg.endTime,
      confidence: romanized ? 0.8 : seg.chord === 'N' ? 0 : 0.8,
    };
  });

  // ── Step 6: 组装返回 ──
  onProgress?.('done', 100);

  const endTime = performance.now();
  const analysisDurationMs = endTime - startTime;

  return {
    fileHash,
    fileName,
    fileSize,
    duration,
    sampleRate,
    key: `${keyRoot} ${features.scale.charAt(0).toUpperCase()}${features.scale.slice(1)}`,
    keyConfidence: features.keyStrength,
    bpm: features.bpm,
    bpmConfidence: 0.8, // essentia.js RhythmExtractor2013 不直接返回置信度
    chordSegments,
    vocabularyLevel: 'extended',
    analyzedAt: Date.now(),
    analysisDurationMs,
  };
}
