globalThis.makoModuleHotUpdate('common', {
    modules: {
        "src/shared/utils/format.ts": function(module, exports, __mako_require__) {
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
                formatDate: function() {
                    return formatDate;
                },
                formatNumber: function() {
                    return formatNumber;
                },
                formatReferenceSongs: function() {
                    return formatReferenceSongs;
                },
                getFullLanguageName: function() {
                    return getFullLanguageName;
                },
                truncateText: function() {
                    return truncateText;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            /**
 * 语言映射：将内部语言代码转换为对外显示的完整语言名称
 * 用于在提示中确保语言描述的一致性和准确性
 */ const languageMap = {
                Mandarin: 'Mandarin Chinese',
                Cantonese: 'Cantonese',
                Minnan: 'Minnan',
                English: 'English',
                Korean: 'Korean',
                Japanese: 'Japanese',
                Other: 'Other'
            };
            const getFullLanguageName = (languageCode)=>{
                return languageMap[languageCode] || languageCode;
            };
            const formatReferenceSongs = (referenceSongs, targetArtist)=>{
                if (referenceSongs.length === 0) return 'None';
                return referenceSongs.filter((song)=>song.title).map((song)=>`${song.title} by ${song.artist || targetArtist}`).join('\n');
            };
            const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss')=>{
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day).replace('HH', hours).replace('mm', minutes).replace('ss', seconds);
            };
            const formatNumber = (number)=>{
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            };
            const truncateText = (text, maxLength)=>{
                if (text.length <= maxLength) return text;
                return text.substring(0, maxLength) + '...';
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
        }
    }
}, function(runtime) {
    runtime._h = '6933013715772715920';
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

//# sourceMappingURL=common-async.12529692599258949215.hot-update.js.map