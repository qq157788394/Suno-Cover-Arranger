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
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
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
    const { apiKey, model, isLoading, saveApiKey, deleteApiKey, validateApiKey, switchModel } = (0, _useApiKey.useApiKey)();
    const [form] = _antd.Form.useForm();
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
    const handleModelChange = async (e)=>{
        const newModel = e.target.value;
        console.log('Changing model to:', newModel);
        await switchModel(newModel);
    };
    const handleFormSubmit = async (values)=>{
        if (!validateApiKey(values.apiKey)) {
            _antd.message.error('API Key格式不正确，请输入有效的API Key');
            return;
        }
        const result = await saveApiKey(values.apiKey, values.model);
        if (result) _antd.message.success('API Key 已成功保存');
        else _antd.message.error('保存API Key失败，请稍后重试');
    };
    const handleFormReset = async ()=>{
        const result = await deleteApiKey();
        if (result) {
            form.setFieldsValue({
                model: 'deepseek',
                apiKey: ''
            });
            _antd.message.success('API Key 已删除');
        } else _antd.message.error('删除API Key失败，请稍后重试');
    };
    return (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        children: (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
            orientation: "vertical",
            size: "large",
            children: [
                (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                    children: (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
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
                        loading: isLoading,
                        children: [
                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm.Item, {
                                name: "model",
                                label: "首选 AI 模型",
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择首选 AI 模型'
                                    }
                                ],
                                children: (0, _jsxdevruntime.jsxDEV)(_antd.Radio.Group, {
                                    value: model,
                                    options: [
                                        {
                                            value: 'deepseek',
                                            label: 'DeepSeek v3.2（需充值，10元起步，支持国货💪）'
                                        },
                                        {
                                            value: 'gemini',
                                            label: 'Google Gemini 3（推荐，可免费白嫖）'
                                        },
                                        {
                                            value: 'mimo',
                                            label: '小米MiMo V2 Flash（限时免费白嫖，但需要在本地运行，线上无法使用）'
                                        }
                                    ],
                                    onChange: handleModelChange
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText.Password, {
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
                                lineNumber: 126,
                                columnNumber: 13
                            }, this),
                            (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                                title: "温馨提示",
                                description: (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                    children: (0, _jsxdevruntime.jsxDEV)("ul", {
                                        children: [
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "您的 API Key 仅保存在本地设备"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 156,
                                                columnNumber: 21
                                            }, void 0),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "不会上传至任何第三方服务器"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 157,
                                                columnNumber: 21
                                            }, void 0),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "仅通过 HTTPS 直连 AI 模型官方 API"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 158,
                                                columnNumber: 21
                                            }, void 0),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "您可随时删除保存的 API Key"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 155,
                                        columnNumber: 19
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, void 0),
                                type: "success",
                                style: {
                                    marginBottom: 24
                                }
                            }, void 0, false, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/ai-setting/index.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/ai-setting/index.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this),
                (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                    split: "vertical",
                    children: [
                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                            colSpan: 12,
                            children: [
                                (0, _jsxdevruntime.jsxDEV)(Title, {
                                    level: 4,
                                    children: "DeepSeek API Key 一分钟申请 + 充值指南（新手版）"
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                    children: [
                                        (0, _jsxdevruntime.jsxDEV)("ol", {
                                            children: [
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "打开官网：",
                                                        (0, _jsxdevruntime.jsxDEV)(Link, {
                                                            href: "https://platform.deepseek.com/",
                                                            target: "_blank",
                                                            children: "https://platform.deepseek.com/"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "点击右上角 ",
                                                        (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "登录 / 注册"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 183,
                                                            columnNumber: 25
                                                        }, this),
                                                        "（手机号、邮箱、微信都可以）"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "根据提示完成注册（手机号、邮箱、微信都可以）"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "登录后，在左侧找到 ",
                                                        (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "API 密钥 / API Keys"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "点击 ",
                                                        (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "创建 API Key"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 191,
                                                            columnNumber: 22
                                                        }, this),
                                                        "，输入名称并确认"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "复制生成的 API Key（记得先保存好，之后看不到完整内容）"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "在 DeepSeek 平台完成充值：10 元起充，支持微信、支付宝"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "完成！现在就可以正常使用各项 AI 生成功能了"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, this),
                                        (0, _jsxdevruntime.jsxDEV)(Title, {
                                            level: 4,
                                            children: "💡 常见问题"
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 198,
                                            columnNumber: 15
                                        }, this),
                                        (0, _jsxdevruntime.jsxDEV)("ul", {
                                            children: (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "需要付费吗？ 需要。充值 10 元就能用好久"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/ai-setting/index.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this),
                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                            colSpan: 12,
                            children: [
                                (0, _jsxdevruntime.jsxDEV)(Title, {
                                    level: 4,
                                    children: "Gemini API Key 一分钟申请指南（新手版）"
                                }, void 0, false, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this),
                                (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                    children: [
                                        (0, _jsxdevruntime.jsxDEV)("ol", {
                                            children: [
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "打开官网：",
                                                        (0, _jsxdevruntime.jsxDEV)(Link, {
                                                            href: "https://aistudio.google.com/",
                                                            target: "_blank",
                                                            children: "https://aistudio.google.com/"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 210,
                                                            columnNumber: 19
                                                        }, this),
                                                        "（注：需要科学上网环境）"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "登录账号 点击页面上的 ",
                                                        (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Sign in"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 31
                                                        }, this),
                                                        "，使用 Google 账号（Gmail）登录。"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "获取密钥 登录后，点击左上角的 ",
                                                        (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Get API key"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 220,
                                                            columnNumber: 35
                                                        }, this),
                                                        ' ',
                                                        "按钮"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: [
                                                        "创建密钥 点击 ",
                                                        (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Create API key"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 27
                                                        }, this),
                                                        ' ',
                                                        "按钮，如果弹窗询问，选择",
                                                        ' ',
                                                        (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            code: true,
                                                            children: "Create API key in new project"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/ai-setting/index.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 19
                                                        }, this),
                                                        "（在新项目中创建）"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "复制并保存 系统会生成一串 AIza 开头的字符，点击 Copy 复制"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 232,
                                                    columnNumber: 17
                                                }, this),
                                                (0, _jsxdevruntime.jsxDEV)("li", {
                                                    children: "完成！现在就可以正常使用各项 AI 生成功能了"
                                                }, void 0, false, {
                                                    fileName: "src/pages/ai-setting/index.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this),
                                        (0, _jsxdevruntime.jsxDEV)(Title, {
                                            level: 4,
                                            children: "💡 常见问题"
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 235,
                                            columnNumber: 15
                                        }, this),
                                        (0, _jsxdevruntime.jsxDEV)("ul", {
                                            children: (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "需要付费吗？ 不需要。Gemini API 提供免费额度，对于日常使用完全足够，无需绑定信用卡"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 237,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/ai-setting/index.tsx",
                                            lineNumber: 236,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/ai-setting/index.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/ai-setting/index.tsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "src/pages/ai-setting/index.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                    split: "vertical",
                    children: (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                        colSpan: 12,
                        children: [
                            (0, _jsxdevruntime.jsxDEV)(Title, {
                                level: 4,
                                children: "小米MiMo API Key 申请指南（新手版）"
                            }, void 0, false, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this),
                            (0, _jsxdevruntime.jsxDEV)(Paragraph, {
                                children: [
                                    (0, _jsxdevruntime.jsxDEV)("ol", {
                                        children: [
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "打开官网：",
                                                    (0, _jsxdevruntime.jsxDEV)(Link, {
                                                        href: "https://platform.xiaomimimo.com/",
                                                        target: "_blank",
                                                        children: "https://platform.xiaomimimo.com/"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 253,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 251,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "在页面中找到 ",
                                                    (0, _jsxdevruntime.jsxDEV)(Text, {
                                                        code: true,
                                                        children: "申请 API Key"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 26
                                                    }, this),
                                                    " 按钮，点击"
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 257,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "按页面提示，登录 / 注册小米账号 ",
                                                    (0, _jsxdevruntime.jsxDEV)(Text, {
                                                        code: true,
                                                        children: "登录 / 注册"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 260,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: [
                                                    "创建密钥 点击 ",
                                                    (0, _jsxdevruntime.jsxDEV)(Text, {
                                                        code: true,
                                                        children: "新建 API Key"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/ai-setting/index.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 27
                                                    }, this),
                                                    ' ',
                                                    "按钮，输入名称并确认"
                                                ]
                                            }, void 0, true, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "复制并保存 系统会生成一串 sk-开头的字符，点击复制按钮"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 267,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "回到本应用 → 打开 设置 / AI 设置 → 粘贴 API Key → 保存"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 268,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "完成！现在就可以正常使用各项 AI 生成功能了"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 269,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this),
                                    (0, _jsxdevruntime.jsxDEV)(Title, {
                                        level: 4,
                                        children: "💡 常见问题"
                                    }, void 0, false, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 271,
                                        columnNumber: 15
                                    }, this),
                                    (0, _jsxdevruntime.jsxDEV)("ul", {
                                        children: [
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "无法使用？ 请确保在本地运行项目，线上环境无法使用"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 273,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "需要付费吗？ 新模型，面向全球公测，限时免费！"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 274,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "访问限制？ 国内可直接访问，无需科学上网"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)("li", {
                                                children: "模型水平如何？ 新模型，up主只开发了功能，并没有深入进行测试"
                                            }, void 0, false, {
                                                fileName: "src/pages/ai-setting/index.tsx",
                                                lineNumber: 276,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/ai-setting/index.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "src/pages/ai-setting/index.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/ai-setting/index.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/ai-setting/index.tsx",
                    lineNumber: 246,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "src/pages/ai-setting/index.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/ai-setting/index.tsx",
        lineNumber: 84,
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