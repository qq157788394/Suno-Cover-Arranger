import type { SpectralEnvelopeConfig } from '@/shared/types/types';

/**
 * 频谱包络随机化 — 频谱域版本（对抗音频向量嵌入检索）
 *
 * Suno 使用类似 CLAP 架构的深度音频编码模型，将音频降维压缩为
 * 高密度特征向量，通过余弦相似度进行语义匹配。这类模型对均匀噪声
 * 具有极强鲁棒性，但对频谱包络形状的变化较为敏感。
 *
 * 本模块将频谱分为若干子带，在相邻子带间随机重分配能量，
 * 改变频谱的整体包络形状，在嵌入空间中产生显著偏移，
 * 同时保持各子带内部的精细结构不变，对听感影响较小。
 *
 * 此版本直接操作频谱数据（spectrum），不自行做 STFT/ISTFT，
 * 由调用方在 Phase 1 的 STFT 循环中调用，零额外遍历开销。
 *
 * @param spectrum - 频域全频谱 [real0, imag0, ..., real{N-1}, imag{N-1}]
 * @param fftSize - FFT 大小
 * @param config - 频谱包络随机化配置
 */
export function applySpectralEnvelopeRandomizationOnSpectrum(
  spectrum: Float32Array,
  fftSize: number,
  config: SpectralEnvelopeConfig,
): void {
  if (!config.enabled) return;

  const bandWidth = config.band_width;
  const mixMin = config.mix_min;
  const mixMax = config.mix_max;
  const binCount = fftSize / 2 + 1;

  // 频谱包络随机化：相邻子带间能量重分配
  for (let bandStart = 1; bandStart < binCount - bandWidth; bandStart += bandWidth * 2) {
    // 计算当前子带和下一个子带的总能量
    let energy1 = 0;
    let energy2 = 0;
    const band2Start = bandStart + bandWidth;

    for (let k = 0; k < bandWidth; k++) {
      const idx1 = bandStart + k;
      const idx2 = band2Start + k;
      if (idx2 < binCount) {
        energy1 += spectrum[2 * idx1] ** 2 + spectrum[2 * idx1 + 1] ** 2;
        energy2 += spectrum[2 * idx2] ** 2 + spectrum[2 * idx2 + 1] ** 2;
      }
    }

    const totalEnergy = energy1 + energy2;
    if (totalEnergy < 1e-10) continue;

    // 随机混合比例
    const mixRatio = mixMin + Math.random() * (mixMax - mixMin);
    const targetE1 = totalEnergy * mixRatio;
    const targetE2 = totalEnergy * (1 - mixRatio);

    // 计算缩放系数
    const scale1 = energy1 > 1e-10 ? Math.sqrt(targetE1 / energy1) : 1;
    const scale2 = energy2 > 1e-10 ? Math.sqrt(targetE2 / energy2) : 1;

    // 应用缩放
    for (let k = 0; k < bandWidth; k++) {
      const idx1 = bandStart + k;
      const idx2 = band2Start + k;
      if (idx2 < binCount) {
        spectrum[2 * idx1] *= scale1;
        spectrum[2 * idx1 + 1] *= scale1;
        spectrum[2 * idx2] *= scale2;
        spectrum[2 * idx2 + 1] *= scale2;
      }
    }
  }
}
