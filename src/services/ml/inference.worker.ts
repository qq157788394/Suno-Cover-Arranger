/**
 * 音乐理解 ML 推理 Worker — 两阶段模式
 *
 * Phase 1 (EXTRACT): 接收音频 → 降采样 → 特征提取 → 缓存 features
 * Phase 2 (ANALYZE_ONE): 加载单个模型 → 推理 → 返回结果 → 卸载模型释放 GPU 内存
 */
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';
import { EssentiaTFInputExtractor, TensorflowMusiCNN } from 'essentia.js/dist/essentia.js-model.es.js';
import * as tf from '@tensorflow/tfjs';

// ============= 模型注册表 =============
const MODEL_REGISTRY: Record<string, string> = {
  /* 风格 */
  genre:              '/models/musicnn/model.json',
  genre_tzanetakis:   '/models/genre_tzanetakis-musicnn-msd-2/model.json',
  genre_electronic:   '/models/genre_electronic-musicnn-msd-2/model.json',
  urbansound8k:       '/models/urbansound8k-musicnn-msd-1-tfjs/model.json',
  /* 情绪 (4合1) */
  mood_happy:         '/models/mood_happy-musicnn-msd-2/model.json',
  mood_sad:           '/models/mood_sad-musicnn-msd-2/model.json',
  mood_relaxed:       '/models/mood_relaxed-musicnn-msd-2/model.json',
  mood_aggressive:    '/models/mood_aggressive-musicnn-msd-2/model.json',
  /* 能量 (4合1) */
  mood_acoustic:      '/models/mood_acoustic-musicnn-msd-2/model.json',
  mood_electronic:    '/models/mood_electronic-musicnn-msd-2/model.json',
  mood_party:         '/models/mood_party-musicnn-msd-2/model.json',
  danceability:       '/models/danceability-musicnn-msd-2/model.json',
};

export type TaskName = keyof typeof MODEL_REGISTRY;

// ============= 状态 =============
let extractor: any = null;
let cachedFeatures: any = null;
let currentModel: any = null;
let initialized = false;

async function init(): Promise<void> {
  if (initialized) return;
  self.postMessage({ type: 'log', msg: '[init] EssentiaTFInputExtractor...' });
  extractor = new EssentiaTFInputExtractor(EssentiaWASM, 'musicnn', false);
  await tf.ready();
  self.postMessage({ type: 'log', msg: '[init] TF.js ready, backend=' + tf.getBackend() });
  initialized = true;
}

/** 卸载当前模型，释放 GPU 内存 */
function unloadModel(): void {
  if (currentModel) {
    try { currentModel = null; } catch {}
  }
  tf.disposeVariables();
}

// ============= 消息处理 =============
self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;

  try {
    await ensureInit();

    if (msg.type === 'EXTRACT') {
      // ===== Phase 1: 特征提取 =====
      const audioSignal = new Float32Array(msg.audioData);
      self.postMessage({ type: 'progress', step: 'extracting', progress: 50 });
      cachedFeatures = extractor.computeFrameWise(audioSignal, 256);
      self.postMessage({ type: 'log', msg: '[extract] Features ready, cached for all models' });
      self.postMessage({
        type: 'ready',
        models: Object.keys(MODEL_REGISTRY),
      });

    } else if (msg.type === 'ANALYZE_ONE') {
      // ===== Phase 2: 单模型推理 =====
      const modelName = msg.model as TaskName;
      const modelPath = MODEL_REGISTRY[modelName];

      if (!modelPath) {
        self.postMessage({ type: 'result', model: modelName, data: { error: 'Unknown model', raw: null } });
        return;
      }

      if (!cachedFeatures) {
        self.postMessage({ type: 'result', model: modelName, data: { error: 'No features cached. Run EXTRACT first.', raw: null } });
        return;
      }

      // 先卸载上一个模型
      unloadModel();

      self.postMessage({ type: 'log', msg: `[model] Loading ${modelName}...` });
      currentModel = new TensorflowMusiCNN(tf, modelPath, false);
      await currentModel.initialize();

      self.postMessage({ type: 'log', msg: `[model] ${modelName}: predicting...` });
      const predictions = await currentModel.predict(cachedFeatures, true);

      // 时间轴均值 → 一维数组
      const numClasses = predictions[0]?.length || 0;
      const averaged: number[] = [];
      for (let ci = 0; ci < numClasses; ci++) {
        let sum = 0;
        for (let ti = 0; ti < predictions.length; ti++) {
          sum += predictions[ti][ci];
        }
        averaged.push(sum / predictions.length);
      }

      self.postMessage({
        type: 'result',
        model: modelName,
        data: { raw: averaged },
      });

      // 推理完成，卸载模型
      unloadModel();
      self.postMessage({ type: 'log', msg: `[model] ${modelName}: done, unloaded` });
    }
  } catch (err: any) {
    self.postMessage({ type: 'error', message: err.message || String(err) });
  }
};

async function ensureInit(): Promise<void> {
  if (!initialized) await init();
}
