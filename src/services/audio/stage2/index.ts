import type { PresetLevel } from '@/shared/types/types';
import { WebFFTBackend } from '@/services/audio/fft/webfft-backend';
import { PRESETS } from '@/services/audio/presets';
import { applyEqFilter, buildEqGainCurve } from './eq';
import { applyCompressor } from './compressor';
import { applyNoiseFloor } from './noise';
import { applyPeakLimiter } from './limiter';
import { applyPhaser } from './phaser';
import { applyLoudnorm } from './loudnorm';
import { applyRubberbandSpectralSmear } from './rubberband';
import { applySpectralPeakShiftOnSpectrum } from './spectral-peak-shift';
import { applySpectralEnvelopeRandomizationOnSpectrum } from './spectral-envelope-randomization';
import { applyStereoDecorrelation } from './stereo-decorrelation';

/** STFT FFT 帧大小（2^13 = 8192，webfft 上限为 131072） */
const FFT_SIZE = 8192;

/** Stage 2 日志前缀 */
const LOG_PREFIX = '[Stage2]';

/**
 * 让出主线程，使 React 有机会处理状态更新并重渲染
 * @returns Promise 在下一个事件循环 tick 时 resolve
 */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Stage 2 主函数 — 频谱指纹混淆（完整处理链）
 *
 * 处理流程：
 *   Phase 1: STFT → EQ滤波 + 峰值位置微扰 + 频谱包络随机化 → IFFT → OLA
 *   Phase 2: 动态压缩（时域）
 *   Phase 3: 相位偏移 Phaser（时域，medium/heavy）
 *   Phase 4: 谱涂抹 Rubberband（仅 heavy）
 *   Phase 5: 本底噪声注入（粉红噪声）
 *   Phase 6: 响度归一化 Loudnorm
 *   Phase 7: Peak Limiter 保护
 *   Phase 8: 立体声通道去相关
 *
 * 性能优化：峰值位置微扰和频谱包络随机化直接在 Phase 1 的 STFT 循环中
 * 对频谱数据操作，零额外 STFT 遍历开销。
 *
 * 异步设计：Phase 1 的 STFT 循环按批次处理帧，每批处理后 await 让出主线程，
 * 确保 React 状态更新能及时触发 UI 重渲染，进度条平滑递增。
 *
 * @param audioBuffer - 浏览器解码后的音频对象
 * @param preset - 预设强度等级
 * @param onProgress - 进度回调（percent: 0~100）
 * @returns 混淆后的音频声道数据
 */
