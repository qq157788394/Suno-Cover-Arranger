/**
 * Web Worker 入口 — 和弦分析
 *
 * 在 Worker 线程内执行完整的和弦分析流水线：
 *   - WASM 初始化（essentia.js）
 *   - 音频解码（AudioContext.decodeAudioData 的 ArrayBuffer 传入）
 *   - 特征提取 + 和弦匹配 + 级数映射
 *   - SHA-256 文件哈希
 *   - 缓存读写（Dexie.js）
 *   - 30s 超时 + 取消支持
 *
 * 消息协议参考现有 `pipeline.worker.ts` 的 {type, payload} 派发模式。
 *
 * @module services/chord/worker
 */

import type {
  WorkerRequest,
  WorkerResponse,
  ProgressStep,
  SongAnalysis,
} from '@/shared/types/types';
import { analyzePipeline, type ProgressCallback } from './pipeline';
import { getCachedAnalysis, cacheAnalysis } from './cache';

// ── Worker 状态 ──
let abortController: AbortController | null = null;
let essentiaReady = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let essentiaInstance: any = null;

// ── 消息监听 ──
self.onmessage = async (
  event: MessageEvent<WorkerRequest>,
) => {
  const data = event.data;
  const { type, requestId } = data;

  try {
    switch (type) {
      case 'analyze':
        await handleAnalyze((data as Extract<WorkerRequest, { type: 'analyze' }>).payload, requestId);
        break;
      case 'hashFile':
        await handleHashFile((data as Extract<WorkerRequest, { type: 'hashFile' }>).payload, requestId);
        break;
      case 'cancel':
        abortController?.abort();
        postResponse({ type: 'cancelled', requestId });
        break;
      default:
        postResponse({
          type: 'error',
          payload: {
            code: 'ALGORITHM_ERROR',
            message: `未知消息类型: ${(data as { type?: string }).type}`,
            retryable: false,
          },
          requestId,
        });
    }
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : String(error);
    postResponse({
      type: 'error',
      payload: {
        code: 'WORKER_CRASH',
        message: `Worker 异常: ${errMsg}`,
        retryable: true,
      },
      requestId,
    });
  }
};

// ── 消息发送辅助 ──
function postResponse(msg: WorkerResponse): void {
  self.postMessage(msg);
}

// ── 进度上报 ──
function reportProgress(
  requestId: string,
  step: ProgressStep,
  percent: number,
  message?: string,
): void {
  postResponse({
    type: 'progress',
    payload: { step, percent, message },
    requestId,
  });
}

// ── SHA-256 文件哈希 ──
async function computeSHA256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── 处理 hashFile 消息 ──
async function handleHashFile(
  payload: { file: File },
  requestId: string,
): Promise<void> {
  try {
    const arrayBuffer = await payload.file.arrayBuffer();
    const fileHash = await computeSHA256(arrayBuffer);
    postResponse({
      type: 'hashResult',
      payload: { fileHash },
      requestId,
    });
  } catch (error) {
    postResponse({
      type: 'error',
      payload: {
        code: 'FILE_READ_FAILED',
        message: `文件哈希计算失败: ${(error as Error).message}`,
        retryable: false,
      },
      requestId,
    });
  }
}

