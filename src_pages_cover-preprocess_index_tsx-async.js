((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/cover-preprocess/index.tsx'],
{ "src/pages/cover-preprocess/components/AudioPreview.tsx": function (module, exports, __mako_require__){
"use strict";
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
/**
 * 音频预览播放器
 * 使用 HTML5 <audio> 标签播放处理后的音频
 */ const AudioPreview = ({ blob })=>{
    _s();
    const audioRef = (0, _react.useRef)(null);
    const [objectUrl, setObjectUrl] = (0, _react.useState)(null);
    (0, _react.useEffect)(()=>{
        // 创建新的 URL
        if (blob && blob.size > 0) {
            const url = URL.createObjectURL(blob);
            setObjectUrl(url);
            // 直接设置 audio 元素的 src 并加载，确保播放器可用
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.load();
            }
        }
        return ()=>{
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [
        blob
    ]);
    if (!blob) return null;
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
        direction: "vertical",
        style: {
            marginTop: 16,
            marginBottom: 16,
            width: '100%'
        },
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                strong: true,
                children: "预览"
            }, void 0, false, {
                fileName: "src/pages/cover-preprocess/components/AudioPreview.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("audio", {
                ref: audioRef,
                controls: true,
                style: {
                    width: '100%'
                },
                src: objectUrl || undefined,
                "aria-label": "音频预览",
                children: "您的浏览器不支持音频播放"
            }, void 0, false, {
                fileName: "src/pages/cover-preprocess/components/AudioPreview.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/cover-preprocess/components/AudioPreview.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
};
_s(AudioPreview, "c7q8V2W0k0fRHGkEZdUXDF2YNyY=");
_c = AudioPreview;
var _default = AudioPreview;
var _c;
$RefreshReg$(_c, "AudioPreview");
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
"src/pages/cover-preprocess/components/AudioUploader.tsx": function (module, exports, __mako_require__){
"use strict";
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
const { Dragger } = _antd.Upload;
const { Text, Paragraph } = _antd.Typography;
/** 支持的音频格式 */ const ACCEPTED_AUDIO_TYPES = [
    '.mp3',
    '.wav',
    '.flac',
    '.m4a'
];
/** 支持的 MIME 类型 */ const ACCEPTED_MIME_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/flac',
    'audio/x-flac',
    'audio/mp4',
    'audio/x-m4a'
];
/**
 * 音频上传组件
 * 支持拖拽上传和点击选择，限制音频格式和大小
 * 兼容 ProForm.Item 的 value/onChange 模式
 */ const AudioUploader = ({ value: _value, onChange, disabled = false })=>{
    /**
   * 处理文件选择
   * @param file - 用户选择的文件
   */ const handleFileSelect = (file)=>{
        // 检查文件类型
        const isValidType = ACCEPTED_MIME_TYPES.includes(file.type) || ACCEPTED_AUDIO_TYPES.some((ext)=>file.name.toLowerCase().endsWith(ext));
        if (!isValidType) {
            _antd.message.error('仅支持 MP3、WAV、FLAC、M4A 格式的音频文件');
            return;
        }
        // 检查文件大小（限制 200MB）
        const maxSize = 209715200;
        if (file.size > maxSize) {
            _antd.message.error('文件大小不能超过 200MB');
            return;
        }
        onChange === null || onChange === void 0 || onChange(file);
    };
    const uploadProps = {
        name: 'audio',
        multiple: false,
        accept: ACCEPTED_AUDIO_TYPES.join(','),
        maxCount: 1,
        disabled,
        // 阻止自动上传，改为手动处理
        beforeUpload: (file)=>{
            handleFileSelect(file);
            return false; // 阻止自动上传
        },
        onRemove: ()=>{
            onChange === null || onChange === void 0 || onChange(null);
        },
        showUploadList: {
            showRemoveIcon: true
        }
    };
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Dragger, {
        ...uploadProps,
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Typography, {
            children: [
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.UploadOutlined, {
                    style: {
                        fontSize: 48,
                        color: 'var(--ant-color-primary)'
                    }
                }, void 0, false, {
                    fileName: "src/pages/cover-preprocess/components/AudioUploader.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                    children: "点击或拖拽音频文件到此区域上传"
                }, void 0, false, {
                    fileName: "src/pages/cover-preprocess/components/AudioUploader.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                    type: "secondary",
                    children: "支持 MP3、WAV、FLAC、M4A 格式，单文件不超过 200MB"
                }, void 0, false, {
                    fileName: "src/pages/cover-preprocess/components/AudioUploader.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "src/pages/cover-preprocess/components/AudioUploader.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/cover-preprocess/components/AudioUploader.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
};
_c = AudioUploader;
var _default = AudioUploader;
var _c;
$RefreshReg$(_c, "AudioUploader");
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
"src/pages/cover-preprocess/components/ProcessProgress.tsx": function (module, exports, __mako_require__){
"use strict";
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
/** 阶段对应的颜色 */ const STAGE_COLORS = {
    decode: '#1890ff',
    stage2: '#722ed1',
    stage3: '#13c2c2',
    encode: '#fa8c16',
    done: '#52c41a'
};
/** 阶段对应的中文标签 */ const STAGE_LABELS = {
    decode: '解码中',
    stage2: '频谱混淆中',
    stage3: '变速处理中',
    encode: 'MP3 编码中',
    done: '处理完成'
};
/**
 * 处理进度组件（仪表盘式）
 * 在右侧处理结果卡片中展示，处理中显示仪表盘，完成后隐藏
 */ const ProcessProgress = ({ progress })=>{
    if (!progress) return null;
    const strokeColor = STAGE_COLORS[progress.stage] || '#1890ff';
    const stageLabel = STAGE_LABELS[progress.stage] || '处理中';
    const percent = Math.round(progress.progress);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Progress, {
                percent: percent,
                strokeColor: strokeColor
            }, void 0, false, {
                fileName: "src/pages/cover-preprocess/components/ProcessProgress.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                children: stageLabel
            }, void 0, false, {
                fileName: "src/pages/cover-preprocess/components/ProcessProgress.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/cover-preprocess/components/ProcessProgress.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
_c = ProcessProgress;
var _default = ProcessProgress;
var _c;
$RefreshReg$(_c, "ProcessProgress");
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
"src/pages/cover-preprocess/index.tsx": function (module, exports, __mako_require__){
/**
 * 参考音频预处理页面
 * 上传音频 → 选择预设 → 频谱指纹混淆 → (可选) 变速 → MP3 编码 → 下载
 * 使用 ProForm 实现表单布局，对齐 lyrics-craft 页面风格
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
var _audio = __mako_require__("src/services/audio/index.ts");
var _AudioPreview = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/cover-preprocess/components/AudioPreview.tsx"));
var _AudioUploader = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/cover-preprocess/components/AudioUploader.tsx"));
var _ProcessProgress = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/cover-preprocess/components/ProcessProgress.tsx"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
/** 预设选项配置 */ const PRESET_OPTIONS = [
    {
        value: 'none',
        label: '不处理'
    },
    {
        value: 'light',
        label: '轻度'
    },
    {
        value: 'medium',
        label: '中度'
    },
    {
        value: 'heavy',
        label: '重度（推荐）'
    }
];
/** 变速模式选项配置 */ const SPEED_MODE_OPTIONS = [
    {
        value: 'none',
        label: '不变速'
    },
    {
        value: 'slowdown',
        label: '0.5 倍'
    },
    {
        value: 'speedup',
        label: '2 倍'
    }
];
/** 默认表单值 */ const DEFAULT_FORM_VALUES = {
    preset: 'heavy',
    speedMode: 'none'
};
/** 格式化毫秒为可读时长 */ function formatProcessingTime(ms) {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
}
/** 格式化秒数为 mm:ss 格式 */ function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
/** 下载 Blob 为文件 */ function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
const CoverPreprocess = ()=>{
    _s();
    const [messageApi, contextHolder] = _antd.message.useMessage();
    const formRef = (0, _react.useRef)(null);
    const [processing, setProcessing] = (0, _react.useState)(false);
    const [progress, setProgress] = (0, _react.useState)(null);
    const [result, setResult] = (0, _react.useState)(null);
    /**
   * 处理表单提交：执行参考音频预处理流水线
   * @param values - 表单提交的值
   * @returns 是否成功完成处理
   */ const handleSubmit = async (values)=>{
        if (!values.audioFile) {
            messageApi.warning('请先上传音频文件');
            return false;
        }
        setProcessing(true);
        setProgress(null);
        setResult(null);
        try {
            const output = await (0, _audio.runCoverPreprocessPipeline)({
                audioFile: values.audioFile,
                preset: values.preset,
                speedMode: values.speedMode,
                onProgress: setProgress
            });
            setResult(output);
            setProgress(null);
            messageApi.success('预处理完成！');
            return true;
        } catch (error) {
            messageApi.error(`预处理失败：${error.message}`);
            return false;
        } finally{
            setProcessing(false);
        }
    };
    /** 下载处理结果 */ const handleDownload = ()=>{
        var _formRef_current, _formValues_audioFile;
        if (!result) return;
        // 从表单获取文件名和参数信息
        const formValues = (_formRef_current = formRef.current) === null || _formRef_current === void 0 ? void 0 : _formRef_current.getFieldsValue();
        const originalName = (formValues === null || formValues === void 0 ? void 0 : (_formValues_audioFile = formValues.audioFile) === null || _formValues_audioFile === void 0 ? void 0 : _formValues_audioFile.name) ? formValues.audioFile.name.replace(/\.[^.]+$/, '') : 'output';
        const speedLabel = (formValues === null || formValues === void 0 ? void 0 : formValues.speedMode) === 'slowdown' ? '_0.5x' : (formValues === null || formValues === void 0 ? void 0 : formValues.speedMode) === 'speedup' ? '_2x' : '';
        const filename = `${originalName}_${(formValues === null || formValues === void 0 ? void 0 : formValues.preset) || 'medium'}${speedLabel}.mp3`;
        downloadBlob(result.mp3Blob, filename);
    };
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
        children: [
            contextHolder,
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Row, {
                    gutter: [
                        24,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                            xxl: 12,
                            xl: 12,
                            lg: 12,
                            md: 24,
                            sm: 24,
                            xs: 24,
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                title: "预处理配置",
                                style: {
                                    height: '100%'
                                },
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
                                    layout: "vertical",
                                    grid: true,
                                    onFinish: handleSubmit,
                                    formRef: formRef,
                                    initialValues: DEFAULT_FORM_VALUES,
                                    submitter: {
                                        render: ()=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                                type: "primary",
                                                htmlType: "submit",
                                                loading: processing,
                                                size: "large",
                                                block: true,
                                                children: "开始预处理"
                                            }, void 0, false, {
                                                fileName: "src/pages/cover-preprocess/index.tsx",
                                                lineNumber: 170,
                                                columnNumber: 21
                                            }, void 0)
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm.Item, {
                                            name: "audioFile",
                                            label: "原始音频",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请上传原始音频文件'
                                                }
                                            ],
                                            colProps: {
                                                span: 24
                                            },
                                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_AudioUploader.default, {
                                                disabled: processing
                                            }, void 0, false, {
                                                fileName: "src/pages/cover-preprocess/index.tsx",
                                                lineNumber: 189,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/cover-preprocess/index.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormRadio.Group, {
                                            name: "preset",
                                            label: "预设强度",
                                            options: PRESET_OPTIONS.map((option)=>({
                                                    label: option.label,
                                                    value: option.value
                                                })),
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择预设强度'
                                                }
                                            ],
                                            fieldProps: {
                                                disabled: processing
                                            },
                                            colProps: {
                                                span: 24
                                            }
                                        }, void 0, false, {
                                            fileName: "src/pages/cover-preprocess/index.tsx",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormRadio.Group, {
                                            name: "speedMode",
                                            label: "变速模式",
                                            options: SPEED_MODE_OPTIONS.map((option)=>({
                                                    label: option.label,
                                                    value: option.value
                                                })),
                                            fieldProps: {
                                                disabled: processing
                                            },
                                            colProps: {
                                                span: 24
                                            }
                                        }, void 0, false, {
                                            fileName: "src/pages/cover-preprocess/index.tsx",
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/cover-preprocess/index.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/cover-preprocess/index.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                            xxl: 12,
                            xl: 12,
                            lg: 12,
                            md: 24,
                            sm: 24,
                            xs: 24,
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                title: "处理结果",
                                style: {
                                    height: '100%'
                                },
                                children: processing && progress ? /* 处理中：展示仪表盘式进度条 */ /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_ProcessProgress.default, {
                                    progress: progress
                                }, void 0, false, {
                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                    lineNumber: 229,
                                    columnNumber: 17
                                }, this) : !result ? /* 未处理：空状态 */ /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Empty, {
                                    description: "上传音频并点击「开始预处理」后，结果将在此显示",
                                    style: {
                                        marginTop: 80
                                    }
                                }, void 0, false, {
                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                    lineNumber: 232,
                                    columnNumber: 17
                                }, this) : /* 处理完成：展示结果 */ /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                    children: [
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions, {
                                            column: 1,
                                            size: "small",
                                            bordered: true,
                                            children: [
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                                                    label: "原始时长",
                                                    children: formatDuration(result.originalDuration)
                                                }, void 0, false, {
                                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                                                    label: "处理后时长",
                                                    children: formatDuration(result.processedDuration)
                                                }, void 0, false, {
                                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                                                    label: "处理耗时",
                                                    children: formatProcessingTime(result.processingTimeMs)
                                                }, void 0, false, {
                                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                                                    label: "预设强度",
                                                    children: result.preset === 'light' ? '轻度' : result.preset === 'medium' ? '中度' : '重度'
                                                }, void 0, false, {
                                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                                                    label: "输出大小",
                                                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Tag, {
                                                        children: [
                                                            (result.mp3Blob.size / 1048576).toFixed(2),
                                                            " MB"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "src/pages/cover-preprocess/index.tsx",
                                                        lineNumber: 257,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "src/pages/cover-preprocess/index.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "src/pages/cover-preprocess/index.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_AudioPreview.default, {
                                            blob: result.mp3Blob
                                        }, void 0, false, {
                                            fileName: "src/pages/cover-preprocess/index.tsx",
                                            lineNumber: 263,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                            type: "primary",
                                            size: "large",
                                            icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.DownloadOutlined, {}, void 0, false, {
                                                fileName: "src/pages/cover-preprocess/index.tsx",
                                                lineNumber: 268,
                                                columnNumber: 27
                                            }, void 0),
                                            onClick: handleDownload,
                                            children: "下载 MP3"
                                        }, void 0, false, {
                                            fileName: "src/pages/cover-preprocess/index.tsx",
                                            lineNumber: 265,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "src/pages/cover-preprocess/index.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/cover-preprocess/index.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "src/pages/cover-preprocess/index.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "src/pages/cover-preprocess/index.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(CoverPreprocess, "I5t8PPO9ZOJDNTIBUgajOBYdBVI=", false, function() {
    return [
        _antd.message.useMessage
    ];
});
_c = CoverPreprocess;
var _default = CoverPreprocess;
var _c;
$RefreshReg$(_c, "CoverPreprocess");
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
"src/services/audio/encoder/mp3-encoder.ts": function (module, exports, __mako_require__){
// lamejs 通过全局脚本加载（config.ts headScripts），从 window.lamejs 获取
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "encodeMP3", {
    enumerable: true,
    get: function() {
        return encodeMP3;
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
const Mp3Encoder = window.lamejs.Mp3Encoder;
/** 统一输出采样率 (Hz)，与PRD参考 ffmpeg 版 -ar 44100 对齐 */ const TARGET_SAMPLE_RATE = 44100;
async function encodeMP3(channels, sampleRate, kbps = 128, onProgress) {
    const numChannels = channels.length;
    /** 如原始采样率非44100，执行线性插值重采样 */ let processedChannels = channels;
    if (sampleRate !== TARGET_SAMPLE_RATE) {
        const ratio = TARGET_SAMPLE_RATE / sampleRate;
        processedChannels = channels.map((ch)=>{
            const newLen = Math.round(ch.length * ratio);
            const resampled = new Float32Array(newLen);
            for(let i = 0; i < newLen; i++){
                const srcIdx = i / ratio;
                const idx0 = Math.floor(srcIdx);
                const frac = srcIdx - idx0;
                const idx1 = Math.min(idx0 + 1, ch.length - 1);
                resampled[i] = ch[idx0] * (1 - frac) + ch[idx1] * frac;
            }
            return resampled;
        });
        sampleRate = TARGET_SAMPLE_RATE;
    }
    const totalSamples = processedChannels[0].length;
    const blockSize = 1152;
    // 每处理 N 个块后 yield 一次，防止阻塞 UI
    const YIELD_EVERY_BLOCKS = 50;
    const encoder = new Mp3Encoder(numChannels, sampleRate, kbps);
    const mp3Data = [];
    const numBlocks = Math.ceil(totalSamples / blockSize);
    /** 将所有声道统一转换为 Int16 */ const int16Channels = [];
    for(let ch = 0; ch < numChannels; ch++)int16Channels.push(await float32ToInt16(processedChannels[ch]));
    // 按块编码（支持任意声道数）
    for(let i = 0; i < numBlocks; i++){
        const start = i * blockSize;
        const end = Math.min(start + blockSize, totalSamples);
        const chunks = int16Channels.map((ch)=>ch.subarray(start, end));
        // lamejs encodeBuffer 接受 1~N 个声道参数
        const mp3buf = encoder.encodeBuffer(...chunks);
        if (mp3buf.length > 0) mp3Data.push(new Uint8Array(mp3buf));
        // 定期 yield 给事件循环，更新进度
        if (i % YIELD_EVERY_BLOCKS === 0) {
            onProgress === null || onProgress === void 0 || onProgress(Math.round(i / numBlocks * 100));
            await yieldToEventLoop();
        }
    }
    // 刷新编码器缓冲区
    const finalBuf = encoder.flush();
    if (finalBuf.length > 0) mp3Data.push(new Uint8Array(finalBuf));
    onProgress === null || onProgress === void 0 || onProgress(100);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Blob(mp3Data, {
        type: "audio/mpeg"
    });
}
/**
 * 将 Float32Array 音频数据转换为 Int16Array（异步分块，避免阻塞 UI）
 * Float32 范围 [-1, 1] → Int16 范围 [-32768, 32767]
 * @param input - Float32Array 音频数据
 * @returns Int16Array 音频数据
 */ async function float32ToInt16(input) {
    const CHUNK_SIZE = 65536; // 每 64K 个采样 yield 一次
    const output = new Int16Array(input.length);
    for(let offset = 0; offset < input.length; offset += CHUNK_SIZE){
        const end = Math.min(offset + CHUNK_SIZE, input.length);
        for(let i = offset; i < end; i++){
            const clamped = Math.max(-1, Math.min(1, input[i]));
            output[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
        }
        await yieldToEventLoop();
    }
    return output;
}
/**
 * 通过 setTimeout 让出事件循环，防止阻塞 UI
 */ function yieldToEventLoop() {
    return new Promise((resolve)=>setTimeout(resolve, 0));
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
"src/services/audio/fft/webfft-backend.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "WebFFTBackend", {
    enumerable: true,
    get: function() {
        return WebFFTBackend;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _webfft = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/webfft@1.0.3/node_modules/webfft/lib/main.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class WebFFTBackend {
    fftSize;
    fft;
    constructor(fftSize){
        this.fftSize = fftSize;
        this.fft = new _webfft.default(fftSize);
    }
    /**
   * 实数正向 FFT
   * 返回全频谱复数值 [real0, imag0, real1, imag1, ..., real{N-1}, imag{N-1}]
   * 长度 = fftSize * 2
   */ rfft(input) {
        // 构建复数输入：实部 = 输入值，虚部 = 0
        const complex = new Float32Array(this.fftSize * 2);
        for(let i = 0; i < this.fftSize; i++){
            complex[2 * i] = input[i];
            complex[2 * i + 1] = 0;
        }
        return this.fft.fft(complex);
    }
    /**
   * 实数逆向 FFT
   * 从全频谱恢复时域信号，通过 IFFT = conj(FFT(conj(X))) / N
   * @param spectrum - 全频谱 [real0, imag0, ..., real{N-1}, imag{N-1}]，长度 = fftSize * 2
   * @param outputLength - 输出信号长度
   */ irfft(spectrum, outputLength) {
        // 步骤 1: 共轭频谱（虚部取反）
        const conjugated = new Float32Array(spectrum.length);
        for(let i = 0; i < this.fftSize; i++){
            conjugated[2 * i] = spectrum[2 * i]; // 实部不变
            conjugated[2 * i + 1] = -spectrum[2 * i + 1]; // 虚部取反
        }
        // 步骤 2: 正向 FFT
        const fftResult = this.fft.fft(conjugated);
        // 步骤 3: 共轭 + 除以 N，取实部
        const result = new Float32Array(outputLength);
        for(let i = 0; i < outputLength; i++)result[i] = fftResult[2 * i] / this.fftSize;
        return result;
    }
    /** 释放 FFT 引擎资源 */ dispose() {
        this.fft.dispose();
    }
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
"src/services/audio/index.ts": function (module, exports, __mako_require__){
/**
 * 参考音频预处理服务统一导出
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
    PRESETS: function() {
        return _presets.PRESETS;
    },
    WebFFTBackend: function() {
        return _webfftbackend.WebFFTBackend;
    },
    encodeMP3: function() {
        return _mp3encoder.encodeMP3;
    },
    processStage2: function() {
        return _stage2.processStage2;
    },
    processStage3: function() {
        return _stage3.processStage3;
    },
    runCoverPreprocessPipeline: function() {
        return _pipeline.runCoverPreprocessPipeline;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _pipeline = __mako_require__("src/services/audio/pipeline.ts");
var _stage2 = __mako_require__("src/services/audio/stage2/index.ts");
var _stage3 = __mako_require__("src/services/audio/stage3/index.ts");
var _mp3encoder = __mako_require__("src/services/audio/encoder/mp3-encoder.ts");
var _presets = __mako_require__("src/services/audio/presets.ts");
var _webfftbackend = __mako_require__("src/services/audio/fft/webfft-backend.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
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
"src/services/audio/pipeline.ts": function (module, exports, __mako_require__){
/**
 * 参考音频预处理完整流水线
 * 顺序执行：音频解码 → Stage 2 频谱混淆 → (可选) Stage 3 变速 → MP3 编码
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "runCoverPreprocessPipeline", {
    enumerable: true,
    get: function() {
        return runCoverPreprocessPipeline;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _stage2 = __mako_require__("src/services/audio/stage2/index.ts");
var _stage3 = __mako_require__("src/services/audio/stage3/index.ts");
var _mp3encoder = __mako_require__("src/services/audio/encoder/mp3-encoder.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
async function runCoverPreprocessPipeline(input) {
    var _input_onProgress, _input_onProgress1, _input_onProgress2, _input_onProgress3;
    // 阶段 0: 音频解码
    const startTime = performance.now();
    (_input_onProgress = input.onProgress) === null || _input_onProgress === void 0 || _input_onProgress.call(input, {
        stage: "decode",
        progress: 0,
        label: "解码中"
    });
    const audioCtx = new AudioContext();
    const arrayBuffer = await input.audioFile.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    (_input_onProgress1 = input.onProgress) === null || _input_onProgress1 === void 0 || _input_onProgress1.call(input, {
        stage: "decode",
        progress: 10,
        label: "解码完成"
    });
    // Stage 2: 频谱指纹混淆（占总进度 10%~65%）
    let obfuscated;
    if (input.preset === "none") {
        var _input_onProgress4;
        // 不处理模式：跳过 Stage 2，直接提取原始声道数据
        const channels = audioBuffer.numberOfChannels;
        obfuscated = [];
        for(let ch = 0; ch < channels; ch++)obfuscated.push(audioBuffer.getChannelData(ch).slice());
        (_input_onProgress4 = input.onProgress) === null || _input_onProgress4 === void 0 || _input_onProgress4.call(input, {
            stage: "stage2",
            progress: 65,
            label: "跳过频谱混淆"
        });
    } else {
        var _input_onProgress5, _input_onProgress6;
        (_input_onProgress5 = input.onProgress) === null || _input_onProgress5 === void 0 || _input_onProgress5.call(input, {
            stage: "stage2",
            progress: 10,
            label: "频谱混淆中"
        });
        obfuscated = await (0, _stage2.processStage2)(audioBuffer, input.preset, (stage2Percent)=>{
            var _input_onProgress;
            // 将 Stage 2 内部进度 0~100 映射到总进度 10~65
            const totalProgress = 10 + Math.round(stage2Percent * 0.55);
            (_input_onProgress = input.onProgress) === null || _input_onProgress === void 0 || _input_onProgress.call(input, {
                stage: "stage2",
                progress: totalProgress,
                label: "频谱混淆中"
            });
        });
        (_input_onProgress6 = input.onProgress) === null || _input_onProgress6 === void 0 || _input_onProgress6.call(input, {
            stage: "stage2",
            progress: 65,
            label: "频谱混淆完成"
        });
    }
    // Stage 3: 保音调变速（根据 speedMode 决定）
    let processed = obfuscated;
    let speedFactor = 1.0;
    if (input.speedMode === "slowdown") {
        var _input_onProgress7, _input_onProgress8;
        (_input_onProgress7 = input.onProgress) === null || _input_onProgress7 === void 0 || _input_onProgress7.call(input, {
            stage: "stage3",
            progress: 65,
            label: "0.5x 降速中"
        });
        processed = (0, _stage3.processStage3)(obfuscated, audioBuffer.sampleRate, 0.5);
        speedFactor = 2.0;
        (_input_onProgress8 = input.onProgress) === null || _input_onProgress8 === void 0 || _input_onProgress8.call(input, {
            stage: "stage3",
            progress: 95,
            label: "0.5x 降速完成"
        });
    } else if (input.speedMode === "speedup") {
        var _input_onProgress9, _input_onProgress10;
        (_input_onProgress9 = input.onProgress) === null || _input_onProgress9 === void 0 || _input_onProgress9.call(input, {
            stage: "stage3",
            progress: 65,
            label: "2x 加速中"
        });
        processed = (0, _stage3.processStage3)(obfuscated, audioBuffer.sampleRate, 2.0);
        speedFactor = 0.5;
        (_input_onProgress10 = input.onProgress) === null || _input_onProgress10 === void 0 || _input_onProgress10.call(input, {
            stage: "stage3",
            progress: 95,
            label: "2x 加速完成"
        });
    }
    // 阶段 4: MP3 编码
    const encodeStartProgress = input.speedMode !== "none" ? 95 : 65;
    (_input_onProgress2 = input.onProgress) === null || _input_onProgress2 === void 0 || _input_onProgress2.call(input, {
        stage: "encode",
        progress: encodeStartProgress,
        label: "MP3 编码中"
    });
    const mp3Blob = await (0, _mp3encoder.encodeMP3)(processed, audioBuffer.sampleRate, 128, (encodeProgress)=>{
        var _input_onProgress;
        // 将编码进度 0-100 映射到总进度区间
        const totalProgress = encodeStartProgress + Math.round(encodeProgress * (100 - encodeStartProgress) / 100);
        (_input_onProgress = input.onProgress) === null || _input_onProgress === void 0 || _input_onProgress.call(input, {
            stage: "encode",
            progress: totalProgress,
            label: "MP3 编码中"
        });
    });
    (_input_onProgress3 = input.onProgress) === null || _input_onProgress3 === void 0 || _input_onProgress3.call(input, {
        stage: "done",
        progress: 100,
        label: "完成！"
    });
    const processingTimeMs = performance.now() - startTime;
    audioCtx.close();
    return {
        mp3Blob,
        originalDuration: audioBuffer.duration,
        processedDuration: audioBuffer.duration * speedFactor,
        preset: input.preset,
        processingTimeMs
    };
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
"src/services/audio/presets.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "PRESETS", {
    enumerable: true,
    get: function() {
        return PRESETS;
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
const PRESETS = {
    /** 不处理：跳过 Stage 2 频谱混淆，直接编码 */ none: null,
    light: {
        highpass_hz: 50,
        lowpass_hz: 16000,
        eq_bands: [
            {
                freq: 65,
                gain: 1.0
            },
            {
                freq: 92,
                gain: 1.0
            },
            {
                freq: 131,
                gain: 1.2
            },
            {
                freq: 185,
                gain: 1.3
            },
            {
                freq: 262,
                gain: 1.3
            },
            {
                freq: 370,
                gain: 1.2
            },
            {
                freq: 523,
                gain: 1.0
            },
            {
                freq: 740,
                gain: 1.0
            },
            {
                freq: 1047,
                gain: 0.9
            },
            {
                freq: 1480,
                gain: 0.9
            },
            {
                freq: 2093,
                gain: 0.8
            },
            {
                freq: 2960,
                gain: 0.8
            },
            {
                freq: 4186,
                gain: 0.9
            },
            {
                freq: 5920,
                gain: 0.9
            },
            {
                freq: 8372,
                gain: 1.0
            },
            {
                freq: 11840,
                gain: 0.9
            },
            {
                freq: 16744,
                gain: 0.8
            },
            {
                freq: 20000,
                gain: 0.7
            }
        ],
        threshold: 0.125,
        ratio: 3,
        noise_floor_db: -65,
        phaser: null,
        rubberband: false,
        rubberband_phase_jitter: 0.3,
        rubberband_mag_jitter: 0.05,
        /** 频域峰值位置微扰 — light 模式启用，偏移范围小 */ spectral_peak_shift: {
            enabled: true,
            shift_range: 1,
            attenuation: 0.4
        },
        /** 频谱包络随机化 — light 模式启用，混合范围窄 */ spectral_envelope: {
            enabled: true,
            band_width: 16,
            mix_min: 0.4,
            mix_max: 0.6
        },
        /** 立体声通道去相关 — light 模式启用，参数保守 */ stereo_decorrelation: {
            enabled: true,
            delay_ms: 5,
            phase_offset: 0.1
        }
    },
    medium: {
        highpass_hz: 40,
        lowpass_hz: 15000,
        eq_bands: [
            {
                freq: 65,
                gain: 0.6
            },
            {
                freq: 92,
                gain: 0.8
            },
            {
                freq: 131,
                gain: 1.4
            },
            {
                freq: 185,
                gain: 1.5
            },
            {
                freq: 262,
                gain: 1.4
            },
            {
                freq: 370,
                gain: 1.2
            },
            {
                freq: 523,
                gain: 1.0
            },
            {
                freq: 740,
                gain: 0.9
            },
            {
                freq: 1047,
                gain: 0.8
            },
            {
                freq: 1480,
                gain: 0.7
            },
            {
                freq: 2093,
                gain: 0.6
            },
            {
                freq: 2960,
                gain: 0.7
            },
            {
                freq: 4186,
                gain: 0.8
            },
            {
                freq: 5920,
                gain: 0.9
            },
            {
                freq: 8372,
                gain: 0.9
            },
            {
                freq: 11840,
                gain: 0.8
            },
            {
                freq: 16744,
                gain: 0.7
            },
            {
                freq: 20000,
                gain: 0.5
            }
        ],
        threshold: 0.1,
        ratio: 4,
        noise_floor_db: -60,
        /** Phaser 相位偏移 — 对齐 ffmpeg_spectral_obfuscator.py medium 预设 */ phaser: {
            in_gain: 0.5,
            out_gain: 0.8,
            delay: 2.0,
            decay: 0.3,
            speed: 0.3,
            type: "triangular"
        },
        rubberband: false,
        rubberband_phase_jitter: 0.5,
        rubberband_mag_jitter: 0.08,
        /** 频域峰值位置微扰 — medium 模式，偏移范围适中 */ spectral_peak_shift: {
            enabled: true,
            shift_range: 2,
            attenuation: 0.3
        },
        /** 频谱包络随机化 — medium 模式，混合范围适中 */ spectral_envelope: {
            enabled: true,
            band_width: 12,
            mix_min: 0.35,
            mix_max: 0.65
        },
        /** 立体声通道去相关 — medium 模式 */ stereo_decorrelation: {
            enabled: true,
            delay_ms: 10,
            phase_offset: 0.2
        }
    },
    heavy: {
        highpass_hz: 60,
        lowpass_hz: 14000,
        eq_bands: [
            {
                freq: 65,
                gain: 0.3
            },
            {
                freq: 92,
                gain: 0.5
            },
            {
                freq: 131,
                gain: 1.6
            },
            {
                freq: 185,
                gain: 1.8
            },
            {
                freq: 262,
                gain: 1.6
            },
            {
                freq: 370,
                gain: 1.3
            },
            {
                freq: 523,
                gain: 1.0
            },
            {
                freq: 740,
                gain: 0.8
            },
            {
                freq: 1047,
                gain: 0.6
            },
            {
                freq: 1480,
                gain: 0.5
            },
            {
                freq: 2093,
                gain: 0.4
            },
            {
                freq: 2960,
                gain: 0.6
            },
            {
                freq: 4186,
                gain: 0.7
            },
            {
                freq: 5920,
                gain: 0.8
            },
            {
                freq: 8372,
                gain: 0.8
            },
            {
                freq: 11840,
                gain: 0.6
            },
            {
                freq: 16744,
                gain: 0.5
            },
            {
                freq: 20000,
                gain: 0.3
            }
        ],
        threshold: 0.063,
        ratio: 6,
        noise_floor_db: -55,
        /** Phaser 相位偏移 — 对齐 ffmpeg_spectral_obfuscator.py heavy 预设 */ phaser: {
            in_gain: 0.6,
            out_gain: 0.85,
            delay: 2.5,
            decay: 0.4,
            speed: 0.4,
            type: "triangular"
        },
        /** Rubberband 谱涂抹 — 对齐 ffmpeg 版 heavy 启用 rubberband_resample */ rubberband: true,
        rubberband_phase_jitter: 0.6,
        rubberband_mag_jitter: 0.1,
        /** 频域峰值位置微扰 — heavy 模式，偏移范围最大 */ spectral_peak_shift: {
            enabled: true,
            shift_range: 3,
            attenuation: 0.2
        },
        /** 频谱包络随机化 — heavy 模式，混合范围最宽 */ spectral_envelope: {
            enabled: true,
            band_width: 8,
            mix_min: 0.3,
            mix_max: 0.7
        },
        /** 立体声通道去相关 — heavy 模式，参数最激进 */ stereo_decorrelation: {
            enabled: true,
            delay_ms: 20,
            phase_offset: 0.4
        }
    }
};
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
"src/services/audio/stage2/compressor.ts": function (module, exports, __mako_require__){
/**
 * 动态压缩（时域，逐采样点，线性阈值）
 * 当采样点幅度超过阈值时，按压缩比进行衰减
 * @param signal - 输入/输出时域信号
 * @param threshold - 线性幅度阈值（如 0.125）
 * @param ratio - 压缩比（如 3.0 表示 3:1）
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applyCompressor", {
    enumerable: true,
    get: function() {
        return applyCompressor;
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
function applyCompressor(signal, threshold, ratio) {
    for(let i = 0; i < signal.length; i++){
        const absVal = Math.abs(signal[i]);
        if (absVal > threshold) {
            // 超过阈值的部分按压缩比衰减
            const sign = signal[i] >= 0 ? 1 : -1;
            signal[i] = sign * (threshold + (absVal - threshold) / ratio);
        }
    }
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
"src/services/audio/stage2/eq.ts": function (module, exports, __mako_require__){
"use strict";
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
    applyEqFilter: function() {
        return applyEqFilter;
    },
    buildEqGainCurve: function() {
        return buildEqGainCurve;
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
function buildEqGainCurve(sampleRate, fftSize, eqBands, highpassHz, lowpassHz) {
    const curve = new Float32Array(fftSize);
    const halfLen = fftSize / 2 + 1;
    // 正频率部分（DC 到 Nyquist）
    for(let i = 0; i < halfLen; i++){
        const freq = i * sampleRate / fftSize;
        // 高低通滤波：截止范围外的频率分量置零
        if (highpassHz !== undefined && freq < highpassHz) {
            curve[i] = 0;
            continue;
        }
        if (lowpassHz !== undefined && freq > lowpassHz) {
            curve[i] = 0;
            continue;
        }
        curve[i] = interpolateGain(freq, eqBands);
    }
    // 负频率部分（Hermitian 对称）
    for(let i = halfLen; i < fftSize; i++)curve[i] = curve[fftSize - i];
    return curve;
}
/**
 * 线性插值计算指定频率的增益值
 * 在 EQ 频段之间进行线性插值，边界外使用最近频段的增益值
 * @param freq - 目标频率（Hz）
 * @param bands - EQ 频段配置数组
 * @returns 插值后的增益值
 */ function interpolateGain(freq, bands) {
    if (bands.length === 0) return 1.0;
    // 低于第一个频段，使用第一个频段的增益
    if (freq <= bands[0].freq) return bands[0].gain;
    // 高于最后一个频段，使用最后一个频段的增益
    if (freq >= bands[bands.length - 1].freq) return bands[bands.length - 1].gain;
    // 在频段之间进行线性插值
    for(let i = 0; i < bands.length - 1; i++)if (freq >= bands[i].freq && freq <= bands[i + 1].freq) {
        const t = (freq - bands[i].freq) / (bands[i + 1].freq - bands[i].freq);
        return bands[i].gain + t * (bands[i + 1].gain - bands[i].gain);
    }
    return 1.0;
}
function applyEqFilter(spectrum, eqCurve) {
    const binCount = eqCurve.length;
    for(let i = 0; i < binCount; i++){
        const gain = eqCurve[i];
        spectrum[2 * i] *= gain; // 实部 × 增益
        spectrum[2 * i + 1] *= gain; // 虚部 × 增益
    }
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
"src/services/audio/stage2/index.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "processStage2", {
    enumerable: true,
    get: function() {
        return processStage2;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _webfftbackend = __mako_require__("src/services/audio/fft/webfft-backend.ts");
var _presets = __mako_require__("src/services/audio/presets.ts");
var _eq = __mako_require__("src/services/audio/stage2/eq.ts");
var _compressor = __mako_require__("src/services/audio/stage2/compressor.ts");
var _noise = __mako_require__("src/services/audio/stage2/noise.ts");
var _limiter = __mako_require__("src/services/audio/stage2/limiter.ts");
var _phaser = __mako_require__("src/services/audio/stage2/phaser.ts");
var _loudnorm = __mako_require__("src/services/audio/stage2/loudnorm.ts");
var _rubberband = __mako_require__("src/services/audio/stage2/rubberband.ts");
var _spectralpeakshift = __mako_require__("src/services/audio/stage2/spectral-peak-shift.ts");
var _spectralenveloperandomization = __mako_require__("src/services/audio/stage2/spectral-envelope-randomization.ts");
var _stereodecorrelation = __mako_require__("src/services/audio/stage2/stereo-decorrelation.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
/** STFT FFT 帧大小（2^13 = 8192，webfft 上限为 131072） */ const FFT_SIZE = 8192;
/** Stage 2 日志前缀 */ const LOG_PREFIX = '[Stage2]';
/**
 * 让出主线程，使 React 有机会处理状态更新并重渲染
 * @returns Promise 在下一个事件循环 tick 时 resolve
 */ function yieldToMain() {
    return new Promise((resolve)=>setTimeout(resolve, 0));
}
async function processStage2(audioBuffer, preset, onProgress) {
    const sr = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;
    const sigLen = audioBuffer.length;
    const cfg = _presets.PRESETS[preset];
    if (!cfg) throw new Error(`processStage2: 不支持 preset=${preset}，请勿对 none 模式调用此函数`);
    console.log(`${LOG_PREFIX} 开始频谱混淆 | preset=${preset} sr=${sr}Hz channels=${channels} samples=${sigLen} duration=${(sigLen / sr).toFixed(2)}s`);
    // ═══ 初始化 ═══
    try {
        // 初始化 FFT 引擎（固定大小 8192）
        const fft = new _webfftbackend.WebFFTBackend(FFT_SIZE);
        // 预计算 EQ 增益曲线（基于 STFT 帧大小，包含高低通滤波）
        const eqCurve = (0, _eq.buildEqGainCurve)(sr, FFT_SIZE, cfg.eq_bands, cfg.highpass_hz, cfg.lowpass_hz);
        // 预生成 Hann 窗
        const hannWindow = generateHannWindow(FFT_SIZE);
        // 计算总帧数
        const numFrames = Math.ceil(sigLen / HOP_SIZE) + (OVERLAP_FACTOR - 1);
        // 预判断频域扩展模块是否启用
        const peakShiftEnabled = cfg.spectral_peak_shift !== null && cfg.spectral_peak_shift.enabled;
        const envelopeRandEnabled = cfg.spectral_envelope !== null && cfg.spectral_envelope.enabled;
        console.log(`${LOG_PREFIX} [Phase-Init] 初始化完成 | FFT=${FFT_SIZE} hop=${HOP_SIZE} frames=${numFrames} highpass=${cfg.highpass_hz}Hz lowpass=${cfg.lowpass_hz}Hz threshold=${cfg.threshold} ratio=${cfg.ratio} noiseFloor=${cfg.noise_floor_db}dB phaser=${cfg.phaser ? 'ON' : 'OFF'} rubberband=${cfg.rubberband} peakShift=${peakShiftEnabled ? 'ON' : 'OFF'} envelopeRand=${envelopeRandEnabled ? 'ON' : 'OFF'}`);
        const outputChannels = [];
        for(let ch = 0; ch < channels; ch++){
            const input = audioBuffer.getChannelData(ch);
            console.log(`${LOG_PREFIX} [Channel-${ch}] 开始处理 ${input.length} 个采样点`);
            // 重叠相加缓冲区
            const olaBuffer = new Float32Array(numFrames * HOP_SIZE + FFT_SIZE);
            /** 时域信号（在 Phase 1 中赋值，后续所有 Phase 共享） */ let timeDomain;
            // ═══ Phase 1: STFT 频域处理（EQ + 峰值微扰 + 包络随机化）═══
            // 峰值位置微扰和频谱包络随机化直接在 STFT 循环中对频谱操作，
            // 避免额外的 STFT 遍历，零性能开销
            // 按批次处理帧，每批处理后让出主线程，确保 React 能重渲染进度条
            try {
                const t0 = performance.now();
                // 每批处理的帧数：约占总帧数的 5%，确保每批处理约 50ms
                const batchSize = Math.max(1, Math.floor(numFrames / 20));
                for(let batchStart = 0; batchStart < numFrames; batchStart += batchSize){
                    const batchEnd = Math.min(batchStart + batchSize, numFrames);
                    for(let frame = batchStart; frame < batchEnd; frame++){
                        const startSample = frame * HOP_SIZE;
                        // 构造加窗帧
                        const frameBuffer = new Float32Array(FFT_SIZE);
                        for(let i = 0; i < FFT_SIZE; i++){
                            const srcIdx = startSample + i;
                            if (srcIdx >= 0 && srcIdx < sigLen) frameBuffer[i] = input[srcIdx] * hannWindow[i];
                        }
                        // FFT → 频域
                        const spectrum = fft.rfft(frameBuffer);
                        // EQ 频域滤波（含高低通）
                        (0, _eq.applyEqFilter)(spectrum, eqCurve);
                        // 频域峰值位置微扰（直接操作频谱，零额外 STFT 开销）
                        if (peakShiftEnabled && cfg.spectral_peak_shift) (0, _spectralpeakshift.applySpectralPeakShiftOnSpectrum)(spectrum, FFT_SIZE, cfg.spectral_peak_shift);
                        // 频谱包络随机化（直接操作频谱，零额外 STFT 开销）
                        if (envelopeRandEnabled && cfg.spectral_envelope) (0, _spectralenveloperandomization.applySpectralEnvelopeRandomizationOnSpectrum)(spectrum, FFT_SIZE, cfg.spectral_envelope);
                        // IFFT → 回时域
                        const ifftResult = fft.irfft(spectrum, FFT_SIZE);
                        // 重叠相加（OLA）
                        for(let i = 0; i < FFT_SIZE; i++){
                            const destIdx = startSample + i;
                            if (destIdx >= 0) olaBuffer[destIdx] += ifftResult[i];
                        }
                    }
                    // 每批处理后上报进度并让出主线程
                    const batchProgress = Math.round(batchEnd / numFrames * 70);
                    onProgress === null || onProgress === void 0 || onProgress(ch > 0 ? 70 + batchProgress : batchProgress);
                    await yieldToMain();
                }
                // 截取原始信号长度
                timeDomain = olaBuffer.slice(0, sigLen);
                const t1 = performance.now();
                console.log(`${LOG_PREFIX} [Phase-1/STFT+EQ+PeakShift+EnvelopeRand] 完成 | channel=${ch} 耗时${(t1 - t0).toFixed(1)}ms frames=${numFrames}`);
            } catch (err) {
                console.error(`${LOG_PREFIX} [Phase-1/STFT+EQ+PeakShift+EnvelopeRand] 失败`, err);
                throw err;
            }
            // ═══ Phase 2: 动态压缩（时域）— 对齐 CUDA 版 ═══
            try {
                const t0 = performance.now();
                (0, _compressor.applyCompressor)(timeDomain, cfg.threshold, cfg.ratio);
                const t1 = performance.now();
                console.log(`${LOG_PREFIX} [Phase-2/Compressor] 完成 | channel=${ch} threshold=${cfg.threshold} ratio=${cfg.ratio} 耗时${(t1 - t0).toFixed(1)}ms`);
            } catch (err) {
                console.error(`${LOG_PREFIX} [Phase-2/Compressor] 失败`, err);
                throw err;
            }
            // ═══ Phase 3: 相位偏移 Phaser（时域）— 对齐 ffmpeg aphaser ═══
            if (cfg.phaser !== null) try {
                const t0 = performance.now();
                (0, _phaser.applyPhaser)(timeDomain, cfg.phaser, sr);
                const t1 = performance.now();
                console.log(`${LOG_PREFIX} [Phase-3/Phaser] 完成 | channel=${ch} in_gain=${cfg.phaser.in_gain} out_gain=${cfg.phaser.out_gain} delay=${cfg.phaser.delay}ms decay=${cfg.phaser.decay} speed=${cfg.phaser.speed} type=${cfg.phaser.type} 耗时${(t1 - t0).toFixed(1)}ms`);
            } catch (err) {
                console.error(`${LOG_PREFIX} [Phase-3/Phaser] 失败`, err);
                throw err;
            }
            else console.log(`${LOG_PREFIX} [Phase-3/Phaser] 跳过 | preset=${preset} 未配置 phaser`);
            // ═══ Phase 4: 谱涂抹 Rubberband（仅 Heavy）— 对齐 ffmpeg rubberband ═══
            if (cfg.rubberband) try {
                const t0 = performance.now();
                (0, _rubberband.applyRubberbandSpectralSmear)(timeDomain, sr, cfg.rubberband_phase_jitter, cfg.rubberband_mag_jitter);
                const t1 = performance.now();
                onProgress === null || onProgress === void 0 || onProgress(85);
                await yieldToMain();
                console.log(`${LOG_PREFIX} [Phase-4/Rubberband] 完成 | channel=${ch} phaseJitter=${cfg.rubberband_phase_jitter}rad magJitter=${cfg.rubberband_mag_jitter} 耗时${(t1 - t0).toFixed(1)}ms`);
            } catch (err) {
                console.error(`${LOG_PREFIX} [Phase-4/Rubberband] 失败`, err);
                throw err;
            }
            else console.log(`${LOG_PREFIX} [Phase-4/Rubberband] 跳过 | preset=${preset} rubberband=false`);
            // ═══ Phase 5: 本底噪声注入（粉红噪声）— 对齐 CUDA 版 ═══
            try {
                const t0 = performance.now();
                (0, _noise.applyNoiseFloor)(timeDomain, cfg.noise_floor_db);
                const t1 = performance.now();
                onProgress === null || onProgress === void 0 || onProgress(90);
                await yieldToMain();
                console.log(`${LOG_PREFIX} [Phase-5/PinkNoise] 完成 | channel=${ch} noiseFloorDb=${cfg.noise_floor_db}dB 耗时${(t1 - t0).toFixed(1)}ms`);
            } catch (err) {
                console.error(`${LOG_PREFIX} [Phase-5/PinkNoise] 失败`, err);
                throw err;
            }
            // ═══ Phase 6: 响度归一化 Loudnorm — 对齐 ffmpeg loudnorm ═══
            try {
                const t0 = performance.now();
                (0, _loudnorm.applyLoudnorm)(timeDomain, sr);
                const t1 = performance.now();
                onProgress === null || onProgress === void 0 || onProgress(95);
                await yieldToMain();
                console.log(`${LOG_PREFIX} [Phase-6/Loudnorm] 完成 | channel=${ch} target=-16LUFS TP=-1.5dBTP 耗时${(t1 - t0).toFixed(1)}ms`);
            } catch (err) {
                console.error(`${LOG_PREFIX} [Phase-6/Loudnorm] 失败`, err);
                throw err;
            }
            // ═══ Phase 7: Peak Limiter 保护 ═══
            try {
                const t0 = performance.now();
                (0, _limiter.applyPeakLimiter)(timeDomain);
                const t1 = performance.now();
                // 计算最终峰值用于日志
                let finalPeak = 0;
                for(let i = 0; i < timeDomain.length; i++){
                    const absVal = Math.abs(timeDomain[i]);
                    if (absVal > finalPeak) finalPeak = absVal;
                }
                console.log(`${LOG_PREFIX} [Phase-7/PeakLimiter] 完成 | channel=${ch} peak=${finalPeak.toFixed(4)} 耗时${(t1 - t0).toFixed(1)}ms`);
            } catch (err) {
                console.error(`${LOG_PREFIX} [Phase-7/PeakLimiter] 失败`, err);
                throw err;
            }
            outputChannels.push(timeDomain);
        }
        // ═══ Phase 8: 立体声通道去相关 — 对抗双通道联合指纹检测 ═══
        // 必须在所有声道独立处理完成后执行，因为它需要同时操作左右声道
        if (cfg.stereo_decorrelation && cfg.stereo_decorrelation.enabled && outputChannels.length >= 2) try {
            const t0 = performance.now();
            (0, _stereodecorrelation.applyStereoDecorrelation)(outputChannels, sr, cfg.stereo_decorrelation);
            const t1 = performance.now();
            console.log(`${LOG_PREFIX} [Phase-8/StereoDecorrelation] 完成 | delay_ms=${cfg.stereo_decorrelation.delay_ms} phase_offset=${cfg.stereo_decorrelation.phase_offset} 耗时${(t1 - t0).toFixed(1)}ms`);
        } catch (err) {
            console.error(`${LOG_PREFIX} [Phase-8/StereoDecorrelation] 失败`, err);
            throw err;
        }
        else console.log(`${LOG_PREFIX} [Phase-8/StereoDecorrelation] 跳过 | stereo_decorrelation=disabled 或单声道`);
        fft.dispose();
        console.log(`${LOG_PREFIX} 全部处理完成 | channels=${outputChannels.length}`);
        return outputChannels;
    } catch (err) {
        console.error(`${LOG_PREFIX} 频谱混淆流程异常中断`, err);
        throw err;
    }
}
/** 帧重叠因子：4 表示 75% 重叠，满足 COLA 约束 */ const OVERLAP_FACTOR = 4;
/** 帧跳跃步长 */ const HOP_SIZE = FFT_SIZE / OVERLAP_FACTOR; // 2048
/**
 * 生成 Hann 窗
 * @param size - 窗长度
 * @returns Hann 窗系数数组
 */ function generateHannWindow(size) {
    const window = new Float32Array(size);
    for(let i = 0; i < size; i++)window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (size - 1)));
    return window;
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
"src/services/audio/stage2/limiter.ts": function (module, exports, __mako_require__){
/**
 * Peak Limiter
 * 峰值 > 0.99 时，整体乘以 (0.95 / peak) 进行限幅
 * 防止削波失真
 * @param signal - 输入/输出时域信号
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applyPeakLimiter", {
    enumerable: true,
    get: function() {
        return applyPeakLimiter;
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
function applyPeakLimiter(signal) {
    // 查找峰值
    let peak = 0;
    for(let i = 0; i < signal.length; i++){
        const absVal = Math.abs(signal[i]);
        if (absVal > peak) peak = absVal;
    }
    // 峰值超过阈值时进行限幅
    if (peak > 0.99) {
        const scale = 0.95 / peak;
        for(let i = 0; i < signal.length; i++)signal[i] *= scale;
    }
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
"src/services/audio/stage2/loudnorm.ts": function (module, exports, __mako_require__){
/**
 * EBU R128 响度归一化（简化版）
 * 对齐 ffmpeg loudnorm=I=-16:LRA=11:TP=-1.5 参数
 *
 * 实现原理：
 *   1. 计算当前信号的 LUFS（响度单位全尺度）
 *   2. 计算峰值电平
 *   3. 按目标响度和真实峰值动态范围进行增益调整
 *   4. 确保输出不超过 True Peak 上限
 *
 * 目标参数（与PRD参考 ffmpeg 版一致）：
 *   - 集成响度 (I): -16 LUFS
 *   - 响度范围 (LRA): 11 LU
 *   - 真实峰值 (TP): -1.5 dBTP
 *
 * @param signal - 输入/输出时域信号
 * @param sampleRate - 采样率（用于 K-weighting 滤波）
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applyLoudnorm", {
    enumerable: true,
    get: function() {
        return applyLoudnorm;
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
function applyLoudnorm(signal, sampleRate = 44100) {
    const len = signal.length;
    /** EBU R128 目标集成响度 (LUFS) */ const TARGET_I = -16;
    /** EBU R128 目标真实峰值上限 (dBTP) */ const TARGET_TP_DB = -1.5;
    // Step 1: 计算 K-weighted RMS（EBU R128 的核心：高频预加重 + 低频高通）
    let weightedSum = 0;
    for(let i = 0; i < len; i++){
        const val = signal[i];
        // 简化的 K-filtering 近似：直接平方（完整版需要 IIR 高通 + A-加权）
        weightedSum += val * val;
    }
    const rmsLinear = Math.sqrt(weightedSum / len);
    // 转换为 dBFS（避免 log(0)）
    const rmsDb = rmsLinear > 1e-10 ? 20 * Math.log10(rmsLinear) : -200;
    // Step 2: 计算峰值
    let peakAbs = 0;
    for(let i = 0; i < len; i++){
        const absVal = Math.abs(signal[i]);
        if (absVal > peakAbs) peakAbs = absVal;
    }
    const peakDb = peakAbs > 1e-10 ? 20 * Math.log10(peakAbs) : -200;
    // Step 3: 计算所需增益
    // 增益 = 目标响度 - 当前响度
    const gainDb = TARGET_I - rmsDb;
    // Step 4: 应用增益，但受限于 True Peak 上限
    // 最终峰值不能超过 TP 上限
    const maxGainDb = TARGET_TP_DB - peakDb; // 允许的最大增益
    const finalGainDb = Math.min(gainDb, maxGainDb);
    const gainLinear = Math.pow(10, finalGainDb / 20);
    // Step 5: 应用增益到信号
    for(let i = 0; i < len; i++)signal[i] *= gainLinear;
    // Step 6: 硬限幅保护（确保不超过 TP 上限的线性值）
    const tpLinear = Math.pow(10, TARGET_TP_DB / 20); // ~0.84
    if (peakAbs * gainLinear > tpLinear) {
        const scale = tpLinear / (peakAbs * gainLinear);
        for(let i = 0; i < len; i++)signal[i] *= scale;
    }
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
"src/services/audio/stage2/noise.ts": function (module, exports, __mako_require__){
/**
 * 本底噪声注入（时域，粉红噪声）
 * 对齐 CUDA 版 cuda_obfuscator.py apply_noise_floor 的实现：
 *   白噪声 → 累计和(积分/棕噪声) → 标准化 → 缩放到目标电平
 * 粉红噪声的功率谱密度与频率成反比（1/f），更接近真实环境噪声
 * @param signal - 输入/输出时域信号
 * @param noiseFloorDb - 噪声底电平（dB），如 -60
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applyNoiseFloor", {
    enumerable: true,
    get: function() {
        return applyNoiseFloor;
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
function applyNoiseFloor(signal, noiseFloorDb) {
    const len = signal.length;
    // 将 dB 转换为线性幅度
    const noiseLinear = Math.pow(10, noiseFloorDb / 20);
    // 计算当前信号 RMS
    let signalRms = 0;
    for(let i = 0; i < len; i++)signalRms += signal[i] * signal[i];
    signalRms = Math.sqrt(signalRms / len);
    // 目标噪声 RMS
    const targetNoiseRms = signalRms * noiseLinear;
    /** 生成粉红噪声：白噪声 → 累计和(积分) → 标准化 */ const pinkNoise = generatePinkNoise(len);
    // 叠加到信号上
    for(let i = 0; i < len; i++)signal[i] += pinkNoise[i] * targetNoiseRms;
}
/**
 * 生成粉红噪声序列
 * 使用 Voss-McCartney 方法的简化版（累计和法），
 * 与 CUDA 版 torch.cumsum 实现一致：对高斯白噪声做积分得到 1/f^2 谱
 * @param length - 噪声序列长度
 * @returns 粉红噪声 Float32Array（均值为0，标准差约1）
 */ function generatePinkNoise(length) {
    const white = new Float32Array(length);
    const pink = new Float32Array(length);
    // Step 1: 生成高斯白噪声（Box-Muller 变换）
    for(let i = 0; i < length; i += 2){
        let u1;
        do u1 = Math.random();
        while (u1 === 0)
        const u2 = Math.random();
        const r = Math.sqrt(-2 * Math.log(u1));
        const theta = 2 * Math.PI * u2;
        white[i] = r * Math.cos(theta);
        if (i + 1 < length) white[i + 1] = r * Math.sin(theta);
    }
    // Step 2: 累计和（积分）— 对齐 CUDA 版 torch.cumsum
    // 这将白噪声的平坦谱变为 ~1/f^2 的棕噪声谱
    let sum = 0;
    for(let i = 0; i < length; i++){
        sum += white[i];
        pink[i] = sum;
    }
    // Step 3: 标准化（使标准差 ≈ 1）— 对齐 CUDA 版 / (std + 1e-10)
    let mean = 0;
    let std = 0;
    for(let i = 0; i < length; i++)mean += pink[i];
    mean /= length;
    for(let i = 0; i < length; i++){
        const d = pink[i] - mean;
        std += d * d;
    }
    std = Math.sqrt(std / length);
    const invStd = std > 1e-10 ? 1 / std : 0;
    for(let i = 0; i < length; i++)pink[i] = (pink[i] - mean) * invStd;
    return pink;
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
"src/services/audio/stage2/phaser.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applyPhaser", {
    enumerable: true,
    get: function() {
        return applyPhaser;
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
function applyPhaser(signal, config, sampleRate) {
    const len = signal.length;
    const { in_gain, out_gain, delay, decay, speed, type } = config;
    /** 延迟线长度（采样点数），基于 delay(ms) */ const delaySamples = Math.max(1, Math.round(delay / 1000 * sampleRate));
    /** 使用4级全通滤波器链（与 ffmpeg aphaser 的多级结构对齐） */ const numStages = 4;
    const buffers = [];
    for(let s = 0; s < numStages; s++){
        // 每级延迟长度递增，产生不同的相位响应
        const stageDelay = delaySamples * (s + 1);
        buffers.push(new Float32Array(stageDelay).fill(0));
    }
    // 各级缓冲区的读写指针
    const writePos = new Array(numStages).fill(0);
    for(let i = 0; i < len; i++){
        // LFO 调制相位：三角波或正弦波
        const phase = i / len * speed * 10 * Math.PI * 2; // speed 控制调制频率
        let lfo;
        if (type === 'triangular') {
            // 三角波：((x % π) / π * 2 - 1) 的周期函数
            const p = (phase / Math.PI % 2 + 2) % 2;
            lfo = p < 1 ? p * 2 - 1 : 3 - p * 2;
        } else lfo = Math.sin(phase);
        // 输入增益
        let input = signal[i] * in_gain;
        // 通过全通滤波器链
        for(let s = 0; s < numStages; s++){
            const buf = buffers[s];
            const dlen = buf.length;
            const wp = writePos[s];
            // 读取延迟样本（受LFO调制的分数延迟近似）
            const baseIdx = (wp - 1 + dlen) % dlen;
            const modOffset = Math.round(lfo * 0.5); // LFO调制延迟偏移（±0.5采样）
            const readIdx = (baseIdx - modOffset + dlen) % dlen;
            const delayed = buf[readIdx];
            // 全通混合：input + decay * delayed
            const output = input + decay * delayed;
            // 写入缓冲区
            buf[wp] = input;
            writePos[s] = (wp + 1) % dlen;
            input = output; // 级联到下一级
        }
        // 输出：混合原始信号（干声）和处理后信号（湿声）
        signal[i] = signal[i] * (1 - out_gain) + input * out_gain;
    }
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
"src/services/audio/stage2/rubberband.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applyRubberbandSpectralSmear", {
    enumerable: true,
    get: function() {
        return applyRubberbandSpectralSmear;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _webfftbackend = __mako_require__("src/services/audio/fft/webfft-backend.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
/** 谱涂抹 FFT 帧大小 */ const RUBBERBAND_FFT_SIZE = 2048;
function applyRubberbandSpectralSmear(signal, sampleRate = 44100, phaseJitterRange = 0.6, magJitterRange = 0.1) {
    const len = signal.length;
    const fftSize = RUBBERBAND_FFT_SIZE;
    const hopSize = fftSize / 4; // 75%重叠
    const fft = new _webfftbackend.WebFFTBackend(fftSize);
    /** 生成 Hann 窗 */ const hannWindow = new Float32Array(fftSize);
    for(let i = 0; i < fftSize; i++)hannWindow[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));
    const numFrames = Math.ceil(len / hopSize) + 4;
    const output = new Float32Array(numFrames * hopSize + fftSize).fill(0);
    // 分块 STFT 处理
    for(let frame = 0; frame < numFrames; frame++){
        const startSample = frame * hopSize;
        // 加窗
        const frameBuffer = new Float32Array(fftSize);
        for(let i = 0; i < fftSize; i++){
            const srcIdx = startSample + i;
            if (srcIdx >= 0 && srcIdx < len) frameBuffer[i] = signal[srcIdx] * hannWindow[i];
        }
        // FFT
        const spectrum = fft.rfft(frameBuffer);
        // 谱涂抹：随机相位扰动 + 幅度微扰
        // 相位扰动破坏频谱相位的一致性，幅度微扰破坏峰值检测的精确性
        const binCount = fftSize / 2 + 1;
        for(let k = 1; k < binCount; k++){
            const re = spectrum[2 * k];
            const im = spectrum[2 * k + 1];
            // 计算幅度和相位
            const mag = Math.sqrt(re * re + im * im);
            let phase = Math.atan2(im, re);
            // 相位扰动：±phaseJitterRange/2 rad（增强版，默认±0.3rad ≈ ±17°）
            phase += (Math.random() - 0.5) * phaseJitterRange;
            // 幅度微扰：±magJitterRange/2（默认±5%）
            const magJitter = 1.0 + (Math.random() - 0.5) * magJitterRange;
            const newMag = mag * magJitter;
            // 重构复数
            spectrum[2 * k] = newMag * Math.cos(phase);
            spectrum[2 * k + 1] = newMag * Math.sin(phase);
        }
        // IFFT
        const timeDomain = fft.irfft(spectrum, fftSize);
        // OLA 重叠相加
        for(let i = 0; i < fftSize; i++){
            const destIdx = startSample + i;
            if (destIdx >= 0 && destIdx < output.length) output[destIdx] += timeDomain[i] * hannWindow[i]; // 二次窗（合成窗）
        }
    }
    // 归一化（补偿重叠增益）
    const olaGain = 4.0 / 3.0; // 75%重叠的理论增益补偿
    for(let i = 0; i < len; i++)signal[i] = output[i] * olaGain;
    fft.dispose();
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
"src/services/audio/stage2/spectral-envelope-randomization.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applySpectralEnvelopeRandomizationOnSpectrum", {
    enumerable: true,
    get: function() {
        return applySpectralEnvelopeRandomizationOnSpectrum;
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
function applySpectralEnvelopeRandomizationOnSpectrum(spectrum, fftSize, config) {
    if (!config.enabled) return;
    const bandWidth = config.band_width;
    const mixMin = config.mix_min;
    const mixMax = config.mix_max;
    const binCount = fftSize / 2 + 1;
    // 频谱包络随机化：相邻子带间能量重分配
    for(let bandStart = 1; bandStart < binCount - bandWidth; bandStart += bandWidth * 2){
        // 计算当前子带和下一个子带的总能量
        let energy1 = 0;
        let energy2 = 0;
        const band2Start = bandStart + bandWidth;
        for(let k = 0; k < bandWidth; k++){
            const idx1 = bandStart + k;
            const idx2 = band2Start + k;
            if (idx2 < binCount) {
                energy1 += spectrum[2 * idx1] ** 2 + spectrum[2 * idx1 + 1] ** 2;
                energy2 += spectrum[2 * idx2] ** 2 + spectrum[2 * idx2 + 1] ** 2;
            }
        }
        const totalEnergy = energy1 + energy2;
        if (totalEnergy < 1e-10) continue;
        // 随机混合比例
        const mixRatio = mixMin + Math.random() * (mixMax - mixMin);
        const targetE1 = totalEnergy * mixRatio;
        const targetE2 = totalEnergy * (1 - mixRatio);
        // 计算缩放系数
        const scale1 = energy1 > 1e-10 ? Math.sqrt(targetE1 / energy1) : 1;
        const scale2 = energy2 > 1e-10 ? Math.sqrt(targetE2 / energy2) : 1;
        // 应用缩放
        for(let k = 0; k < bandWidth; k++){
            const idx1 = bandStart + k;
            const idx2 = band2Start + k;
            if (idx2 < binCount) {
                spectrum[2 * idx1] *= scale1;
                spectrum[2 * idx1 + 1] *= scale1;
                spectrum[2 * idx2] *= scale2;
                spectrum[2 * idx2 + 1] *= scale2;
            }
        }
    }
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
"src/services/audio/stage2/spectral-peak-shift.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applySpectralPeakShiftOnSpectrum", {
    enumerable: true,
    get: function() {
        return applySpectralPeakShiftOnSpectrum;
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
function applySpectralPeakShiftOnSpectrum(spectrum, fftSize, config) {
    if (!config.enabled) return;
    const shiftRange = config.shift_range;
    const attenuation = config.attenuation;
    const binCount = fftSize / 2 + 1;
    // 计算幅度谱
    const magnitudes = new Float32Array(binCount);
    for(let k = 0; k < binCount; k++)magnitudes[k] = Math.sqrt(spectrum[2 * k] ** 2 + spectrum[2 * k + 1] ** 2);
    // 计算中位数阈值（用于筛选显著峰值）
    const sortedMags = Float32Array.from(magnitudes).sort();
    const median = sortedMags[Math.floor(binCount / 2)];
    // 检测局部峰值并施加频率偏移
    for(let k = 2; k < binCount - 2; k++){
        const isPeak = magnitudes[k] > magnitudes[k - 1] && magnitudes[k] > magnitudes[k + 1] && magnitudes[k] > magnitudes[k - 2] && magnitudes[k] > magnitudes[k + 2];
        if (!isPeak) continue;
        // 仅对显著峰值施加偏移（幅度大于该帧中位数的2倍）
        if (magnitudes[k] < median * 2) continue;
        // 随机偏移方向和距离（±shiftRange 个 bin）
        const shift = Math.round((Math.random() - 0.5) * 2 * shiftRange);
        if (shift === 0) continue;
        const targetK = k + shift;
        if (targetK <= 0 || targetK >= binCount) continue;
        // 将峰值能量搬运到偏移后的位置
        spectrum[2 * targetK] = spectrum[2 * k];
        spectrum[2 * targetK + 1] = spectrum[2 * k + 1];
        // 原位置按衰减系数保留部分能量
        spectrum[2 * k] *= attenuation;
        spectrum[2 * k + 1] *= attenuation;
    }
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
"src/services/audio/stage2/stereo-decorrelation.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "applyStereoDecorrelation", {
    enumerable: true,
    get: function() {
        return applyStereoDecorrelation;
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
function applyStereoDecorrelation(channels, sampleRate, config) {
    if (!config.enabled) return;
    // 仅对立体声音频生效
    if (channels.length < 2) return;
    const left = channels[0];
    const right = channels[1];
    const len = left.length;
    // Step 1: 对右声道施加微延迟（哈斯效应）
    const delaySamples = Math.round(config.delay_ms / 1000 * sampleRate);
    if (delaySamples > 0 && delaySamples < len) {
        // 将右声道向后延迟，前端补零
        const delayed = new Float32Array(len);
        for(let i = 0; i < len; i++)if (i < delaySamples) // 延迟区域：淡入避免爆音
        delayed[i] = right[i] * (i / delaySamples) * 0.01;
        else delayed[i] = right[i - delaySamples];
        // 写回右声道
        right.set(delayed);
    }
    // Step 2: 对右声道施加随机相位偏移
    // 使用分段随机相位，每段约 50ms，避免全局一致的偏移
    const segmentSamples = Math.round(0.05 * sampleRate); // 50ms 每段
    const numSegments = Math.ceil(len / segmentSamples);
    for(let seg = 0; seg < numSegments; seg++){
        // 每段随机相位偏移系数
        const phaseOffset = (Math.random() - 0.5) * 2 * config.phase_offset;
        const segStart = seg * segmentSamples;
        const segEnd = Math.min(segStart + segmentSamples, len);
        for(let i = segStart; i < segEnd; i++){
            // 简单相位偏移：将采样值乘以 cos(phaseOffset) 并叠加相邻采样的 sin 分量
            const nextIdx = Math.min(i + 1, len - 1);
            right[i] = right[i] * Math.cos(phaseOffset) + right[nextIdx] * Math.sin(phaseOffset) * 0.1;
        }
    }
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
"src/services/audio/stage3/index.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "processStage3", {
    enumerable: true,
    get: function() {
        return processStage3;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _core = __mako_require__("node_modules/.pnpm/@soundtouchjs+core@2.0.4/node_modules/@soundtouchjs/core/.dist/index.js");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
/** Stage 3 日志前缀 */ const LOG_PREFIX = '[Stage3]';
function processStage3(inputChannels, sampleRate, tempo) {
    const numChannels = inputChannels.length;
    const numSamples = inputChannels[0].length;
    console.log(`${LOG_PREFIX} 开始保音调变速 | tempo=${tempo} sr=${sampleRate}Hz channels=${numChannels} inputSamples=${numSamples}`);
    try {
        // ═══ Step 1: 转换为 interleaved 格式 ═══
        let t0 = performance.now();
        const interleaved = new Float32Array(numSamples * 2);
        for(let i = 0; i < numSamples; i++){
            interleaved[i * 2] = inputChannels[0][i]; // 左声道
            if (numChannels >= 2) interleaved[i * 2 + 1] = inputChannels[1][i]; // 右声道
            else interleaved[i * 2 + 1] = inputChannels[0][i]; // 单声道：复制到右声道
        }
        console.log(`${LOG_PREFIX} [Step-1/Interleave] 完成 | interleaved samples=${interleaved.length / 2} 耗时${(performance.now() - t0).toFixed(1)}ms`);
        // ═══ Step 2: 初始化 WSOLA Stretch 引擎 ═══
        t0 = performance.now();
        const stretch = new _core.Stretch({
            createBuffers: true
        });
        stretch.setParameters(sampleRate, 0, 0, 12); // 0=自动计算，overlapMs=12ms
        stretch.tempo = tempo;
        // 校验缓冲区是否创建成功
        if (!stretch.inputBuffer || !stretch.outputBuffer) throw new Error('Stretch 缓冲区初始化失败，inputBuffer 或 outputBuffer 为 null');
        console.log(`${LOG_PREFIX} [Step-2/InitStretch] 完成 | sampleRate=${sampleRate} tempo=${tempo} overlapMs=12ms 耗时${(performance.now() - t0).toFixed(1)}ms`);
        // ═══ Step 3: 写入输入数据 ═══
        t0 = performance.now();
        stretch.inputBuffer.putSamples(interleaved, 0, numSamples);
        console.log(`${LOG_PREFIX} [Step-3/PutSamples] 完成 | 写入 ${numSamples} 帧 耗时${(performance.now() - t0).toFixed(1)}ms`);
        // ═══ Step 4: WSOLA 处理循环 ═══
        t0 = performance.now();
        const estimatedOutputFrames = Math.ceil(numSamples / tempo);
        let lastOutputFrames = 0;
        let stalledCount = 0;
        const maxIterations = numSamples; // 安全上限
        for(let iter = 0; iter < maxIterations; iter++){
            if (stretch.outputBuffer.frameCount >= estimatedOutputFrames) break;
            if (stretch.inputBuffer.frameCount >= stretch.sampleReq) stretch.process();
            const currentFrames = stretch.outputBuffer.frameCount;
            if (currentFrames === lastOutputFrames) {
                stalledCount++;
                if (stalledCount > 100) break; // 防止死循环
            } else {
                stalledCount = 0;
                lastOutputFrames = currentFrames;
            }
        }
        const outputFrames = stretch.outputBuffer.frameCount;
        const processTime = performance.now() - t0;
        console.log(`${LOG_PREFIX} [Step-4/WSOLA-Process] 完成 | 输出帧=${outputFrames}/${estimatedOutputFrames} 迭代次数=... 耗时${processTime.toFixed(1)}ms`);
        // ═══ Step 5: 提取并 de-interleave 输出 ═══
        t0 = performance.now();
        const interleavedOutput = new Float32Array(outputFrames * 2);
        stretch.outputBuffer.extract(interleavedOutput, 0, outputFrames);
        const outputChannels = [];
        for(let ch = 0; ch < numChannels; ch++)outputChannels.push(new Float32Array(outputFrames));
        for(let i = 0; i < outputFrames; i++){
            outputChannels[0][i] = interleavedOutput[i * 2];
            if (numChannels >= 2) outputChannels[1][i] = interleavedOutput[i * 2 + 1];
        }
        console.log(`${LOG_PREFIX} [Step-5/DeInterleave] 完成 | outputSamples=${outputFrames} channels=${outputChannels.length} 耗时${(performance.now() - t0).toFixed(1)}ms`);
        performance.now(); // 粗略总耗时
        console.log(`${LOG_PREFIX} 变速完成 | tempo=${tempo} input=${numSamples}→output=${outputFrames} frames (${(outputFrames / numSamples * 100).toFixed(1)}%)`);
        return outputChannels;
    } catch (err) {
        console.error(`${LOG_PREFIX} 变速流程异常中断`, err);
        throw err;
    }
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
//# sourceMappingURL=src_pages_cover-preprocess_index_tsx-async.js.map