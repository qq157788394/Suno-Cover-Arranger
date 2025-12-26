globalThis.makoModuleHotUpdate('src/pages/lyrics-craft/index.tsx', {
    modules: {
        "src/pages/lyrics-craft/index.tsx": function(module, exports, __mako_require__) {
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
            var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js");
            var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
            var _xmarkdown = __mako_require__("node_modules/.pnpm/@ant-design+x-markdown@2.1.1_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/x-markdown/es/index.js");
            var _max = __mako_require__("src/.umi/exports.ts");
            var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
            var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
            "";
            "";
            var _lyricsEnums = __mako_require__("src/config/lyricsEnums.ts");
            var _masterStyleConfig = __mako_require__("src/config/masterStyleConfig.ts");
            var _useApiKey = __mako_require__("src/hooks/useApiKey.ts");
            var _useLyricsRecords = __mako_require__("src/hooks/useLyricsRecords.ts");
            var _providers = __mako_require__("src/services/ai/providers/index.ts");
            var _aiTemperatureConfig = __mako_require__("src/config/aiTemperatureConfig.ts");
            var _utils = __mako_require__("src/shared/utils/index.ts");
            var _components = __mako_require__("src/components/index.ts");
            var _promptBuilder = __mako_require__("src/pages/lyrics-craft/utils/promptBuilder.ts");
            var _responseParser = __mako_require__("src/pages/lyrics-craft/utils/responseParser.ts");
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
            const LyricsCraftPage = ()=>{
                var _initialState_settings;
                _s();
                (0, _max.useNavigate)();
                const { apiKey, model, checkApiKey, shouldShowAlert, navigateToSettings } = (0, _useApiKey.useApiKey)();
                const { createRecord } = (0, _useLyricsRecords.useLyricsRecords)();
                const [loading, setLoading] = (0, _react.useState)(false);
                const [generatedLyrics, setGeneratedLyrics] = (0, _react.useState)("");
                const [messageApi, contextHolder] = _antd.message.useMessage();
                const { initialState } = (0, _max.useModel)("@@initialState");
                // 根据主题设置确定XMarkdown的主题类
                const isDarkTheme = (initialState === null || initialState === void 0 ? void 0 : (_initialState_settings = initialState.settings) === null || _initialState_settings === void 0 ? void 0 : _initialState_settings.navTheme) === "realDark";
                const markdownThemeClass = isDarkTheme ? "x-markdown-dark" : "x-markdown-light";
                const defaultFormValues = {
                    song_language: "mandarin",
                    song_style: "lyrical_pop",
                    song_structure: "standard_pop",
                    creation_mode: "new",
                    persona: "unlimited",
                    wording_style: [],
                    allow_english: false,
                    closeness: 3,
                    rhyme_type: "mix",
                    rhyme_strict: true,
                    output_count: 1
                };
                const handleSubmit = async (values)=>{
                    if (!checkApiKey()) return;
                    if (!values.song_name || !values.song_name.trim()) {
                        messageApi.error("歌曲名称不能为空");
                        return;
                    }
                    if (!values.raw_material || !values.raw_material.trim()) {
                        messageApi.error("原始素材不能为空");
                        return;
                    }
                    if (values.output_count < 1 || values.output_count > 5) {
                        messageApi.error("生成数量必须在1-5之间");
                        return;
                    }
                    if (values.closeness < 0 || values.closeness > 100) {
                        messageApi.error("贴近度必须在0-100之间");
                        return;
                    }
                    setLoading(true);
                    setGeneratedLyrics("");
                    try {
                        const provider = _providers.AIProviderFactory.createProvider(model);
                        const systemPrompt = _promptBuilder.LyricsCraftPromptBuilder.buildSystemPrompt(values);
                        const userPrompt = _promptBuilder.LyricsCraftPromptBuilder.buildUserPrompt(values);
                        const response = await provider.generate({
                            api_key: apiKey,
                            system_prompt: systemPrompt,
                            user_prompt: userPrompt,
                            business_type: _aiTemperatureConfig.BusinessType.LYRICS
                        });
                        if (!response.success) throw new Error(response.error || "AI生成失败");
                        const parsedResponse = _responseParser.LyricsCraftResponseParser.parseResponse(response.content);
                        if (parsedResponse.success && parsedResponse.lyrics) {
                            var _result_data;
                            setGeneratedLyrics(parsedResponse.lyrics);
                            const result = await createRecord({
                                form_data: values,
                                ai_result: {
                                    lyrics: parsedResponse.lyrics,
                                    model: model,
                                    closeness: values.closeness
                                },
                                created_at: new Date()
                            });
                            if (result.success && ((_result_data = result.data) === null || _result_data === void 0 ? void 0 : _result_data.id)) messageApi.success("歌词生成成功！");
                            else messageApi.error("歌词生成成功，但保存失败");
                        } else messageApi.error(parsedResponse.error || "歌词生成失败");
                    } catch (error) {
                        console.error("歌词生成失败：", error);
                        messageApi.error("歌词生成失败，请稍后重试");
                    } finally{
                        setLoading(false);
                    }
                };
                return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                    children: [
                        contextHolder,
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
                            children: [
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_components.ApiKeyAlert, {
                                    visible: shouldShowAlert,
                                    onNavigateToSettings: navigateToSettings
                                }, void 0, false, {
                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                    lineNumber: 161,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                                    spinning: loading,
                                    fullscreen: true,
                                    size: "large"
                                }, void 0, false, {
                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                    lineNumber: 165,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Row, {
                                    gutter: [
                                        24,
                                        0
                                    ],
                                    children: [
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                            xxl: 16,
                                            xl: 12,
                                            lg: 12,
                                            md: 12,
                                            sm: 12,
                                            xs: 12,
                                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                                title: "创作配置",
                                                style: {
                                                    height: "100%"
                                                },
                                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
                                                    layout: "vertical",
                                                    grid: true,
                                                    onFinish: handleSubmit,
                                                    submitter: {
                                                        render: ()=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                                                type: "primary",
                                                                htmlType: "submit",
                                                                loading: loading,
                                                                size: "large",
                                                                block: true,
                                                                children: "生成歌词"
                                                            }, void 0, false, {
                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 21
                                                            }, void 0)
                                                    },
                                                    initialValues: defaultFormValues,
                                                    children: [
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                            name: "song_name",
                                                            label: "歌曲名称",
                                                            placeholder: "请输入歌曲名称",
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请输入歌曲名称"
                                                                },
                                                                {
                                                                    max: 50,
                                                                    message: "歌曲名称最多 50 个字"
                                                                }
                                                            ],
                                                            colProps: {
                                                                span: 24
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "song_language",
                                                            label: "歌曲语言",
                                                            placeholder: "请选择歌曲语言",
                                                            options: _lyricsEnums.SONG_LANGUAGE_OPTIONS.map((option)=>({
                                                                    label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: option.label
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 205,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: option.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 206,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 209,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: option.value
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择歌曲语言"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSwitch, {
                                                            name: "allow_english",
                                                            label: "允许英语单词",
                                                            tooltip: "想用一杯Latte把你灌醉？关闭时，歌词中禁止出现散装英语",
                                                            colProps: {
                                                                xxl: 6,
                                                                xl: 12,
                                                                lg: 12,
                                                                md: 12,
                                                                sm: 12,
                                                                xs: 12
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormRadio.Group, {
                                                            name: "output_count",
                                                            label: "输出方案数量",
                                                            options: _lyricsEnums.OUTPUT_COUNT_OPTIONS.map((option)=>({
                                                                    label: option.label,
                                                                    value: option.value
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择输出方案数量"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 6,
                                                                xl: 12,
                                                                lg: 12,
                                                                md: 12,
                                                                sm: 12,
                                                                xs: 12
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 223,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "master_id",
                                                            label: "大师风格",
                                                            placeholder: "请选择大师风格",
                                                            options: _masterStyleConfig.MASTER_STYLE_CARDS.map((master)=>({
                                                                    label: master.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: master.name
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 240,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: master.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 241,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: master.name
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 244,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: master.id
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择大师风格"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "wording_style",
                                                            label: "措辞要求（可选，最多可选 2 项）",
                                                            options: _lyricsEnums.WORDING_STYLE_OPTIONS.map((option)=>({
                                                                    label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: option.label
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 258,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: option.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 259,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 262,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: option.value
                                                                })),
                                                            mode: "multiple",
                                                            rules: [
                                                                {
                                                                    type: "array",
                                                                    max: 2,
                                                                    message: "措辞要求最多选择 2 项"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false,
                                                                maxCount: 2,
                                                                maxTagCount: "responsive"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 252,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSlider, {
                                                            name: "closeness",
                                                            label: "贴近度",
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择贴近度"
                                                                }
                                                            ],
                                                            colProps: {
                                                                span: 24
                                                            },
                                                            min: 1,
                                                            max: 5,
                                                            marks: _lyricsEnums.CLOSENESS_LEVEL_OPTIONS.reduce((acc, opt)=>{
                                                                acc[opt.value] = opt.label;
                                                                return acc;
                                                            }, {}),
                                                            step: 1,
                                                            fieldProps: {
                                                                tooltip: {
                                                                    formatter: (value)=>{
                                                                        if (value === undefined) return "";
                                                                        const option = _lyricsEnums.CLOSENESS_LEVEL_OPTIONS.find((opt)=>opt.value === value);
                                                                        if (!option) return String(value);
                                                                        return option.tooltip_example ? `${option.description}。${option.tooltip_example}` : option.description;
                                                                    }
                                                                },
                                                                style: {
                                                                    margin: "0 32px"
                                                                }
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 281,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "creation_mode",
                                                            label: "创作模式",
                                                            placeholder: "请选择创作模式",
                                                            options: _lyricsEnums.CREATION_MODE_OPTIONS.map((option)=>({
                                                                    label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: option.label
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 316,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: option.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 317,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 320,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: option.value
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择创作模式"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 309,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "song_style",
                                                            label: "歌曲风格",
                                                            placeholder: "请选择歌曲风格",
                                                            options: _lyricsEnums.SONG_STYLE_OPTIONS.map((option)=>({
                                                                    label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: option.label
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 335,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: option.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 336,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 339,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: option.value
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择歌曲风格"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 328,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "song_structure",
                                                            label: "曲式结构",
                                                            placeholder: "请选择曲式结构",
                                                            options: _lyricsEnums.SONG_STRUCTURE_OPTIONS.map((option)=>({
                                                                    label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: option.label
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 355,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: option.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 356,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 359,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: option.value
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择曲式结构"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "persona",
                                                            label: "叙事人设",
                                                            placeholder: "请选择叙事人设",
                                                            options: _lyricsEnums.PERSONA_OPTIONS.map((option)=>({
                                                                    label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: option.label
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 374,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: option.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 375,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 378,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: option.value
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择叙事人设"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 367,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                            name: "raw_material",
                                                            label: "原始素材",
                                                            placeholder: "请输入原始素材（主题、大意、歌词片段等），每一行视为一个参考素材",
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请输入原始素材"
                                                                },
                                                                {
                                                                    max: 1000,
                                                                    message: "原始素材最多1000字"
                                                                }
                                                            ],
                                                            fieldProps: {
                                                                rows: 6,
                                                                showCount: true,
                                                                maxLength: 1000
                                                            },
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                            name: "reference_lyrics",
                                                            label: "参考歌曲和歌词（可选）",
                                                            placeholder: "请输入参考歌曲名称和歌词全文，仅作为技法参考，不要求结构对齐",
                                                            rules: [
                                                                {
                                                                    max: 1000,
                                                                    message: "参考歌曲和歌词最多1000字"
                                                                }
                                                            ],
                                                            fieldProps: {
                                                                rows: 6,
                                                                showCount: true,
                                                                maxLength: 1000
                                                            },
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 401,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                            name: "requirements",
                                                            label: "创作要求（可选）",
                                                            placeholder: "请输入创作要求（情绪走向、禁止出现的内容等）",
                                                            rules: [
                                                                {
                                                                    max: 1000,
                                                                    message: "创作要求最多1000字"
                                                                }
                                                            ],
                                                            fieldProps: {
                                                                rows: 4,
                                                                showCount: true,
                                                                maxLength: 1000
                                                            },
                                                            colProps: {
                                                                span: 24
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 413,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "rhyme_type",
                                                            label: "押韵类型",
                                                            placeholder: "请选择押韵类型",
                                                            options: _lyricsEnums.RHYME_TYPE_OPTIONS.map((option)=>({
                                                                    label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                strong: true,
                                                                                children: option.label
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 432,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                                type: "secondary",
                                                                                children: option.description
                                                                            }, void 0, false, {
                                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                                lineNumber: 433,
                                                                                columnNumber: 25
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                        strong: true,
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                                                        lineNumber: 436,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    value: option.value
                                                                })),
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请选择押韵类型"
                                                                }
                                                            ],
                                                            colProps: {
                                                                xxl: 12,
                                                                xl: 24,
                                                                lg: 24,
                                                                md: 24,
                                                                sm: 24,
                                                                xs: 24
                                                            },
                                                            fieldProps: {
                                                                popupMatchSelectWidth: false
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 425,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                            name: "rhyme_tone",
                                                            label: "韵脚（可选）",
                                                            placeholder: "请输入韵脚，留空则系统推荐",
                                                            colProps: {
                                                                xxl: 6,
                                                                xl: 12,
                                                                lg: 12,
                                                                md: 12,
                                                                sm: 12,
                                                                xs: 12
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 444,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSwitch, {
                                                            name: "rhyme_strict",
                                                            label: "严格押韵",
                                                            tooltip: "开启时，必须严格执行韵脚，不得出现近音字代替",
                                                            colProps: {
                                                                xxl: 6,
                                                                xl: 12,
                                                                lg: 12,
                                                                md: 12,
                                                                sm: 12,
                                                                xs: 12
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 450,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 15
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 168,
                                                columnNumber: 13
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                            lineNumber: 167,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                            xxl: 8,
                                            xl: 12,
                                            lg: 12,
                                            md: 12,
                                            sm: 12,
                                            xs: 12,
                                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                                title: "生成的歌词",
                                                extra: generatedLyrics && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                                    size: "small",
                                                    onClick: ()=>(0, _utils.copyToClipboard)(generatedLyrics, "歌词"),
                                                    children: "复制歌词"
                                                }, void 0, false, {
                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                    lineNumber: 465,
                                                    columnNumber: 19
                                                }, void 0),
                                                style: {
                                                    height: "100%"
                                                },
                                                children: !generatedLyrics ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Empty, {
                                                    description: "请填写左侧表单并点击生成按钮",
                                                    style: {
                                                        marginTop: 80
                                                    }
                                                }, void 0, false, {
                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 17
                                                }, this) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_xmarkdown.XMarkdown, {
                                                    className: markdownThemeClass,
                                                    config: {
                                                        breaks: true
                                                    },
                                                    children: generatedLyrics
                                                }, void 0, false, {
                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 461,
                                                columnNumber: 13
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                            lineNumber: 460,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                    lineNumber: 166,
                                    columnNumber: 9
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/lyrics-craft/index.tsx",
                            lineNumber: 159,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true);
            };
            _s(LyricsCraftPage, "X4C/4fMYHzAvzdysUKL76ydCI0Y=", false, function() {
                return [
                    _max.useNavigate,
                    _useApiKey.useApiKey,
                    _useLyricsRecords.useLyricsRecords,
                    _antd.message.useMessage,
                    _max.useModel
                ];
            });
            _c = LyricsCraftPage;
            var _default = LyricsCraftPage;
            var _c;
            $RefreshReg$(_c, "LyricsCraftPage");
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
    runtime._h = '121482688162558718';
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

//# sourceMappingURL=src_pages_lyrics-craft_index_tsx-async.11953616162774144515.hot-update.js.map