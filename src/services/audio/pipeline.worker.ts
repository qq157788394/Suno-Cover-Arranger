/**
 * 音频处理 Web Worker
 * 监听主线程消息，执行 Stage 2 / Stage 3 处理并返回结果
 * 注意：当前版本先使用主线程同步执行，Worker 版本后续迭代
 */

import { processStage2 } from '@/services/audio/stage2';
import { processStage3 } from '@/services/audio/stage3';

/** Worker 消息类型 */
interface WorkerMessage {
  type: 'stage2' | 'stage3';
  payload: any;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case 'stage2': {
        const result = processStage2(payload.audioBuffer, payload.preset);
        self.postMessage({ type: 'stage2-done', result });
        break;
      }
      case 'stage3': {
        const result = processStage3(
          payload.channels,
          payload.sampleRate,
          payload.tempo,
        );
        self.postMessage({ type: 'stage3-done', result });
        break;
      }
      default:
        self.postMessage({ type: 'error', error: `未知消息类型: ${type}` });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: (error as Error).message,
    });
  }
};