import type { PresetConfig, PresetLevel } from "@/shared/types/types";

/**
 * 三种预设配置
 * 精确复刻自 cuda_obfuscator.py PRESETS 字典（核心 EQ/Compressor/Noise 参数）
 * Phaser 参数对齐 ffmpeg_spectral_obfuscator.py 的 aphaser 配置
 * Rubberband 仅在 heavy 模式启用（对齐 ffmpeg 版 rubberband_resample）
 *
 * 新增对抗模块：
 *   - spectral_peak_shift: 频域峰值位置微扰（对抗星座图特征提取）
 *   - spectral_envelope: 频谱包络随机化（对抗音频向量嵌入检索）
 *   - stereo_decorrelation: 立体声通道去相关（对抗双通道联合指纹检测）
 *   - rubberband_phase_jitter / rubberband_mag_jitter: 增强 rubberband 谱涂抹
 */
export const PRESETS: Record<PresetLevel, PresetConfig | null> = {
  /** 不处理：跳过 Stage 2 频谱混淆，直接编码 */
  none: null,
  light: {
    highpass_hz: 50,
    lowpass_hz: 16000,
    eq_bands: [
      { freq: 65, gain: 1.0 },
      { freq: 92, gain: 1.0 },
      { freq: 131, gain: 1.2 },
      { freq: 185, gain: 1.3 },
      { freq: 262, gain: 1.3 },
      { freq: 370, gain: 1.2 },
      { freq: 523, gain: 1.0 },
      { freq: 740, gain: 1.0 },
      { freq: 1047, gain: 0.9 },
      { freq: 1480, gain: 0.9 },
      { freq: 2093, gain: 0.8 },
      { freq: 2960, gain: 0.8 },
      { freq: 4186, gain: 0.9 },
      { freq: 5920, gain: 0.9 },
      { freq: 8372, gain: 1.0 },
      { freq: 11840, gain: 0.9 },
      { freq: 16744, gain: 0.8 },
      { freq: 20000, gain: 0.7 },
    ],
    threshold: 0.125,
    ratio: 3,
    noise_floor_db: -65,
    phaser: null, // light 模式不启用相位偏移
    rubberband: false,
    rubberband_phase_jitter: 0.3, // 轻度相位扰动（±0.15rad ≈ ±8.6°）
    rubberband_mag_jitter: 0.05, // 轻度幅度微扰（±2.5%）
    /** 频域峰值位置微扰 — light 模式启用，偏移范围小 */
    spectral_peak_shift: {
      enabled: true,
      shift_range: 1, // 最大偏移1个bin
      attenuation: 0.4, // 原位置保留40%能量
    },
    /** 频谱包络随机化 — light 模式启用，混合范围窄 */
    spectral_envelope: {
      enabled: true,
      band_width: 16, // 较宽的子带，变化更温和
      mix_min: 0.4,
      mix_max: 0.6,
    },
    /** 立体声通道去相关 — light 模式启用，参数保守 */
    stereo_decorrelation: {
      enabled: true,
      delay_ms: 5, // 5ms 微延迟
      phase_offset: 0.1, // 轻微相位偏移
    },
  },
  medium: {
    highpass_hz: 40,
    lowpass_hz: 15000,
    eq_bands: [
      { freq: 65, gain: 0.6 },
      { freq: 92, gain: 0.8 },
      { freq: 131, gain: 1.4 },
      { freq: 185, gain: 1.5 },
      { freq: 262, gain: 1.4 },
      { freq: 370, gain: 1.2 },
      { freq: 523, gain: 1.0 },
      { freq: 740, gain: 0.9 },
      { freq: 1047, gain: 0.8 },
      { freq: 1480, gain: 0.7 },
      { freq: 2093, gain: 0.6 },
      { freq: 2960, gain: 0.7 },
      { freq: 4186, gain: 0.8 },
      { freq: 5920, gain: 0.9 },
      { freq: 8372, gain: 0.9 },
      { freq: 11840, gain: 0.8 },
      { freq: 16744, gain: 0.7 },
      { freq: 20000, gain: 0.5 },
    ],
    threshold: 0.1,
    ratio: 4,
    noise_floor_db: -60,
    /** Phaser 相位偏移 — 对齐 ffmpeg_spectral_obfuscator.py medium 预设 */
    phaser: {
      in_gain: 0.5,
      out_gain: 0.8,
      delay: 2.0, // ms
      decay: 0.3,
      speed: 0.3, // 缓慢调制
      type: "triangular",
    },
    rubberband: false,
    rubberband_phase_jitter: 0.5, // 中度相位扰动（±0.25rad ≈ ±14.3°）
    rubberband_mag_jitter: 0.08, // 中度幅度微扰（±4%）
    /** 频域峰值位置微扰 — medium 模式，偏移范围适中 */
    spectral_peak_shift: {
      enabled: true,
      shift_range: 2, // 最大偏移2个bin
      attenuation: 0.3, // 原位置保留30%能量
    },
    /** 频谱包络随机化 — medium 模式，混合范围适中 */
    spectral_envelope: {
      enabled: true,
      band_width: 12,
      mix_min: 0.35,
      mix_max: 0.65,
    },
    /** 立体声通道去相关 — medium 模式 */
    stereo_decorrelation: {
      enabled: true,
      delay_ms: 10, // 10ms 微延迟
      phase_offset: 0.2, // 中等相位偏移
    },
  },
  heavy: {
    highpass_hz: 60,
    lowpass_hz: 14000,
    eq_bands: [
      { freq: 65, gain: 0.3 },
      { freq: 92, gain: 0.5 },
      { freq: 131, gain: 1.6 },
      { freq: 185, gain: 1.8 },
      { freq: 262, gain: 1.6 },
      { freq: 370, gain: 1.3 },
      { freq: 523, gain: 1.0 },
      { freq: 740, gain: 0.8 },
      { freq: 1047, gain: 0.6 },
      { freq: 1480, gain: 0.5 },
      { freq: 2093, gain: 0.4 },
      { freq: 2960, gain: 0.6 },
      { freq: 4186, gain: 0.7 },
      { freq: 5920, gain: 0.8 },
      { freq: 8372, gain: 0.8 },
      { freq: 11840, gain: 0.6 },
      { freq: 16744, gain: 0.5 },
      { freq: 20000, gain: 0.3 },
    ],
    threshold: 0.063,
    ratio: 6,
    noise_floor_db: -55,
    /** Phaser 相位偏移 — 对齐 ffmpeg_spectral_obfuscator.py heavy 预设 */
    phaser: {
      in_gain: 0.6,
      out_gain: 0.85,
      delay: 2.5, // ms (略长于medium)
      decay: 0.4,
      speed: 0.4, // 略快调制
      type: "triangular",
    },
    /** Rubberband 谱涂抹 — 对齐 ffmpeg 版 heavy 启用 rubberband_resample */
    rubberband: true,
    rubberband_phase_jitter: 0.6, // 强相位扰动（±0.3rad ≈ ±17.2°）
    rubberband_mag_jitter: 0.1, // 强幅度微扰（±5%）
    /** 频域峰值位置微扰 — heavy 模式，偏移范围最大 */
    spectral_peak_shift: {
      enabled: true,
      shift_range: 3, // 最大偏移3个bin
      attenuation: 0.2, // 原位置仅保留20%能量
    },
    /** 频谱包络随机化 — heavy 模式，混合范围最宽 */
    spectral_envelope: {
      enabled: true,
      band_width: 8, // 较窄子带，变化更显著
      mix_min: 0.3,
      mix_max: 0.7,
    },
    /** 立体声通道去相关 — heavy 模式，参数最激进 */
    stereo_decorrelation: {
      enabled: true,
      delay_ms: 20, // 20ms 微延迟
      phase_offset: 0.4, // 较强相位偏移
    },
  },
};
