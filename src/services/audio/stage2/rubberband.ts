import { WebFFTBackend } from '@/services/audio/fft/webfft-backend';

/** 谱涂抹 FFT 帧大小 */
const RUBBERBAND_FFT_SIZE = 2048;

/**
 * Rubberband 谱涂抹（增强版）
 * 对齐 ffmpeg rubberband=tempo=1.0 的效果：
 *   不改变速度/音调，但通过频域微扰改变频谱的精细结构，
 *   从而破坏指纹匹配所需的精确频谱特征
 *
 * 增强内容（对抗星座图特征提取）：
 *   - 相位扰动范围从 ±0.025rad 增大至可配置值（默认±0.3rad ≈ ±17°）
 *   - 新增幅度微扰（±5%~10%），破坏峰值检测的精确性
 *   - 相位扰动使星座图中的峰值相位一致性被破坏
 *   - 幅度微扰使峰值的显著性发生变化，部分峰值可能不再被检测到
 *
 * 实现方式：分块 STFT → 随机相位扰动 + 幅度微扰 → ISTFT → OLA 重构
 *
 * @param signal - 输入/输出时域信号
 * @param sampleRate - 采样率
 * @param phaseJitterRange - 相位扰动范围（rad），默认0.6（即±0.3rad）
 * @param magJitterRange - 幅度微扰范围，默认0.1（即±5%）
 */
export function applyRubberbandSpectralSmear(
  signal: Float32Array,
  sampleRate: number = 44100,
  phaseJitterRange: number = 0.6,
  magJitterRange: number = 0.1,
): void {
  const len = signal.length;
  const fftSize = RUBBERBAND_FFT_SIZE;
  const hopSize = fftSize / 4; // 75%重叠

  const fft = new WebFFTBackend(fftSize);

  /** 生成 Hann 窗 */
  const hannWindow = new Float32Array(fftSize);
  for (let i = 0; i < fftSize; i++) {
    hannWindow[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
  }

  const numFrames = Math.ceil(len / hopSize) + 4;
  const output = new Float32Array(numFrames * hopSize + fftSize).fill(0);

  // 分块 STFT 处理
  for (let frame = 0; frame < numFrames; frame++) {
    const startSample = frame * hopSize;

    // 加窗
    const frameBuffer = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      const srcIdx = startSample + i;
      if (srcIdx >= 0 && srcIdx < len) {
        frameBuffer[i] = signal[srcIdx] * hannWindow[i];
      }
    }

    // FFT
    const spectrum = fft.rfft(frameBuffer);

    // 谱涂抹：随机相位扰动 + 幅度微扰
    // 相位扰动破坏频谱相位的一致性，幅度微扰破坏峰值检测的精确性
    const binCount = fftSize / 2 + 1;
    for (let k = 1; k < binCount; k++) { // 跳过 DC
      const re = spectrum[2 * k];
      const im = spectrum[2 * k + 1];

      // 计算幅度和相位
      const mag = Math.sqrt(re * re + im * im);
      let phase = Math.atan2(im, re);

      // 相位扰动：±phaseJitterRange/2 rad（增强版，默认±0.3rad ≈ ±17°）
      phase += (Math.random() - 0.5) * phaseJitterRange;

      // 幅度微扰：±magJitterRange/2（默认±5%）
      const magJitter = 1.0 + (Math.random() - 0.5) * magJitterRange;
      const newMag = mag * magJitter;

      // 重构复数
      spectrum[2 * k] = newMag * Math.cos(phase);
      spectrum[2 * k + 1] = newMag * Math.sin(phase);
    }

    // IFFT
    const timeDomain = fft.irfft(spectrum, fftSize);

    // OLA 重叠相加
    for (let i = 0; i < fftSize; i++) {
      const destIdx = startSample + i;
      if (destIdx >= 0 && destIdx < output.length) {
        output[destIdx] += timeDomain[i] * hannWindow[i]; // 二次窗（合成窗）
      }
    }
  }

  // 归一化（补偿重叠增益）
  const olaGain = 4.0 / 3.0; // 75%重叠的理论增益补偿
  for (let i = 0; i < len; i++) {
    signal[i] = output[i] * olaGain;
  }

  fft.dispose();
}
