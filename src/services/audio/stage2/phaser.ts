import type { PhaserConfig } from '@/shared/types/types';

/**
 * Phaser 相位偏移器（时域全通滤波器阵列）
 * 对齐 ffmpeg aphaser 滤镜的核心原理：
 *   多个延迟线 + 调制 LFO → 产生相位漂移 → 破坏频谱指纹的相位一致性
 *
 * 实现方式：4级交错全通滤波器（Schroeder allpass chain），
 * 每级的延迟时间由 LFO 低频调制，产生随时间变化的相位偏移
 *
 * @param signal - 输入/输出时域信号
 * @param config - Phaser 配置参数
 * @param sampleRate - 采样率
 */
export function applyPhaser(
  signal: Float32Array,
  config: PhaserConfig,
  sampleRate: number,
): void {
  const len = signal.length;
  const { in_gain, out_gain, delay, decay, speed, type } = config;

  /** 延迟线长度（采样点数），基于 delay(ms) */
  const delaySamples = Math.max(1, Math.round((delay / 1000) * sampleRate));

  /** 使用4级全通滤波器链（与 ffmpeg aphaser 的多级结构对齐） */
  const numStages = 4;
  const buffers: Float32Array[] = [];
  for (let s = 0; s < numStages; s++) {
    // 每级延迟长度递增，产生不同的相位响应
    const stageDelay = delaySamples * (s + 1);
    buffers.push(new Float32Array(stageDelay).fill(0));
  }

  // 各级缓冲区的读写指针
  const writePos: number[] = new Array(numStages).fill(0);

  for (let i = 0; i < len; i++) {
    // LFO 调制相位：三角波或正弦波
    const phase = (i / len) * speed * 10 * Math.PI * 2; // speed 控制调制频率
    let lfo: number;
    if (type === 'triangular') {
      // 三角波：((x % π) / π * 2 - 1) 的周期函数
      const p = ((phase / Math.PI) % 2 + 2) % 2;
      lfo = p < 1 ? p * 2 - 1 : 3 - p * 2;
    } else {
      lfo = Math.sin(phase);
    }

    // 输入增益
    let input = signal[i] * in_gain;

    // 通过全通滤波器链
    for (let s = 0; s < numStages; s++) {
      const buf = buffers[s];
      const dlen = buf.length;
      const wp = writePos[s];

      // 读取延迟样本（受LFO调制的分数延迟近似）
      const baseIdx = (wp - 1 + dlen) % dlen;
      const modOffset = Math.round(lfo * 0.5); // LFO调制延迟偏移（±0.5采样）
      const readIdx = (baseIdx - modOffset + dlen) % dlen;

      const delayed = buf[readIdx];

      // 全通混合：input + decay * delayed
      const output = input + decay * delayed;

      // 写入缓冲区
      buf[wp] = input;
      writePos[s] = (wp + 1) % dlen;

      input = output; // 级联到下一级
    }

    // 输出：混合原始信号（干声）和处理后信号（湿声）
    signal[i] = signal[i] * (1 - out_gain) + input * out_gain;
  }
}
