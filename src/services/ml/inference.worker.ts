/**
 * 音乐理解 ML 推理 Worker — 两阶段模式
 */

const PUBLIC_PATH = '/Suno-Cover-Arranger/';

(self as any).Module = {
  locateFile: (path: string) => PUBLIC_PATH + 'essentia-wasm/' + path,
};

import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';
import { EssentiaTFInputExtractor, TensorflowMusiCNN } from 'essentia.js/dist/essentia.js-model.es.js';
import * as tf from '@tensorflow/tfjs';

const MODEL_REGISTRY: Record<string, string> = {
  genre:              PUBLIC_PATH + 'models/musicnn/model.json',
  genre_tzanetakis:   PUBLIC_PATH + 'models/genre_tzanetakis-musicnn-msd-2/model.json',
  genre_electronic:   PUBLIC_PATH + 'models/genre_electronic-musicnn-msd-2/model.json',
  urbansound8k:       PUBLIC_PATH + 'models/urbansound8k-musicnn-msd-1-tfjs/model.json',
  mood_happy:         PUBLIC_PATH + 'models/mood_happy-musicnn-msd-2/model.json',
  mood_sad:           PUBLIC_PATH + 'models/mood_sad-musicnn-msd-2/model.json',
  mood_relaxed:       PUBLIC_PATH + 'models/mood_relaxed-musicnn-msd-2/model.json',
  mood_aggressive:    PUBLIC_PATH + 'models/mood_aggressive-musicnn-msd-2/model.json',
  mood_acoustic:      PUBLIC_PATH + 'models/mood_acoustic-musicnn-msd-2/model.json',
  mood_electronic:    PUBLIC_PATH + 'models/mood_electronic-musicnn-msd-2/model.json',
  mood_party:         PUBLIC_PATH + 'models/mood_party-musicnn-msd-2/model.json',
  danceability:       PUBLIC_PATH + 'models/danceability-musicnn-msd-2/model.json',
};

export type TaskName = keyof typeof MODEL_REGISTRY;

let extractor: any = null;
let cachedFeatures: any = null;
let currentModel: any = null;
let initialized = false;

async function init(): Promise<void> {
  if (initialized) return;
  (self as any).postMessage({ type: 'log', msg: '[init] EssentiaTFInputExtractor...' });
  extractor = new EssentiaTFInputExtractor(EssentiaWASM, 'musicnn', false);
  await tf.ready();
  (self as any).postMessage({ type: 'log', msg: '[init] TF.js ready, backend=' + tf.getBackend() });
  initialized = true;
}

function unloadModel(): void {
  if (currentModel) {
    try { currentModel = null; } catch {}
  }
  tf.disposeVariables();
}

(self as any).onmessage = async (e: MessageEvent) => {
  const msg = e.data;

  try {
    await ensureInit();

    if (msg.type === 'EXTRACT') {
      const audioSignal = new Float32Array(msg.audioData);
      (self as any).postMessage({ type: 'progress', step: 'extracting', progress: 50 });
      cachedFeatures = extractor.computeFrameWise(audioSignal, 256);
      (self as any).postMessage({ type: 'log', msg: '[extract] Features ready, cached for all models' });
      (self as any).postMessage({
        type: 'ready',
        models: Object.keys(MODEL_REGISTRY),
      });

    } else if (msg.type === 'ANALYZE_ONE') {
      const modelName = msg.model as TaskName;
      const modelPath = MODEL_REGISTRY[modelName];

      if (!modelPath) {
        (self as any).postMessage({ type: 'result', model: modelName, data: { error: 'Unknown model', raw: null } });
        return;
      }

      if (!cachedFeatures) {
        (self as any).postMessage({ type: 'result', model: modelName, data: { error: 'No features cached. Run EXTRACT first.', raw: null } });
        return;
      }

      unloadModel();

      (self as any).postMessage({ type: 'log', msg: '[model] Loading ' + modelName + '...' });
      currentModel = new TensorflowMusiCNN(tf, modelPath, false);
      await currentModel.initialize();

      (self as any).postMessage({ type: 'log', msg: '[model] ' + modelName + ': predicting...' });
      const predictions = await currentModel.predict(cachedFeatures, true);

      const numClasses = predictions[0]?.length || 0;
      const averaged: number[] = [];
      for (let ci = 0; ci < numClasses; ci++) {
        let sum = 0;
        for (let ti = 0; ti < predictions.length; ti++) {
          sum += predictions[ti][ci];
        }
        averaged.push(sum / predictions.length);
      }

      (self as any).postMessage({
        type: 'result',
        model: modelName,
        data: { raw: averaged },
      });

      unloadModel();
      (self as any).postMessage({ type: 'log', msg: '[model] ' + modelName + ': done, unloaded' });
    }
  } catch (err: any) {
    (self as any).postMessage({ type: 'error', message: err.message || String(err) });
  }
};

async function ensureInit(): Promise<void> {
  if (!initialized) await init();
}
