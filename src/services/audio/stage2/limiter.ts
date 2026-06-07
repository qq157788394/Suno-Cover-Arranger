/**
 * Peak Limiter
 * 峰值 > 0.99 时，整体乘以 (0.95 / peak) 进行限幅
 * 防止削波失真
 * @param signal - 输入/输出时域信号
 */
export function applyPeakLimiter(signal: Float32Array): void {
  // 查找峰值
  let peak = 0;
  for (let i = 0; i < signal.length; i++) {
    const absVal = Math.abs(signal[i]);
    if (absVal > peak) peak = absVal;
  }

  // 峰值超过阈值时进行限幅
  if (peak > 0.99) {
    const scale = 0.95 / peak;
    for (let i = 0; i < signal.length; i++) {
      signal[i] *= scale;
    }
  }
}