((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/music-insight/index.tsx'],
{ "src/hooks/useMusicInsight.ts": function (module, exports, __mako_require__){
/**
 * useMusicInsight — 两阶段音乐理解 Hook
 *
 * Phase 1: 上传音频 → 降采样 → Worker 特征提取 → 缓存 features
 * Phase 2: 点击模型/分组 → Worker 逐个加载模型 → 推理 → 返回结果 → 卸载模型
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "useMusicInsight", {
    enumerable: true,
    get: function() {
        return useMusicInsight;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
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
function useMusicInsight() {
    _s();
    const [status, setStatus] = (0, _react.useState)('IDLE');
    const [models, setModels] = (0, _react.useState)([]);
    const [results, setResults] = (0, _react.useState)({});
    const [fileName, setFileName] = (0, _react.useState)(null);
    const [duration, setDuration] = (0, _react.useState)(0);
    const [error, setError] = (0, _react.useState)(null);
    const [analyzing, setAnalyzing] = (0, _react.useState)(null);
    const [logs, setLogs] = (0, _react.useState)([]);
    const workerRef = (0, _react.useRef)(null);
    const terminateWorker = (0, _react.useCallback)(()=>{
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }, []);
    const createWorker = (0, _react.useCallback)(()=>{
        terminateWorker();
        console.log('[useMusicInsight] Creating worker...');
        try {
            const baseUrl = window.location.pathname.startsWith('/Suno-Cover-Arranger') ? '/Suno-Cover-Arranger/' : '/';
            const workerUrl = baseUrl + 'inference.worker.js';
            console.log('[useMusicInsight] Worker URL:', workerUrl);
            const w = new Worker(workerUrl);
            workerRef.current = w;
            console.log('[useMusicInsight] Worker created successfully');
            w.onerror = (err)=>{
                console.error('[useMusicInsight] Worker error:', err);
                setError(err.message);
                setStatus('ERROR');
            };
            w.onmessageerror = (err)=>{
                console.error('[useMusicInsight] Worker message error:', err);
                setError('Worker message error');
                setStatus('ERROR');
            };
            return w;
        } catch (err) {
            console.error('[useMusicInsight] Failed to create worker:', err);
            throw err;
        }
    }, [
        terminateWorker
    ]);
    const reset = (0, _react.useCallback)(()=>{
        terminateWorker();
        setStatus('IDLE');
        setModels([]);
        setResults({});
        setFileName(null);
        setDuration(0);
        setError(null);
        setAnalyzing(null);
        setLogs([]);
    }, [
        terminateWorker
    ]);
    // ===== Phase 1: 上传 → 解码 → 降采样 → 特征提取 =====
    const handleFileSelect = (0, _react.useCallback)(async (file)=>{
        console.log('[useMusicInsight] handleFileSelect started, file:', file.name, file.size);
        reset();
        setFileName(file.name);
        setStatus('DECODING');
        try {
            console.log('[useMusicInsight] Decoding audio file...');
            const arrayBuffer = await file.arrayBuffer();
            console.log('[useMusicInsight] ArrayBuffer obtained, size:', arrayBuffer.byteLength);
            const audioCtx = new AudioContext();
            console.log('[useMusicInsight] AudioContext created');
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            console.log('[useMusicInsight] Audio decoded, sampleRate:', audioBuffer.sampleRate, 'duration:', audioBuffer.duration);
            await audioCtx.close();
            setDuration(audioBuffer.duration);
            const origData = audioBuffer.getChannelData(0);
            const ratio = 16000 / audioBuffer.sampleRate;
            const newLen = Math.floor(origData.length * ratio);
            const ds = new Float32Array(newLen);
            for(let i = 0; i < newLen; i++)ds[i] = origData[Math.min(Math.round(i / ratio), origData.length - 1)];
            console.log('[useMusicInsight] Downsampled to 16kHz, length:', newLen);
            setStatus('EXTRACTING');
            const w = createWorker();
            console.log('[useMusicInsight] Worker created, posting EXTRACT message...');
            await new Promise((resolve, reject)=>{
                w.onmessage = (e)=>{
                    console.log('[useMusicInsight] Worker message received:', e.data.type);
                    if (e.data.type === 'ready') {
                        console.log('[useMusicInsight] Worker ready, models:', e.data.models);
                        setModels(e.data.models);
                        setStatus('READY');
                        resolve();
                    } else if (e.data.type === 'error') {
                        console.error('[useMusicInsight] Worker error:', e.data.message);
                        reject(new Error(e.data.message));
                    } else if (e.data.type === 'log') {
                        console.log('[useMusicInsight] Worker log:', e.data.msg);
                        setLogs((prev)=>[
                                ...prev,
                                e.data.msg
                            ]);
                    } else if (e.data.type === 'progress') console.log('[useMusicInsight] Worker progress:', e.data);
                };
                const copy = ds.buffer.slice(0);
                console.log('[useMusicInsight] Posting message to worker...');
                w.postMessage({
                    type: 'EXTRACT',
                    audioData: copy
                }, [
                    copy
                ]);
                console.log('[useMusicInsight] Message posted successfully');
            });
        } catch (err) {
            console.error('[useMusicInsight] Error in handleFileSelect:', err);
            setError(err instanceof Error ? err.message : '未知错误');
            setStatus('ERROR');
        }
    }, [
        reset,
        createWorker
    ]);
    // ===== 单模型推理 =====
    const runOne = (0, _react.useCallback)((model)=>{
        return new Promise((resolve, reject)=>{
            var _results_model;
            if (!workerRef.current) {
                resolve();
                return;
            }
            if ((_results_model = results[model]) === null || _results_model === void 0 ? void 0 : _results_model.raw) {
                resolve();
                return;
            }
            setAnalyzing(model);
            const w = workerRef.current;
            w.onmessage = (e)=>{
                if (e.data.type === 'result' && e.data.model === model) {
                    setResults((prev)=>({
                            ...prev,
                            [model]: e.data.data
                        }));
                    resolve();
                } else if (e.data.type === 'error') {
                    setResults((prev)=>({
                            ...prev,
                            [model]: {
                                error: e.data.message,
                                raw: null
                            }
                        }));
                    resolve();
                } else if (e.data.type === 'log') setLogs((prev)=>[
                        ...prev,
                        e.data.msg
                    ]);
            };
            w.postMessage({
                type: 'ANALYZE_ONE',
                model
            });
        });
    }, [
        results
    ]);
    const handleAnalyzeModel = (0, _react.useCallback)((model)=>{
        if (status !== 'READY' && status !== 'ANALYZING') return;
        setStatus('ANALYZING');
        runOne(model).then(()=>{
            setAnalyzing(null);
            setStatus('READY');
        });
    }, [
        status,
        runOne
    ]);
    // ===== 分组串行分析 =====
    const handleAnalyzeGroup = (0, _react.useCallback)(async (groupModels)=>{
        if (status !== 'READY' && status !== 'ANALYZING') return;
        setStatus('ANALYZING');
        for (const model of groupModels)await runOne(model);
        setAnalyzing(null);
        setStatus('READY');
    }, [
        status,
        runOne
    ]);
    const handleReset = (0, _react.useCallback)(()=>reset(), [
        reset
    ]);
    (0, _react.useEffect)(()=>{
        return ()=>terminateWorker();
    }, [
        terminateWorker
    ]);
    return {
        status,
        models,
        results,
        fileName,
        duration,
        error,
        analyzing,
        logs,
        handleFileSelect,
        handleAnalyzeModel,
        handleAnalyzeGroup,
        handleReset
    };
}
_s(useMusicInsight, "ve3KdGQemaSmHBnK0+lDL1Uy2Z8=");
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
"src/pages/music-insight/components/AnalysisProgress.tsx": function (module, exports, __mako_require__){
/**
 * 音乐理解 — 分析进度组件
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
const AnalysisProgress = ({ status, fileName, percent })=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        style: {
            textAlign: 'center',
            padding: '40px 0'
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                indicator: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.LoadingOutlined, {
                    style: {
                        fontSize: 40,
                        color: '#FF9000'
                    },
                    spin: true
                }, void 0, false, {
                    fileName: "src/pages/music-insight/components/AnalysisProgress.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, void 0)
            }, void 0, false, {
                fileName: "src/pages/music-insight/components/AnalysisProgress.tsx",
                lineNumber: 18,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    marginTop: 20
                },
                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                    style: {
                        fontSize: 15,
                        fontWeight: 600
                    },
                    children: [
                        status,
                        " ",
                        percent,
                        "%"
                    ]
                }, void 0, true, {
                    fileName: "src/pages/music-insight/components/AnalysisProgress.tsx",
                    lineNumber: 24,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "src/pages/music-insight/components/AnalysisProgress.tsx",
                lineNumber: 23,
                columnNumber: 5
            }, this),
            fileName && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                type: "secondary",
                style: {
                    display: 'block',
                    marginTop: 8
                },
                children: fileName
            }, void 0, false, {
                fileName: "src/pages/music-insight/components/AnalysisProgress.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Progress, {
                percent: percent,
                strokeColor: "#FF9000",
                size: "medium",
                style: {
                    width: 300,
                    marginTop: 16
                }
            }, void 0, false, {
                fileName: "src/pages/music-insight/components/AnalysisProgress.tsx",
                lineNumber: 33,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/music-insight/components/AnalysisProgress.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, this);
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
"src/pages/music-insight/components/GroupResultCard.tsx": function (module, exports, __mako_require__){
/**
 * 音乐理解 — 分组结果卡片（情绪/能量分析）
 * 使用与 StructuredResultCard 一致的 Descriptions + Progress 格式
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
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19._39948e61760ff9ce55bb289fa3c0c022/node_modules/@ant-design/pro-components/es/index.js");
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
const GroupResultCard = ({ title, items })=>{
    const validItems = items.map((item)=>{
        var _item_data;
        const raw = (_item_data = item.data) === null || _item_data === void 0 ? void 0 : _item_data.raw;
        if (!raw || !Array.isArray(raw) || raw.length < 2) return null;
        const pct = Math.round(raw[1] * 100);
        return {
            key: item.label,
            label: item.label,
            pct
        };
    }).filter((item)=>item !== null);
    if (validItems.length === 0) return null;
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
        size: "small",
        title: title,
        bordered: true,
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Descriptions, {
            column: 1,
            bordered: true,
            children: validItems.map((item)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Descriptions.Item, {
                    label: item.label,
                    styles: {
                        label: {
                            width: 240
                        }
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Progress, {
                        percent: item.pct,
                        strokeColor: item.pct >= 50 ? 'orange' : item.pct >= 30 ? 'gold' : 'pink',
                        size: "medium"
                    }, void 0, false, {
                        fileName: "src/pages/music-insight/components/GroupResultCard.tsx",
                        lineNumber: 43,
                        columnNumber: 13
                    }, this)
                }, item.key, false, {
                    fileName: "src/pages/music-insight/components/GroupResultCard.tsx",
                    lineNumber: 38,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "src/pages/music-insight/components/GroupResultCard.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/music-insight/components/GroupResultCard.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
};
_c = GroupResultCard;
var _default = GroupResultCard;
var _c;
$RefreshReg$(_c, "GroupResultCard");
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
"src/pages/music-insight/components/StructuredResultCard.tsx": function (module, exports, __mako_require__){
/**
 * 音乐理解 — 多分类结构化结果卡片
 * genre → top 5, 其余 → top 3, 数值以 % 整数展示
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
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19._39948e61760ff9ce55bb289fa3c0c022/node_modules/@ant-design/pro-components/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var _labels = __mako_require__("src/services/ml/labels.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const TOP_N = {
    genre: 5
};
const StructuredResultCard = ({ modelName, title, data })=>{
    if (data.error) return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
        size: "small",
        title: title,
        bordered: true,
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Descriptions, {
            column: 1,
            bordered: true,
            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Descriptions.Item, {
                label: "错误",
                children: data.error
            }, void 0, false, {
                fileName: "src/pages/music-insight/components/StructuredResultCard.tsx",
                lineNumber: 24,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "src/pages/music-insight/components/StructuredResultCard.tsx",
            lineNumber: 23,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "src/pages/music-insight/components/StructuredResultCard.tsx",
        lineNumber: 22,
        columnNumber: 7
    }, this);
    const raw = data.raw;
    if (!raw || !Array.isArray(raw) || raw.length < 2) return null;
    const labels = (0, _labels.getLabels)(modelName, raw.length);
    const topN = TOP_N[modelName] || 3;
    const items = labels.map((label, i)=>({
            key: label,
            label,
            pct: Math.round((raw[i] || 0) * 100)
        })).sort((a, b)=>b.pct - a.pct).slice(0, topN);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
        size: "small",
        title: title,
        bordered: true,
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Descriptions, {
            column: 1,
            bordered: true,
            children: items.map((item)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Descriptions.Item, {
                    label: item.label,
                    styles: {
                        label: {
                            width: 240
                        }
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Progress, {
                        percent: item.pct,
                        strokeColor: item.pct >= 50 ? 'orange' : item.pct >= 30 ? 'gold' : 'pink',
                        size: "medium"
                    }, void 0, false, {
                        fileName: "src/pages/music-insight/components/StructuredResultCard.tsx",
                        lineNumber: 54,
                        columnNumber: 13
                    }, this)
                }, item.key, false, {
                    fileName: "src/pages/music-insight/components/StructuredResultCard.tsx",
                    lineNumber: 49,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "src/pages/music-insight/components/StructuredResultCard.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/music-insight/components/StructuredResultCard.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
};
_c = StructuredResultCard;
var _default = StructuredResultCard;
var _c;
$RefreshReg$(_c, "StructuredResultCard");
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
"src/pages/music-insight/index.tsx": function (module, exports, __mako_require__){
/**
 * 音乐理解 — 深度学习音频分析
 *
 * 两阶段交互：
 * 1. 上传音频 → 特征提取（所有模型共用）
 * 2. 选择模型维度 → 逐个分析 → 展示结果
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
var _useMusicInsight = __mako_require__("src/hooks/useMusicInsight.ts");
var _AnalysisProgress = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/music-insight/components/AnalysisProgress.tsx"));
var _GroupResultCard = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/music-insight/components/GroupResultCard.tsx"));
var _StructuredResultCard = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/music-insight/components/StructuredResultCard.tsx"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
var _s1 = $RefreshSig$();
const { Text } = _antd.Typography;
// ==================== 常量 ====================
const SUPPORTED_EXTENSIONS = [
    '.mp3',
    '.wav',
    '.flac',
    '.ogg',
    '.aac',
    '.m4a'
];
const MAX_FILE_SIZE = 52428800;
/** 独立模型按钮 */ const SOLO_MODELS = [
    {
        key: 'genre',
        label: '风格分析·通用'
    },
    {
        key: 'genre_tzanetakis',
        label: '风格分析·GTZAN数据集'
    },
    {
        key: 'genre_electronic',
        label: '风格分析·电子乐细分'
    },
    {
        key: 'urbansound8k',
        label: '场景分析'
    }
];
/** 情绪分组（4 个模型串行分析，结果合并展示） */ const MOOD_MODELS = [
    'mood_happy',
    'mood_sad',
    'mood_relaxed',
    'mood_aggressive'
];
/** 能量分组（4 个模型串行分析，结果合并展示） */ const ENERGY_MODELS = [
    'mood_acoustic',
    'mood_electronic',
    'mood_party',
    'danceability'
];
/** 二分类子维度标签 */ const BINARY_LABELS = {
    mood_happy: '欢快',
    mood_sad: '悲伤',
    mood_relaxed: '放松',
    mood_aggressive: '激烈',
    mood_acoustic: '原声',
    mood_electronic: '电子',
    mood_party: '派对',
    danceability: '可舞性'
};
// ==================== 子组件 ====================
/** 上传卡片 */ const UploadCard = ({ onFileSelect })=>{
    _s();
    const [dragging, setDragging] = _react.default.useState(false);
    const inputRef = (0, _react.useRef)(null);
    const validate = (0, _react.useCallback)((file)=>{
        var _file_name_split_pop;
        const ext = `.${(_file_name_split_pop = file.name.split('.').pop()) === null || _file_name_split_pop === void 0 ? void 0 : _file_name_split_pop.toLowerCase()}`;
        if (!SUPPORTED_EXTENSIONS.includes(ext)) {
            _antd.message.error(`不支持的格式：${ext}。支持 MP3、WAV、FLAC、OGG、AAC`);
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            _antd.message.error(`文件过大（${(file.size / 1048576).toFixed(0)}MB），请选择 50MB 以内的文件`);
            return false;
        }
        return true;
    }, []);
    const handleDrop = (0, _react.useCallback)((e)=>{
        var _e_dataTransfer_files;
        e.preventDefault();
        setDragging(false);
        const file = (_e_dataTransfer_files = e.dataTransfer.files) === null || _e_dataTransfer_files === void 0 ? void 0 : _e_dataTransfer_files[0];
        if (file && validate(file)) onFileSelect(file);
    }, [
        onFileSelect,
        validate
    ]);
    const handleChange = (0, _react.useCallback)((e)=>{
        var _e_target_files;
        const file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
        if (file && validate(file)) onFileSelect(file);
        if (inputRef.current) inputRef.current.value = '';
    }, [
        onFileSelect,
        validate
    ]);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        onDragOver: (e)=>{
            e.preventDefault();
            setDragging(true);
        },
        onDragLeave: ()=>setDragging(false),
        onDrop: handleDrop,
        onClick: ()=>{
            var _inputRef_current;
            return (_inputRef_current = inputRef.current) === null || _inputRef_current === void 0 ? void 0 : _inputRef_current.click();
        },
        style: {
            border: `2px ${dragging ? 'solid' : 'dashed'} ${dragging ? '#FF9000' : '#D9D9D9'}`,
            borderRadius: 12,
            padding: '56px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(255,144,0,0.04)' : '#FAFAFA',
            transition: 'all 0.2s'
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.SoundOutlined, {
                style: {
                    fontSize: 40,
                    color: '#FF9000',
                    marginBottom: 16
                }
            }, void 0, false, {
                fileName: "src/pages/music-insight/index.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 8
                },
                children: "点击或拖拽音频文件到此处"
            }, void 0, false, {
                fileName: "src/pages/music-insight/index.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                type: "secondary",
                children: "支持 MP3、WAV、FLAC、OGG、AAC 格式，单个文件不超过 50MB"
            }, void 0, false, {
                fileName: "src/pages/music-insight/index.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("input", {
                ref: inputRef,
                type: "file",
                accept: "audio/*",
                style: {
                    display: 'none'
                },
                onChange: handleChange
            }, void 0, false, {
                fileName: "src/pages/music-insight/index.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/music-insight/index.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
};
_s(UploadCard, "6DNp0vhOuF5zOwyV3ipHiMIRwvc=");
_c = UploadCard;
// ==================== 主页面 ====================
/** 模型按钮 */ const ModelBtn = ({ model, label, done, busy, onClick })=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
        size: "small",
        type: done ? 'default' : 'primary',
        ghost: !done,
        icon: done ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("span", {
            style: {
                color: 'green'
            },
            children: "✓"
        }, void 0, false, {
            fileName: "src/pages/music-insight/index.tsx",
            lineNumber: 163,
            columnNumber: 14
        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.PlayCircleOutlined, {}, void 0, false, {
            fileName: "src/pages/music-insight/index.tsx",
            lineNumber: 163,
            columnNumber: 58
        }, void 0),
        loading: busy,
        onClick: onClick,
        style: {
            borderRadius: 8,
            borderColor: done ? 'green' : undefined,
            color: done ? 'green' : undefined
        },
        children: label
    }, model, false, {
        fileName: "src/pages/music-insight/index.tsx",
        lineNumber: 157,
        columnNumber: 3
    }, this);
_c1 = ModelBtn;
/** 分组按钮 */ const GroupBtn = ({ label, groupModels, results, busyKey, onClick })=>{
    const doneCount = groupModels.filter((m)=>{
        var _results_m;
        return !!((_results_m = results[m]) === null || _results_m === void 0 ? void 0 : _results_m.raw);
    }).length;
    const allDone = doneCount === groupModels.length;
    const someBusy = groupModels.some((m)=>busyKey === m);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
        size: "small",
        type: allDone ? 'default' : 'primary',
        ghost: !allDone,
        icon: allDone ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("span", {
            style: {
                color: 'green'
            },
            children: "✓"
        }, void 0, false, {
            fileName: "src/pages/music-insight/index.tsx",
            lineNumber: 195,
            columnNumber: 11
        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.PlayCircleOutlined, {}, void 0, false, {
            fileName: "src/pages/music-insight/index.tsx",
            lineNumber: 197,
            columnNumber: 11
        }, void 0),
        loading: someBusy,
        onClick: onClick,
        style: {
            borderRadius: 8,
            borderColor: allDone ? 'green' : undefined,
            color: allDone ? 'green' : undefined
        },
        children: [
            label,
            " (",
            doneCount,
            "/",
            groupModels.length,
            ")"
        ]
    }, void 0, true, {
        fileName: "src/pages/music-insight/index.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
};
_c2 = GroupBtn;
const MusicInsightPage = ()=>{
    _s1();
    const { status, models, results, fileName, duration, error, analyzing, handleFileSelect, handleAnalyzeModel, handleAnalyzeGroup, handleReset } = (0, _useMusicInsight.useMusicInsight)();
    const isIdle = status === 'IDLE';
    const isDecoding = status === 'DECODING';
    const isExtracting = status === 'EXTRACTING';
    const isProcessing = isDecoding || isExtracting;
    const isError = status === 'ERROR';
    const showButtons = status === 'READY' || status === 'ANALYZING';
    const doneCount = Object.values(results).filter((r)=>r.raw).length;
    // ==================== 渲染 ====================
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        header: {
            title: '音乐理解',
            subTitle: '上传歌曲，查看深度学习模型的音频分析结果',
            ghost: true
        },
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
            children: [
                isIdle && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        maxWidth: 640,
                        margin: '0 auto'
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(UploadCard, {
                        onFileSelect: handleFileSelect
                    }, void 0, false, {
                        fileName: "src/pages/music-insight/index.tsx",
                        lineNumber: 251,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/music-insight/index.tsx",
                    lineNumber: 250,
                    columnNumber: 11
                }, this),
                isProcessing && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        maxWidth: 640,
                        margin: '0 auto'
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_AnalysisProgress.default, {
                        status: isDecoding ? '解码音频' : '提取特征',
                        fileName: fileName || undefined,
                        percent: isExtracting ? 50 : 20
                    }, void 0, false, {
                        fileName: "src/pages/music-insight/index.tsx",
                        lineNumber: 258,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/music-insight/index.tsx",
                    lineNumber: 257,
                    columnNumber: 11
                }, this),
                showButtons && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16
                            },
                            children: [
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                    style: {
                                        fontSize: 15,
                                        fontWeight: 600
                                    },
                                    children: fileName
                                }, void 0, false, {
                                    fileName: "src/pages/music-insight/index.tsx",
                                    lineNumber: 271,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                    type: "secondary",
                                    children: [
                                        duration.toFixed(1),
                                        "s"
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/music-insight/index.tsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                    type: "secondary",
                                    children: [
                                        doneCount,
                                        "/",
                                        models.length,
                                        " 已分析"
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/music-insight/index.tsx",
                                    lineNumber: 273,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    type: "text",
                                    size: "small",
                                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.ReloadOutlined, {}, void 0, false, {
                                        fileName: "src/pages/music-insight/index.tsx",
                                        lineNumber: 279,
                                        columnNumber: 23
                                    }, void 0),
                                    onClick: handleReset,
                                    style: {
                                        marginLeft: 'auto',
                                        borderRadius: 8,
                                        color: '#6B7280'
                                    },
                                    children: "重新上传"
                                }, void 0, false, {
                                    fileName: "src/pages/music-insight/index.tsx",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/music-insight/index.tsx",
                            lineNumber: 270,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                            size: "small",
                            title: "选择分析维度",
                            bordered: true,
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                orientation: "vertical",
                                size: 12,
                                style: {
                                    width: '100%'
                                },
                                children: [
                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                                        style: {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 8
                                        },
                                        children: SOLO_MODELS.map((m)=>{
                                            var _results_m_key;
                                            return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(ModelBtn, {
                                                model: m.key,
                                                label: m.label,
                                                done: !!((_results_m_key = results[m.key]) === null || _results_m_key === void 0 ? void 0 : _results_m_key.raw),
                                                busy: analyzing === m.key,
                                                onClick: ()=>handleAnalyzeModel(m.key)
                                            }, m.key, false, {
                                                fileName: "src/pages/music-insight/index.tsx",
                                                lineNumber: 297,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "src/pages/music-insight/index.tsx",
                                        lineNumber: 295,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                                        style: {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(GroupBtn, {
                                                label: "情绪分析",
                                                groupModels: MOOD_MODELS,
                                                results: results,
                                                busyKey: analyzing,
                                                onClick: ()=>handleAnalyzeGroup([
                                                        ...MOOD_MODELS
                                                    ])
                                            }, void 0, false, {
                                                fileName: "src/pages/music-insight/index.tsx",
                                                lineNumber: 309,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(GroupBtn, {
                                                label: "能量分析",
                                                groupModels: ENERGY_MODELS,
                                                results: results,
                                                busyKey: analyzing,
                                                onClick: ()=>handleAnalyzeGroup([
                                                        ...ENERGY_MODELS
                                                    ])
                                            }, void 0, false, {
                                                fileName: "src/pages/music-insight/index.tsx",
                                                lineNumber: 316,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/music-insight/index.tsx",
                                        lineNumber: 308,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "src/pages/music-insight/index.tsx",
                                lineNumber: 293,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/music-insight/index.tsx",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this),
                        doneCount > 0 && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12
                            },
                            children: [
                                SOLO_MODELS.filter((m)=>{
                                    var _results_m_key;
                                    return (_results_m_key = results[m.key]) === null || _results_m_key === void 0 ? void 0 : _results_m_key.raw;
                                }).map((m)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_StructuredResultCard.default, {
                                        modelName: m.key,
                                        title: m.label,
                                        data: results[m.key]
                                    }, m.key, false, {
                                        fileName: "src/pages/music-insight/index.tsx",
                                        lineNumber: 334,
                                        columnNumber: 19
                                    }, this)),
                                MOOD_MODELS.some((m)=>{
                                    var _results_m;
                                    return (_results_m = results[m]) === null || _results_m === void 0 ? void 0 : _results_m.raw;
                                }) && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_GroupResultCard.default, {
                                    title: "情绪分析",
                                    items: MOOD_MODELS.map((m)=>({
                                            label: BINARY_LABELS[m],
                                            data: results[m]
                                        }))
                                }, void 0, false, {
                                    fileName: "src/pages/music-insight/index.tsx",
                                    lineNumber: 344,
                                    columnNumber: 19
                                }, this),
                                ENERGY_MODELS.some((m)=>{
                                    var _results_m;
                                    return (_results_m = results[m]) === null || _results_m === void 0 ? void 0 : _results_m.raw;
                                }) && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_GroupResultCard.default, {
                                    title: "能量分析",
                                    items: ENERGY_MODELS.map((m)=>({
                                            label: BINARY_LABELS[m],
                                            data: results[m]
                                        }))
                                }, void 0, false, {
                                    fileName: "src/pages/music-insight/index.tsx",
                                    lineNumber: 355,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/music-insight/index.tsx",
                            lineNumber: 329,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "src/pages/music-insight/index.tsx",
                    lineNumber: 268,
                    columnNumber: 11
                }, this),
                isError && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    style: {
                        maxWidth: 640,
                        margin: '0 auto'
                    },
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                        type: "error",
                        message: "分析失败",
                        description: error,
                        showIcon: true,
                        style: {
                            borderRadius: 12
                        },
                        action: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                            size: "small",
                            onClick: handleReset,
                            style: {
                                borderRadius: 8
                            },
                            children: "重新上传"
                        }, void 0, false, {
                            fileName: "src/pages/music-insight/index.tsx",
                            lineNumber: 378,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "src/pages/music-insight/index.tsx",
                        lineNumber: 371,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/music-insight/index.tsx",
                    lineNumber: 370,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "src/pages/music-insight/index.tsx",
            lineNumber: 247,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/music-insight/index.tsx",
        lineNumber: 240,
        columnNumber: 5
    }, this);
};
_s1(MusicInsightPage, "eAAxRa26zZHJKoJHGlGUlNoUT4Q=", false, function() {
    return [
        _useMusicInsight.useMusicInsight
    ];
});
_c3 = MusicInsightPage;
var _default = MusicInsightPage;
var _c;
var _c1;
var _c2;
var _c3;
$RefreshReg$(_c, "UploadCard");
$RefreshReg$(_c1, "ModelBtn");
$RefreshReg$(_c2, "GroupBtn");
$RefreshReg$(_c3, "MusicInsightPage");
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
"src/services/ml/labels.ts": function (module, exports, __mako_require__){
/**
 * 模型标签映射表 — 索引顺序与模型输出维度对应
 * 所有标签名已经过 Essentia 官方元数据 + MTG-Jamendo 标注数据核对
 */ /** MSD-MusiCNN 50 标签 */ "use strict";
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
    BINARY_LABELS: function() {
        return BINARY_LABELS;
    },
    GENRE_LABELS: function() {
        return GENRE_LABELS;
    },
    MULTICLASS_LABELS: function() {
        return MULTICLASS_LABELS;
    },
    getLabels: function() {
        return getLabels;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const GENRE_LABELS = [
    'rock',
    'pop',
    'alternative',
    'indie',
    'electronic',
    'female vocalists',
    'dance',
    '00s',
    'alternative rock',
    'jazz',
    'beautiful',
    'metal',
    'chillout',
    'male vocalists',
    'classic rock',
    'soul',
    'indie rock',
    'Mellow',
    'electronica',
    '80s',
    'folk',
    '90s',
    'chill',
    'instrumental',
    'punk',
    'oldies',
    'blues',
    'hard rock',
    'ambient',
    'acoustic',
    'experimental',
    'female vocalist',
    'guitar',
    'Hip-Hop',
    '70s',
    'party',
    'country',
    'easy listening',
    'sexy',
    'catchy',
    'funk',
    'electro',
    'heavy metal',
    'Progressive rock',
    '60s',
    'rnb',
    'indie pop',
    'sad',
    'House',
    'happy'
];
const BINARY_LABELS = {
    mood_happy: [
        'non_happy',
        'happy'
    ],
    mood_sad: [
        'non_sad',
        'sad'
    ],
    mood_relaxed: [
        'non_relaxed',
        'relaxed'
    ],
    mood_aggressive: [
        'non_aggressive',
        'aggressive'
    ],
    mood_acoustic: [
        'non_acoustic',
        'acoustic'
    ],
    mood_electronic: [
        'non_electronic',
        'electronic'
    ],
    mood_party: [
        'non_party',
        'party'
    ],
    danceability: [
        'not_danceable',
        'danceable'
    ]
};
const MULTICLASS_LABELS = {
    // GTZAN benchmark (Tzanetakis 2001), 10 genres — 来源: MTG-Jamendo 标注
    genre_tzanetakis: [
        'Blues',
        'Classical',
        'Country',
        'Disco',
        'Hip Hop',
        'Jazz',
        'Metal',
        'Pop',
        'Reggae',
        'Rock'
    ],
    // 电子风格子分类 — 来源: MTG-Jamendo 标注, "ambeint" 校正为 "Ambient"
    genre_electronic: [
        'Ambient',
        'Drum & Bass',
        'House',
        'Techno',
        'Trance'
    ],
    // UrbanSound8K 环境声音分类 — 来源: urbansound8k 数据集官方 10 类
    urbansound8k: [
        'Air Conditioner',
        'Car Horn',
        'Children Playing',
        'Dog Bark',
        'Drilling',
        'Engine Idling',
        'Gun Shot',
        'Jackhammer',
        'Siren',
        'Street Music'
    ]
};
function getLabels(modelName, numClasses) {
    if (modelName === 'genre') return GENRE_LABELS.slice(0, numClasses);
    if (BINARY_LABELS[modelName]) return BINARY_LABELS[modelName];
    if (MULTICLASS_LABELS[modelName]) return MULTICLASS_LABELS[modelName];
    return Array.from({
        length: numClasses
    }, (_, i)=>`class_${i}`);
}
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
//# sourceMappingURL=src_pages_music-insight_index_tsx-async.js.map