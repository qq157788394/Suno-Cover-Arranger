import type { StereoDecorrelationConfig } from '@/shared/types/types';

/**
 * 立体声通道去相关（对抗双通道联合指纹检测）
 *
 * 当音频为立体声时，版权检测系统可能利用左右声道的相关性进行联合
 * 指纹提取。如果两个声道高度相关，检测置信度会更高。
 *
 * 本模块通过以下方式降低左右声道的相关性：
 *   1. 对右声道施加微小延迟（5~20ms），产生哈斯效应（Haas Effect）
 *   2. 对右声道施加随机相位偏移，破坏相位一致性
 *
 * 哈斯效应范围内（<30ms）的延迟不会被感知为回声，而是增加空间感，
 * 对听感影响极小。
 *
 * @param channels - 输入/输出声道数据数组（[左声道, 右声道]）
 * @param sampleRate - 采样率
 * @param config - 立体声通道去相关配置
 */
export function applyStereoDecorrelation(
  channels: Float32Array[],
  sampleRate: number,
  config: StereoDecorrelationConfig,
): void {
  if (!config.enabled) return;

  // 仅对立体声音频生效
  if (channels.length < 2) return;

  const left = channels[0];
  const right = channels[1];
  const len = left.length;

  // Step 1: 对右声道施加微延迟（哈斯效应）
  const delaySamples = Math.round((config.delay_ms / 1000) * sampleRate);
  if (delaySamples > 0 && delaySamples < len) {
    // 将右声道向后延迟，前端补零
    const delayed = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      if (i < delaySamples) {
        // 延迟区域：淡入避免爆音
        delayed[i] = right[i] * (i / delaySamples) * 0.01;
      } else {
        delayed[i] = right[i - delaySamples];
      }
    }
    // 写回右声道
    right.set(delayed);
  }

  // Step 2: 对右声道施加随机相位偏移
  // 使用分段随机相位，每段约 50ms，避免全局一致的偏移
  const segmentSamples = Math.round(0.05 * sampleRate); // 50ms 每段
  const numSegments = Math.ceil(len / segmentSamples);

  for (let seg = 0; seg < numSegments; seg++) {
    // 每段随机相位偏移系数
    const phaseOffset = (Math.random() - 0.5) * 2 * config.phase_offset;
    const segStart = seg * segmentSamples;
    const segEnd = Math.min(segStart + segmentSamples, len);

    for (let i = segStart; i < segEnd; i++) {
      // 简单相位偏移：将采样值乘以 cos(phaseOffset) 并叠加相邻采样的 sin 分量
      const nextIdx = Math.min(i + 1, len - 1);
      right[i] = right[i] * Math.cos(phaseOffset) + right[nextIdx] * Math.sin(phaseOffset) * 0.1;
    }
  }
}
