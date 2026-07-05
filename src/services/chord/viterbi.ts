/**
 * HMM / Viterbi 时序解码
 *
 * 翻写自 Chordino `Chordino.cpp` 中的 HMM/Viterbi 全局解码算法。
 * 转移概率矩阵基于音乐理论构建（同和弦高自转、纯四/五度关系高转移、
 * 级进优先），通过动态规划找到全局最优和弦序列。
 *
 * @module services/chord/viterbi
 */

import type { MatchedFrame } from './chord-matcher';
import {
  generateTemplates,
  EXTENDED_CHORD_NAMES,
  type VocabularyLevel,
} from './chord-templates';

/**
 * 从和弦名中提取根音
 *
 * @param chordName - 和弦名，如 "Dm7"，N 返回 "C"
 * @returns 根音名
 */
function extractRoot(chordName: string): string {
  if (!chordName || chordName === 'N') return 'C';
  const match = chordName.match(/^[A-G][#b]?/);
  return match ? match[0] : 'C';
}

/**
 * 两个根音之间的半音距离（最短）
 *
 * @param noteA - 根音 A
 * @param noteB - 根音 B
 * @returns 半音距离 [0, 6]
 */
function semitoneDistance(noteA: string, noteB: string): number {
  const NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  const a = NOTES.indexOf(noteA);
  const b = NOTES.indexOf(noteB);
  if (a === -1 || b === -1) return 6;
  const diff = Math.abs(b - a);
  return Math.min(diff, 12 - diff);
}

/**
 * 构建和弦间转移概率矩阵
 *
 * 规则：
 * - 同和弦自转概率高（0.7 基础）
 * - 纯四度/五度关系（半音距离 5 或 7）转移概率 ×2
 * - 级进关系（半音距离 1-4）转移概率 ×1.5
 * - 每行归一化为概率分布
 *
 * @param chordNames - 和弦名列表
 * @returns N×N 转移概率矩阵（每行和为 1）
 */
function buildTransitionMatrix(chordNames: string[]): number[][] {
  const n = chordNames.length;
  // 初始化为均匀分布（避免 log(0)）
  const matrix: number[][] = Array.from({ length: n }, () =>
    new Array(n).fill(0.1),
  );

  for (let i = 0; i < n; i++) {
    // 自转基础概率
    matrix[i][i] = 1.5;

    const rootI = extractRoot(chordNames[i]);
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const interval = semitoneDistance(rootI, extractRoot(chordNames[j]));

      // 纯四度/五度 → 高转移概率
      if (interval === 5 || interval === 7) {
        matrix[i][j] *= 2.5;
      }
      // 级进（1-4 半音）→ 中等转移概率
      else if (interval >= 1 && interval <= 4) {
        matrix[i][j] *= 1.8;
      }
      // 三全音 / 小二度 → 低转移概率（保持默认 0.1）
    }

    // 归一化
    const sum = matrix[i].reduce((a, b) => a + b, 0);
    for (let j = 0; j < n; j++) {
      matrix[i][j] /= sum;
    }
  }

  return matrix;
}

/**
 * Viterbi 解码 —— 找到全局最优和弦序列
 *
 * 使用对数概率以避免浮点下溢。
 * DP 状态：dp[t][s] = 到第 t 帧为止以状态 s 结束的最大对数概率。
 *
 * @param observations - 帧级匹配结果（含和弦名和置信度）
 * @param chordNames - 候选和弦名列表
 * @param transitionMatrix - 转移概率矩阵
 * @returns 每帧的最优和弦名
 */
export function viterbiDecode(
  observations: MatchedFrame[],
  chordNames: string[],
  transitionMatrix: number[][],
): string[] {
  const T = observations.length;
  const N = chordNames.length;

  if (T === 0) return [];
  if (N === 0) return new Array(T).fill('N');

  // DP 表：dp[t][s] = 最大对数概率
  const dp: number[][] = Array.from({ length: T }, () =>
    new Array(N).fill(-Infinity),
  );
  // 回溯表：back[t][s] = 前一帧的最优状态
  const back: number[][] = Array.from({ length: T }, () =>
    new Array(N).fill(0),
  );

  // ── 初始化（t=0）──
  const initProb = Math.log(1 / N);
  for (let s = 0; s < N; s++) {
    // 发射概率：观测的和弦名匹配该状态 → 用置信度，否则用极小值
    const obs = observations[0];
    const emissionProb =
      obs.chord === chordNames[s]
        ? Math.log(Math.max(obs.confidence, 0.01))
        : Math.log(0.001);
    dp[0][s] = initProb + emissionProb;
  }

  // ── 递推 ──
  for (let t = 1; t < T; t++) {
    for (let s = 0; s < N; s++) {
      let maxProb = -Infinity;
      let bestPrev = 0;

      for (let prev = 0; prev < N; prev++) {
        const transProb = Math.log(Math.max(transitionMatrix[prev][s], 1e-12));
        const prob = dp[t - 1][prev] + transProb;
        if (prob > maxProb) {
          maxProb = prob;
          bestPrev = prev;
        }
      }

      // 加上发射概率
      const obs = observations[t];
      const emissionProb =
        obs.chord === chordNames[s]
          ? Math.log(Math.max(obs.confidence, 0.01))
          : Math.log(0.001);

      dp[t][s] = maxProb + emissionProb;
      back[t][s] = bestPrev;
    }
  }

  // ── 回溯 ──
  const result: string[] = new Array(T);

  // 最后一帧：选概率最大的状态
  let lastState = 0;
  let maxProb = -Infinity;
  for (let s = 0; s < N; s++) {
    if (dp[T - 1][s] > maxProb) {
      maxProb = dp[T - 1][s];
      lastState = s;
    }
  }
  result[T - 1] = chordNames[lastState];

  // 向前回溯
  for (let t = T - 2; t >= 0; t--) {
    lastState = back[t + 1][lastState];
    result[t] = chordNames[lastState];
  }

  return result;
}

/**
 * 便捷方法：从帧匹配结果直接解码为最优和弦序列
 *
 * @param observations - 帧级匹配结果
 * @param level - 和弦词汇级别（默认 extended）
 * @returns 每帧的最优和弦名
 */
export function decodeChordSequence(
  observations: MatchedFrame[],
  level: VocabularyLevel = 'extended',
): string[] {
  if (observations.length === 0) return [];

  const templates = generateTemplates(level);
  const chordNames = templates.map((t) => t.name);
  const transitionMatrix = buildTransitionMatrix(chordNames);

  return viterbiDecode(observations, chordNames, transitionMatrix);
}
