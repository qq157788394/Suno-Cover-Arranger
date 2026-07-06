((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/chord-analysis/index.tsx'],
{ "src/hooks/useChordAnalysis.ts": function (module, exports, __mako_require__){
/**
 * useChordAnalysis — 和弦分析状态管理 Hook
 *
 * 管理分析全生命周期状态：
 * - 文件选择 → Worker 分析 → 缓存检查 → 状态转移
 * - 播放控制（播放/暂停/停止/跳转）
 * - 当前和弦跟随
 * - 错误处理 + 重试
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
__mako_require__.e(exports, {
    default: function() {
        return _default;
    },
    useChordAnalysis: function() {
        return useChordAnalysis;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const NOTE_SEMITONES_MAP = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
};
const NOTE_LETTERS_ARR = [
    'C',
    'D',
    'E',
    'F',
    'G',
    'A',
    'B'
];
function transposeSemitones(note, semitones) {
    if (!note) return 'C';
    const letter = note.charAt(0).toUpperCase();
    const acc = (note.match(/#/g) || []).length - (note.match(/b/g) || []).length;
    const basePc = NOTE_SEMITONES_MAP[letter] ?? 0;
    const targetPc = ((basePc + acc + semitones) % 12 + 12) % 12;
    const steps = Math.round(semitones * 7 / 12);
    const idx = (NOTE_LETTERS_ARR.indexOf(letter) + steps) % 7;
    const targetLetter = NOTE_LETTERS_ARR[idx >= 0 ? idx : idx + 7];
    const naturalPc = NOTE_SEMITONES_MAP[targetLetter] ?? 0;
    let diff = ((targetPc - naturalPc) % 12 + 12) % 12;
    if (diff > 6) diff -= 12;
    return targetLetter + (diff === 0 ? '' : diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff));
}
function useChordAnalysis() {
    _s();
    const [analysisStatus, setAnalysisStatus] = (0, _react.useState)('IDLE');
    const [playbackState, setPlaybackState] = (0, _react.useState)('STOPPED');
    const [currentTime, setCurrentTime] = (0, _react.useState)(0);
    const [currentChord, setCurrentChord] = (0, _react.useState)(null);
    const [songAnalysis, setSongAnalysis] = (0, _react.useState)(null);
    const [error, setError] = (0, _react.useState)(null);
    const [retryable, setRetryable] = (0, _react.useState)(false);
    const [currentStep, setCurrentStep] = (0, _react.useState)();
    const [progressPercent, setProgressPercent] = (0, _react.useState)(0);
    const [fileName, setFileName] = (0, _react.useState)(null);
    const [audioUrl, setAudioUrl] = (0, _react.useState)(null);
    const [peaks, setPeaks] = (0, _react.useState)(new Float32Array(0));
    const audioRef = (0, _react.useRef)(null);
    const workerRef = (0, _react.useRef)(null);
    const lastFileRef = (0, _react.useRef)(null);
    const timeoutRef = (0, _react.useRef)(null);
    const isLoading = analysisStatus === 'FILE_LOADING' || analysisStatus === 'WASM_LOADING' || analysisStatus === 'DECODING' || analysisStatus === 'ANALYZING';
    const terminateWorker = (0, _react.useCallback)(()=>{
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }, []);
    const clearTimeout_ = (0, _react.useCallback)(()=>{
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);
    const cleanupAudio = (0, _react.useCallback)(()=>{
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setCurrentTime(0);
        setCurrentChord(null);
        setPlaybackState('STOPPED');
    }, [
        audioUrl
    ]);
    const extractPeaks = (0, _react.useCallback)(async (file)=>{
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new AudioContext();
        try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const channelData = audioBuffer.getChannelData(0);
            const targetLength = 2000;
            const step = Math.floor(channelData.length / targetLength);
            const peaks = new Float32Array(targetLength);
            for(let i = 0; i < targetLength; i++){
                let max = 0;
                const start = i * step;
                const end = Math.min(start + step, channelData.length);
                for(let j = start; j < end; j++){
                    const abs = Math.abs(channelData[j]);
                    if (abs > max) max = abs;
                }
                peaks[i] = max;
            }
            const maxPeak = Math.max(...peaks, 0.01);
            for(let i = 0; i < peaks.length; i++)peaks[i] = peaks[i] / maxPeak;
            return {
                peaks,
                audioBuffer
            };
        } finally{
            await audioContext.close();
        }
    }, []);
    const startAnalysis = (0, _react.useCallback)(async (file)=>{
        setFileName(file.name);
        setAnalysisStatus('FILE_LOADING');
        setError(null);
        setProgressPercent(0);
        setCurrentStep(undefined);
        try {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            setAudioUrl(URL.createObjectURL(file));
            setAnalysisStatus('DECODING');
            const { peaks: extractedPeaks, audioBuffer } = await extractPeaks(file);
            setPeaks(extractedPeaks);
            setAnalysisStatus('WASM_LOADING');
            const features = await new Promise((resolve, reject)=>{
                const baseUrl = window.location.pathname.startsWith('/Suno-Cover-Arranger') ? '/Suno-Cover-Arranger/' : '/';
                const workerUrl = baseUrl + 'chord-analysis.worker.js';
                const w = new Worker(workerUrl);
                workerRef.current = w;
                const timeout = setTimeout(()=>{
                    w.terminate();
                    workerRef.current = null;
                    reject(new Error('分析超时'));
                }, 90000);
                w.onmessage = (e)=>{
                    if (e.data.type === 'error') {
                        clearTimeout(timeout);
                        w.terminate();
                        workerRef.current = null;
                        reject(new Error(e.data.error));
                    } else if (e.data.type === 'result') {
                        clearTimeout(timeout);
                        w.terminate();
                        workerRef.current = null;
                        resolve(e.data.features);
                    } else if (e.data.type === 'log') console.log('[Worker]', e.data.msg);
                };
                w.onerror = (err)=>{
                    clearTimeout(timeout);
                    w.terminate();
                    reject(new Error(`Worker error: ${err.message || `${err.filename}:${err.lineno} ${err.error}`}`));
                };
                const copy = audioBuffer.getChannelData(0).buffer.slice(0);
                w.postMessage({
                    type: 'analyze',
                    audioBuffer: copy,
                    sampleRate: audioBuffer.sampleRate
                }, [
                    copy
                ]);
            });
            setAnalysisStatus('ANALYZING');
            setCurrentStep('done');
            setProgressPercent(100);
            const chordSegs = features.chordSegments && features.chordSegments.length > 0 ? features.chordSegments : [
                {
                    startTime: 0,
                    endTime: audioBuffer.duration,
                    chord: `${features.key}${features.scale === 'minor' ? 'm' : ''}`,
                    degree: features.scale === 'minor' ? 'Im' : 'I',
                    confidence: features.keyStrength || 0.5
                }
            ];
            const result = {
                fileHash: file.name + Date.now(),
                fileName: file.name,
                fileSize: file.size,
                duration: audioBuffer.duration,
                sampleRate: audioBuffer.sampleRate,
                key: features.scale === 'minor' ? `${features.key} Minor / ${transposeSemitones(features.key, 3)} Major` : `${features.key} ${features.scale.charAt(0).toUpperCase()}${features.scale.slice(1)}`,
                keyConfidence: features.keyStrength,
                bpm: features.bpm,
                bpmConfidence: features.bpmConfidence || 0.6,
                chordSegments: chordSegs,
                beatChords: features.beatChords || [],
                beatList: features.beatList || [],
                vocabularyLevel: 'extended',
                analyzedAt: Date.now(),
                analysisDurationMs: 0
            };
            setSongAnalysis(result);
            setAnalysisStatus('READY');
            setCurrentChord(chordSegs[0]);
            _antd.message.success(`分析完成: ${result.key}, ${features.bpm} BPM`);
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : '未知错误';
            setAnalysisStatus('ERROR');
            setError(`分析失败：${errMsg}`);
            setRetryable(true);
        }
    }, [
        audioUrl,
        extractPeaks
    ]);
    const handleFileSelect = (0, _react.useCallback)((file)=>{
        lastFileRef.current = file;
        startAnalysis(file);
    }, [
        startAnalysis
    ]);
    const handlePlay = (0, _react.useCallback)(()=>{
        if (audioRef.current) {
            audioRef.current.play();
            setPlaybackState('PLAYING');
        }
    }, []);
    const handlePause = (0, _react.useCallback)(()=>{
        if (audioRef.current) {
            audioRef.current.pause();
            setPlaybackState('PAUSED');
        }
    }, []);
    const handleStop = (0, _react.useCallback)(()=>{
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setPlaybackState('STOPPED');
            setCurrentTime(0);
            setCurrentChord(songAnalysis && songAnalysis.chordSegments.length > 0 ? songAnalysis.chordSegments[0] : null);
        }
    }, [
        songAnalysis
    ]);
    const handleSeek = (0, _react.useCallback)((time)=>{
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);
    const handleRetry = (0, _react.useCallback)(()=>{
        cleanupAudio();
        setError(null);
        setRetryable(false);
        setAnalysisStatus('IDLE');
        setSongAnalysis(null);
        setCurrentChord(null);
        if (lastFileRef.current) startAnalysis(lastFileRef.current);
    }, [
        cleanupAudio,
        startAnalysis
    ]);
    (0, _react.useEffect)(()=>{
        const audio = audioRef.current;
        if (!audio) return;
        const onTimeUpdate = ()=>{
            const t = audio.currentTime;
            setCurrentTime(t);
            if (songAnalysis) {
                const seg = songAnalysis.chordSegments.find((seg)=>t >= seg.startTime && t < seg.endTime);
                setCurrentChord(seg || null);
            }
        };
        const onEnded = ()=>{
            setPlaybackState('STOPPED');
            setCurrentTime(0);
            setCurrentChord(songAnalysis && songAnalysis.chordSegments.length > 0 ? songAnalysis.chordSegments[0] : null);
        };
        const onPause = ()=>{
            if (!audio.ended) setPlaybackState('PAUSED');
        };
        const onPlay = ()=>{
            setPlaybackState('PLAYING');
        };
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('play', onPlay);
        return ()=>{
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('play', onPlay);
        };
    }, [
        songAnalysis
    ]);
    (0, _react.useEffect)(()=>{
        return ()=>{
            terminateWorker();
            clearTimeout_();
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [
        terminateWorker,
        clearTimeout_,
        audioUrl
    ]);
    return {
        analysisStatus,
        playbackState,
        currentTime,
        currentChord,
        songAnalysis,
        error,
        retryable,
        currentStep,
        progressPercent,
        fileName,
        isLoading,
        handleFileSelect,
        handlePlay,
        handlePause,
        handleStop,
        handleSeek,
        setCurrentTime,
        handleRetry,
        audioRef,
        audioUrl,
        peaks
    };
}
_s(useChordAnalysis, "DduKoY6tO08V10w6AXe0HQgA9vM=");
var _default = useChordAnalysis;
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/chord-analysis/components/AnalysisProgress.tsx": function (module, exports, __mako_require__){
/**
 * AnalysisProgress — 分析进度展示组件
 * 根据分析状态显示不同的进度提示
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const { Text } = _antd.Typography;
/** 步骤名称映射 */ const STEP_LABELS = {
    hpcp: '提取音频特征…',
    key_bpm: '检测调性与速度…',
    chord_match: '匹配和弦模板…',
    viterbi: '优化和弦序列…',
    romanize: '映射功能级数…',
    done: '分析完成'
};
/** 步骤百分比映射 */ const STEP_PERCENT = {
    hpcp: 20,
    key_bpm: 40,
    chord_match: 60,
    viterbi: 80,
    romanize: 95,
    done: 100
};
const AnalysisProgress = ({ status, currentStep, percent: customPercent, fileName })=>{
    if (status === 'IDLE' || status === 'READY' || status === 'ERROR') return null;
    let label;
    let percent;
    switch(status){
        case 'FILE_LOADING':
            label = '正在读取文件…';
            percent = 5;
            break;
        case 'WASM_LOADING':
            label = '加载音频分析引擎…';
            percent = 10;
            break;
        case 'DECODING':
            label = '解码音频文件…';
            percent = 15;
            break;
        case 'ANALYZING':
            if (currentStep && STEP_LABELS[currentStep]) {
                label = STEP_LABELS[currentStep];
                percent = customPercent ?? STEP_PERCENT[currentStep];
            } else {
                label = '正在分析…';
                percent = customPercent ?? 50;
            }
            break;
        default:
            label = '处理中…';
            percent = 0;
    }
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        style: {
            padding: '16px 0'
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Progress, {
                percent: percent,
                status: "active",
                strokeColor: "#ff9000",
                style: {
                    marginBottom: 8
                }
            }, void 0, false, {
                fileName: "src/pages/chord-analysis/components/AnalysisProgress.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                type: "secondary",
                style: {
                    fontSize: 13
                },
                children: [
                    label,
                    fileName ? `（${fileName}）` : ''
                ]
            }, void 0, true, {
                fileName: "src/pages/chord-analysis/components/AnalysisProgress.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/chord-analysis/components/AnalysisProgress.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
};
_c = AnalysisProgress;
var _default = AnalysisProgress;
var _c;
$RefreshReg$(_c, "AnalysisProgress");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/chord-analysis/components/ChordGrid.tsx": function (module, exports, __mako_require__){
/**
 * ChordGrid — 拍级和弦网格
 *
 * 每行 16 拍（4 小节 × 4 拍），每拍一个方格。
 * - 小节间距 16px，拍间距 4px
 * - 小节第一拍（downbeat）必显示和弦文字
 * - 后续拍若与前拍同和弦则只显示方格占位
 * - 和弦变更点也会显示文字
 * - 当前播放拍高亮
 * - displayMode='chord'|'degree' 控制展示内容
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const { Text } = _antd.Typography;
const BEATS_PER_ROW = 16;
const BEATS_PER_MEASURE = 4;
// 方格的尺寸
const CELL_SIZE = 64;
// 拍间距
const BEAT_GAP = 4;
// 小节间距（前端的 space）
const MEASURE_GAP = 16;
/** 单格样式 */ function cellStyle(cell) {
    const base = {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'default',
        transition: 'background 0.2s, box-shadow 0.2s'
    };
    if (!cell.chord) return {
        ...base,
        background: '#F9F9FB',
        border: '1px dashed #E5E7EB'
    };
    if (cell.isCurrent) return {
        ...base,
        background: '#374151',
        color: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(55,65,81,0.35)'
    };
    if (cell.isPast) return {
        ...base,
        background: '#F3F4F6',
        opacity: 0.45
    };
    return {
        ...base,
        background: '#FFFFFF',
        border: '1px solid #D1D5DB'
    };
}
const ChordGrid = ({ beatChords, bpm, currentTime, displayMode })=>{
    _s();
    const cells = (0, _react.useMemo)(()=>{
        const beatInterval = 60 / bpm;
        return beatChords.map((bc, i)=>{
            const beatTime = i * beatInterval;
            const isDownbeat = i % BEATS_PER_MEASURE === 0;
            const isChordChange = !!(!isDownbeat && i > 0 && bc.chord && bc.chord !== beatChords[i - 1].chord);
            return {
                beatIndex: i,
                chord: bc.chord,
                degree: bc.degree,
                isCurrent: currentTime >= beatTime && currentTime < beatTime + beatInterval,
                isPast: beatTime + beatInterval <= currentTime,
                isDownbeat,
                isChordChange
            };
        });
    }, [
        beatChords,
        bpm,
        currentTime
    ]);
    // 按行分组
    const rows = (0, _react.useMemo)(()=>{
        const result = [];
        for(let i = 0; i < cells.length; i += BEATS_PER_ROW)result.push(cells.slice(i, i + BEATS_PER_ROW));
        return result;
    }, [
        cells
    ]);
    if (beatChords.length === 0) return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        style: {
            textAlign: 'center',
            padding: '32px 0'
        },
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
            type: "secondary",
            children: "暂无可显示的和弦数据"
        }, void 0, false, {
            fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
            lineNumber: 138,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
        lineNumber: 132,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 16
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    display: 'flex',
                    paddingLeft: 0
                },
                children: [
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                        style: {
                            width: 64,
                            flexShrink: 0
                        }
                    }, void 0, false, {
                        fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    [
                        'section-0',
                        'section-1',
                        'section-2',
                        'section-3'
                    ].map((key, m)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                width: BEATS_PER_MEASURE * (CELL_SIZE + BEAT_GAP) - BEAT_GAP,
                                textAlign: 'center',
                                marginLeft: m > 0 ? MEASURE_GAP : 0
                            },
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                type: "secondary",
                                children: [
                                    "第",
                                    m + 1,
                                    "小节"
                                ]
                            }, void 0, true, {
                                fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                                lineNumber: 158,
                                columnNumber: 15
                            }, this)
                        }, key, false, {
                            fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            rows.map((row, rowIndex)=>{
                var _row_;
                return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center'
                    },
                    children: [
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                width: 64,
                                height: CELL_SIZE,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                paddingRight: 8,
                                flexShrink: 0
                            },
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                type: "secondary",
                                children: rowIndex + 1
                            }, void 0, false, {
                                fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        row.map((cell, colIndex)=>{
                            const isShowText = cell.isDownbeat || cell.isChordChange;
                            const textColor = cell.isCurrent ? '#FFFFFF' : '#1F2937';
                            // 小节间距
                            const marginLeft = colIndex > 0 && colIndex % BEATS_PER_MEASURE === 0 ? MEASURE_GAP : colIndex === 0 ? 0 : BEAT_GAP;
                            return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                                style: {
                                    ...cellStyle(cell),
                                    marginLeft,
                                    flexShrink: 0
                                },
                                title: `${cell.chord || '—'} ${cell.degree || ''} (${displayMode})`,
                                children: [
                                    cell.chord && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("span", {
                                        style: {
                                            fontSize: 12,
                                            fontWeight: cell.isCurrent ? 700 : 600,
                                            color: textColor,
                                            maxWidth: CELL_SIZE - 8,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'center'
                                        },
                                        children: isShowText ? displayMode === 'degree' && cell.degree ? cell.degree : cell.chord : ''
                                    }, void 0, false, {
                                        fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                                        lineNumber: 209,
                                        columnNumber: 19
                                    }, this),
                                    !cell.chord && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("span", {
                                        style: {
                                            fontSize: 10,
                                            color: '#D1D5DB'
                                        },
                                        children: "—"
                                    }, void 0, false, {
                                        fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                                        lineNumber: 229,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, cell.beatIndex, true, {
                                fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                                lineNumber: 199,
                                columnNumber: 15
                            }, this);
                        })
                    ]
                }, ((_row_ = row[0]) === null || _row_ === void 0 ? void 0 : _row_.beatIndex) ?? rowIndex, true, {
                    fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this);
            }),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#9CA3AF',
                    paddingTop: 4
                },
                children: [
                    "每行 4 小节，每小节 4 拍 · 跟随播放实时高亮当前拍 ·",
                    ' ',
                    displayMode === 'degree' ? '展示功能级数' : '展示和弦名称'
                ]
            }, void 0, true, {
                fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/chord-analysis/components/ChordGrid.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
};
_s(ChordGrid, "5jIXY6el0yH1f2zKnq+HBeK2fzU=");
_c = ChordGrid;
var _default = ChordGrid;
var _c;
$RefreshReg$(_c, "ChordGrid");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/chord-analysis/components/FileDropZone.tsx": function (module, exports, __mako_require__){
/**
 * FileDropZone — 文件拖拽上传组件
 * 使用 Upload.Dragger 封装，支持拖拽/点击上传音频文件
 * 校验文件格式 + 大小，通过 onChange 回调触发分析流程
 *
 * 视觉风格：大卡片上传区域，橙色图标，符合 Bento Attio Flat Modern 设计
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.3.2_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@ant-design/icons/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const { Dragger } = _antd.Upload;
const { Text } = _antd.Typography;
/** 支持的音频格式 */ const SUPPORTED_AUDIO_MIME_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/flac',
    'audio/ogg',
    'audio/aac',
    'audio/x-m4a',
    'audio/mp4'
];
const SUPPORTED_EXTENSIONS = [
    '.mp3',
    '.wav',
    '.flac',
    '.ogg',
    '.aac',
    '.m4a'
];
/** 文件大小上限：50MB */ const MAX_FILE_SIZE = 52428800;
const FileDropZone = ({ disabled, onFileSelect })=>{
    _s();
    const beforeUpload = (0, _react.useCallback)((file)=>{
        var _file_name_split_pop;
        // 文件大小校验
        if (file.size > MAX_FILE_SIZE) {
            const sizeMB = (file.size / 1048576).toFixed(0);
            _antd.message.error(`文件过大（${sizeMB}MB），请选择 50MB 以内的文件`);
            return _antd.Upload.LIST_IGNORE;
        }
        // 文件格式校验
        const ext = `.${(_file_name_split_pop = file.name.split('.').pop()) === null || _file_name_split_pop === void 0 ? void 0 : _file_name_split_pop.toLowerCase()}`;
        const isSupportedExt = SUPPORTED_EXTENSIONS.includes(ext);
        const isSupportedMime = SUPPORTED_AUDIO_MIME_TYPES.includes(file.type);
        if (!isSupportedExt && !isSupportedMime) {
            _antd.message.error('不支持的文件格式。支持：MP3、WAV、FLAC、OGG、AAC');
            return _antd.Upload.LIST_IGNORE;
        }
        // 校验通过，触发回调
        onFileSelect(file);
        return false; // 阻止自动上传
    }, [
        onFileSelect
    ]);
    const handleChange = (0, _react.useCallback)((info)=>{
        const { status } = info.file;
        if (status === 'error') _antd.message.error('文件读取失败，请重试');
    }, []);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Dragger, {
        name: "audio",
        multiple: false,
        maxCount: 1,
        accept: "audio/*",
        disabled: disabled,
        beforeUpload: beforeUpload,
        onChange: handleChange,
        showUploadList: false,
        style: {
            padding: '56px 24px',
            borderRadius: 12,
            border: '2px dashed #E5E7EB',
            background: '#FAFBFC',
            transition: 'all 0.2s ease'
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    marginBottom: 16
                },
                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.SoundOutlined, {
                    style: {
                        fontSize: 48,
                        color: '#FF9000'
                    }
                }, void 0, false, {
                    fileName: "src/pages/chord-analysis/components/FileDropZone.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "src/pages/chord-analysis/components/FileDropZone.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                strong: true,
                style: {
                    fontSize: 16,
                    color: '#0F1419',
                    display: 'block',
                    marginBottom: 8
                },
                children: "点击或拖拽音频文件到此处"
            }, void 0, false, {
                fileName: "src/pages/chord-analysis/components/FileDropZone.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                type: "secondary",
                style: {
                    fontSize: 13,
                    color: '#9CA3AF',
                    display: 'block',
                    lineHeight: '20px'
                },
                children: "支持 MP3、WAV、FLAC、OGG、AAC 格式，文件大小不超过 50MB"
            }, void 0, false, {
                fileName: "src/pages/chord-analysis/components/FileDropZone.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/chord-analysis/components/FileDropZone.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
};
_s(FileDropZone, "Mij/dKIEtbsKwTi6Tj4oEhfuMds=");
_c = FileDropZone;
var _default = FileDropZone;
var _c;
$RefreshReg$(_c, "FileDropZone");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/chord-analysis/components/FileInfoBar.tsx": function (module, exports, __mako_require__){
/**
 * FileInfoBar — 文件信息栏组件
 *
 * 展示已上传音频文件的基本信息和分析结果元数据：
 * - 左侧：文件名 + 时长 / 文件大小
 * - 右侧：Key Pill（橙色 #FF9000）+ BPM Pill（绿色 #10B981）
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var _KeyBpmDisplay = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/chord-analysis/components/KeyBpmDisplay.tsx"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
/** 格式化秒为 mm:ss */ function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
/** 格式化文件大小 */ function formatSize(bytes) {
    const mb = bytes / 1048576;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
}
const FileInfoBar = ({ fileName, duration, fileSize, key, keyConfidence, bpm, bpmConfidence })=>{
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            padding: '14px 20px',
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #F3F4F6'
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                },
                children: [
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("span", {
                        style: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#0F1419',
                            lineHeight: '20px'
                        },
                        children: fileName
                    }, void 0, false, {
                        fileName: "src/pages/chord-analysis/components/FileInfoBar.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("span", {
                        style: {
                            fontSize: 12,
                            color: '#6B7280',
                            lineHeight: '16px'
                        },
                        children: [
                            formatTime(duration),
                            fileSize ? ` · ${formatSize(fileSize)}` : ''
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/chord-analysis/components/FileInfoBar.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/chord-analysis/components/FileInfoBar.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_KeyBpmDisplay.default, {
                keyName: key,
                keyConfidence: keyConfidence,
                bpm: bpm,
                bpmConfidence: bpmConfidence
            }, void 0, false, {
                fileName: "src/pages/chord-analysis/components/FileInfoBar.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/chord-analysis/components/FileInfoBar.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
};
_c = FileInfoBar;
var _default = FileInfoBar;
var _c;
$RefreshReg$(_c, "FileInfoBar");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/chord-analysis/components/KeyBpmDisplay.tsx": function (module, exports, __mako_require__){
/**
 * KeyBpmDisplay — Key / BPM 信息展示组件
 * 使用 Tag 组件显示调性和速度信息
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const { Text } = _antd.Typography;
const KeyBpmDisplay = ({ keyName, keyConfidence, bpm, bpmConfidence })=>{
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
        size: 12,
        style: {
            marginTop: 16
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Tag, {
                color: "orange",
                style: {
                    fontSize: 14,
                    padding: '4px 12px'
                },
                children: [
                    keyName,
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                        type: "secondary",
                        style: {
                            fontSize: 11,
                            marginLeft: 6
                        },
                        children: [
                            "(",
                            (keyConfidence * 100).toFixed(0),
                            "%)"
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/chord-analysis/components/KeyBpmDisplay.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/chord-analysis/components/KeyBpmDisplay.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Tag, {
                color: "blue",
                style: {
                    fontSize: 14,
                    padding: '4px 12px'
                },
                children: [
                    Math.round(bpm),
                    " BPM",
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                        type: "secondary",
                        style: {
                            fontSize: 11,
                            marginLeft: 6
                        },
                        children: [
                            "(",
                            (bpmConfidence * 100).toFixed(0),
                            "%)"
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/chord-analysis/components/KeyBpmDisplay.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/chord-analysis/components/KeyBpmDisplay.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/chord-analysis/components/KeyBpmDisplay.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
};
_c = KeyBpmDisplay;
var _default = KeyBpmDisplay;
var _c;
$RefreshReg$(_c, "KeyBpmDisplay");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/chord-analysis/components/WaveformCanvas.tsx": function (module, exports, __mako_require__){
/**
 * WaveformCanvas — 音频波形可视化组件（Canvas 渲染）
 * 本模块中唯一不使用 antd 组件的部分（antd 无音频波形组件）
 * 外部用 ProCard 包裹保持一致性
 *
 * 视觉层次（从下到上）：
 * 1. 波形层 — 音频振幅波形，浅灰色填充
 * 2. 节拍线 — BPM 推算的拍点位置，垂直细线，强拍稍粗
 * 3. 小节线 — 4/4 拍每 4 拍一条，垂直粗线
 * 4. 和弦标签 — 每个和弦段起始位置的标签
 * 5. 播放头 — 当前播放位置，橙色竖线
 * 6. 和弦段背景 — 当前和弦段浅橙色半透明背景
 *
 * 滚动行为：播放时波形整体向左滚动，播放头固定在画面约 30% 位置
 * 使用 requestAnimationFrame 驱动重绘
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const CANVAS_FILL_COLOR = '#e8e8e8';
const BEAT_LINE_COLOR = 'rgba(0, 0, 0, 0.15)';
const DOWNBEAT_LINE_COLOR = 'rgba(0, 0, 0, 0.3)';
const MEASURE_LINE_COLOR = 'rgba(0, 0, 0, 0.25)';
const PLAYHEAD_COLOR = '#ff9000';
const CHORD_BG_COLOR = 'rgba(255, 144, 0, 0.08)';
const CHORD_LABEL_COLOR = '#333';
const CHORD_BORDER_COLOR = 'rgba(255, 144, 0, 0.3)';
const WaveformCanvas = ({ peaks, duration, chordSegments, bpm, beats: realBeats, currentTime, isPlaying, onSeek })=>{
    _s();
    const canvasRef = (0, _react.useRef)(null);
    const containerRef = (0, _react.useRef)(null);
    const rafRef = (0, _react.useRef)(0);
    const scrollOffsetRef = (0, _react.useRef)(0);
    const currentTimeRef = (0, _react.useRef)(currentTime);
    currentTimeRef.current = currentTime;
    /** 节拍位置：优先用真实检测结果，fallback BPM 推算 */ const computeBeats = (0, _react.useCallback)(()=>{
        if (realBeats && realBeats.length > 0) return realBeats;
        if (bpm <= 0 || duration <= 0) return [];
        const beats = [];
        const beatInterval = 60 / bpm;
        let t = 0, beatIndex = 0;
        while(t <= duration){
            beats.push({
                time: t,
                isDownbeat: beatIndex % 4 === 0
            });
            t += beatInterval;
            beatIndex++;
        }
        return beats;
    }, [
        realBeats,
        bpm,
        duration
    ]);
    /** 像素/秒 比例（缩放级别） */ const PIXELS_PER_SECOND = 80;
    /** 播放头固定位置（占 canvas 宽度的比例） */ const PLAYHEAD_RATIO = 0.3;
    const draw = (0, _react.useCallback)(()=>{
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const dpr = window.devicePixelRatio || 1;
        const containerWidth = container.clientWidth;
        const height = 160;
        canvas.width = containerWidth * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);
        const playheadX = containerWidth * PLAYHEAD_RATIO;
        // 计算滚动偏移：播放头固定在 playheadX，波形向左滚动
        let offset;
        if (isPlaying && currentTimeRef.current > 0) offset = currentTimeRef.current * PIXELS_PER_SECOND - playheadX;
        else offset = scrollOffsetRef.current;
        scrollOffsetRef.current = offset;
        // 清空画布
        ctx.clearRect(0, 0, containerWidth, height);
        const waveYTop = 20;
        const waveYBottom = 100;
        const waveHeight = waveYBottom - waveYTop;
        const waveMidY = (waveYTop + waveYBottom) / 2;
        // --- 1. 波形层 ---
        if (peaks.length > 0) {
            peaks.length;
            const startIndex = Math.max(0, Math.floor(offset / PIXELS_PER_SECOND * peaks.length / duration));
            const endIndex = Math.min(peaks.length - 1, Math.ceil((offset + containerWidth) / PIXELS_PER_SECOND * peaks.length / duration));
            // 先用纯色填充波形区域
            ctx.fillStyle = CANVAS_FILL_COLOR;
            ctx.beginPath();
            let firstPoint = true;
            for(let i = startIndex; i <= endIndex; i++){
                const t = i / peaks.length * duration;
                const x = t * PIXELS_PER_SECOND - offset;
                const peak = typeof peaks[i] === 'number' ? peaks[i] : 0;
                const y = waveMidY - peak * waveHeight * 0.5;
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else ctx.lineTo(x, y);
            }
            // 绘制底部镜像（填充波形）
            for(let i = endIndex; i >= startIndex; i--){
                const t = i / peaks.length * duration;
                const x = t * PIXELS_PER_SECOND - offset;
                const peak = typeof peaks[i] === 'number' ? peaks[i] : 0;
                const y = waveMidY + peak * waveHeight * 0.5;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }
        // --- 2. 和弦段背景 ---
        chordSegments.forEach((seg)=>{
            const segStartX = seg.startTime * PIXELS_PER_SECOND - offset;
            const segEndX = seg.endTime * PIXELS_PER_SECOND - offset;
            const isCurrent = currentTimeRef.current >= seg.startTime && currentTimeRef.current < seg.endTime;
            if (segEndX >= 0 && segStartX <= containerWidth) {
                if (isCurrent) {
                    ctx.fillStyle = CHORD_BG_COLOR;
                    ctx.fillRect(Math.max(0, segStartX), 0, Math.min(containerWidth, segEndX) - Math.max(0, segStartX), height);
                    // 边框
                    ctx.strokeStyle = CHORD_BORDER_COLOR;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(Math.max(0, segStartX), 0, Math.min(containerWidth, segEndX) - Math.max(0, segStartX), height);
                }
            }
        });
        // --- 3. 节拍线（视口裁剪 + 密度控制） ---
        const beats = computeBeats();
        // 二分找到可见范围
        const viewStartTime = offset / PIXELS_PER_SECOND;
        const viewEndTime = (offset + containerWidth) / PIXELS_PER_SECOND;
        let startIdx = 0, endIdx = beats.length;
        for(let lo = 0, hi = beats.length - 1; lo <= hi;){
            const mid = lo + hi >> 1;
            if (beats[mid].time < viewStartTime) lo = mid + 1;
            else {
                hi = mid - 1;
                startIdx = mid;
            }
        }
        for(let lo = 0, hi = beats.length - 1; lo <= hi;){
            const mid = lo + hi >> 1;
            if (beats[mid].time <= viewEndTime) lo = mid + 1;
            else {
                hi = mid - 1;
                endIdx = mid;
            }
        }
        const visibleCount = endIdx - startIdx;
        const showAll = visibleCount < 40; // <40 拍可见时全画，超过则只画强拍
        for(let i = startIdx; i < endIdx; i++){
            const beat = beats[i];
            if (!showAll && !beat.isDownbeat) continue; // 高密度时只画强拍
            const x = beat.time * PIXELS_PER_SECOND - offset;
            ctx.strokeStyle = beat.isDownbeat ? DOWNBEAT_LINE_COLOR : BEAT_LINE_COLOR;
            ctx.lineWidth = beat.isDownbeat ? 1.5 : 0.8;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        // --- 4. 小节线（只画可见强拍） ---
        for(let i = startIdx; i < endIdx; i++){
            const beat = beats[i];
            if (!beat.isDownbeat) continue;
            const x = beat.time * PIXELS_PER_SECOND - offset;
            ctx.strokeStyle = MEASURE_LINE_COLOR;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([
                6,
                4
            ]);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        // --- 5. 和弦标签 ---
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        chordSegments.forEach((seg)=>{
            const segStartX = seg.startTime * PIXELS_PER_SECOND - offset;
            const segEndX = seg.endTime * PIXELS_PER_SECOND - offset;
            const segWidth = segEndX - segStartX;
            if (segEndX >= 0 && segStartX <= containerWidth) {
                const labelX = Math.max(0, segStartX) + Math.min(segWidth, containerWidth - Math.max(0, segStartX)) / 2;
                if (segWidth > 30) {
                    // 足够宽才画标签
                    const isCurrent = currentTimeRef.current >= seg.startTime && currentTimeRef.current < seg.endTime;
                    ctx.fillStyle = isCurrent ? '#ff9000' : CHORD_LABEL_COLOR;
                    ctx.font = isCurrent ? 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif' : '12px -apple-system, BlinkMacSystemFont, sans-serif';
                    const clampedX = Math.min(Math.max(labelX, 20), containerWidth - 20);
                    ctx.fillText(seg.chord, clampedX, height - 8);
                }
            }
        });
        // --- 6. 播放头 ---
        const phX = currentTimeRef.current * PIXELS_PER_SECOND - offset;
        if (phX >= 0 && phX <= containerWidth) {
            ctx.strokeStyle = PLAYHEAD_COLOR;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(phX, 0);
            ctx.lineTo(phX, height);
            ctx.stroke();
            // 播放头三角形指示器（Canvas 内可见）
            ctx.fillStyle = PLAYHEAD_COLOR;
            ctx.beginPath();
            ctx.moveTo(phX, 0);
            ctx.lineTo(phX - 5, 8);
            ctx.lineTo(phX + 5, 8);
            ctx.closePath();
            ctx.fill();
        }
    }, [
        peaks,
        duration,
        chordSegments,
        bpm,
        isPlaying,
        computeBeats
    ]);
    // 播放时用 rAF 驱动重绘（30fps 节流）
    (0, _react.useEffect)(()=>{
        if (isPlaying) {
            let animating = true;
            let lastDraw = 0;
            const loop = (ts)=>{
                if (!animating) return;
                if (ts - lastDraw >= 33) {
                    // ~30fps
                    draw();
                    lastDraw = ts;
                }
                rafRef.current = requestAnimationFrame(loop);
            };
            rafRef.current = requestAnimationFrame(loop);
            return ()=>{
                animating = false;
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
            };
        }
        draw();
        return undefined;
    }, [
        isPlaying,
        draw
    ]);
    // 尺寸变化时重绘
    (0, _react.useEffect)(()=>{
        draw();
        const handleResize = ()=>draw();
        window.addEventListener('resize', handleResize);
        return ()=>window.removeEventListener('resize', handleResize);
    }, [
        draw
    ]);
    // 点击跳转
    const handleClick = (0, _react.useCallback)((e)=>{
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const offset = scrollOffsetRef.current;
        const time = (clickX + offset) / PIXELS_PER_SECOND;
        if (time >= 0 && time <= duration) onSeek(Math.max(0, Math.min(time, duration)));
    }, [
        duration,
        onSeek
    ]);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        ref: containerRef,
        style: {
            width: '100%',
            height: 170,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 6,
            background: '#fafafa',
            cursor: 'pointer'
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("canvas", {
                ref: canvasRef,
                onClick: handleClick,
                style: {
                    display: 'block',
                    width: '100%',
                    height: 160
                }
            }, void 0, false, {
                fileName: "src/pages/chord-analysis/components/WaveformCanvas.tsx",
                lineNumber: 374,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    height: 10,
                    width: '100%',
                    position: 'relative',
                    background: '#f5f5f5',
                    borderTop: '1px solid #e8e8e8'
                }
            }, void 0, false, {
                fileName: "src/pages/chord-analysis/components/WaveformCanvas.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/chord-analysis/components/WaveformCanvas.tsx",
        lineNumber: 362,
        columnNumber: 5
    }, this);
};
_s(WaveformCanvas, "cJGHzuTQhNEsbAaVDLDc38nuOzQ=");
_c = WaveformCanvas;
var _default = WaveformCanvas;
var _c;
$RefreshReg$(_c, "WaveformCanvas");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/chord-analysis/index.tsx": function (module, exports, __mako_require__){
/**
 * 大师看和弦 — 页面主入口
 *
 * 布局：单列全宽垂直布局（Bento Attio Flat Modern 风格）
 * - 状态A (IDLE)：大卡片上传区域
 * - 状态B (LOADING)：分析进度
 * - 状态C (READY)：文件信息栏 → 播放控制栏 → 波形可视化 → 进度条 → 和弦网格
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.3.2_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@ant-design/icons/es/index.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19._39948e61760ff9ce55bb289fa3c0c022/node_modules/@ant-design/pro-components/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var _useChordAnalysis = __mako_require__("src/hooks/useChordAnalysis.ts");
var _AnalysisProgress = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/chord-analysis/components/AnalysisProgress.tsx"));
var _ChordGrid = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/chord-analysis/components/ChordGrid.tsx"));
var _FileDropZone = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/chord-analysis/components/FileDropZone.tsx"));
var _FileInfoBar = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/chord-analysis/components/FileInfoBar.tsx"));
var _WaveformCanvas = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/chord-analysis/components/WaveformCanvas.tsx"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
/** 支持的音频格式 */ const SUPPORTED_EXTENSIONS = [
    '.mp3',
    '.wav',
    '.flac',
    '.ogg',
    '.aac',
    '.m4a'
];
const SUPPORTED_AUDIO_MIME_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/flac',
    'audio/ogg',
    'audio/aac',
    'audio/x-m4a',
    'audio/mp4'
];
const MAX_FILE_SIZE = 52428800;
/** 格式化时间 mm:ss */ function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
const ChordAnalysisPage = ()=>{
    _s();
    const { analysisStatus, playbackState, currentTime, songAnalysis, error, retryable, currentStep, progressPercent, fileName, isLoading, handleFileSelect, handlePlay, handlePause, handleStop, handleSeek, handleRetry, audioRef, audioUrl, peaks } = (0, _useChordAnalysis.useChordAnalysis)();
    // 展示模式：和弦名称 or 功能级数
    const [displayMode, setDisplayMode] = (0, _react.useState)('chord');
    // 隐藏文件选择器用于重新上传
    const fileInputRef = (0, _react.useRef)(null);
    const isReady = analysisStatus === 'READY';
    const isError = analysisStatus === 'ERROR';
    const isIdle = analysisStatus === 'IDLE';
    const isPlaying = playbackState === 'PLAYING';
    /** 触发重新上传 — 直接弹出文件选择框覆盖 */ const handleReupload = (0, _react.useCallback)(()=>{
        var _fileInputRef_current;
        (_fileInputRef_current = fileInputRef.current) === null || _fileInputRef_current === void 0 || _fileInputRef_current.click();
    }, []);
    /** 处理重新上传的文件选择 */ const handleReuploadFileChange = (0, _react.useCallback)((e)=>{
        var _e_target_files, _file_name_split_pop;
        const file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
        if (!file) return;
        // 文件大小校验
        if (file.size > MAX_FILE_SIZE) {
            _antd.message.error(`文件过大（${(file.size / 1048576).toFixed(0)}MB），请选择 50MB 以内的文件`);
            e.target.value = '';
            return;
        }
        // 文件格式校验
        const ext = `.${(_file_name_split_pop = file.name.split('.').pop()) === null || _file_name_split_pop === void 0 ? void 0 : _file_name_split_pop.toLowerCase()}`;
        const isSupportedExt = SUPPORTED_EXTENSIONS.includes(ext);
        const isSupportedMime = SUPPORTED_AUDIO_MIME_TYPES.includes(file.type);
        if (!isSupportedExt && !isSupportedMime) {
            _antd.message.error('不支持的文件格式。支持：MP3、WAV、FLAC、OGG、AAC');
            e.target.value = '';
            return;
        }
        handleFileSelect(file);
        e.target.value = ''; // 清空 input 以允许重复选择同一文件
    }, [
        handleFileSelect
    ]);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        header: {
            title: '大师看和弦',
            subTitle: '分析音频文件，自动识别调弦、BPM 与和弦进行',
            ghost: true
        },
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
            children: [
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("input", {
                    ref: fileInputRef,
                    type: "file",
                    accept: "audio/*",
                    style: {
                        display: 'none'
                    },
                    onChange: handleReuploadFileChange
                }, void 0, false, {
                    fileName: "src/pages/chord-analysis/index.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                isIdle && !isError && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        maxWidth: 640,
                        margin: '0 auto'
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_FileDropZone.default, {
                        disabled: false,
                        onFileSelect: handleFileSelect
                    }, void 0, false, {
                        fileName: "src/pages/chord-analysis/index.tsx",
                        lineNumber: 138,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/chord-analysis/index.tsx",
                    lineNumber: 136,
                    columnNumber: 11
                }, this),
                isLoading && !isError && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        maxWidth: 640,
                        margin: '0 auto'
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_AnalysisProgress.default, {
                        status: analysisStatus,
                        currentStep: currentStep,
                        percent: progressPercent,
                        fileName: fileName || undefined
                    }, void 0, false, {
                        fileName: "src/pages/chord-analysis/index.tsx",
                        lineNumber: 145,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/chord-analysis/index.tsx",
                    lineNumber: 144,
                    columnNumber: 11
                }, this),
                isReady && songAnalysis && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_FileInfoBar.default, {
                            fileName: songAnalysis.fileName,
                            duration: songAnalysis.duration,
                            fileSize: songAnalysis.fileSize,
                            keyConfidence: songAnalysis.keyConfidence,
                            bpm: songAnalysis.bpm,
                            bpmConfidence: songAnalysis.bpmConfidence
                        }, songAnalysis.key, false, {
                            fileName: "src/pages/chord-analysis/index.tsx",
                            lineNumber: 158,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                            size: 12,
                            children: [
                                isPlaying ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    type: "default",
                                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.PauseOutlined, {}, void 0, false, {
                                        fileName: "src/pages/chord-analysis/index.tsx",
                                        lineNumber: 173,
                                        columnNumber: 25
                                    }, void 0),
                                    onClick: handlePause,
                                    style: {
                                        borderRadius: 8
                                    },
                                    children: "暂停"
                                }, void 0, false, {
                                    fileName: "src/pages/chord-analysis/index.tsx",
                                    lineNumber: 171,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    type: "primary",
                                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.CaretRightOutlined, {}, void 0, false, {
                                        fileName: "src/pages/chord-analysis/index.tsx",
                                        lineNumber: 182,
                                        columnNumber: 25
                                    }, void 0),
                                    onClick: handlePlay,
                                    style: {
                                        borderRadius: 8,
                                        background: '#FF9000',
                                        borderColor: '#FF9000'
                                    },
                                    children: "播放"
                                }, void 0, false, {
                                    fileName: "src/pages/chord-analysis/index.tsx",
                                    lineNumber: 180,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.StopOutlined, {}, void 0, false, {
                                        fileName: "src/pages/chord-analysis/index.tsx",
                                        lineNumber: 194,
                                        columnNumber: 23
                                    }, void 0),
                                    onClick: handleStop,
                                    disabled: playbackState === 'STOPPED',
                                    style: {
                                        borderRadius: 8
                                    },
                                    children: "停止"
                                }, void 0, false, {
                                    fileName: "src/pages/chord-analysis/index.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    type: "text",
                                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.ReloadOutlined, {}, void 0, false, {
                                        fileName: "src/pages/chord-analysis/index.tsx",
                                        lineNumber: 203,
                                        columnNumber: 23
                                    }, void 0),
                                    onClick: handleReupload,
                                    style: {
                                        borderRadius: 8,
                                        color: '#6B7280'
                                    },
                                    children: "重新上传"
                                }, void 0, false, {
                                    fileName: "src/pages/chord-analysis/index.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/chord-analysis/index.tsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                border: '1px solid #F0F0F0',
                                borderRadius: 12,
                                overflow: 'hidden'
                            },
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_WaveformCanvas.default, {
                                peaks: peaks,
                                duration: songAnalysis.duration,
                                chordSegments: songAnalysis.chordSegments,
                                bpm: songAnalysis.bpm,
                                beats: songAnalysis.beatList,
                                currentTime: currentTime,
                                isPlaying: isPlaying,
                                onSeek: handleSeek
                            }, void 0, false, {
                                fileName: "src/pages/chord-analysis/index.tsx",
                                lineNumber: 219,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/chord-analysis/index.tsx",
                            lineNumber: 212,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                padding: '0 4px'
                            },
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Slider, {
                                min: 0,
                                max: songAnalysis.duration,
                                value: currentTime,
                                step: 0.1,
                                onChange: handleSeek,
                                tooltip: {
                                    formatter: (val)=>formatTime(val || 0)
                                },
                                styles: {
                                    track: {
                                        background: '#FF9000'
                                    },
                                    rail: {
                                        background: '#F3F4F6'
                                    }
                                }
                            }, void 0, false, {
                                fileName: "src/pages/chord-analysis/index.tsx",
                                lineNumber: 233,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/chord-analysis/index.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                background: '#FFFFFF',
                                borderRadius: 12,
                                border: '1px solid #F3F4F6',
                                padding: '20px 16px',
                                overflowX: 'auto'
                            },
                            children: [
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginBottom: 16
                                    },
                                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Segmented, {
                                        options: [
                                            {
                                                label: '和弦名称',
                                                value: 'chord'
                                            },
                                            {
                                                label: '功能级数',
                                                value: 'degree'
                                            }
                                        ],
                                        value: displayMode,
                                        onChange: (v)=>setDisplayMode(v)
                                    }, void 0, false, {
                                        fileName: "src/pages/chord-analysis/index.tsx",
                                        lineNumber: 265,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "src/pages/chord-analysis/index.tsx",
                                    lineNumber: 258,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_ChordGrid.default, {
                                    beatChords: songAnalysis.beatChords || [],
                                    bpm: songAnalysis.bpm,
                                    currentTime: currentTime,
                                    displayMode: displayMode
                                }, void 0, false, {
                                    fileName: "src/pages/chord-analysis/index.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/chord-analysis/index.tsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("audio", {
                            ref: audioRef,
                            src: audioUrl || undefined,
                            preload: "auto",
                            "aria-label": "音频播放",
                            style: {
                                display: 'none'
                            }
                        }, void 0, false, {
                            fileName: "src/pages/chord-analysis/index.tsx",
                            lineNumber: 284,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "src/pages/chord-analysis/index.tsx",
                    lineNumber: 156,
                    columnNumber: 11
                }, this),
                isError && error && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        maxWidth: 640,
                        margin: '0 auto'
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                        type: "error",
                        message: "分析错误",
                        description: error,
                        showIcon: true,
                        style: {
                            marginTop: 16,
                            borderRadius: 12
                        },
                        action: retryable ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                            size: "small",
                            onClick: handleRetry,
                            style: {
                                borderRadius: 8
                            },
                            children: "重试"
                        }, void 0, false, {
                            fileName: "src/pages/chord-analysis/index.tsx",
                            lineNumber: 305,
                            columnNumber: 19
                        }, void 0) : undefined
                    }, void 0, false, {
                        fileName: "src/pages/chord-analysis/index.tsx",
                        lineNumber: 297,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/chord-analysis/index.tsx",
                    lineNumber: 296,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "src/pages/chord-analysis/index.tsx",
            lineNumber: 124,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/chord-analysis/index.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
};
_s(ChordAnalysisPage, "BP/pJx6v20Qf8DoP5zzmUcjirrI=", false, function() {
    return [
        _useChordAnalysis.useChordAnalysis
    ];
});
_c = ChordAnalysisPage;
var _default = ChordAnalysisPage;
var _c;
$RefreshReg$(_c, "ChordAnalysisPage");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
 }]);
//# sourceMappingURL=src_pages_chord-analysis_index_tsx-async.js.map