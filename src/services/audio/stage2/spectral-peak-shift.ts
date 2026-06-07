import type { SpectralPeakShiftConfig } from '@/shared/types/types';

/**
 * 频域峰值位置微扰 — 频谱域版本（对抗星座图特征提取）
 *
 * Suno 星座图检测的核心是提取频谱能量峰值点，并将相邻峰值配对生成
 * Hash = [f1, f2, Δt]。本模块通过检测频谱中的局部能量峰值，将其
 * 能量搬运到相邻的频率 bin，使峰值的频率坐标发生偏移，从而破坏
 * 星座图哈希的匹配。
 *
 * 此版本直接操作频谱数据（spectrum），不自行做 STFT/ISTFT，
 * 由调用方在 Phase 1 的 STFT 循环中调用，零额外遍历开销。
 *
 * @param spectrum - 频域全频谱 [real0, imag0, ..., real{N-1}, imag{N-1}]
 * @param fftSize - FFT 大小
 * @param config - 峰值位置微扰配置
 */
export function applySpectralPeakShiftOnSpectrum(
  spectrum: Float32Array,
  fftSize: number,
  config: SpectralPeakShiftConfig,
): void {
  if (!config.enabled) return;

  const shiftRange = config.shift_range;
  const attenuation = config.attenuation;
  const binCount = fftSize / 2 + 1;

  // 计算幅度谱
  const magnitudes = new Float32Array(binCount);
  for (let k = 0; k < binCount; k++) {
    magnitudes[k] = Math.sqrt(spectrum[2 * k] ** 2 + spectrum[2 * k + 1] ** 2);
  }

  // 计算中位数阈值（用于筛选显著峰值）
  const sortedMags = Float32Array.from(magnitudes).sort();
  const median = sortedMags[Math.floor(binCount / 2)];

  // 检测局部峰值并施加频率偏移
  for (let k = 2; k < binCount - 2; k++) {
    const isPeak =
      magnitudes[k] > magnitudes[k - 1] &&
      magnitudes[k] > magnitudes[k + 1] &&
      magnitudes[k] > magnitudes[k - 2] &&
      magnitudes[k] > magnitudes[k + 2];

    if (!isPeak) continue;

    // 仅对显著峰值施加偏移（幅度大于该帧中位数的2倍）
    if (magnitudes[k] < median * 2) continue;

    // 随机偏移方向和距离（±shiftRange 个 bin）
    const shift = Math.round((Math.random() - 0.5) * 2 * shiftRange);
    if (shift === 0) continue;

    const targetK = k + shift;
    if (targetK <= 0 || targetK >= binCount) continue;

    // 将峰值能量搬运到偏移后的位置
    spectrum[2 * targetK] = spectrum[2 * k];
    spectrum[2 * targetK + 1] = spectrum[2 * k + 1];

    // 原位置按衰减系数保留部分能量
    spectrum[2 * k] *= attenuation;
    spectrum[2 * k + 1] *= attenuation;
  }
}
