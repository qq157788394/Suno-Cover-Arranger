import type { EqBand } from '@/shared/types/types';

/**
 * 构建 EQ 增益曲线（全频谱）
 * 根据 18 段 EQ 频段配置 + 高低切频率，对每个频率 bin 计算增益
 * 包含 Hermitian 对称性：负频率 = 对应正频率的增益
 * 频率低于 highpassHz 或高于 lowpassHz 的分量将被置零（高低通滤波）
 * @param sampleRate - 采样率
 * @param fftSize - FFT 大小
 * @param eqBands - EQ 频段配置数组
 * @param highpassHz - 高通截止频率（Hz），低于此频率的分量置零
 * @param lowpassHz - 低通截止频率（Hz），高于此频率的分量置零
 * @returns 每个频率 bin 对应的增益值数组（长度 = fftSize）
 */
export function buildEqGainCurve(
  sampleRate: number,
  fftSize: number,
  eqBands: EqBand[],
  highpassHz?: number,
  lowpassHz?: number,
): Float32Array {
  const curve = new Float32Array(fftSize);
  const halfLen = fftSize / 2 + 1;
  const nyquist = sampleRate / 2;

  // 正频率部分（DC 到 Nyquist）
  for (let i = 0; i < halfLen; i++) {
    const freq = (i * sampleRate) / fftSize;

    // 高低通滤波：截止范围外的频率分量置零
    if (highpassHz !== undefined && freq < highpassHz) {
      curve[i] = 0;
      continue;
    }
    if (lowpassHz !== undefined && freq > lowpassHz) {
      curve[i] = 0;
      continue;
    }

    curve[i] = interpolateGain(freq, eqBands);
  }

  // 负频率部分（Hermitian 对称）
  for (let i = halfLen; i < fftSize; i++) {
    curve[i] = curve[fftSize - i];
  }

  return curve;
}

/**
 * 线性插值计算指定频率的增益值
 * 在 EQ 频段之间进行线性插值，边界外使用最近频段的增益值
 * @param freq - 目标频率（Hz）
 * @param bands - EQ 频段配置数组
 * @returns 插值后的增益值
 */
function interpolateGain(freq: number, bands: EqBand[]): number {
  if (bands.length === 0) return 1.0;

  // 低于第一个频段，使用第一个频段的增益
  if (freq <= bands[0].freq) return bands[0].gain;

  // 高于最后一个频段，使用最后一个频段的增益
  if (freq >= bands[bands.length - 1].freq) return bands[bands.length - 1].gain;

  // 在频段之间进行线性插值
  for (let i = 0; i < bands.length - 1; i++) {
    if (freq >= bands[i].freq && freq <= bands[i + 1].freq) {
      const t = (freq - bands[i].freq) / (bands[i + 1].freq - bands[i].freq);
      return bands[i].gain + t * (bands[i + 1].gain - bands[i].gain);
    }
  }

  return 1.0;
}

/**
 * 对全频谱应用 EQ 滤波
 * 遍历每个 bin，实部和虚部乘以相同的增益
 * @param spectrum - 频域全频谱 [real0, imag0, ..., real{N-1}, imag{N-1}]，长度 = fftSize * 2
 * @param eqCurve - 每个频率 bin 对应的增益值，长度 = fftSize
 */
export function applyEqFilter(
  spectrum: Float32Array,
  eqCurve: Float32Array,
): void {
  const binCount = eqCurve.length;

  for (let i = 0; i < binCount; i++) {
    const gain = eqCurve[i];
    spectrum[2 * i] *= gain;       // 实部 × 增益
    spectrum[2 * i + 1] *= gain;   // 虚部 × 增益
  }
}