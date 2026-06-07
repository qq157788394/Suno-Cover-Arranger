// lamejs 通过全局脚本加载（config.ts headScripts），从 window.lamejs 获取
const Mp3Encoder = (window as any).lamejs.Mp3Encoder;

/** 统一输出采样率 (Hz)，与PRD参考 ffmpeg 版 -ar 44100 对齐 */
const TARGET_SAMPLE_RATE = 44100;

/**
 * 将 Float32Array 声道数据编码为 MP3 Blob（异步，分块处理避免阻塞主线程）
 * 使用 lamejs，128kbps CBR，统一 44.1kHz 输出
 * @param channels - 音频声道数据
 * @param sampleRate - 原始采样率（如非44100将自动重采样）
 * @param kbps - 比特率，默认 128kbps
 * @param onProgress - 进度回调 (0-100)
 * @returns MP3 编码后的 Blob
 */
export async function encodeMP3(
  channels: Float32Array[],
  sampleRate: number,
  kbps: number = 128,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  const numChannels = channels.length;

  /** 如原始采样率非44100，执行线性插值重采样 */
  let processedChannels = channels;
  if (sampleRate !== TARGET_SAMPLE_RATE) {
    const ratio = TARGET_SAMPLE_RATE / sampleRate;
    processedChannels = channels.map((ch) => {
      const newLen = Math.round(ch.length * ratio);
      const resampled = new Float32Array(newLen);
      for (let i = 0; i < newLen; i++) {
        const srcIdx = i / ratio;
        const idx0 = Math.floor(srcIdx);
        const frac = srcIdx - idx0;
        const idx1 = Math.min(idx0 + 1, ch.length - 1);
        resampled[i] = ch[idx0] * (1 - frac) + ch[idx1] * frac;
      }
      return resampled;
    });
    sampleRate = TARGET_SAMPLE_RATE;
  }

  const totalSamples = processedChannels[0].length;
  const blockSize = 1152;

  // 每处理 N 个块后 yield 一次，防止阻塞 UI
  const YIELD_EVERY_BLOCKS = 50;

  const encoder = new Mp3Encoder(numChannels, sampleRate, kbps);
  const mp3Data: Uint8Array[] = [];

  const numBlocks = Math.ceil(totalSamples / blockSize);

  /** 将所有声道统一转换为 Int16 */
  const int16Channels: Int16Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    int16Channels.push(await float32ToInt16(processedChannels[ch]));
  }

  // 按块编码（支持任意声道数）
  for (let i = 0; i < numBlocks; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, totalSamples);
    const chunks = int16Channels.map((ch) => ch.subarray(start, end));

    // lamejs encodeBuffer 接受 1~N 个声道参数
    const mp3buf = encoder.encodeBuffer(...chunks);
    if (mp3buf.length > 0) mp3Data.push(new Uint8Array(mp3buf));

    // 定期 yield 给事件循环，更新进度
    if (i % YIELD_EVERY_BLOCKS === 0) {
      onProgress?.(Math.round((i / numBlocks) * 100));
      await yieldToEventLoop();
    }
  }

  // 刷新编码器缓冲区
  const finalBuf = encoder.flush();
  if (finalBuf.length > 0) mp3Data.push(new Uint8Array(finalBuf));

  onProgress?.(100);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Blob(mp3Data as any, { type: "audio/mpeg" });
}

/**
 * 将 Float32Array 音频数据转换为 Int16Array（异步分块，避免阻塞 UI）
 * Float32 范围 [-1, 1] → Int16 范围 [-32768, 32767]
 * @param input - Float32Array 音频数据
 * @returns Int16Array 音频数据
 */
async function float32ToInt16(input: Float32Array): Promise<Int16Array> {
  const CHUNK_SIZE = 65536; // 每 64K 个采样 yield 一次
  const output = new Int16Array(input.length);

  for (let offset = 0; offset < input.length; offset += CHUNK_SIZE) {
    const end = Math.min(offset + CHUNK_SIZE, input.length);
    for (let i = offset; i < end; i++) {
      const clamped = Math.max(-1, Math.min(1, input[i]));
      output[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
    }
    await yieldToEventLoop();
  }

  return output;
}

/**
 * 通过 setTimeout 让出事件循环，防止阻塞 UI
 */
function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
