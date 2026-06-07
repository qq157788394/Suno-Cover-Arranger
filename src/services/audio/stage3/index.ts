import { Stretch } from '@soundtouchjs/core';

/** Stage 3 日志前缀 */
const LOG_PREFIX = '[Stage3]';

/**
 * Stage 3 主入口 — 保音调变速
 * 使用 @soundtouchjs/core v2 的 Stretch 类（WSOLA 算法）实现时间拉伸
 * 输入/输出为分离声道，内部自动进行 interleaved 格式转换
 * @param inputChannels - 输入声道数据
 * @param sampleRate - 采样率
 * @param tempo - 速度因子: 0.5=降速至半速, 2.0=加速至双倍速
 * @returns 变速后的音频声道数据
 */
export function processStage3(
  inputChannels: Float32Array[],
  sampleRate: number,
  tempo: number,
): Float32Array[] {

  const numChannels = inputChannels.length;
  const numSamples = inputChannels[0].length;

  console.log(`${LOG_PREFIX} 开始保音调变速 | tempo=${tempo} sr=${sampleRate}Hz channels=${numChannels} inputSamples=${numSamples}`);

  try {
    // ═══ Step 1: 转换为 interleaved 格式 ═══
    let t0 = performance.now();
    const interleaved = new Float32Array(numSamples * 2);
    for (let i = 0; i < numSamples; i++) {
      interleaved[i * 2] = inputChannels[0][i]; // 左声道
      if (numChannels >= 2) {
        interleaved[i * 2 + 1] = inputChannels[1][i]; // 右声道
      } else {
        interleaved[i * 2 + 1] = inputChannels[0][i]; // 单声道：复制到右声道
      }
    }
    console.log(`${LOG_PREFIX} [Step-1/Interleave] 完成 | interleaved samples=${interleaved.length / 2} 耗时${(performance.now() - t0).toFixed(1)}ms`);

    // ═══ Step 2: 初始化 WSOLA Stretch 引擎 ═══
    t0 = performance.now();
    const stretch = new Stretch({ createBuffers: true });
    stretch.setParameters(sampleRate, 0, 0, 12); // 0=自动计算，overlapMs=12ms
    stretch.tempo = tempo;

    // 校验缓冲区是否创建成功
    if (!stretch.inputBuffer || !stretch.outputBuffer) {
      throw new Error('Stretch 缓冲区初始化失败，inputBuffer 或 outputBuffer 为 null');
    }
    console.log(`${LOG_PREFIX} [Step-2/InitStretch] 完成 | sampleRate=${sampleRate} tempo=${tempo} overlapMs=12ms 耗时${(performance.now() - t0).toFixed(1)}ms`);

    // ═══ Step 3: 写入输入数据 ═══
    t0 = performance.now();
    stretch.inputBuffer.putSamples(interleaved, 0, numSamples);
    console.log(`${LOG_PREFIX} [Step-3/PutSamples] 完成 | 写入 ${numSamples} 帧 耗时${(performance.now() - t0).toFixed(1)}ms`);

    // ═══ Step 4: WSOLA 处理循环 ═══
    t0 = performance.now();
    const estimatedOutputFrames = Math.ceil(numSamples / tempo);
    let lastOutputFrames = 0;
    let stalledCount = 0;
    const maxIterations = numSamples; // 安全上限

    for (let iter = 0; iter < maxIterations; iter++) {
      if (stretch.outputBuffer.frameCount >= estimatedOutputFrames) break;
      if (stretch.inputBuffer.frameCount >= stretch.sampleReq) {
        stretch.process();
      }

      const currentFrames = stretch.outputBuffer.frameCount;
      if (currentFrames === lastOutputFrames) {
        stalledCount++;
        if (stalledCount > 100) break; // 防止死循环
      } else {
        stalledCount = 0;
        lastOutputFrames = currentFrames;
      }
    }

    const outputFrames = stretch.outputBuffer.frameCount;
    const processTime = performance.now() - t0;
    console.log(`${LOG_PREFIX} [Step-4/WSOLA-Process] 完成 | 输出帧=${outputFrames}/${estimatedOutputFrames} 迭代次数=... 耗时${processTime.toFixed(1)}ms`);

    // ═══ Step 5: 提取并 de-interleave 输出 ═══
    t0 = performance.now();
    const interleavedOutput = new Float32Array(outputFrames * 2);
    stretch.outputBuffer.extract(interleavedOutput, 0, outputFrames);

    const outputChannels: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) {
      outputChannels.push(new Float32Array(outputFrames));
    }

    for (let i = 0; i < outputFrames; i++) {
      outputChannels[0][i] = interleavedOutput[i * 2];
      if (numChannels >= 2) {
        outputChannels[1][i] = interleavedOutput[i * 2 + 1];
      }
    }
    console.log(`${LOG_PREFIX} [Step-5/DeInterleave] 完成 | outputSamples=${outputFrames} channels=${outputChannels.length} 耗时${(performance.now() - t0).toFixed(1)}ms`);

    const totalTime = performance.now() - (t0 - processTime); // 粗略总耗时
    console.log(`${LOG_PREFIX} 变速完成 | tempo=${tempo} input=${numSamples}→output=${outputFrames} frames (${((outputFrames / numSamples) * 100).toFixed(1)}%)`);

    return outputChannels;

  } catch (err) {
    console.error(`${LOG_PREFIX} 变速流程异常中断`, err);
    throw err;
  }
}
