/**
 * 和弦段落合并
 *
 * 将逐帧和弦序列合并为连续段落。
 * 相邻帧和弦名相同时合并，不同时切分新段落。
 *
 * @module services/chord/segmenter
 */

/** 合并后的和弦段落 */
export interface RawSegment {
  /** 和弦名 */
  chord: string;
  /** 段落起始时间（秒） */
  startTime: number;
  /** 段落结束时间（秒） */
  endTime: number;
}

/**
 * 将逐帧和弦序列合并为连续段落
 *
 * 遍历和弦序列，合并连续相同和弦名的帧为一个段落。
 *
 * @param frameChords - 逐帧和弦名数组（Viterbi 解码输出）
 * @param frameDuration - 每帧时长（秒），= hopSize / sampleRate
 * @param startTime - 第一个分析窗口的中心时间偏移（秒），默认 0
 * @returns 合并后的和弦段落列表
 */
export function mergeSegments(
  frameChords: string[],
  frameDuration: number,
  startTime: number = 0,
): RawSegment[] {
  if (frameChords.length === 0) return [];

  const segments: RawSegment[] = [];
  let currentChord = frameChords[0];
  let startFrame = 0;

  for (let i = 1; i < frameChords.length; i++) {
    if (frameChords[i] !== currentChord) {
      segments.push({
        chord: currentChord,
        startTime: startTime + startFrame * frameDuration,
        endTime: startTime + i * frameDuration,
      });
      currentChord = frameChords[i];
      startFrame = i;
    }
  }

  // 最后一个段落
  segments.push({
    chord: currentChord,
    startTime: startTime + startFrame * frameDuration,
    endTime: startTime + frameChords.length * frameDuration,
  });

  return segments;
}
