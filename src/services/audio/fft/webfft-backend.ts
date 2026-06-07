import webfft from 'webfft';
import type { FFTBackend } from './fft-backend';

/**
 * WebFFT 实现
 * 封装 webfft 库，提供实数 FFT/IFFT 能力
 * 注意：webfft 只有正向 FFT，IFFT 通过共轭 + FFT + 共轭 / N 实现
 * FFT 大小要求 4~131072 之间的 2 的幂
 */
export class WebFFTBackend implements FFTBackend {
  private fftSize: number;
  private fft: any;

  constructor(fftSize: number) {
    this.fftSize = fftSize;
    this.fft = new webfft(fftSize);
  }

  /**
   * 实数正向 FFT
   * 返回全频谱复数值 [real0, imag0, real1, imag1, ..., real{N-1}, imag{N-1}]
   * 长度 = fftSize * 2
   */
  rfft(input: Float32Array): Float32Array {
    // 构建复数输入：实部 = 输入值，虚部 = 0
    const complex = new Float32Array(this.fftSize * 2);
    for (let i = 0; i < this.fftSize; i++) {
      complex[2 * i] = input[i];
      complex[2 * i + 1] = 0;
    }
    return this.fft.fft(complex);
  }

  /**
   * 实数逆向 FFT
   * 从全频谱恢复时域信号，通过 IFFT = conj(FFT(conj(X))) / N
   * @param spectrum - 全频谱 [real0, imag0, ..., real{N-1}, imag{N-1}]，长度 = fftSize * 2
   * @param outputLength - 输出信号长度
   */
  irfft(spectrum: Float32Array, outputLength: number): Float32Array {
    // 步骤 1: 共轭频谱（虚部取反）
    const conjugated = new Float32Array(spectrum.length);
    for (let i = 0; i < this.fftSize; i++) {
      conjugated[2 * i] = spectrum[2 * i];        // 实部不变
      conjugated[2 * i + 1] = -spectrum[2 * i + 1]; // 虚部取反
    }

    // 步骤 2: 正向 FFT
    const fftResult = this.fft.fft(conjugated);

    // 步骤 3: 共轭 + 除以 N，取实部
    const result = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      result[i] = fftResult[2 * i] / this.fftSize;
    }

    return result;
  }

  /** 释放 FFT 引擎资源 */
  dispose(): void {
    this.fft.dispose();
  }
}