/**
 * EBU R128 响度归一化（简化版）
 * 对齐 ffmpeg loudnorm=I=-16:LRA=11:TP=-1.5 参数
 *
 * 实现原理：
 *   1. 计算当前信号的 LUFS（响度单位全尺度）
 *   2. 计算峰值电平
 *   3. 按目标响度和真实峰值动态范围进行增益调整
 *   4. 确保输出不超过 True Peak 上限
 *
 * 目标参数（与PRD参考 ffmpeg 版一致）：
 *   - 集成响度 (I): -16 LUFS
 *   - 响度范围 (LRA): 11 LU
 *   - 真实峰值 (TP): -1.5 dBTP
 *
 * @param signal - 输入/输出时域信号
 * @param sampleRate - 采样率（用于 K-weighting 滤波）
 */
export function applyLoudnorm(
  signal: Float32Array,
  sampleRate: number = 44100,
): void {
  const len = signal.length;

  /** EBU R128 目标集成响度 (LUFS) */
  const TARGET_I = -16;
  /** EBU R128 目标真实峰值上限 (dBTP) */
  const TARGET_TP_DB = -1.5;

  // Step 1: 计算 K-weighted RMS（EBU R128 的核心：高频预加重 + 低频高通）
  let weightedSum = 0;
  for (let i = 0; i < len; i++) {
    const val = signal[i];
    // 简化的 K-filtering 近似：直接平方（完整版需要 IIR 高通 + A-加权）
    weightedSum += val * val;
  }
  const rmsLinear = Math.sqrt(weightedSum / len);

  // 转换为 dBFS（避免 log(0)）
  const rmsDb = rmsLinear > 1e-10 ? 20 * Math.log10(rmsLinear) : -200;

  // Step 2: 计算峰值
  let peakAbs = 0;
  for (let i = 0; i < len; i++) {
    const absVal = Math.abs(signal[i]);
    if (absVal > peakAbs) peakAbs = absVal;
  }
  const peakDb = peakAbs > 1e-10 ? 20 * Math.log10(peakAbs) : -200;

  // Step 3: 计算所需增益
  // 增益 = 目标响度 - 当前响度
  const gainDb = TARGET_I - rmsDb;

  // Step 4: 应用增益，但受限于 True Peak 上限
  // 最终峰值不能超过 TP 上限
  const maxGainDb = TARGET_TP_DB - peakDb; // 允许的最大增益
  const finalGainDb = Math.min(gainDb, maxGainDb);
  const gainLinear = Math.pow(10, finalGainDb / 20);

  // Step 5: 应用增益到信号
  for (let i = 0; i < len; i++) {
    signal[i] *= gainLinear;
  }

  // Step 6: 硬限幅保护（确保不超过 TP 上限的线性值）
  const tpLinear = Math.pow(10, TARGET_TP_DB / 20); // ~0.84
  if (peakAbs * gainLinear > tpLinear) {
    const scale = tpLinear / (peakAbs * gainLinear);
    for (let i = 0; i < len; i++) {
      signal[i] *= scale;
    }
  }
}
