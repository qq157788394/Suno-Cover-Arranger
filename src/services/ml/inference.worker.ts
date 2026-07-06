const PUBLIC_PATH = '/Suno-Cover-Arranger/';

self.Module = {
  locateFile: (path) => PUBLIC_PATH + 'essentia-wasm/' + path,
};

importScripts(PUBLIC_PATH + 'essentia-wasm/essentia-wasm.web.js');
importScripts(PUBLIC_PATH + 'essentia-wasm/essentia.js-model.umd.js');
importScripts(PUBLIC_PATH + 'libs/tf.min.js');

const { EssentiaTFInputExtractor, TensorflowMusiCNN } = self.EssentiaModel || {};

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

async function init() {
  if (initialized) return;
  
  extractor = new EssentiaTFInputExtractor(EssentiaWASM, 'musicnn', false);
  
  await tf.ready();
  
  initialized = true;
}

function unloadModel() {
  if (currentModel) {
    try { currentModel = null; } catch {}
  }
  tf.disposeVariables();
}

self.onmessage = async function(e) {
  const msg = e.data;

  try {
    await init();

    if (msg.type === 'EXTRACT') {
      const audioSignal = new Float32Array(msg.audioData);
      cachedFeatures = extractor.computeFrameWise(audioSignal, 256);
      
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
    self.postMessage({ type: 'error', message: err.message || String(err) });
  }
};
