var baseUrl = self.location.pathname.indexOf('/Suno-Cover-Arranger/') === 0 ? '/Suno-Cover-Arranger/' : '/';

console.log('[chord-analysis.worker] Starting...');
console.log('[chord-analysis.worker] baseUrl:', baseUrl);

self.Module = {
  locateFile: function(path) {
    return baseUrl + 'essentia-wasm/' + path;
  }
};

self.module = { exports: {} };
self.exports = self.module.exports;

console.log('[chord-analysis.worker] Loading essentia-wasm.umd.js...');
importScripts(baseUrl + 'essentia-wasm/essentia-wasm.umd.js');
console.log('[chord-analysis.worker] essentia-wasm.umd.js loaded');

var EssentiaWASM = Module;
console.log('[chord-analysis.worker] EssentiaWASM available:', !!EssentiaWASM);

self.module = { exports: {} };
self.exports = self.module.exports;

console.log('[chord-analysis.worker] Loading essentia.js-core.umd.js...');
importScripts(baseUrl + 'essentia-wasm/essentia.js-core.umd.js');
console.log('[chord-analysis.worker] essentia.js-core.umd.js loaded');

var Essentia = self.module.exports;
console.log('[chord-analysis.worker] Essentia available:', !!Essentia);

var essentia = new Essentia(EssentiaWASM);
console.log('[chord-analysis.worker] essentia instance created');

var BEAT_GROUP = 2;

var NOTE_SEMITONES_MAP = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
var NOTE_LETTERS_ARR = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
var SHARP_TO_FLAT_MAP = {
  'C#':'Db','D#':'Eb','F#':'Gb','G#':'Ab','A#':'Bb',
};

function transposeSemitones(note, semitones) {
  if (!note) return 'C';
  var letter = note.charAt(0).toUpperCase();
  var acc = (note.match(/#/g)||[]).length - (note.match(/b/g)||[]).length;
  var basePc = NOTE_SEMITONES_MAP[letter] || 0;
  var targetPc = ((basePc + acc + semitones) % 12 + 12) % 12;
  var steps = Math.round(semitones * 7 / 12);
  var targetLetterIdx = (NOTE_LETTERS_ARR.indexOf(letter) + steps) % 7;
  var targetLetter = NOTE_LETTERS_ARR[targetLetterIdx >= 0 ? targetLetterIdx : targetLetterIdx+7];
  var naturalPc = NOTE_SEMITONES_MAP[targetLetter] || 0;
  var diff = ((targetPc - naturalPc) % 12 + 12) % 12;
  if (diff > 6) diff -= 12;
  var accStr = diff === 0 ? '' : diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff);
  return targetLetter + accStr;
}

var CHORD_NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

var CHORD_QUALITIES_DEF = [
  { suffix: '', intervals: [0, 4, 7], weights: [1.0, 0.8, 0.7], qualityType: 'major', level: 'basic' },
  { suffix: 'm', intervals: [0, 3, 7], weights: [1.0, 0.8, 0.7], qualityType: 'minor', level: 'basic' },
  { suffix: '7', intervals: [0, 4, 7, 10], weights: [1.0, 0.7, 0.6, 0.5], qualityType: 'dominant', level: 'extended' },
  { suffix: 'maj7', intervals: [0, 4, 7, 11], weights: [1.0, 0.7, 0.6, 0.5], qualityType: 'major', level: 'extended' },
  { suffix: 'm7', intervals: [0, 3, 7, 10], weights: [1.0, 0.7, 0.6, 0.5], qualityType: 'minor', level: 'extended' },
  { suffix: 'dim', intervals: [0, 3, 6], weights: [1.0, 0.8, 0.7], qualityType: 'diminished', level: 'rich' },
  { suffix: 'aug', intervals: [0, 4, 8], weights: [1.0, 0.8, 0.7], qualityType: 'augmented', level: 'rich' },
  { suffix: 'sus4', intervals: [0, 5, 7], weights: [1.0, 0.8, 0.7], qualityType: 'suspended', level: 'rich' },
  { suffix: 'sus2', intervals: [0, 2, 7], weights: [1.0, 0.8, 0.7], qualityType: 'suspended', level: 'rich' },
  { suffix: 'm7b5', intervals: [0, 3, 6, 10], weights: [1.0, 0.7, 0.6, 0.5], qualityType: 'diminished', level: 'rich' },
];

function generateTemplates(level) {
  var templates = [];
  var qualities = CHORD_QUALITIES_DEF.filter(function(q) {
    switch (level) {
      case 'basic': return q.level === 'basic';
      case 'extended': return q.level === 'basic' || q.level === 'extended';
      default: return true;
    }
  });
  for (var rootIdx = 0; rootIdx < 12; rootIdx++) {
    var rootName = CHORD_NOTES[rootIdx];
    for (var i = 0; i < qualities.length; i++) {
      var q = qualities[i];
      var intervals = q.intervals.map(function(int) { return (rootIdx + int) % 12; });
      var weight = new Array(12).fill(0);
      for (var j = 0; j < q.intervals.length; j++) {
        weight[intervals[j]] = Math.max(weight[intervals[j]], q.weights[j]);
      }
      templates.push({ name: rootName + q.suffix, intervals: intervals, weight: weight, qualityType: q.qualityType });
    }
  }
  templates.push({ name: 'N', intervals: [], weight: new Array(12).fill(0), qualityType: 'major' });
  return templates;
}

function cosineSimilarity(a, b) {
  var dot = 0, normA = 0, normB = 0;
  for (var i = 0; i < 12; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  var denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom < 1e-10) return 0;
  return dot / denom;
}

function matchFrame(chroma, templates) {
  var chromaNorm = Math.sqrt(chroma.reduce(function(s, v) { return s + v * v; }, 0));
  if (chromaNorm < 0.01) return { chord: 'N', confidence: 0 };
  var best = { chord: 'N', confidence: -1 };
  for (var i = 0; i < templates.length; i++) {
    var tpl = templates[i];
    if (tpl.name === 'N') continue;
    var similarity = cosineSimilarity(chroma, tpl.weight);
    if (similarity > best.confidence) {
      best = { chord: tpl.name, confidence: Math.min(1, Math.max(0, similarity)) };
    }
  }
  if (best.confidence < 0.05) return { chord: 'N', confidence: 0 };
  return best;
}

function matchAllFrames(chromaFrames, level) {
  var templates = generateTemplates(level || 'extended');
  return chromaFrames.map(function(frame) { return matchFrame(frame, templates); });
}

var ROMAN_NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
var ROMAN_SEMITONE_MAP = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11
};
var ROMAN_NOTE_ALIASES = {
  CB: 'B', 'B#': 'C', DB: 'C#', EB: 'D#', 'E#': 'F', FB: 'E',
  GB: 'F#', AB: 'G#', BB: 'A#', HB: 'B', H: 'B'
};

