((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['p__changelog__index'],
{ "src/pages/changelog/index.tsx": function (module, exports, __mako_require__){
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
var _xmarkdown = __mako_require__("node_modules/.pnpm/@ant-design+x-markdown@2.1.1_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/x-markdown/es/index.js");
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
"";
"";
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const ChangelogPage = ()=>{
    var _initialState_settings;
    _s();
    const [changelogContent, setChangelogContent] = (0, _react.useState)('');
    const [loading, setLoading] = (0, _react.useState)(true);
    const { initialState } = (0, _max.useModel)('@@initialState');
    const isDarkTheme = (initialState === null || initialState === void 0 ? void 0 : (_initialState_settings = initialState.settings) === null || _initialState_settings === void 0 ? void 0 : _initialState_settings.navTheme) === 'realDark';
    const markdownThemeClass = isDarkTheme ? 'x-markdown-dark' : 'x-markdown-light';
    (0, _react.useEffect)(()=>{
        var response, content;
        {
            const fetchChangelog = async ()=>{
                try {
                    const response = await fetch('/api/changelog');
                    if (response.ok) {
                        const content = await response.text();
                        setChangelogContent(content);
                    } else {
                        console.error('Failed to fetch changelog.md');
                        setChangelogContent('# 更新记录\n\n暂无更新记录，请稍后查看。');
                    }
                } catch (error) {
                    console.error('Error fetching changelog.md:', error);
                    setChangelogContent('# 更新记录\n\n暂无更新记录，请稍后查看。');
                } finally{
                    setLoading(false);
                }
            };
            fetchChangelog();
        }
    }, []);
    return (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        title: "更新记录",
        children: (0, _jsxdevruntime.jsxDEV)(_antd.Card, {
            children: loading ? (0, _jsxdevruntime.jsxDEV)("div", {
                style: {
                    textAlign: 'center',
                    padding: '40px'
                },
                children: (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                    size: "large"
                }, void 0, false, {
                    fileName: "src/pages/changelog/index.tsx",
                    lineNumber: 75,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "src/pages/changelog/index.tsx",
                lineNumber: 74,
                columnNumber: 11
            }, this) : (0, _jsxdevruntime.jsxDEV)(_xmarkdown.XMarkdown, {
                className: markdownThemeClass,
                children: changelogContent
            }, void 0, false, {
                fileName: "src/pages/changelog/index.tsx",
                lineNumber: 78,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "src/pages/changelog/index.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/changelog/index.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
};
_s(ChangelogPage, "hiyVDiVFVzzs8fZjaRxu9VZLr90=", false, function() {
    return [
        _max.useModel
    ];
});
_c = ChangelogPage;
var _default = ChangelogPage;
var _c;
$RefreshReg$(_c, "ChangelogPage");
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
//# sourceMappingURL=p__changelog__index-async.js.map