globalThis.makoModuleHotUpdate('src/.umi/umi.ts?hmr', {
    modules: {
        "src/.umi/core/route.tsx": function(module, exports, __mako_require__) {
            "use strict";
            var interop = __mako_require__("@swc/helpers/_/_interop_require_wildcard")._;
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            __mako_require__.d(exports, "getRoutes", {
                enumerable: true,
                get: function() {
                    return getRoutes;
                }
            });
            var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            async function getRoutes() {
                const routes = {
                    "1": {
                        "name": "翻唱编曲大师",
                        "icon": "LikeOutlined",
                        "path": "/",
                        "parentId": "ant-design-pro-layout",
                        "id": "1"
                    },
                    "2": {
                        "name": "生成记录",
                        "icon": "FileTextOutlined",
                        "path": "/record",
                        "parentId": "ant-design-pro-layout",
                        "id": "2"
                    },
                    "3": {
                        "name": "AI 设置",
                        "icon": "SettingOutlined",
                        "path": "/ai-setting",
                        "parentId": "ant-design-pro-layout",
                        "id": "3"
                    },
                    "4": {
                        "name": "项目介绍",
                        "icon": "InfoCircleOutlined",
                        "path": "/about",
                        "parentId": "ant-design-pro-layout",
                        "id": "4"
                    },
                    "5": {
                        "name": "更新记录",
                        "icon": "HistoryOutlined",
                        "path": "/changelog",
                        "parentId": "ant-design-pro-layout",
                        "id": "5"
                    },
                    "6": {
                        "path": "/*",
                        "parentId": "ant-design-pro-layout",
                        "id": "6"
                    },
                    "ant-design-pro-layout": {
                        "id": "ant-design-pro-layout",
                        "path": "/",
                        "isLayout": true
                    },
                    "umi/plugin/openapi": {
                        "path": "/umi/plugin/openapi",
                        "id": "umi/plugin/openapi"
                    }
                };
                return {
                    routes,
                    routeComponents: {
                        '1': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/pages/suno-cover/index.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/pages/suno-cover/index.tsx")))),
                        '2': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/pages/record/index.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/pages/record/index.tsx")))),
                        '3': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/pages/ai-setting/index.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/pages/ai-setting/index.tsx")))),
                        '4': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/pages/about/index.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/pages/about/index.tsx")))),
                        '5': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/pages/changelog/index.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/pages/changelog/index.tsx")))),
                        '6': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/pages/404.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/pages/404.tsx")))),
                        'ant-design-pro-layout': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/.umi/plugin-layout/Layout.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/.umi/plugin-layout/Layout.tsx")))),
                        'umi/plugin/openapi': /*#__PURE__*/ _react.default.lazy(()=>__mako_require__.ensure2("src/.umi/plugin-openapi/openapi.tsx").then(__mako_require__.dr(interop, __mako_require__.bind(__mako_require__, "src/.umi/plugin-openapi/openapi.tsx"))))
                    }
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
        }
    }
}, function(runtime) {
    runtime._h = '7040762698982170370';
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

//# sourceMappingURL=umi.6933013715772715920.hot-update.js.map