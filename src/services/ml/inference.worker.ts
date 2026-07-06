/**
 * 音乐理解 ML 推理 Worker — 两阶段模式
 */

const PUBLIC_PATH = '/Suno-Cover-Arranger/';

(self as any).Module = {
  locateFile: (path: string) => {
    const result = PUBLIC_PATH + 'essentia-wasm/' + path;
    console.log('[Worker] locateFile:', path, '->', result);
    return result;
  },
};

let EssentiaWASM: any = null;
let EssentiaTFInputExtractor: any = null;
let TensorflowMusiCNN: any = null;
let tf: any = null;

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

async function loadDependencies(): Promise<void> {
  console.log('[Worker] loadDependencies: Starting...');
  
  console.log('[Worker] loadDependencies: Loading essentia-wasm.es.js...');
  const essentiaWasmModule = await import('essentia.js/dist/essentia-wasm.es.js');
  EssentiaWASM = essentiaWasmModule.EssentiaWASM;
  console.log('[Worker] loadDependencies: essentia-wasm loaded successfully');
  
  console.log('[Worker] loadDependencies: Loading essentia.js-model.es.js...');
  const essentiaModelModule = await import('essentia.js/dist/essentia.js-model.es.js');
  EssentiaTFInputExtractor = essentiaModelModule.EssentiaTFInputExtractor;
  TensorflowMusiCNN = essentiaModelModule.TensorflowMusiCNN;
  console.log('[Worker] loadDependencies: essentia.js-model loaded successfully');
  
  console.log('[Worker] loadDependencies: Loading @tensorflow/tfjs...');
  tf = await import('@tensorflow/tfjs');
  console.log('[Worker] loadDependencies: TensorFlow.js loaded successfully, version:', tf.version.tfjs);
}

async function init(): Promise<void> {
  if (initialized) {
    console.log('[Worker] init: Already initialized, skipping');
    return;
  }
  
  await loadDependencies();
  
  console.log('[Worker] init: Starting initialization...');
  (self as any).postMessage({ type: 'log', msg: '[init] Creating EssentiaTFInputExtractor...' });
  
  try {
    console.log('[Worker] init: Creating EssentiaTFInputExtractor with EssentiaWASM...');
    extractor = new EssentiaTFInputExtractor(EssentiaWASM, 'musicnn', false);
    console.log('[Worker] init: EssentiaTFInputExtractor created successfully');
    (self as any).postMessage({ type: 'log', msg: '[init] EssentiaTFInputExtractor created' });
  } catch (err) {
    console.error('[Worker] init: Failed to create EssentiaTFInputExtractor:', err);
    (self as any).postMessage({ type: 'error', message: 'Failed to create EssentiaTFInputExtractor: ' + (err instanceof Error ? err.message : String(err)) });
    throw err;
  }
  
  try {
    console.log('[Worker] init: Waiting for tf.ready()...');
    await tf.ready();
    console.log('[Worker] init: TF.js ready, backend=', tf.getBackend());
    (self as any).postMessage({ type: 'log', msg: '[init] TF.js ready, backend=' + tf.getBackend() });
  } catch (err) {
    console.error('[Worker] init: TF.js ready failed:', err);
    (self as any).postMessage({ type: 'error', message: 'TF.js init failed: ' + (err instanceof Error ? err.message : String(err)) });
    throw err;
  }
  
  initialized = true;
  console.log('[Worker] init: Initialization complete');
  (self as any).postMessage({ type: 'log', msg: '[init] Complete' });
}

function unloadModel(): void {
  if (currentModel) {
    try { currentModel = null; } catch {}
  }
  tf.disposeVariables();
}