// ── 处理 analyze 消息 ──
async function handleAnalyze(
  payload: {
    audioBuffer: ArrayBuffer;
    sampleRate: number;
    fileName: string;
    fileHash: string;
  },
  requestId: string,
): Promise<void> {
  const { audioBuffer: rawBuffer, sampleRate, fileName, fileHash } = payload;

  // 创建新的 AbortController
  abortController = new AbortController();
  const signal = abortController.signal;

  // ── 30s 超时 ──
  const TIMEOUT_MS = 30000;
  const timeoutId = setTimeout(() => {
    abortController?.abort();
  }, TIMEOUT_MS);

  try {
    // ── 1. 检查缓存 ──
    reportProgress(requestId, 'wasm_loading', 0, '检查缓存…');
    const cached = await getCachedAnalysis(fileHash);
    if (cached) {
      clearTimeout(timeoutId);
      postResponse({ type: 'result', payload: cached, requestId });
      return;
    }

    if (signal.aborted) {
      clearTimeout(timeoutId);
      postResponse({ type: 'cancelled', requestId });
      return;
    }

    // ── 2. WASM 初始化 ──
    reportProgress(requestId, 'wasm_loading', 5, '正在加载音频分析引擎…');
    await ensureEssentia(requestId);

    if (signal.aborted) {
      clearTimeout(timeoutId);
      postResponse({ type: 'cancelled', requestId });
      return;
    }

    // ── 3. 音频解码 ──
    reportProgress(requestId, 'wasm_loading', 10, '正在解码音频…');
    const audioBuffer = await decodeAudioInWorker(rawBuffer, sampleRate);

    if (signal.aborted) {
      clearTimeout(timeoutId);
      postResponse({ type: 'cancelled', requestId });
      return;
    }

    // ── 4. 分析流水线 ──
    const progressCallback: ProgressCallback = (step, percent) => {
      // 映射 pipeline 内部 step 到 Worker 协议 step
      const stepMap: Record<string, ProgressStep> = {
        hpcp: 'hpcp',
        key_bpm: 'key_bpm',
        chord_match: 'chord_match',
        viterbi: 'viterbi',
        romanize: 'romanize',
        done: 'done',
      };
      const mapped = stepMap[step] || 'hpcp';
      reportProgress(requestId, mapped, percent);
    };

    const fileSize = rawBuffer.byteLength;
    const result: SongAnalysis = await analyzePipeline(
      audioBuffer,
      fileName,
      fileHash,
      fileSize,
      progressCallback,
    );

    if (signal.aborted) {
      clearTimeout(timeoutId);
      postResponse({ type: 'cancelled', requestId });
      return;
    }

    // ── 5. 存入缓存 ──
    try {
      await cacheAnalysis(result);
    } catch {
      // 缓存失败不阻塞结果返回
      console.warn('[Worker] 缓存写入失败，结果仍可用');
    }

    // ── 6. 返回结果 ──
    clearTimeout(timeoutId);
    postResponse({
      type: 'result',
      payload: result,
      requestId,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if ((error as Error).name === 'AbortError' || signal.aborted) {
      postResponse({ type: 'cancelled', requestId });
      return;
    }

    const errMsg =
      error instanceof Error ? error.message : String(error);

    // 根据错误消息映射错误码
    let code: import('@/shared/types/types').ErrorCode = 'ALGORITHM_ERROR';
    let retryable = true;

    if (errMsg.includes('WASM_LOAD_FAILED')) {
      code = 'WASM_LOAD_FAILED';
      retryable = true;
    } else if (errMsg.includes('DECODE_FAILED') || errMsg.includes('decode')) {
      code = 'DECODE_FAILED';
      retryable = false;
    } else if (errMsg.includes('TIMEOUT') || signal.aborted) {
      code = 'TIMEOUT';
      retryable = true;
    } else if (errMsg.includes('OUT_OF_MEMORY') || errMsg.includes('memory')) {
      code = 'OUT_OF_MEMORY';
      retryable = false;
    }

    postResponse({
      type: 'error',
      payload: { code, message: errMsg, retryable },
      requestId,
    });
  }
}

// ── WASM 初始化 ──
async function ensureEssentia(requestId: string): Promise<void> {
  if (essentiaReady && essentiaInstance) return;

  try {
    // Worker 中检测环境
    const isDev = typeof self !== 'undefined' &&
      (self as unknown as { location: { hostname: string } }).location.hostname === 'localhost';
    const WASM_BASE = isDev
      ? '/essentia-wasm/'
      : '/Suno-Cover-Arranger/essentia-wasm/';

    // Worker 模块模式下，使用 fetch + eval 加载 essentia.js（绕过 bundler 互操作）
    const wasmScriptUrl = `${WASM_BASE}essentia-wasm.web.js`;
    const wasmResponse = await fetch(wasmScriptUrl);
    if (!wasmResponse.ok) {
      throw new Error(`Failed to fetch WASM script: ${wasmResponse.status}`);
    }
    const wasmScript = await wasmResponse.text();
    // eval 会设置 self.EssentiaWASM 全局
    eval(wasmScript);

    const EssentiaWASM: any = (self as any).EssentiaWASM;

    // 加载 Core API
    const coreScript = await fetch(
      isDev
        ? '/essentia-wasm/essentia.js-core.umd.js'
        : '/Suno-Cover-Arranger/essentia-wasm/essentia.js-core.umd.js',
    );
    if (coreScript.ok) {
      eval(await coreScript.text());
    }
    const EssentiaClass: any = (self as any).Essentia;

    if (!EssentiaWASM || !EssentiaClass) {
      throw new Error('essentia.js 模块结构不符合预期');
    }

    const wasmModule = await EssentiaWASM({
      locateFile: (path: string): string => {
        if (path.endsWith('.wasm')) {
          return WASM_BASE + path;
        }
        return path;
      },
    });

    essentiaInstance = new EssentiaClass(wasmModule);
    essentiaReady = true;
  } catch (error) {
    throw new Error(
      `WASM_LOAD_FAILED: ${(error as Error).message}`,
    );
  }
}

// ── 在 Worker 中解码音频 ──
async function decodeAudioInWorker(
  rawBuffer: ArrayBuffer,
  sampleRate: number,
): Promise<AudioBuffer> {
  // Worker 中可以直接使用 OfflineAudioContext 解码
  // 注意：部分浏览器 Worker 中可能不支持 AudioContext
  try {
    const audioContext = new OfflineAudioContext({
      numberOfChannels: 1,
      length: 1,
      sampleRate: sampleRate || 44100,
    });

    const audioBuffer = await audioContext.decodeAudioData(rawBuffer.slice(0));

    // 重采样到 44100Hz（如果需要）
    if (audioBuffer.sampleRate !== 44100) {
      return await resampleBuffer(audioBuffer, 44100);
    }

    return audioBuffer;
  } catch (error) {
    throw new Error(
      `DECODE_FAILED: 音频解码失败 — ${(error as Error).message}`,
    );
  }
}

// ── 重采样到目标采样率 ──
async function resampleBuffer(
  buffer: AudioBuffer,
  targetSampleRate: number,
): Promise<AudioBuffer> {
  const offlineCtx = new OfflineAudioContext(
    buffer.numberOfChannels,
    Math.ceil(buffer.duration * targetSampleRate),
    targetSampleRate,
  );
  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineCtx.destination);
  source.start();
  return offlineCtx.startRendering();
}
