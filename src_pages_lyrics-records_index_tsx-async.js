((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/lyrics-records/index.tsx'],
{ "src/pages/lyrics-records/detail/index.tsx": function (module, exports, __mako_require__){
/**
 * 歌词记录详情组件
 * 展示歌词生成记录的详细信息，包括表单数据和生成的歌词
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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.1.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/icons/es/index.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
var _xmarkdown = __mako_require__("node_modules/.pnpm/@ant-design+x-markdown@2.1.1_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/x-markdown/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
var _masterStyleConfig = __mako_require__("src/config/masterStyleConfig.ts");
var _lyricsEnums = __mako_require__("src/config/lyricsEnums.ts");
var _max = __mako_require__("src/.umi/exports.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const { Paragraph, Text } = _antd.Typography;
const LyricsRecordDetail = ({ record, onClose })=>{
    var _initialState_settings, _SONG_LANGUAGE_OPTIONS_find, _SONG_STYLE_OPTIONS_find, _CLOSENESS_LEVEL_OPTIONS_find, _CREATION_MODE_OPTIONS_find, _SONG_STRUCTURE_OPTIONS_find, _PERSONA_OPTIONS_find, _RHYME_TYPE_OPTIONS_find;
    _s();
    const { initialState } = (0, _max.useModel)("@@initialState");
    // 根据主题设置确定XMarkdown的主题类
    const isDarkTheme = (initialState === null || initialState === void 0 ? void 0 : (_initialState_settings = initialState.settings) === null || _initialState_settings === void 0 ? void 0 : _initialState_settings.navTheme) === "realDark";
    const markdownThemeClass = isDarkTheme ? "markdown-body-dark" : "markdown-body-light";
    const handleCopy = async (text)=>{
        try {
            await navigator.clipboard.writeText(text);
            _antd.message.success("复制成功");
        } catch (_error) {
            _antd.message.error("复制失败");
        }
    };
    const getMasterInfo = (masterId)=>{
        if (!masterId) return undefined;
        return _masterStyleConfig.MASTER_STYLE_CARDS.find((m)=>m.id === masterId);
    };
    if (!record) return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Drawer, {
        title: "歌词生成详情",
        placement: "right",
        open: true,
        size: 992,
        onClose: onClose,
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
            style: {
                textAlign: "center",
                padding: "100px 0"
            },
            children: "记录不存在"
        }, void 0, false, {
            fileName: "src/pages/lyrics-records/detail/index.tsx",
            lineNumber: 77,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "src/pages/lyrics-records/detail/index.tsx",
        lineNumber: 70,
        columnNumber: 7
    }, this);
    const masterInfo = getMasterInfo(record.form_data.master_id);
    // Segmented选项
    const segmentedOptions = [
        {
            label: "基本信息",
            value: "basic-info"
        },
        {
            label: "大师歌词",
            value: "generated-lyrics"
        },
        {
            label: "原始素材",
            value: "raw-material"
        },
        {
            label: "参考歌词",
            value: "reference-lyrics"
        },
        {
            label: "创作参数",
            value: "creation-parameters"
        }
    ];
    // 当前选中的Segmented项
    const [activeItem, setActiveItem] = _react.default.useState("basic-info");
    // 滚动到指定元素
    const scrollToElement = (elementId)=>{
        const element = document.getElementById(elementId);
        if (element) {
            // 获取当前Drawer的滚动容器
            const currentDrawer = element.closest(".ant-drawer");
            if (currentDrawer) {
                const drawerContent = currentDrawer.querySelector(".ant-drawer-body");
                if (drawerContent instanceof HTMLElement) {
                    // 计算滚动位置，考虑到顶部边距
                    const elementTop = element.offsetTop - 57 - 24;
                    drawerContent.scrollTo({
                        top: elementTop,
                        behavior: "smooth"
                    });
                }
            }
        }
    };
    // 监听滚动事件，自动更新activeItem
    _react.default.useEffect(()=>{
        // 获取当前Drawer的滚动容器
        const basicInfoElement = document.getElementById("basic-info");
        if (!basicInfoElement) return;
        const currentDrawer = basicInfoElement.closest(".ant-drawer");
        if (!currentDrawer) return;
        const drawerContent = currentDrawer.querySelector(".ant-drawer-body");
        if (!(drawerContent instanceof HTMLElement)) return;
        const handleScroll = ()=>{
            const scrollPosition = drawerContent.scrollTop + 50;
            // 检查每个内容区域的位置
            for (const option of segmentedOptions){
                const element = document.getElementById(option.value);
                if (element) {
                    const elementTop = element.offsetTop;
                    const elementBottom = elementTop + element.offsetHeight;
                    if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                        setActiveItem(option.value);
                        break;
                    }
                }
            }
        };
        // 添加滚动事件监听
        drawerContent.addEventListener("scroll", handleScroll);
        // 清理函数
        return ()=>{
            drawerContent.removeEventListener("scroll", handleScroll);
        };
    }, [
        segmentedOptions
    ]);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Drawer, {
        title: "歌词生成详情",
        placement: "right",
        open: true,
        size: 992,
        onClose: onClose,
        extra: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Segmented, {
            options: segmentedOptions,
            value: activeItem,
            onChange: (value)=>{
                setActiveItem(value);
                scrollToElement(value);
            }
        }, void 0, false, {
            fileName: "src/pages/lyrics-records/detail/index.tsx",
            lineNumber: 165,
            columnNumber: 9
        }, void 0),
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions, {
                id: "basic-info",
                column: 2,
                title: "基本信息",
                children: [
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "歌曲名称",
                        children: record.form_data.song_name
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "歌曲语言",
                        children: ((_SONG_LANGUAGE_OPTIONS_find = _lyricsEnums.SONG_LANGUAGE_OPTIONS.find((item)=>String(item.value) === String(record.form_data.song_language))) === null || _SONG_LANGUAGE_OPTIONS_find === void 0 ? void 0 : _SONG_LANGUAGE_OPTIONS_find.label) || record.form_data.song_language
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "大师风格",
                        children: masterInfo ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                            children: [
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                    children: masterInfo.name
                                }, void 0, false, {
                                    fileName: "src/pages/lyrics-records/detail/index.tsx",
                                    lineNumber: 188,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                    type: "secondary",
                                    children: masterInfo.description
                                }, void 0, false, {
                                    fileName: "src/pages/lyrics-records/detail/index.tsx",
                                    lineNumber: 189,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/lyrics-records/detail/index.tsx",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                            children: "无"
                        }, void 0, false, {
                            fileName: "src/pages/lyrics-records/detail/index.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "歌曲风格",
                        children: ((_SONG_STYLE_OPTIONS_find = _lyricsEnums.SONG_STYLE_OPTIONS.find((item)=>String(item.value) === String(record.form_data.song_style))) === null || _SONG_STYLE_OPTIONS_find === void 0 ? void 0 : _SONG_STYLE_OPTIONS_find.label) || record.form_data.song_style
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Divider, {}, void 0, false, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                id: "generated-lyrics",
                title: "大师歌词",
                ghost: true,
                extra: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                    size: "small",
                    type: "text",
                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.CopyOutlined, {}, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 212,
                        columnNumber: 19
                    }, void 0),
                    onClick: ()=>handleCopy(record.ai_result.lyrics),
                    children: "复制歌词"
                }, void 0, false, {
                    fileName: "src/pages/lyrics-records/detail/index.tsx",
                    lineNumber: 209,
                    columnNumber: 11
                }, void 0),
                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_xmarkdown.XMarkdown, {
                    className: markdownThemeClass,
                    config: {
                        breaks: true
                    },
                    children: record.ai_result.lyrics
                }, void 0, false, {
                    fileName: "src/pages/lyrics-records/detail/index.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Divider, {}, void 0, false, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                id: "raw-material",
                title: "原始素材",
                ghost: true,
                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_xmarkdown.XMarkdown, {
                    className: markdownThemeClass,
                    config: {
                        breaks: true
                    },
                    children: record.form_data.raw_material
                }, void 0, false, {
                    fileName: "src/pages/lyrics-records/detail/index.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Divider, {}, void 0, false, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                id: "reference-lyrics",
                title: "参考歌词",
                ghost: true,
                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_xmarkdown.XMarkdown, {
                    className: markdownThemeClass,
                    config: {
                        breaks: true
                    },
                    children: record.form_data.reference_lyrics || "无"
                }, void 0, false, {
                    fileName: "src/pages/lyrics-records/detail/index.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Divider, {}, void 0, false, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions, {
                id: "creation-parameters",
                column: 2,
                title: "创作参数",
                children: [
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "参考歌词",
                        span: 2
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "措辞要求",
                        children: Array.isArray(record.form_data.wording_style) ? record.form_data.wording_style.map((style)=>{
                            var _WORDING_STYLE_OPTIONS_find;
                            return ((_WORDING_STYLE_OPTIONS_find = _lyricsEnums.WORDING_STYLE_OPTIONS.find((item)=>String(item.value) === String(style))) === null || _WORDING_STYLE_OPTIONS_find === void 0 ? void 0 : _WORDING_STYLE_OPTIONS_find.label) || style;
                        }).join("、") : record.form_data.wording_style || "无"
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "贴近度",
                        children: ((_CLOSENESS_LEVEL_OPTIONS_find = _lyricsEnums.CLOSENESS_LEVEL_OPTIONS.find((item)=>String(item.value) === String(record.form_data.closeness))) === null || _CLOSENESS_LEVEL_OPTIONS_find === void 0 ? void 0 : _CLOSENESS_LEVEL_OPTIONS_find.label) || `${record.form_data.closeness}`
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "创作模式",
                        children: ((_CREATION_MODE_OPTIONS_find = _lyricsEnums.CREATION_MODE_OPTIONS.find((item)=>String(item.value) === String(record.form_data.creation_mode))) === null || _CREATION_MODE_OPTIONS_find === void 0 ? void 0 : _CREATION_MODE_OPTIONS_find.label) || record.form_data.creation_mode
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "曲式结构",
                        children: ((_SONG_STRUCTURE_OPTIONS_find = _lyricsEnums.SONG_STRUCTURE_OPTIONS.find((item)=>String(item.value) === String(record.form_data.song_structure))) === null || _SONG_STRUCTURE_OPTIONS_find === void 0 ? void 0 : _SONG_STRUCTURE_OPTIONS_find.label) || record.form_data.song_structure
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "叙事人设",
                        children: ((_PERSONA_OPTIONS_find = _lyricsEnums.PERSONA_OPTIONS.find((item)=>String(item.value) === String(record.form_data.persona))) === null || _PERSONA_OPTIONS_find === void 0 ? void 0 : _PERSONA_OPTIONS_find.label) || record.form_data.persona
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "押韵类型",
                        children: ((_RHYME_TYPE_OPTIONS_find = _lyricsEnums.RHYME_TYPE_OPTIONS.find((item)=>String(item.value) === String(record.form_data.rhyme_type))) === null || _RHYME_TYPE_OPTIONS_find === void 0 ? void 0 : _RHYME_TYPE_OPTIONS_find.label) || record.form_data.rhyme_type
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "输出数量",
                        children: record.form_data.output_count
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "AI模型",
                        children: record.ai_result.model
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                        label: "生成时间",
                        children: new Date(record.created_at).toLocaleString("zh-CN")
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-records/detail/index.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/lyrics-records/detail/index.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/lyrics-records/detail/index.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, this);
};
_s(LyricsRecordDetail, "JWuOwed+OWZPg2IxgF286IpIElk=", false, function() {
    return [
        _max.useModel
    ];
});
_c = LyricsRecordDetail;
var _default = LyricsRecordDetail;
var _c;
$RefreshReg$(_c, "LyricsRecordDetail");
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
"src/pages/lyrics-records/index.tsx": function (module, exports, __mako_require__){
/**
 * 歌词记录列表页面
 * 使用ProTable展示所有歌词生成记录
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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.1.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/icons/es/index.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
var _masterStyleConfig = __mako_require__("src/config/masterStyleConfig.ts");
var _lyricsEnums = __mako_require__("src/config/lyricsEnums.ts");
var _useLyricsRecords = __mako_require__("src/hooks/useLyricsRecords.ts");
var _db = __mako_require__("src/services/db.ts");
var _detail = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/pages/lyrics-records/detail/index.tsx"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const LyricsRecordsPage = ()=>{
    _s();
    const navigate = (0, _max.useNavigate)();
    const { deleteRecord } = (0, _useLyricsRecords.useLyricsRecords)();
    const actionRef = (0, _react.useRef)(null);
    const [loading, setLoading] = (0, _react.useState)(false);
    const [open, setOpen] = (0, _react.useState)(false);
    const [selectedRecord, setSelectedRecord] = (0, _react.useState)(null);
    const handleDelete = async (id)=>{
        try {
            const result = await deleteRecord(id);
            if (result.success) {
                var _actionRef_current;
                _antd.message.success("删除成功");
                (_actionRef_current = actionRef.current) === null || _actionRef_current === void 0 || _actionRef_current.reload();
                setOpen(false); // 删除后关闭Drawer
                setSelectedRecord(null);
            } else _antd.message.error("删除失败");
        } catch (_error) {
            _antd.message.error("删除失败");
        }
    };
    const handleView = (record)=>{
        setSelectedRecord(record);
        setOpen(true);
    };
    const handleDrawerClose = ()=>{
        setOpen(false);
        setSelectedRecord(null);
    };
    /**
   * 获取歌词记录数据
   * 处理分页和排序逻辑
   */ const fetchLyricsRecords = async (params, sort)=>{
        setLoading(true);
        try {
            const records = await _db.db.getAllLyricsRecords();
            let filteredRecords = [
                ...records
            ];
            if (params.current && params.pageSize) {
                const start = (params.current - 1) * params.pageSize;
                const end = start + params.pageSize;
                filteredRecords = filteredRecords.slice(start, end);
            }
            if (sort && Object.keys(sort).length > 0) {
                const sortKey = Object.keys(sort)[0];
                const sortOrder = sort[sortKey];
                filteredRecords.sort((a, b)=>{
                    const aVal = a[sortKey];
                    const bVal = b[sortKey];
                    if (aVal === undefined && bVal === undefined) return 0;
                    if (aVal === undefined) return 1;
                    if (bVal === undefined) return -1;
                    if (sortOrder === "ascend") return aVal > bVal ? 1 : -1;
                    else return aVal < bVal ? 1 : -1;
                });
            }
            return {
                data: filteredRecords,
                success: true,
                total: records.length
            };
        } catch (_error) {
            _antd.message.error("加载数据失败");
            return {
                data: [],
                success: false,
                total: 0
            };
        } finally{
            setLoading(false);
        }
    };
    const columns = [
        {
            title: "歌曲名称",
            dataIndex: [
                "form_data",
                "song_name"
            ],
            width: 150,
            fixed: "left",
            ellipsis: true
        },
        {
            title: "风格大师",
            dataIndex: [
                "form_data",
                "master_id"
            ],
            width: 120,
            render: (_, record)=>{
                const masterId = record.form_data.master_id;
                if (!masterId) return "无";
                const master = _masterStyleConfig.MASTER_STYLE_CARDS.find((m)=>m.id === masterId);
                return master ? master.name : masterId;
            }
        },
        {
            title: "语言",
            dataIndex: [
                "form_data",
                "song_language"
            ],
            width: 100,
            render: (_, record)=>{
                const language = _lyricsEnums.SONG_LANGUAGE_OPTIONS.find((item)=>String(item.value) === String(record.form_data.song_language));
                return (language === null || language === void 0 ? void 0 : language.label) || record.form_data.song_language;
            }
        },
        {
            title: "风格",
            dataIndex: [
                "form_data",
                "song_style"
            ],
            width: 100,
            render: (_, record)=>{
                const style = _lyricsEnums.SONG_STYLE_OPTIONS.find((item)=>String(item.value) === String(record.form_data.song_style));
                return (style === null || style === void 0 ? void 0 : style.label) || record.form_data.song_style;
            }
        },
        {
            title: "贴近度",
            dataIndex: [
                "form_data",
                "closeness"
            ],
            width: 100,
            render: (_, record)=>{
                const closeness = record.form_data.closeness;
                const closenessOption = _lyricsEnums.CLOSENESS_LEVEL_OPTIONS.find((item)=>String(item.value) === String(closeness));
                return (closenessOption === null || closenessOption === void 0 ? void 0 : closenessOption.label) || `${closeness}级`;
            }
        },
        {
            title: "生成时间",
            dataIndex: "created_at",
            width: 180,
            valueType: "dateTime",
            sorter: true,
            defaultSortOrder: "descend"
        },
        {
            title: "操作",
            valueType: "option",
            width: 150,
            fixed: "right",
            render: (_, record)=>[
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                        type: "primary",
                        size: "small",
                        icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.EyeOutlined, {}, void 0, false, {
                            fileName: "src/pages/lyrics-records/index.tsx",
                            lineNumber: 189,
                            columnNumber: 17
                        }, void 0),
                        onClick: ()=>handleView(record),
                        children: "查看"
                    }, "view", false, {
                        fileName: "src/pages/lyrics-records/index.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Popconfirm, {
                        title: "确认删除",
                        description: "确定要删除这条记录吗？",
                        onConfirm: ()=>record.id && handleDelete(record.id),
                        okText: "确定",
                        cancelText: "取消",
                        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                            size: "small",
                            danger: true,
                            icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.DeleteOutlined, {}, void 0, false, {
                                fileName: "src/pages/lyrics-records/index.tsx",
                                lineNumber: 202,
                                columnNumber: 45
                            }, void 0),
                            children: "删除"
                        }, void 0, false, {
                            fileName: "src/pages/lyrics-records/index.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this)
                    }, "delete", false, {
                        fileName: "src/pages/lyrics-records/index.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this)
                ]
        }
    ];
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                title: "生成记录仅保存在本地设备，不会上传至服务器，更换设备或浏览器后记录将无法查看。",
                banner: true,
                style: {
                    marginBottom: 24
                }
            }, void 0, false, {
                fileName: "src/pages/lyrics-records/index.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProTable, {
                headerTitle: "大师写歌词生成记录",
                columns: columns,
                actionRef: actionRef,
                request: fetchLyricsRecords,
                rowKey: "id",
                search: false,
                pagination: {
                    defaultPageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total)=>`共 ${total} 条记录`
                },
                scroll: {
                    x: "max-content"
                },
                loading: loading,
                toolBarRender: ()=>[
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                            type: "primary",
                            onClick: ()=>navigate("/lyrics-craft"),
                            children: "创建新歌词"
                        }, "create", false, {
                            fileName: "src/pages/lyrics-records/index.tsx",
                            lineNumber: 233,
                            columnNumber: 11
                        }, void 0)
                    ]
            }, void 0, false, {
                fileName: "src/pages/lyrics-records/index.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            selectedRecord && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_detail.default, {
                record: selectedRecord,
                onClose: handleDrawerClose
            }, void 0, false, {
                fileName: "src/pages/lyrics-records/index.tsx",
                lineNumber: 245,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/lyrics-records/index.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
};
_s(LyricsRecordsPage, "lzjN+7ZqBghFHPXP7l4E0Wka0xM=", false, function() {
    return [
        _max.useNavigate,
        _useLyricsRecords.useLyricsRecords
    ];
});
_c = LyricsRecordsPage;
var _default = LyricsRecordsPage;
var _c;
$RefreshReg$(_c, "LyricsRecordsPage");
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
//# sourceMappingURL=src_pages_lyrics-records_index_tsx-async.js.map