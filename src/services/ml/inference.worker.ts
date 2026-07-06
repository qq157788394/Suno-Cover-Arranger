try {
  console.log('[inference.worker] Starting...');

  const PUBLIC_PATH = '/Suno-Cover-Arranger/';

  self.Module = {
    locateFile: (path) => PUBLIC_PATH + 'essentia-wasm/' + path,
  };

  console.log('[inference.worker] Loading essentia-wasm.web.js...');
  importScripts(PUBLIC_PATH + 'essentia-wasm/essentia-wasm.web.js');
  console.log('[inference.worker] essentia-wasm.web.js loaded');

  console.log('[inference.worker] Loading essentia.js-model.umd.js...');
  importScripts(PUBLIC_PATH + 'essentia-wasm/essentia.js-model.umd.js');
  console.log('[inference.worker] essentia.js-model.umd.js loaded');

  console.log('[inference.worker] Loading tf.min.js...');
  importScripts(PUBLIC_PATH + 'libs/tf.min.js');
  console.log('[inference.worker] tf.min.js loaded');

  console.log('[inference.worker] Checking EssentiaModel:', !!self.EssentiaModel);
  const { EssentiaTFInputExtractor, TensorflowMusiCNN } = self.EssentiaModel || {};
  console.log('[inference.worker] Extracted classes:', { EssentiaTFInputExtractor: !!EssentiaTFInputExtractor, TensorflowMusiCNN: !!TensorflowMusiCNN });

  console.log('[inference.worker] Checking EssentiaWASM:', typeof EssentiaWASM);
  console.log('[inference.worker] EssentiaWASM.ready:', !!EssentiaWASM?.ready);

  const MODEL_REGISTRY = {
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

  let extractor = null;
  let cachedFeatures = null;
  let currentModel = null;
  let initialized = false;
  let essentiaInstance = null;

  async function init() {
    if (initialized) return;

    console.log('[inference.worker] init() started');

    console.log('[inference.worker] Awaiting EssentiaWASM.ready...');
    essentiaInstance = await EssentiaWASM.ready;
    console.log('[inference.worker] EssentiaWASM initialized successfully');

    console.log('[inference.worker] Creating EssentiaTFInputExtractor...');
    extractor = new EssentiaTFInputExtractor(essentiaInstance, 'musicnn', false);
    console.log('[inference.worker] EssentiaTFInputExtractor created');

    console.log('[inference.worker] Awaiting tf.ready()...');
    await tf.ready();
    console.log('[inference.worker] TensorFlow.js ready');

    initialized = true;
    console.log('[inference.worker] init() completed');
  }

  function unloadModel() {
    if (currentModel) {
      try { currentModel = null; } catch {}
    }
    tf.disposeVariables();
  }

  self.onmessage = async function(e) {
    const msg = e.data;
    console.log('[inference.worker] Received message:', msg.type);

    try {
      await init();

      if (msg.type === 'EXTRACT') {
        console.log('[inference.worker] Starting feature extraction...');
        const audioSignal = new Float32Array(msg.audioData);
        console.log('[inference.worker] Audio data received, length:', audioSignal.length);
        cachedFeatures = extractor.computeFrameWise(audioSignal, 256);
        console.log('[inference.worker] Feature extraction completed');

        self.postMessage({
          type: 'ready',
          models: Object.keys(MODEL_REGISTRY),
        });

      } else if (msg.type === 'ANALYZE_ONE') {
        const modelName = msg.model;
        const modelPath = MODEL_REGISTRY[modelName];

        if (!modelPath) {
          self.postMessage({ type: 'result', model: modelName, data: { error: 'Unknown model', raw: null } });
          return;
        }

        if (!cachedFeatures) {
          self.postMessage({ type: 'result', model: modelName, data: { error: 'No features cached', raw: null } });
          return;
        }

        unloadModel();

        currentModel = new TensorflowMusiCNN(tf, modelPath, false);
        await currentModel.initialize();

        const predictions = await currentModel.predict(cachedFeatures, true);

        const numClasses = predictions[0]?.length || 0;
        const averaged = [];
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

        unloadModel();
      }
    } catch (err) {
      console.error('[inference.worker] Error:', err);
      self.postMessage({ type: 'error', message: err.message || String(err) });
    }
  };

  console.log('[inference.worker] Setup complete, waiting for messages...');

} catch (err) {
  console.error('[inference.worker] Top-level error:', err);
  self.postMessage({ type: 'error', message: 'Top-level error: ' + (err.message || String(err)) });
}