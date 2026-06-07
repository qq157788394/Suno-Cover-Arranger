/**
 * 本底噪声注入（时域，粉红噪声）
 * 对齐 CUDA 版 cuda_obfuscator.py apply_noise_floor 的实现：
 *   白噪声 → 累计和(积分/棕噪声) → 标准化 → 缩放到目标电平
 * 粉红噪声的功率谱密度与频率成反比（1/f），更接近真实环境噪声
 * @param signal - 输入/输出时域信号
 * @param noiseFloorDb - 噪声底电平（dB），如 -60
 */
export function applyNoiseFloor(
  signal: Float32Array,
  noiseFloorDb: number,
): void {
  const len = signal.length;

  // 将 dB 转换为线性幅度
  const noiseLinear = Math.pow(10, noiseFloorDb / 20);

  // 计算当前信号 RMS
  let signalRms = 0;
  for (let i = 0; i < len; i++) {
    signalRms += signal[i] * signal[i];
  }
  signalRms = Math.sqrt(signalRms / len);

  // 目标噪声 RMS
  const targetNoiseRms = signalRms * noiseLinear;

  /** 生成粉红噪声：白噪声 → 累计和(积分) → 标准化 */
  const pinkNoise = generatePinkNoise(len);

  // 叠加到信号上
  for (let i = 0; i < len; i++) {
    signal[i] += pinkNoise[i] * targetNoiseRms;
  }
}

/**
 * 生成粉红噪声序列
 * 使用 Voss-McCartney 方法的简化版（累计和法），
 * 与 CUDA 版 torch.cumsum 实现一致：对高斯白噪声做积分得到 1/f^2 谱
 * @param length - 噪声序列长度
 * @returns 粉红噪声 Float32Array（均值为0，标准差约1）
 */
function generatePinkNoise(length: number): Float32Array {
  const white = new Float32Array(length);
  const pink = new Float32Array(length);

  // Step 1: 生成高斯白噪声（Box-Muller 变换）
  for (let i = 0; i < length; i += 2) {
    let u1: number;
    do {
      u1 = Math.random();
    } while (u1 === 0);
    const u2 = Math.random();
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * u2;

    white[i] = r * Math.cos(theta);
    if (i + 1 < length) {
      white[i + 1] = r * Math.sin(theta);
    }
  }

  // Step 2: 累计和（积分）— 对齐 CUDA 版 torch.cumsum
  // 这将白噪声的平坦谱变为 ~1/f^2 的棕噪声谱
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += white[i];
    pink[i] = sum;
  }

  // Step 3: 标准化（使标准差 ≈ 1）— 对齐 CUDA 版 / (std + 1e-10)
  let mean = 0;
  let std = 0;
  for (let i = 0; i < length; i++) {
    mean += pink[i];
  }
  mean /= length;

  for (let i = 0; i < length; i++) {
    const d = pink[i] - mean;
    std += d * d;
  }
  std = Math.sqrt(std / length);
  const invStd = std > 1e-10 ? 1 / std : 0;

  for (let i = 0; i < length; i++) {
    pink[i] = (pink[i] - mean) * invStd;
  }

  return pink;
}