export async function processStage2(
  audioBuffer: AudioBuffer,
  preset: PresetLevel,
  onProgress?: (percent: number) => void,
): Promise<Float32Array[]> {
  const sr = audioBuffer.sampleRate;
  const channels = audioBuffer.numberOfChannels;
  const sigLen = audioBuffer.length;
  const cfg = PRESETS[preset];

  console.log(`${LOG_PREFIX} 开始频谱混淆 | preset=${preset} sr=${sr}Hz channels=${channels} samples=${sigLen} duration=${(sigLen / sr).toFixed(2)}s`);

  // ═══ 初始化 ═══
  try {
    // 初始化 FFT 引擎（固定大小 8192）
    const fft = new WebFFTBackend(FFT_SIZE);

    // 预计算 EQ 增益曲线（基于 STFT 帧大小，包含高低通滤波）
    const eqCurve = buildEqGainCurve(sr, FFT_SIZE, cfg.eq_bands, cfg.highpass_hz, cfg.lowpass_hz);

    // 预生成 Hann 窗
    const hannWindow = generateHannWindow(FFT_SIZE);

    // 计算总帧数
    const numFrames = Math.ceil(sigLen / HOP_SIZE) + (OVERLAP_FACTOR - 1);

    // 预判断频域扩展模块是否启用
    const peakShiftEnabled = cfg.spectral_peak_shift !== null && cfg.spectral_peak_shift.enabled;
    const envelopeRandEnabled = cfg.spectral_envelope !== null && cfg.spectral_envelope.enabled;

    console.log(`${LOG_PREFIX} [Phase-Init] 初始化完成 | FFT=${FFT_SIZE} hop=${HOP_SIZE} frames=${numFrames} highpass=${cfg.highpass_hz}Hz lowpass=${cfg.lowpass_hz}Hz threshold=${cfg.threshold} ratio=${cfg.ratio} noiseFloor=${cfg.noise_floor_db}dB phaser=${cfg.phaser ? 'ON' : 'OFF'} rubberband=${cfg.rubberband} peakShift=${peakShiftEnabled ? 'ON' : 'OFF'} envelopeRand=${envelopeRandEnabled ? 'ON' : 'OFF'}`);

    const outputChannels: Float32Array[] = [];

    for (let ch = 0; ch < channels; ch++) {
      const input = audioBuffer.getChannelData(ch);
      console.log(`${LOG_PREFIX} [Channel-${ch}] 开始处理 ${input.length} 个采样点`);

      // 重叠相加缓冲区
      const olaBuffer = new Float32Array(numFrames * HOP_SIZE + FFT_SIZE);

      /** 时域信号（在 Phase 1 中赋值，后续所有 Phase 共享） */
      let timeDomain: Float32Array;

      // ═══ Phase 1: STFT 频域处理（EQ + 峰值微扰 + 包络随机化）═══
      // 峰值位置微扰和频谱包络随机化直接在 STFT 循环中对频谱操作，
      // 避免额外的 STFT 遍历，零性能开销
      // 按批次处理帧，每批处理后让出主线程，确保 React 能重渲染进度条
      try {
        const t0 = performance.now();
        // 每批处理的帧数：约占总帧数的 5%，确保每批处理约 50ms
        const batchSize = Math.max(1, Math.floor(numFrames / 20));

        for (let batchStart = 0; batchStart < numFrames; batchStart += batchSize) {
          const batchEnd = Math.min(batchStart + batchSize, numFrames);

          for (let frame = batchStart; frame < batchEnd; frame++) {
            const startSample = frame * HOP_SIZE;

            // 构造加窗帧
            const frameBuffer = new Float32Array(FFT_SIZE);
            for (let i = 0; i < FFT_SIZE; i++) {
              const srcIdx = startSample + i;
              if (srcIdx >= 0 && srcIdx < sigLen) {
                frameBuffer[i] = input[srcIdx] * hannWindow[i];
              }
            }

            // FFT → 频域
            const spectrum = fft.rfft(frameBuffer);

            // EQ 频域滤波（含高低通）
            applyEqFilter(spectrum, eqCurve);

            // 频域峰值位置微扰（直接操作频谱，零额外 STFT 开销）
            if (peakShiftEnabled && cfg.spectral_peak_shift) {
              applySpectralPeakShiftOnSpectrum(spectrum, FFT_SIZE, cfg.spectral_peak_shift);
            }

            // 频谱包络随机化（直接操作频谱，零额外 STFT 开销）
            if (envelopeRandEnabled && cfg.spectral_envelope) {
              applySpectralEnvelopeRandomizationOnSpectrum(spectrum, FFT_SIZE, cfg.spectral_envelope);
            }

            // IFFT → 回时域
            const ifftResult = fft.irfft(spectrum, FFT_SIZE);

            // 重叠相加（OLA）
            for (let i = 0; i < FFT_SIZE; i++) {
              const destIdx = startSample + i;
              if (destIdx >= 0) {
                olaBuffer[destIdx] += ifftResult[i];
              }
            }
          }

          // 每批处理后上报进度并让出主线程
          const batchProgress = Math.round((batchEnd / numFrames) * 70);
          onProgress?.(ch > 0 ? 70 + batchProgress : batchProgress);
          await yieldToMain();
        }

        // 截取原始信号长度
        timeDomain = olaBuffer.slice(0, sigLen);
        const t1 = performance.now();
        console.log(`${LOG_PREFIX} [Phase-1/STFT+EQ+PeakShift+EnvelopeRand] 完成 | channel=${ch} 耗时${(t1 - t0).toFixed(1)}ms frames=${numFrames}`);
      } catch (err) {
        console.error(`${LOG_PREFIX} [Phase-1/STFT+EQ+PeakShift+EnvelopeRand] 失败`, err);
        throw err;
      }

      // ═══ Phase 2: 动态压缩（时域）— 对齐 CUDA 版 ═══
      try {
        const t0 = performance.now();
        applyCompressor(timeDomain, cfg.threshold, cfg.ratio);
        const t1 = performance.now();
        console.log(`${LOG_PREFIX} [Phase-2/Compressor] 完成 | channel=${ch} threshold=${cfg.threshold} ratio=${cfg.ratio} 耗时${(t1 - t0).toFixed(1)}ms`);
      } catch (err) {
        console.error(`${LOG_PREFIX} [Phase-2/Compressor] 失败`, err);
        throw err;
      }

      // ═══ Phase 3: 相位偏移 Phaser（时域）— 对齐 ffmpeg aphaser ═══
      if (cfg.phaser !== null) {
        try {
          const t0 = performance.now();
          applyPhaser(timeDomain, cfg.phaser, sr);
          const t1 = performance.now();
          console.log(`${LOG_PREFIX} [Phase-3/Phaser] 完成 | channel=${ch} in_gain=${cfg.phaser.in_gain} out_gain=${cfg.phaser.out_gain} delay=${cfg.phaser.delay}ms decay=${cfg.phaser.decay} speed=${cfg.phaser.speed} type=${cfg.phaser.type} 耗时${(t1 - t0).toFixed(1)}ms`);
        } catch (err) {
          console.error(`${LOG_PREFIX} [Phase-3/Phaser] 失败`, err);
          throw err;
        }
      } else {
        console.log(`${LOG_PREFIX} [Phase-3/Phaser] 跳过 | preset=${preset} 未配置 phaser`);
      }

      // ═══ Phase 4: 谱涂抹 Rubberband（仅 Heavy）— 对齐 ffmpeg rubberband ═══
      if (cfg.rubberband) {
        try {
          const t0 = performance.now();
          applyRubberbandSpectralSmear(timeDomain, sr, cfg.rubberband_phase_jitter, cfg.rubberband_mag_jitter);
          const t1 = performance.now();
          onProgress?.(85);
          await yieldToMain();
          console.log(`${LOG_PREFIX} [Phase-4/Rubberband] 完成 | channel=${ch} phaseJitter=${cfg.rubberband_phase_jitter}rad magJitter=${cfg.rubberband_mag_jitter} 耗时${(t1 - t0).toFixed(1)}ms`);
        } catch (err) {
          console.error(`${LOG_PREFIX} [Phase-4/Rubberband] 失败`, err);
          throw err;
        }
      } else {
        console.log(`${LOG_PREFIX} [Phase-4/Rubberband] 跳过 | preset=${preset} rubberband=false`);
      }

      // ═══ Phase 5: 本底噪声注入（粉红噪声）— 对齐 CUDA 版 ═══
      try {
        const t0 = performance.now();
        applyNoiseFloor(timeDomain, cfg.noise_floor_db);
        const t1 = performance.now();
        onProgress?.(90);
        await yieldToMain();
        console.log(`${LOG_PREFIX} [Phase-5/PinkNoise] 完成 | channel=${ch} noiseFloorDb=${cfg.noise_floor_db}dB 耗时${(t1 - t0).toFixed(1)}ms`);
      } catch (err) {
        console.error(`${LOG_PREFIX} [Phase-5/PinkNoise] 失败`, err);
        throw err;
      }

      // ═══ Phase 6: 响度归一化 Loudnorm — 对齐 ffmpeg loudnorm ═══
      try {
        const t0 = performance.now();
        applyLoudnorm(timeDomain, sr);
        const t1 = performance.now();
        onProgress?.(95);
        await yieldToMain();
        console.log(`${LOG_PREFIX} [Phase-6/Loudnorm] 完成 | channel=${ch} target=-16LUFS TP=-1.5dBTP 耗时${(t1 - t0).toFixed(1)}ms`);
      } catch (err) {
        console.error(`${LOG_PREFIX} [Phase-6/Loudnorm] 失败`, err);
        throw err;
      }

      // ═══ Phase 7: Peak Limiter 保护 ═══
      try {
        const t0 = performance.now();
        applyPeakLimiter(timeDomain);
        const t1 = performance.now();

        // 计算最终峰值用于日志
        let finalPeak = 0;
        for (let i = 0; i < timeDomain.length; i++) {
          const absVal = Math.abs(timeDomain[i]);
          if (absVal > finalPeak) finalPeak = absVal;
        }
        console.log(`${LOG_PREFIX} [Phase-7/PeakLimiter] 完成 | channel=${ch} peak=${finalPeak.toFixed(4)} 耗时${(t1 - t0).toFixed(1)}ms`);
      } catch (err) {
        console.error(`${LOG_PREFIX} [Phase-7/PeakLimiter] 失败`, err);
        throw err;
      }

      outputChannels.push(timeDomain);
    }

    // ═══ Phase 8: 立体声通道去相关 — 对抗双通道联合指纹检测 ═══
    // 必须在所有声道独立处理完成后执行，因为它需要同时操作左右声道
    if (cfg.stereo_decorrelation && cfg.stereo_decorrelation.enabled && outputChannels.length >= 2) {
      try {
        const t0 = performance.now();
        applyStereoDecorrelation(outputChannels, sr, cfg.stereo_decorrelation);
        const t1 = performance.now();
        console.log(`${LOG_PREFIX} [Phase-8/StereoDecorrelation] 完成 | delay_ms=${cfg.stereo_decorrelation.delay_ms} phase_offset=${cfg.stereo_decorrelation.phase_offset} 耗时${(t1 - t0).toFixed(1)}ms`);
      } catch (err) {
        console.error(`${LOG_PREFIX} [Phase-8/StereoDecorrelation] 失败`, err);
        throw err;
      }
    } else {
      console.log(`${LOG_PREFIX} [Phase-8/StereoDecorrelation] 跳过 | stereo_decorrelation=disabled 或单声道`);
    }

    fft.dispose();
    console.log(`${LOG_PREFIX} 全部处理完成 | channels=${outputChannels.length}`);
    return outputChannels;

  } catch (err) {
    console.error(`${LOG_PREFIX} 频谱混淆流程异常中断`, err);
    throw err;
  }
}

/** 帧重叠因子：4 表示 75% 重叠，满足 COLA 约束 */
const OVERLAP_FACTOR = 4;

/** 帧跳跃步长 */
const HOP_SIZE = FFT_SIZE / OVERLAP_FACTOR; // 2048

/**
 * 生成 Hann 窗
 * @param size - 窗长度
 * @returns Hann 窗系数数组
 */
function generateHannWindow(size: number): Float32Array {
  const window = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  return window;
}