function normalizeNotePc(note) {
  if (!note) return null;
  var up = note.trim().toUpperCase();
  if (!up) return null;
  if (up in ROMAN_NOTE_ALIASES) return ROMAN_NOTE_ALIASES[up];
  if (ROMAN_NOTE_NAMES.indexOf(up) !== -1) return up;
  var letter = up[0];
  if (letter === 'H') return 'B';
  var NATURAL_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  if (!(letter in NATURAL_PC)) return null;
  var accidental = 0;
  var rest = up.substring(1);
  for (var i = 0; i < rest.length; i++) {
    var ch = rest[i];
    if (ch === '#') accidental++;
    else if (ch === 'B') accidental--;
    else if (ch === 'X') accidental += 2;
    else return null;
  }
  var pc = ((NATURAL_PC[letter] + accidental) % 12 + 12) % 12;
  return ROMAN_NOTE_NAMES[pc];
}

function normalizeSpelling(token) {
  if (!token) return token;
  var t = token.trim();
  if (!t) return t;
  return t[0].toUpperCase() + t.substring(1);
}

function parseChord(symbol) {
  if (!symbol) return null;
  var text = symbol.trim();
  var nc = text.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
  if (nc === 'NC' || nc === 'NOCHORD') {
    return { symbol: text, root: 'NC', quality: '' };
  }
  var body, bass;
  var slashIdx = text.indexOf('/');
  if (slashIdx > 0) {
    body = text.substring(0, slashIdx);
    var bassToken = text.substring(slashIdx + 1).trim();
    if (normalizeNotePc(bassToken) === null) return null;
    bass = normalizeSpelling(bassToken);
  } else {
    body = text;
    bass = undefined;
  }
  body = body.trim();
  if (!body) return null;
  var ptr = 1;
  while (ptr < body.length && (body[ptr] === '#' || body[ptr] === 'b' || body[ptr] === 'B' || body[ptr] === 'x' || body[ptr] === 'X')) {
    ptr++;
  }
  var rootToken = body.substring(0, ptr);
  if (normalizeNotePc(rootToken) === null) return null;
  var root = normalizeSpelling(rootToken);
  var quality = body.substring(ptr);
  return { symbol: text, root: root, quality: quality, bass: bass };
}

