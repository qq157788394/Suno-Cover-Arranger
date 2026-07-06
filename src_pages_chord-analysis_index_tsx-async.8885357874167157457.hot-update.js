globalThis.makoModuleHotUpdate('src/pages/chord-analysis/index.tsx', {
    modules: {
        "src/hooks/useChordAnalysis.ts": function(module, exports, __mako_require__) {
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
                default: function() {
                    return _default;
                },
                useChordAnalysis: function() {
                    return useChordAnalysis;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
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
            /** 音名上行指定半音数（用于 Minor → 相对大调显示） */ const NOTE_SEMITONES_MAP = {
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
                // 分析状态
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
                /** 终止 Worker */ const terminateWorker = (0, _react.useCallback)(()=>{
                    if (workerRef.current) {
                        workerRef.current.terminate();
                        workerRef.current = null;
                    }
                }, []);
                /** 清理超时定时器 */ const clearTimeout_ = (0, _react.useCallback)(()=>{
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                }, []);
                /** 清理音频资源 */ const cleanupAudio = (0, _react.useCallback)(()=>{
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                    setAudioUrl(null);
                    setCurrentTime(0);
                    setCurrentChord(null);
                    setPlaybackState('STOPPED');
                }, [
                    audioUrl
                ]);
                /** 提取音频峰值数据（降采样波形） */ const extractPeaks = (0, _react.useCallback)(async (file)=>{
                    const arrayBuffer = await file.arrayBuffer();
                    const audioContext = new AudioContext();
                    try {
                        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                        const channelData = audioBuffer.getChannelData(0);
                        const targetLength = 2000; // 降采样到 2000 个点
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
                        // 归一化
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
                /** 启动分析流程 */ const startAnalysis = (0, _react.useCallback)(async (file)=>{
                    setFileName(file.name);
                    setAnalysisStatus('FILE_LOADING');
                    setError(null);
                    setProgressPercent(0);
                    setCurrentStep(undefined);
                    try {
                        // 1. 创建音频 URL
                        if (audioUrl) URL.revokeObjectURL(audioUrl);
                        setAudioUrl(URL.createObjectURL(file));
                        // 2. 解码音频 + 提取峰值
                        setAnalysisStatus('DECODING');
                        const { peaks: extractedPeaks, audioBuffer } = await extractPeaks(file);
                        setPeaks(extractedPeaks);
                        // 5. Worker 提取 essentia 特征
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
                            // 拷贝一份 ArrayBuffer 传给 Worker（Transferable 零拷贝）
                            const copy = audioBuffer.getChannelData(0).buffer.slice(0);
                            w.postMessage({
                                type: 'analyze',
                                audioBuffer: copy,
                                sampleRate: audioBuffer.sampleRate
                            }, [
                                copy
                            ]);
                        });
                        // 6. 构建结果
                        setAnalysisStatus('ANALYZING');
                        setCurrentStep('done');
                        setProgressPercent(100);
                        // Worker 返回 chordSegments（自有和弦匹配）
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
                            // Minor 键同步显示相对大调：A Minor / C Major
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
                /** 处理文件选择 */ const handleFileSelect = (0, _react.useCallback)((file)=>{
                    lastFileRef.current = file;
                    startAnalysis(file);
                }, [
                    startAnalysis
                ]);
                /** 播放 */ const handlePlay = (0, _react.useCallback)(()=>{
                    if (audioRef.current) {
                        audioRef.current.play();
                        setPlaybackState('PLAYING');
                    }
                }, []);
                /** 暂停 */ const handlePause = (0, _react.useCallback)(()=>{
                    if (audioRef.current) {
                        audioRef.current.pause();
                        setPlaybackState('PAUSED');
                    }
                }, []);
                /** 停止 */ const handleStop = (0, _react.useCallback)(()=>{
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
                /** 跳转 */ const handleSeek = (0, _react.useCallback)((time)=>{
                    if (audioRef.current) {
                        audioRef.current.currentTime = time;
                        setCurrentTime(time);
                    }
                }, []);
                /** 重试分析 */ const handleRetry = (0, _react.useCallback)(()=>{
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
                // audio 时间更新事件
                (0, _react.useEffect)(()=>{
                    const audio = audioRef.current;
                    if (!audio) return;
                    const onTimeUpdate = ()=>{
                        const t = audio.currentTime;
                        setCurrentTime(t);
                        // 查找当前和弦（找不到则为 null，不表示无和弦，UI 显示默认符号）
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
                // 组件卸载时清理
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
        }
    }
}, function(runtime) {
    runtime._h = '6331731272092478449';
    runtime.updateEnsure2Map({
        "src/.umi/plugin-layout/Layout.tsx": [
            "vendors",
            "src/.umi/plugin-layout/Layout.tsx"
        ],
        "src/.umi/plugin-openapi/openapi.tsx": [
            "vendors",
            "src/.umi/plugin-openapi/openapi.tsx"
        ],
        "src/pages/404.tsx": [
            "p__404"
        ],
        "src/pages/about/index.tsx": [
            "vendors",
            "p__about__index"
        ],
        "src/pages/ai-setting/index.tsx": [
            "vendors",
            "common",
            "src/pages/ai-setting/index.tsx"
        ],
        "src/pages/changelog/index.tsx": [
            "vendors",
            "p__changelog__index"
        ],
        "src/pages/chord-analysis/index.tsx": [
            "src/pages/chord-analysis/index.tsx"
        ],
        "src/pages/cover-preprocess/index.tsx": [
            "vendors",
            "src/pages/cover-preprocess/index.tsx"
        ],
        "src/pages/lyrics-craft/index.tsx": [
            "vendors",
            "common",
            "src/pages/lyrics-craft/index.tsx"
        ],
        "src/pages/lyrics-records/index.tsx": [
            "vendors",
            "common",
            "src/pages/lyrics-records/index.tsx"
        ],
        "src/pages/music-insight/index.tsx": [
            "src/pages/music-insight/index.tsx"
        ],
        "src/pages/record/index.tsx": [
            "vendors",
            "common",
            "p__record__index"
        ],
        "src/pages/suno-cover/index.tsx": [
            "vendors",
            "common",
            "src/pages/suno-cover/index.tsx"
        ]
    });
    ;
});

//# sourceMappingURL=src_pages_chord-analysis_index_tsx-async.8885357874167157457.hot-update.js.map