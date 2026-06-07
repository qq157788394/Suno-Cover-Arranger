/**
 * 参考音频预处理完整流水线
 * 顺序执行：音频解码 → Stage 2 频谱混淆 → (可选) Stage 3 变速 → MP3 编码
 */

import type { PipelineInput, PipelineOutput } from "@/shared/types/types";
import { processStage2 } from "./stage2";
import { processStage3 } from "./stage3";
import { encodeMP3 } from "./encoder/mp3-encoder";

/**
 * 执行参考音频预处理完整流水线
 * @param input - 流水线输入参数
 * @returns 包含 MP3 Blob 的输出结果
 */
export async function runCoverPreprocessPipeline(
  input: PipelineInput,
): Promise<PipelineOutput> {
  // 阶段 0: 音频解码
  const startTime = performance.now();
  input.onProgress?.({ stage: "decode", progress: 0, label: "解码中" });
  const audioCtx = new AudioContext();
  const arrayBuffer = await input.audioFile.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  input.onProgress?.({ stage: "decode", progress: 10, label: "解码完成" });

  // Stage 2: 频谱指纹混淆（占总进度 10%~65%）
  input.onProgress?.({ stage: "stage2", progress: 10, label: "频谱混淆中" });
  const obfuscated = await processStage2(
    audioBuffer,
    input.preset,
    (stage2Percent) => {
      // 将 Stage 2 内部进度 0~100 映射到总进度 10~65
      const totalProgress = 10 + Math.round(stage2Percent * 0.55);
      input.onProgress?.({
        stage: "stage2",
        progress: totalProgress,
        label: "频谱混淆中",
      });
    },
  );
  input.onProgress?.({ stage: "stage2", progress: 65, label: "频谱混淆完成" });

  // Stage 3: 保音调变速（根据 speedMode 决定）
  let processed = obfuscated;
  let speedFactor = 1.0;

  if (input.speedMode === "slowdown") {
    input.onProgress?.({
      stage: "stage3",
      progress: 65,
      label: "0.5x 降速中",
    });
    processed = processStage3(obfuscated, audioBuffer.sampleRate, 0.5);
    speedFactor = 2.0;
    input.onProgress?.({
      stage: "stage3",
      progress: 95,
      label: "0.5x 降速完成",
    });
  } else if (input.speedMode === "speedup") {
    input.onProgress?.({
      stage: "stage3",
      progress: 65,
      label: "2x 加速中",
    });
    processed = processStage3(obfuscated, audioBuffer.sampleRate, 2.0);
    speedFactor = 0.5;
    input.onProgress?.({ stage: "stage3", progress: 95, label: "2x 加速完成" });
  }

  // 阶段 4: MP3 编码
  const encodeStartProgress = input.speedMode !== "none" ? 95 : 65;
  input.onProgress?.({
    stage: "encode",
    progress: encodeStartProgress,
    label: "MP3 编码中",
  });
  const mp3Blob = await encodeMP3(
    processed,
    audioBuffer.sampleRate,
    128,
    (encodeProgress) => {
      // 将编码进度 0-100 映射到总进度区间
      const totalProgress =
        encodeStartProgress +
        Math.round((encodeProgress * (100 - encodeStartProgress)) / 100);
      input.onProgress?.({
        stage: "encode",
        progress: totalProgress,
        label: "MP3 编码中",
      });
    },
  );
  input.onProgress?.({ stage: "done", progress: 100, label: "完成！" });

  const processingTimeMs = performance.now() - startTime;

  audioCtx.close();

  return {
    mp3Blob,
    originalDuration: audioBuffer.duration,
    processedDuration: audioBuffer.duration * speedFactor,
    preset: input.preset,
    processingTimeMs,
  };
}
