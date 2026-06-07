/**
 * FFT Backend 接口定义
 * 抽象 FFT 实现，便于后续扩展（如 wasm-fft 等）
 */
export interface FFTBackend {
  /** 实数正向 FFT，返回正频率半谱 [N/2 + 1] */
  rfft(input: Float32Array): Float32Array;
  /** 实数逆向 FFT，从正频率半谱恢复时域信号 */
  irfft(spectrum: Float32Array, outputLength: number): Float32Array;
  /** 释放 FFT 引擎资源 */
  dispose(): void;
}