function semitoneDistance(note1, note2) {
  var p1 = ROMAN_SEMITONE_MAP[note1];
  var p2 = ROMAN_SEMITONE_MAP[note2];
  if (p1 === undefined || p2 === undefined) return null;
  return ((p2 - p1) % 12 + 12) % 12;
}

function spellDegreeNote(degree, key) {
  var degreeSemitones = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 };
  var deg = degree.toUpperCase().replace(/[b#]/g, '');
  var base = degreeSemitones[deg];
  if (base === undefined) return null;
  var acc = 0;
  for (var i = 0; i < degree.length; i++) {
    if (degree[i] === '#') acc++;
    else if (degree[i] === 'b') acc--;
  }
  var keyPc = ROMAN_SEMITONE_MAP[key];
  if (keyPc === undefined) return null;
  var targetPc = ((keyPc + base + acc) % 12 + 12) % 12;
  return ROMAN_NOTE_NAMES[targetPc];
}

function formatRoman(degree, quality) {
  var roman = degree;
  if (quality.includes('7')) {
    roman += '7';
  }
  if (quality.includes('maj7')) {
    roman = roman.replace('7', '') + 'maj7';
  }
  if (quality.includes('dim')) {
    roman += '°';
  }
  if (quality.includes('aug')) {
    roman += '+';
  }
  return roman;
}

function determineDegreeName(dist, key, chord) {
  var degrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  var degreeIdx = dist % 7;
  var baseDegree = degrees[degreeIdx];
  var alternates = [];
  return [baseDegree, alternates];
}

function analyzeSlashChord(chord, nextChord) {
  return { isHybrid: false, alter: null, bassPreference: null, rootOverride: null, kind: 'none' };
}

function Romanizer(key, preferSharps) {
  this.key = key;
  this.preferSharps = preferSharps;
}

Romanizer.prototype.determineDegreeName = function(dist, key, chord, prevChord, nextChord, preferSharps) {
  var degrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  var degreeIdx = dist % 7;
  var baseDegree = degrees[degreeIdx];
  var alternates = [];
  return [baseDegree, alternates];
};

Romanizer.prototype.formatRoman = function(baseDegree, chord) {
  var roman = baseDegree;
  var quality = chord.quality || '';
  if (quality.includes('7')) {
    roman += '7';
  }
  if (quality.includes('maj7')) {
    roman = roman.replace('7', '') + 'maj7';
  }
  if (quality.includes('dim')) {
    roman += '°';
  }
  if (quality.includes('aug')) {
    roman += '+';
  }
  return roman;
};

Romanizer.prototype.spellDegreeNote = function(baseDegree, key) {
  var degreeSemitones = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 };
  var deg = baseDegree.toUpperCase().replace(/[b#]/g, '');
  var base = degreeSemitones[deg];
  if (base === undefined) return null;
  var acc = 0;
  for (var i = 0; i < baseDegree.length; i++) {
    if (baseDegree[i] === '#') acc++;
    else if (baseDegree[i] === 'b') acc--;
  }
  var keyPc = ROMAN_SEMITONE_MAP[key];
  if (keyPc === undefined) return null;
  var targetPc = ((keyPc + base + acc) % 12 + 12) % 12;
  return ROMAN_NOTE_NAMES[targetPc];
};

Romanizer.prototype.analyzeSlashChord = function(chord, nextChord) {
  return { isHybrid: false, alter: null, bassPreference: null, rootOverride: null, kind: 'none' };
};

Romanizer.prototype.processChord = function(chord, key, prevChord, nextChord, hint) {
  if (chord.root === 'NC') {
    return { chord: chord, roman: '-', alternateLabels: [], degreeRoot: '-', isHybrid: false, isIiVStart: false, isResolutionTarget: false };
  }
  var dist = semitoneDistance(chord.root, key);
  if (dist === null) return null;
  var preferSharps = hint ? hint.preferSharps : null;
  var results = this.determineDegreeName(dist, key, chord, prevChord, nextChord, preferSharps);
  var baseDegree = results[0];
  var alternates = results[1];
  var primaryRoot = this.formatRoman(baseDegree, chord);
  var altRoots = alternates.map(function(a) { return this.formatRoman(a, chord); }.bind(this));
  var analysis = this.analyzeSlashChord(chord, nextChord);
  var rootFixed = this.spellDegreeNote(baseDegree, key);
  if (analysis.rootOverride) rootFixed = analysis.rootOverride;
  return {
    chord: chord,
    roman: primaryRoot,
    alternateLabels: altRoots,
    degreeRoot: rootFixed || '-',
    isHybrid: analysis.isHybrid,
    isIiVStart: false,
    isResolutionTarget: false,
    resolutionType: null
  };
};

Romanizer.prototype.annotateProgression = function(progression) {
  var results = [];
  for (var i = 0; i < progression.length; i++) {
    var chord = progression[i];
    var prevChord = i > 0 ? progression[i - 1] : undefined;
    var nextChord = i < progression.length - 1 ? progression[i + 1] : undefined;
    var result = this.processChord(chord, this.key, prevChord, nextChord);
    if (result) {
      results.push(result);
    } else {
      results.push({ chord: chord, roman: chord.root + chord.quality, alternateLabels: [], degreeRoot: chord.root, isHybrid: false, isIiVStart: false, isResolutionTarget: false });
    }
  }
  return results;
};

console.log('[chord-analysis.worker] All dependencies loaded');

self.onmessage = function(e) {
  var msg = e.data;
  if (msg.type !== 'analyze') return;

  try {
    var audioData = new Float32Array(msg.audioBuffer);
    var sr = msg.sampleRate;
    var signalVec = essentia.arrayToVector(audioData);

    self.postMessage({type:'log',msg:'Key...'});
    var keyResult = essentia.KeyExtractor(
      signalVec,
      true,    // averageDetuningCorrection
      4096,    // frameSize
      4096,    // hopSize
      12,      // hpcpSize
      3500,    // maxFrequency
      60,      // maximumSpectralPeaks
      80,      // minFrequency
      0.2,     // pcpThreshold
      'temperley', // profileType
      sr,      // sampleRate
      0.0001,  // spectralPeaksThreshold
      440,     // tuningFrequency
      'cosine', // weightType
      'hann',  // windowType
    );

    self.postMessage({type:'log',msg:'Beat...'});
    var beatResult = essentia.BeatTrackerMultiFeature(signalVec,208,40);
    var tickArr = essentia.vectorToArray(beatResult.ticks);
    var bpm = 120, bpmConfidence = 0.6;
    if (tickArr.length >= 2) {
      var iv = [];
      for (var i=1;i<tickArr.length;i++) {
        var d = tickArr[i]-tickArr[i-1];
        if (d >= 0.15 && d <= 2.0) iv.push(d);
      }
      if (iv.length >= 2) {
        iv.sort(function(a,b){return a-b;});
        bpm = Math.round(60 / iv[Math.floor(iv.length/2)]);
        bpmConfidence = Math.min(0.95, 0.5 + iv.length / (tickArr.length - 1));
      }
    }
    var beatList = tickArr.map(function(t,i){return {time:t,isDownbeat:i%4===0};});

    self.postMessage({type:'log',msg:'HPCP: '+keyResult.key+' '+keyResult.scale+' '+bpm+'BPM'});
    var frameSize=4096,hop=2048;
    var numFrames = Math.floor((audioData.length-frameSize)/hop)+1;
    var chromaFrames = [];
    var peakErr=0, skipCount=0;
    for (var i=0;i<numFrames;i++) {
      if (i%2000===0) self.postMessage({type:'log',msg:'Frame '+i+'/'+numFrames+'...'});
      var fv = essentia.arrayToVector(audioData.slice(i*hop,i*hop+frameSize));
      try {
        var w=essentia.Windowing(fv,true,frameSize,'hann',0,true);
        var sp=essentia.Spectrum(w.frame,frameSize);
        var p=essentia.SpectralPeaks(sp.spectrum,0,5000,100,80,'frequency',sr);
        if ((p.frequencies.size ? p.frequencies.size() : 0) < 1) {
          chromaFrames.push(new Float32Array(12));
          skipCount++;
          continue;
        }
        var h=essentia.HPCP(
          p.frequencies, p.magnitudes,
          true, 500, 0, 5000, false, 80, true, 'unitMax', 440, sr, 12, 'cosine', 1.0
        );
        chromaFrames.push(essentia.vectorToArray(h.hpcp));
      } catch(e) {
        chromaFrames.push(new Float32Array(12));
        peakErr++;
      }
    }

    self.postMessage({type:'log',msg:'HPCP done: '+chromaFrames.length+' fr, err='+peakErr+', skip='+skipCount});
    var chordSegments=[];
    var beatChords=[];
    if (chromaFrames.length>0) {
      var matched = matchAllFrames(chromaFrames);
      var fd = hop/sr;
      var fc=[];
      for(var i=0;i<matched.length;i++){
        var s=Math.max(0,i-2),e=Math.min(matched.length,i+3);
        var cnt={};
        for(var j=s;j<e;j++){var c=matched[j].chord;cnt[c]=(cnt[c]||0)+matched[j].confidence;}
        fc.push(Object.entries(cnt).sort(function(a,b){return b[1]-a[1];})[0]?.[0]||'N');
      }
      var bc=[], bt=[];
      for(var bi=0;bi+BEAT_GROUP<=tickArr.length;bi+=BEAT_GROUP){
        var ts=tickArr[bi], te=tickArr[Math.min(bi+BEAT_GROUP,tickArr.length-1)];
        if(te-ts<0.3) continue;
        var f0=Math.max(0,Math.floor(ts/fd)), f1=Math.min(fc.length,Math.ceil(te/fd));
        var cnt={};
        for(var fi=f0;fi<f1;fi++){var c=fc[fi]||'N';cnt[c]=(cnt[c]||0)+1;}
        var best=Object.entries(cnt).sort(function(a,b){return b[1]-a[1];})[0];
        if(best&&best[0]!=='N'){bc.push(best[0]);bt.push({s:ts,e:te});}
      }
      var romanizerKey = keyResult.scale === 'minor'
        ? transposeSemitones(keyResult.key, 3)
        : keyResult.key;
      var rom=new Romanizer(romanizerKey,false);
      if(bc.length>0){
        var rs=[];
        var seg={c:bc[0],s:bt[0].s,e:bt[0].e};
        for(var i=1;i<bc.length;i++){if(bc[i]===seg.c)seg.e=bt[i].e;else{rs.push(seg);seg={c:bc[i],s:bt[i].s,e:bt[i].e};}}
        rs.push(seg);
        var parsed=rs.map(function(s){return parseChord(s.c);}).filter(Boolean);
        var ann=rom.annotateProgression(parsed);
        chordSegments=rs.map(function(s,i){return {startTime:s.s,endTime:s.e,chord:s.c,degree:ann[i]?.roman||s.c,confidence:0.7};});
      }

      beatChords=[];
      var beatChordLabels=[];
      if (tickArr.length>0) {
        for (var i=0;i<tickArr.length;i++) {
          var f0=Math.floor(tickArr[i]/fd);
          var f1=i+1<tickArr.length?Math.floor(tickArr[i+1]/fd):fc.length;
          var cnt={};
          for (var fi=f0;fi<f1;fi++){var c=fc[fi]||'N';cnt[c]=(cnt[c]||0)+1;}
          var best=Object.entries(cnt).sort(function(a,b){return b[1]-a[1];})[0];
          var chord=best&&best[0]!=='N'?best[0]:'';
          beatChords.push({time:tickArr[i],chord:chord,degree:''});
          if (i===0||chord!==beatChords[i-1].chord||!chord) {
            beatChordLabels.push(chord||'N');
          }
        }
        if (beatChordLabels.length>0) {
          var parsed=beatChordLabels.map(function(c){return parseChord(c);}).filter(Boolean);
          var annRom=rom.annotateProgression(parsed);
          var annIdx=0,lastChord='';
          for (var i=0;i<beatChords.length;i++) {
            var cur=beatChords[i].chord;
            if (!cur) {beatChords[i].degree='';continue;}
            if (cur!==lastChord&&annIdx<annRom.length) {
              lastChord=cur;beatChords[i].degree=annRom[annIdx]?.roman||cur;annIdx++;
            } else if (cur===lastChord) {
              beatChords[i].degree=annRom[Math.max(0,annIdx-1)]?.roman||cur;
            } else {beatChords[i].degree=cur;}
          }
        }
      }
    }

    self.postMessage({type:'log',msg:'Done: '+chordSegments.length+' chords, '+beatChords.length+' beats'});
    self.postMessage({type:'result',features:{
      key:keyResult.key||'C',scale:keyResult.scale||'major',
      keyStrength:keyResult.strength||0,bpm:bpm,bpmConfidence:bpmConfidence,ticks:tickArr,
      beatList:beatList,chordSegments:chordSegments,beatChords:beatChords,hopSize:hop,
    }});
  } catch(err) {
    console.error('[chord-analysis.worker] Error:', err);
    self.postMessage({type:'error',error:err.message||String(err)});
  }
};

console.log('[chord-analysis.worker] Setup complete, waiting for messages...');