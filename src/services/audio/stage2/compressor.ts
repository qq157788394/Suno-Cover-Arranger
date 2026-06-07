/**
 * 动态压缩（时域，逐采样点，线性阈值）
 * 当采样点幅度超过阈值时，按压缩比进行衰减
 * @param signal - 输入/输出时域信号
 * @param threshold - 线性幅度阈值（如 0.125）
 * @param ratio - 压缩比（如 3.0 表示 3:1）
 */
export function applyCompressor(
  signal: Float32Array,
  threshold: number,
  ratio: number,
): void {
  for (let i = 0; i < signal.length; i++) {
    const absVal = Math.abs(signal[i]);
    if (absVal > threshold) {
      // 超过阈值的部分按压缩比衰减
      const sign = signal[i] >= 0 ? 1 : -1;
      signal[i] = sign * (threshold + (absVal - threshold) / ratio);
    }
  }
}