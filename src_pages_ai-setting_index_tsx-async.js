((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/ai-setting/index.tsx'],
{ "src/pages/ai-setting/index.tsx": function (module, exports, __mako_require__){
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
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19._39948e61760ff9ce55bb289fa3c0c022/node_modules/@ant-design/pro-components/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var _useApiKey = __mako_require__("src/hooks/useApiKey.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const { Text, Paragraph, Title, Link } = _antd.Typography;
const AISettingPage = ()=>{
    _s();
    // 使用自定义hook管理API Key，包括新添加的switchModel方法
    const { apiKey, model, isLoading, saveApiKey, deleteApiKey, validateApiKey, switchModel } = (0, _useApiKey.useApiKey)();
    // 创建 FormInstance 的引用
    const [form] = _antd.Form.useForm();
    // 当API Key加载完成后，设置到表单中
    (0, _react.useEffect)(()=>{
        if (!isLoading) form.setFieldsValue({
            model: model || 'deepseek',
            apiKey: apiKey
        });
    }, [
        apiKey,
        model,
        isLoading,
        form
    ]);
    // 处理模型变化，使用新添加的switchModel方法
    const handleModelChange = async (e)=>{
        const newModel = e.target.value;
        console.log('Changing model to:', newModel);
        await switchModel(newModel);
    };
    // 表单提交处理
    const handleFormSubmit = async (values)=>{
        // 验证API Key格式
        if (!validateApiKey(values.apiKey)) {
            _antd.message.error('API Key格式不正确，请输入有效的API Key');
            return;
        }
        const result = await saveApiKey(values.apiKey, values.model);
        if (result) _antd.message.success('API Key 已成功保存');
        else _antd.message.error('保存API Key失败，请稍后重试');
    };
    // 表单重置处理
    const handleFormReset = async ()=>{
        const result = await deleteApiKey();
        if (result) {
            // 清空表单内容
            form.setFieldsValue({
                model: 'deepseek',
                apiKey: ''
            });
            _antd.message.success('API Key 已删除');
        } else _antd.message.error('删除API Key失败，请稍后重试');
    };
    // 使用条件渲染避免 initialValues 警告
    if (isLoading) return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        loading: true
    }, void 0, false, {
        fileName: "src/pages/ai-setting/index.tsx",
        lineNumber: 81,
        columnNumber: 12
    }, this);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
            orientation: "vertical",
            size: "large",
            children: [
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
                        layout: "vertical",
                        initialValues: {
                            model: model || 'deepseek',
                            apiKey: apiKey
                        },
                        form: form,
                        onFinish: handleFormSubmit,
                        onReset: handleFormReset,
                        submitter: {
                            searchConfig: {
                                submitText: '保存 API Key',
                                resetText: '删除 API Key'
                            }
                        },
                        loading: false,
                        children: [
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm.Item, {
                                name: "model",
                                label: "首选 AI 模型",
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择首选 AI 模型'
                                    }
                                ],
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Radio.Group, {
                                    value: model,
                                    options: [
                                        {
                                            value: 'deepseek',
                                            label: 'DeepSeek v4（最新模型，需充值，10元起步，支持国货💪）'
                                        },
                                        {
                                            value: 'gemini',
                                            label: 'Google Gemini-3.5-Flash（推荐，可白嫖）'
                                        },
                                        {
                                            value: 'glm',
                                            label: '智谱AI GLM-4.7-Flash（可白嫖）'
                                        }
                                    ],
                                    onChange: handleModelChange
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText.Password, {
                                name: "apiKey",
                                label: "API Key",
                                placeholder: "请输入所选 AI 模型的 API Key",
                                fieldProps: {
                                    size: 'large'
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入 API Key'
                                    },
                                    {
                                        validator: (_rule, value)=>{
                                            if (!value || validateApiKey(value)) return Promise.resolve();
                                            return Promise.reject(new Error('API Key格式不正确，请输入有效的 API Key'));
                                        }
                                    }
                                ]
                            }, void 0, false, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                                title: "温馨提示",
                                description: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "您的 API Key 仅保存在本地设备"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 166,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "不会上传至任何第三方服务器"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 167,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "仅通过 HTTPS 直连 AI 模型官方 API"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "您可随时删除保存的 API Key"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 169,
                                                columnNumber: 21
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 165,
                                        columnNumber: 19
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 164,
                                    columnNumber: 17
                                }, void 0),
                                type: "success",
                                style: {
                                    marginBottom: 24
                                }
                            }, void 0, false, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/ai-setting/index.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/ai-setting/index.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                    split: "vertical",
                    children: [
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                            colSpan: 12,
                            children: [
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Title, {
                                    level: 4,
                                    children: "DeepSeek API Key 一分钟申请 + 充值指南（新手版）"
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                    children: [
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("ol", {
                                            children: [
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "打开官网：",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Link, {
                                                            href: "https://platform.deepseek.com/",
                                                            target: "_blank",
                                                            children: "https://platform.deepseek.com/"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "点击右上角 ",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "登录 / 注册"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 25
                                                        }, this),
                                                        "（手机号、邮箱、微信都可以）"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "根据提示完成注册（手机号、邮箱、微信都可以）"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "登录后，在左侧找到 ",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "API 密钥 / API Keys"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "点击 ",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "创建 API Key"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 22
                                                        }, this),
                                                        "，输入名称并确认"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "复制生成的 API Key（记得先保存好，之后看不到完整内容）"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 203,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "在 DeepSeek 平台完成充值：10 元起充，支持微信、支付宝"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "完成！现在就可以正常使用各项 AI 生成功能了"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Title, {
                                            level: 4,
                                            children: "💡 常见问题"
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 208,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("ul", {
                                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "需要付费吗？ 需要。充值 10 元就能用好久"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 210,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/ai-setting/index.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                            colSpan: 12,
                            children: [
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Title, {
                                    level: 4,
                                    children: "Gemini API Key 一分钟申请指南（新手版）"
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                    children: [
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("ol", {
                                            children: [
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "打开官网：",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Link, {
                                                            href: "https://aistudio.google.com/",
                                                            target: "_blank",
                                                            children: "https://aistudio.google.com/"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 220,
                                                            columnNumber: 19
                                                        }, this),
                                                        "（注：需要科学上网环境）"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "登录账号 点击页面上的 ",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Sign in"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 31
                                                        }, this),
                                                        "，使用 Google 账号（Gmail）登录。"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "获取密钥 登录后，点击左上角的 ",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Get API key"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 35
                                                        }, this),
                                                        ' ',
                                                        "按钮"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "创建密钥 点击 ",
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Create API key"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 234,
                                                            columnNumber: 27
                                                        }, this),
                                                        ' ',
                                                        "按钮，如果弹窗询问，选择",
                                                        ' ',
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Create API key in new project"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 19
                                                        }, this),
                                                        "（在新项目中创建）"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "复制并保存 系统会生成一串 AIza 开头的字符，点击 Copy 复制"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "完成！现在就可以正常使用各项 AI 生成功能了"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Title, {
                                            level: 4,
                                            children: "💡 常见问题"
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 245,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("ul", {
                                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "需要付费吗？ 不需要。Gemini API 提供免费额度，对于日常使用完全足够，无需绑定信用卡"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 247,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 246,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/ai-setting/index.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "src/pages/ai-setting/index.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                    split: "vertical",
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                        colSpan: 12,
                        children: [
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Title, {
                                level: 4,
                                children: "智谱AI API Key 一分钟申请指南（新手版）"
                            }, void 0, false, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                children: [
                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("ol", {
                                        children: [
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "打开官网：",
                                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Link, {
                                                        href: "https://open.bigmodel.cn/",
                                                        target: "_blank",
                                                        children: "https://open.bigmodel.cn/"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 261,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "点击右上角 ",
                                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                        code: true,
                                                        children: "登录 / 注册"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 25
                                                    }, this),
                                                    "（手机号、邮箱都可以）"
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 267,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "根据提示完成注册（手机号、邮箱都可以）"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 271,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "登录后，在左侧找到 ",
                                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                        code: true,
                                                        children: "API 密钥 / API Keys"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "点击 ",
                                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                        code: true,
                                                        children: "创建 API Key"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 22
                                                    }, this),
                                                    "，输入名称并确认"
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "复制生成的 API Key（记得先保存好，之后看不到完整内容）"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 278,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 279,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "完成！现在就可以正常使用各项 AI 生成功能了"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 280,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 260,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Title, {
                                        level: 4,
                                        children: "💡 常见问题"
                                    }, void 0, false, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 282,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "需要付费吗？ 不需要，GLM-4.7-Flash是免费模型。"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "是国货么？ 国货"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "模型水平如何？ 写代码水平不错。"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 259,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/ai-setting/index.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/ai-setting/index.tsx",
                    lineNumber: 256,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "src/pages/ai-setting/index.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/ai-setting/index.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
};
_s(AISettingPage, "1ozzVD62NhCfbb1be5D2E4hH5tw=", false, function() {
    return [
        _useApiKey.useApiKey,
        _antd.Form.useForm
    ];
});
_c = AISettingPage;
var _default = AISettingPage;
var _c;
$RefreshReg$(_c, "AISettingPage");
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
//# sourceMappingURL=src_pages_ai-setting_index_tsx-async.js.map