(self as any).onmessage = async (e: MessageEvent) => {
  const msg = e.data;
  console.log('[Worker] onmessage: Received message, type:', msg.type);

  try {
    console.log('[Worker] onmessage: Calling ensureInit...');
    await ensureInit();
    console.log('[Worker] onmessage: ensureInit completed');

    if (msg.type === 'EXTRACT') {
      console.log('[Worker] onmessage: EXTRACT received, audioData byteLength:', msg.audioData?.byteLength);
      const audioSignal = new Float32Array(msg.audioData);
      console.log('[Worker] onmessage: Float32Array created, length:', audioSignal.length);
      
      (self as any).postMessage({ type: 'progress', step: 'extracting', progress: 50 });
      
      try {
        console.log('[Worker] onmessage: Calling extractor.computeFrameWise...');
        cachedFeatures = extractor.computeFrameWise(audioSignal, 256);
        console.log('[Worker] onmessage: Features extracted successfully');
        (self as any).postMessage({ type: 'log', msg: '[extract] Features ready, cached for all models' });
        
        (self as any).postMessage({
          type: 'ready',
          models: Object.keys(MODEL_REGISTRY),
        });
        console.log('[Worker] onmessage: Sent READY message with models');
      } catch (extractErr) {
        console.error('[Worker] onmessage: extractor.computeFrameWise failed:', extractErr);
        (self as any).postMessage({ type: 'error', message: 'Feature extraction failed: ' + (extractErr instanceof Error ? extractErr.message : String(extractErr)) });
      }

    } else if (msg.type === 'ANALYZE_ONE') {
      const modelName = msg.model as TaskName;
      console.log('[Worker] onmessage: ANALYZE_ONE received, model:', modelName);
      
      const modelPath = MODEL_REGISTRY[modelName];
      console.log('[Worker] onmessage: Model path:', modelPath);

      if (!modelPath) {
        console.error('[Worker] onmessage: Unknown model:', modelName);
        (self as any).postMessage({ type: 'result', model: modelName, data: { error: 'Unknown model', raw: null } });
        return;
      }

      if (!cachedFeatures) {
        console.error('[Worker] onmessage: No features cached');
        (self as any).postMessage({ type: 'result', model: modelName, data: { error: 'No features cached. Run EXTRACT first.', raw: null } });
        return;
      }

      unloadModel();

      (self as any).postMessage({ type: 'log', msg: '[model] Loading ' + modelName + '...' });
      console.log('[Worker] onmessage: Creating TensorflowMusiCNN...');
      
      try {
        currentModel = new TensorflowMusiCNN(tf, modelPath, false);
        console.log('[Worker] onmessage: TensorflowMusiCNN created');
        
        console.log('[Worker] onmessage: Calling currentModel.initialize()...');
        await currentModel.initialize();
        console.log('[Worker] onmessage: Model initialized successfully');
        
        (self as any).postMessage({ type: 'log', msg: '[model] ' + modelName + ': predicting...' });
        
        console.log('[Worker] onmessage: Calling currentModel.predict()...');
        const predictions = await currentModel.predict(cachedFeatures, true);
        console.log('[Worker] onmessage: Predictions received, length:', predictions.length);

        const numClasses = predictions[0]?.length || 0;
        console.log('[Worker] onmessage: Number of classes:', numClasses);
        
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
        console.log('[Worker] onmessage: Result sent');

        unloadModel();
        (self as any).postMessage({ type: 'log', msg: '[model] ' + modelName + ': done, unloaded' });
        console.log('[Worker] onmessage: ANALYZE_ONE complete');
      } catch (modelErr) {
        console.error('[Worker] onmessage: Model analysis failed:', modelErr);
        (self as any).postMessage({ type: 'result', model: modelName, data: { error: 'Model analysis failed: ' + (modelErr instanceof Error ? modelErr.message : String(modelErr)), raw: null } });
        unloadModel();
      }
    }
  } catch (err: any) {
    console.error('[Worker] onmessage: Unexpected error:', err);
    (self as any).postMessage({ type: 'error', message: err.message || String(err) });
  }
};

async function ensureInit(): Promise<void> {
  if (!initialized) await init();
}
