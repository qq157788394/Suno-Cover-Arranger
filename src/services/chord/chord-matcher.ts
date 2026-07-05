/**
 * 帧级和弦匹配
 *
 * 翻写自 Chordino `Chordino.cpp` 中的帧级余弦相似度计算。
 * 对每一帧 12-bin chroma 向量计算与所有和弦模板的余弦相似度，
 * 返回最佳匹配和弦名和置信度。
 *
 * @module services/chord/chord-matcher
 */

import {
  type ChordTemplate,
  generateTemplates,
  type VocabularyLevel,
} from './chord-templates';

/** 单帧匹配结果 */
export interface MatchedFrame {
  /** 最佳匹配和弦名 */
  chord: string;
  /** 余弦相似度置信度 0-1 */
  confidence: number;
}

/**
 * 余弦相似度 = (a·b) / (|a| × |b|)
 *
 * @param a - 向量 a
 * @param b - 向量 b
 * @returns 相似度 [-1, 1]，这里两向量均为正值，结果为 [0, 1]
 */
function cosineSimilarity(a: Float32Array | number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < 12; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom < 1e-10) return 0;
  return dot / denom;
}

/**
 * 对单个 chroma 帧匹配最佳和弦模板
 *
 * @param chroma - 12-bin chroma 向量（Float32Array 或 number[]）
 * @param templates - 和弦模板列表
 * @returns 最佳匹配结果，若能量极低则返回 N（无和弦）
 */
export function matchFrame(
  chroma: Float32Array | number[],
  templates: ChordTemplate[],
): MatchedFrame {
  // 能量检测：若 chroma 范数极小 → 无和弦
  const chromaNorm = Math.sqrt(
    Array.from(chroma).reduce((s, v) => s + v * v, 0),
  );
  if (chromaNorm < 0.01) {
    return { chord: 'N', confidence: 0 };
  }

  let best: MatchedFrame = { chord: 'N', confidence: -1 };

  for (const tpl of templates) {
    if (tpl.name === 'N') continue; // 跳过显式 N 模板，单独处理

    const similarity = cosineSimilarity(chroma, tpl.weight);
    if (similarity > best.confidence) {
      best = { chord: tpl.name, confidence: Math.min(1, Math.max(0, similarity)) };
    }
  }

  // 若最佳置信度过低 → 视为无和弦
  if (best.confidence < 0.05) {
    return { chord: 'N', confidence: 0 };
  }

  return best;
}

/**
 * 对所有 chroma 帧进行逐帧和弦匹配
 *
 * @param chromaFrames - 12-bin chroma 帧数组
 * @param level - 和弦词汇级别（默认 extended，24 基本 + 12 扩展 = 36 模板）
 * @returns 每帧的匹配结果
 */
export function matchAllFrames(
  chromaFrames: Float32Array[],
  level: VocabularyLevel = 'extended',
): MatchedFrame[] {
  const templates = generateTemplates(level);

  return chromaFrames.map((frame) => matchFrame(frame, templates));
}
