var baseUrl = self.location.pathname.indexOf('/Suno-Cover-Arranger/') === 0 ? '/Suno-Cover-Arranger/' : '/';

console.log('[inference.worker] Starting...');
console.log('[inference.worker] baseUrl:', baseUrl);

self.Module = {
  locateFile: function(path) {
    return baseUrl + 'essentia-wasm/' + path;
  }
};

console.log('[inference.worker] Loading essentia-wasm.umd.js...');
importScripts(baseUrl + 'essentia-wasm/essentia-wasm.umd.js');
console.log('[inference.worker] essentia-wasm.umd.js loaded');

var EssentiaWASM = Module;
console.log('[inference.worker] EssentiaWASM available:', !!EssentiaWASM);

console.log('[inference.worker] Loading essentia.js-model.umd.js...');
importScripts(baseUrl + 'essentia-wasm/essentia.js-model.umd.js');
console.log('[inference.worker] essentia.js-model.umd.js loaded');

console.log('[inference.worker] Loading tf.min.js...');
importScripts(baseUrl + 'libs/tf.min.js');
console.log('[inference.worker] tf.min.js loaded');

var extractor = null;
var cachedFeatures = null;
var currentModel = null;
var initialized = false;

var MODEL_REGISTRY = {
  genre:              baseUrl + 'models/musicnn/model.json',
  genre_tzanetakis:   baseUrl + 'models/genre_tzanetakis-musicnn-msd-2/model.json',
  genre_electronic:   baseUrl + 'models/genre_electronic-musicnn-msd-2/model.json',
  urbansound8k:       baseUrl + 'models/urbansound8k-musicnn-msd-1-tfjs/model.json',
  mood_happy:         baseUrl + 'models/mood_happy-musicnn-msd-2/model.json',
  mood_sad:           baseUrl + 'models/mood_sad-musicnn-msd-2/model.json',
  mood_relaxed:       baseUrl + 'models/mood_relaxed-musicnn-msd-2/model.json',
  mood_aggressive:    baseUrl + 'models/mood_aggressive-musicnn-msd-2/model.json',
  mood_acoustic:      baseUrl + 'models/mood_acoustic-musicnn-msd-2/model.json',
  mood_electronic:    baseUrl + 'models/mood_electronic-musicnn-msd-2/model.json',
  mood_party:         baseUrl + 'models/mood_party-musicnn-msd-2/model.json',
  danceability:       baseUrl + 'models/danceability-musicnn-msd-2/model.json'
};

function init() {
  if (initialized) return;

  console.log('[inference.worker] init() started');

  console.log('[inference.worker] Creating EssentiaTFInputExtractor...');
  extractor = new EssentiaModel.EssentiaTFInputExtractor(EssentiaWASM, 'musicnn', false);
  console.log('[inference.worker] EssentiaTFInputExtractor created');

  console.log('[inference.worker] Awaiting tf.ready()...');
  tf.ready().then(function() {
    console.log('[inference.worker] TensorFlow.js ready');
    initialized = true;
    console.log('[inference.worker] init() completed');
  });
}

function unloadModel() {
  if (currentModel) {
    try { currentModel = null; } catch(e) {}
  }
  tf.disposeVariables();
}

self.onmessage = function(e) {
  var msg = e.data;
  console.log('[inference.worker] Received message:', msg.type);

  init();

  setTimeout(function() {
    if (!initialized) {
      self.postMessage({ type: 'error', message: 'Initialization not complete' });
      return;
    }

    if (msg.type === 'EXTRACT') {
      console.log('[inference.worker] Starting feature extraction...');
      var audioSignal = new Float32Array(msg.audioData);
      console.log('[inference.worker] Audio data received, length:', audioSignal.length);
      cachedFeatures = extractor.computeFrameWise(audioSignal, 256);
      console.log('[inference.worker] Feature extraction completed');

      self.postMessage({
        type: 'ready',
        models: Object.keys(MODEL_REGISTRY)
      });

    } else if (msg.type === 'ANALYZE_ONE') {
      var modelName = msg.model;
      var modelPath = MODEL_REGISTRY[modelName];

      if (!modelPath) {
        self.postMessage({ type: 'result', model: modelName, data: { error: 'Unknown model', raw: null } });
        return;
      }

      if (!cachedFeatures) {
        self.postMessage({ type: 'result', model: modelName, data: { error: 'No features cached', raw: null } });
        return;
      }

      unloadModel();

      currentModel = new EssentiaModel.TensorflowMusiCNN(tf, modelPath, false);
      currentModel.initialize().then(function() {
        return currentModel.predict(cachedFeatures, true);
      }).then(function(predictions) {
        var numClasses = predictions[0] ? predictions[0].length : 0;
        var averaged = [];
        for (var ci = 0; ci < numClasses; ci++) {
          var sum = 0;
          for (var ti = 0; ti < predictions.length; ti++) {
            sum += predictions[ti][ci];
          }
          averaged.push(sum / predictions.length);
        }

        self.postMessage({
          type: 'result',
          model: modelName,
          data: { raw: averaged }
        });

        unloadModel();
      }).catch(function(err) {
        console.error('[inference.worker] Inference error:', err);
        self.postMessage({ type: 'error', message: err.message || String(err) });
      });
    }
  }, 50);
};

console.log('[inference.worker] Setup complete, waiting for messages...');