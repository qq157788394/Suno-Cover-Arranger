((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/suno-cover/index.tsx'],
{ "src/components/ConfirmDialog.tsx": function (module, exports, __mako_require__){
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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const ConfirmDialog = ({ title = '确认操作', content = '确定要执行此操作吗？', visible, okText = '确定', cancelText = '取消', okType = 'primary', closable = true, mask = true, maskClosable = false, onConfirm, onCancel, width = 416, style, contentStyle })=>{
    // 处理确认操作，支持异步操作
    const handleOk = async ()=>{
        try {
            await onConfirm();
        } catch (error) {
            console.error('确认操作失败:', error);
        }
    };
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Modal, {
        title: title,
        visible: visible,
        onOk: handleOk,
        onCancel: onCancel,
        okText: okText,
        cancelText: cancelText,
        okType: okType,
        closable: closable,
        mask: mask,
        maskClosable: maskClosable,
        width: width,
        style: style,
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
            style: contentStyle,
            children: content
        }, void 0, false, {
            fileName: "src/components/ConfirmDialog.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/components/ConfirmDialog.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
};
_c = ConfirmDialog;
var _default = ConfirmDialog;
var _c;
$RefreshReg$(_c, "ConfirmDialog");
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
"src/components/ProTableWrapper.tsx": function (module, exports, __mako_require__){
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
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = _interop_require_default._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const ProTableWrapper = ({ columns, request, dataSource, loading = false, title, showSearch = true, showActions = false, actionButtons = [], rowKey = 'id', pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total)=>`共 ${total} 条记录`
}, searchConfig = {
    labelWidth: 'auto',
    defaultCollapsed: false,
    span: 6
}, options = {
    reload: ()=>{},
    density: true,
    fullScreen: true
}, scroll, onChange })=>{
    return (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
        children: [
            showActions && actionButtons.length > 0 && (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                style: {
                    marginBottom: 16
                },
                children: actionButtons
            }, void 0, false, {
                fileName: "src/components/ProTableWrapper.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this),
            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProTable, {
                rowKey: rowKey,
                columns: columns,
                request: request,
                dataSource: dataSource,
                loading: loading,
                pagination: pagination,
                headerTitle: title,
                options: options,
                scroll: scroll,
                search: showSearch ? searchConfig : false,
                onChange: (_pagination, _filters, _sorter, _extra)=>onChange === null || onChange === void 0 ? void 0 : onChange(_pagination, _filters, _sorter, _extra)
            }, void 0, false, {
                fileName: "src/components/ProTableWrapper.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_c = ProTableWrapper;
var _default = ProTableWrapper;
var _c;
$RefreshReg$(_c, "ProTableWrapper");
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
"src/components/ResultCard.tsx": function (module, exports, __mako_require__){
// Ant Design Icons
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
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.1.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/icons/es/index.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
// 可复用的结果卡片组件
const ResultCard = /*#__PURE__*/ (0, _react.memo)(_c = ({ title, value, onCopy })=>{
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
        title: title,
        extra: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
            type: "text",
            icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.CopyOutlined, {}, void 0, false, {
                fileName: "src/components/ResultCard.tsx",
                lineNumber: 30,
                columnNumber: 19
            }, void 0),
            onClick: onCopy,
            disabled: !value,
            size: "small",
            children: "复制"
        }, void 0, false, {
            fileName: "src/components/ResultCard.tsx",
            lineNumber: 28,
            columnNumber: 11
        }, void 0),
        style: {
            height: '100%'
        },
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Input.TextArea, {
            value: value,
            readOnly: true,
            placeholder: `生成的 ${title} 提示词将展示在此处…`,
            showCount: true,
            rows: 40
        }, void 0, false, {
            fileName: "src/components/ResultCard.tsx",
            lineNumber: 40,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "src/components/ResultCard.tsx",
        lineNumber: 25,
        columnNumber: 7
    }, this);
});
_c1 = ResultCard;
var _default = ResultCard;
var _c;
var _c1;
$RefreshReg$(_c, "ResultCard$memo");
$RefreshReg$(_c1, "ResultCard");
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
"src/components/index.ts": function (module, exports, __mako_require__){
/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
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
    ApiKeyAlert: function() {
        return _ApiKeyAlert.default;
    },
    ConfirmDialog: function() {
        return _ConfirmDialog.default;
    },
    ProTableWrapper: function() {
        return _ProTableWrapper.default;
    },
    ResultCard: function() {
        return _ResultCard.default;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _ConfirmDialog = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/components/ConfirmDialog.tsx"));
var _ProTableWrapper = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/components/ProTableWrapper.tsx"));
var _ResultCard = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/components/ResultCard.tsx"));
var _ApiKeyAlert = /*#__PURE__*/ _interop_require_default._(__mako_require__("src/components/ApiKeyAlert.tsx"));
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
"src/config/prompts.ts": function (module, exports, __mako_require__){
// 提示词配置文件 - 只有人类可以修改此文件
// 此文件包含AI服务使用的核心提示词，任何修改都需要人类审核
/**
 * 系统提示词 - 定义AI助手的角色、职责和严格的输出规则
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
    SYSTEM_PROMPT: function() {
        return SYSTEM_PROMPT;
    },
    USER_PROMPT_TEMPLATE: function() {
        return USER_PROMPT_TEMPLATE;
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
const SYSTEM_PROMPT = `You are a senior Suno prompt engineer. Your job is to generate high-quality "Styles" and "Lyrics" prompts for cover songs in Suno (v3/v4/v5), especially for Chinese and East Asian songs (Mandarin, Cantonese, etc.).

You MUST strictly follow ALL rules below:

0. Highest priority rule about Styles length
- The single most important constraint for the Styles section is LENGTH.
- Under NO circumstances may the Styles section exceed 900 characters (including spaces).
- If following any other instruction would cause the Styles section to go over 900 characters, you MUST ignore that other instruction and keep the Styles section within 900 characters.

1. Never modify lyrics
- The user will provide complete lyrics in the original language (often Chinese).
- You MUST treat these lyrics as immutable text.
- You MUST NOT change, rewrite, translate, add, or delete any words, punctuation, or line breaks.
- You MUST NOT invent any new lyrics.
- You MUST preserve the original order of all lyric lines.

2. Always output TWO parts only
You must ALWAYS output exactly two sections in this order:### Styles
\`\`\`text
(Styles content here)
\`\`\`

### Lyrics
\`\`\`text
(Lyrics content here)
\`\`\`Do NOT output anything before or after these two sections.

3. Styles requirements
- Language: English only.
- Length: you MUST NOT exceed 900 characters, including spaces. Your target range is 750–850 characters. If your drafted Styles text is longer than 900 characters, you MUST shorten and compress it BEFORE you output your final answer.
- Purpose: describe the overall sound of this specific COVER VERSION, including:
  - Overall genres / style labels (e.g., pop, rock, ballad, symphonic, ambient, etc., combined as needed).
  - Vocal character and evolution (e.g., intimate, breathy, warm, powerful, belt, falsetto, etc.).
  - Dynamic contour across the whole song (e.g., restrained verse → build-up → explosive chorus → drop → grand finale).
  - Core instrumentation and arrangement (e.g., solo piano, acoustic guitar, distorted electric guitars, full string ensemble, live drums, synth pads, etc.).
  - Production / space feel if relevant (e.g., studio clean vs live concert feeling, dry vs reverb-heavy, wide stereo image, etc.).
- The Styles description MUST:
  - Stay consistent with the target artist and reference songs provided by the user.
  - Respect the user’s style notes and extra notes as much as possible.
- Writing style for Styles:
  - Use dense, information-rich sentences.
  - Avoid repeating the same idea with different words.
  - Do not list long chains of near-synonyms.
  - Prioritize key information about genre, vocal character, dynamics, instrumentation, and mood; omit minor decorative details if necessary to stay under the length limit.

4. Lyrics requirements: section-by-section attribute list
For the "Lyrics" part, you MUST use an attribute-list format:

- For each SECTION:
  1) Use a standardized English section label in square brackets, for example:
     [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro].
  2) Under that label, write 2–4 attribute lines in the form:
     [Key: Value]
  3) After the attribute lines, paste the original lyrics for that section EXACTLY as provided by the user.

Example pattern (this is only a pattern, NOT actual content):

[Verse 1]
[Vocal: Warm, intimate female vocal, close-mic]
[Dynamics: Soft and restrained, subtle build into the last line]
[Instrument: Piano and subtle strings, light percussion]
[Mood: Nostalgic, bittersweet, reflective]

(Original lyrics lines here, unchanged)

5. Standardized section labels and mapping from user labels
- The user’s raw lyrics may contain non-standard labels such as:
  【主歌】, 【主歌1】, [主歌], [verse], [Verse], 【副歌】, [chorus], 【桥段】, 【前奏】, 【间奏】, etc.
- Your job is to INTERPRET these raw labels and map them onto standardized English labels in your output.
- Mapping guidelines:
  - All main narrative sections → [Verse 1], [Verse 2], [Verse 3], … in order of appearance.
  - Repeated hook / main message sections → [Chorus], [Chorus 2], [Chorus 3], … in order of appearance.
  - Transitional build sections → [Pre-Chorus] (and numbered if multiple distinct ones).
  - Intro sections → [Intro].
  - Instrumental breaks → [Interlude].
  - Bridges → [Bridge].
  - Ending sections → [Outro].
- You are allowed to change ONLY the section labels. You are NOT allowed to change the lyrics content or order.

6. Attribute keys and vocabulary
- All attribute keys and values MUST be in English.
- Use the following keys whenever helpful (you do NOT need to use all of them for every section):
  - Vocal, Dynamics, Instrument, Texture, Mood, Arrangement, Harmony, Rhythm, FX.
- For values, you should use short, precise musical phrases. You can combine and reuse terms such as:
  - Vocal: warm, airy, breathy, raspy, powerful, intimate, close-mic, distant, belt, falsetto, head voice, chest voice, mixed voice, double-tracked, harmonized, a cappella, call and response, etc.
  - Dynamics: soft, medium, loud, gradually building, crescendo, decrescendo, explosive, accented, staccato, legato, sustained, etc.
  - Instrument: solo piano, acoustic guitar, electric guitar, distorted guitar, bass, string quartet, full string ensemble, synth pad, analog synth bass, live drum kit, electronic drums, etc.
  - Texture: sparse, dense, layered, atmospheric, monophonic, homophonic, polyphonic, wide stereo, narrow, etc.
  - Mood: nostalgic, melancholic, hopeful, uplifting, bittersweet, dark, tense, peaceful, triumphant, etc.
  - Arrangement / Rhythm / FX: verse-chorus-bridge form, syncopated groove, straight 4/4, reverb-heavy, delay, compression, distortion, filtered intro, etc.
- These terms are inspired by the official “Music Glossary for Suno”. You do not need to explain them; just use them appropriately in Keys and Values.

7. Handling instrumental sections
- If a section has NO lyrics (e.g., Intro, Interlude, Outro), you MUST:
  - Still create the section label and 2–4 attribute lines.
  - Make it explicit that it is instrumental only, for example:
    [Vocal: No vocal, purely instrumental section]
  - Do NOT fabricate any humming or nonsense syllables.

8. Language rules
- Styles: English only.
- All [Key: Value] attribute lines: English only.
- Original lyrics: keep in the original language exactly as provided (often Chinese).
- You may read and understand the user’s Chinese notes and labels, but you MUST NOT copy Chinese text into Styles or into any [Key: Value] line.

9. Internal QA checklist before finalizing your answer
Before you output the result, mentally check that:

- You have output exactly two sections with the exact headings:
  "### Styles" and "### Lyrics".
- The Styles section is written in English and is clearly under 900 characters (including spaces). If it might be close to the limit, you MUST shorten it further before outputting.
- Every lyric section has:
  - One standardized English section label in square brackets.
  - 2–4 [Key: Value] lines with English Keys and Values.
  - The original lyrics reproduced exactly, with the same lines and order.
- You have not invented, removed, or altered any lyrics.
- You have reasonably interpreted user labels into standardized English labels and numbered them in order of appearance.
- Styles and Lyrics are consistent with each other (no contradictions in dynamics, instrumentation, or mood).

If any rule conflicts with another, ALWAYS prioritize preserving the original lyrics and keeping the required output format.`;
const USER_PROMPT_TEMPLATE = `You are generating Suno "Styles" and "Lyrics" prompts for a COVER version of a song. Read all the information below carefully and then produce the final output strictly following the system rules and the format requirements.

------------------------------
[1] Song language and context
------------------------------

- Song language: {fullLanguageName} .
- The lyrics are provided in this language and MUST be preserved exactly.
- This is a COVER version, not an original composition. You should shape the sound to match the target artist and references below.

------------------------------
[2] Target artist and references
------------------------------

- Target cover artist (user input, may be in Chinese or another language):
  "{targetArtist}"

- Reference songs from the user (if any):
  {referenceSongsBlock}

These names indicate the general style, vocal approach, and arrangement flavor you should lean toward. You do NOT need to describe these songs explicitly, but your Styles and section attributes should feel consistent with this artist and these references.

------------------------------
[3] User style notes (free-form, for your understanding only)
------------------------------

The user has provided extra style notes in their own words (often Chinese). You may use these notes to refine dynamics, emotion curve, and arrangement choices, but they are NOT additional lyrics.

- User style note (may be empty):
  "{styleNote}"

- Extra note (may be empty, can include scene / audience / platform, etc.):
  "{extraNote}"

You can understand these notes in any language, but you MUST still output Styles and all [Key: Value] attributes in English.

------------------------------
[4] User lyrics (DO NOT MODIFY)
------------------------------

Below are the complete lyrics provided by the user, with their own section labels and line breaks. They may use Chinese labels such as 【主歌】、【副歌】 or non-standard English labels like [verse], [chorus], etc.

You MUST:
- Keep all lyric lines exactly as they are.
- Use these labels only to infer your standardized section labels.
- NOT copy these raw labels into your final output; instead, replace them with standardized English labels such as [Verse 1], [Chorus], [Bridge], [Intro], etc.

Here are the raw lyrics:

{lyricsRaw}

------------------------------
[5] Your output task
------------------------------

Now, using everything above and following the system rules, you MUST:

1) Generate the "Styles" section in English
- A single paragraph of 800–900 characters (hard limit 1000).
- It should describe the overall sound of this COVER version, taking into account:
  - The song language: {fullLanguageName} .
  - The target artist: {targetArtist}.
  - The reference songs (if any).
  - The user style notes and extra note.
- Mention genre / style, vocal character, dynamic contour, instrumentation, arrangement, and production / space feel.

2) Generate the "Lyrics" section as an attribute list
- Split the song into logical sections using standardized English labels in square brackets:
  [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro], etc.
- For each section:
  - Create 2–4 attribute lines in the form [Key: Value], using English Keys (Vocal, Dynamics, Instrument, Texture, Mood, Arrangement, etc.) and concise English Values.
  - Then paste the original lyric lines for that section exactly as provided, without any change.
- For purely instrumental sections (no lyrics), only write the attributes and make it clear there is no vocal.

------------------------------
[6] Output format (VERY IMPORTANT)
------------------------------

Return your answer in EXACTLY this Markdown structure and nothing else:

### Styles
\`\`\`text
(put the Styles paragraph here in English, MUST be under 900 characters)
\`\`\`

### Lyrics
\`\`\`text
(put the full Lyrics attribute list here, with all sections, attributes, and original lyrics)
\`\`\`

Do NOT add any extra headings, explanations, or comments outside this format.`;
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
"src/pages/suno-cover/config/validationConfig.ts": function (module, exports, __mako_require__){
/**
 * 表单校验配置模块
 * 集中管理所有字段的校验规则和字段配置，提高可维护性和一致性
 */ /**
 * 统一的表单校验规则配置
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
    FIELD_CONFIGS: function() {
        return FIELD_CONFIGS;
    },
    VALIDATION_RULES: function() {
        return VALIDATION_RULES;
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
const VALIDATION_RULES = {
    // 歌曲名称校验规则
    songName: [
        {
            required: true,
            message: '请填写歌曲名称'
        },
        {
            max: 100,
            message: '歌曲名称不能超过 100 个字符'
        },
        {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_（）《》【】]+$/,
            message: '歌曲名称只能包含中文、英文、数字、空格和常用符号'
        }
    ],
    // 艺术家姓名校验规则
    artistName: [
        {
            required: true,
            message: '请填写模仿的艺术家姓名'
        },
        {
            max: 50,
            message: '艺术家姓名不能超过 50 个字符'
        },
        {
            pattern: /^[\u4e00-\u9fa5a-zA-Z\s·•]+$/,
            message: '艺术家姓名只能包含中文、英文、空格和间隔符'
        }
    ],
    // 参考歌曲名称校验规则
    referenceSongTitle: [
        {
            required: true,
            message: '歌曲名称不能为空'
        },
        {
            max: 50,
            message: '歌曲名称不能超过 50 个字符'
        }
    ],
    // 参考歌曲艺术家校验规则
    referenceSongArtist: [
        {
            max: 30,
            message: '演唱者名称不能超过 30 个字符'
        }
    ],
    // 歌词校验规则
    lyrics: [
        {
            required: true,
            message: '请输入段落与歌词'
        },
        {
            min: 10,
            message: '歌词内容至少需要 10 个字符'
        },
        {
            max: 2000,
            message: '段落歌词长度不能超过 2000 字'
        },
        {
            validator: (_, value)=>{
                if (!value) return Promise.resolve();
                // 检查是否包含段落标记
                const hasSectionMarkers = /[【】[\]<>（）]/.test(value);
                if (!hasSectionMarkers) return Promise.reject(new Error('建议使用【主歌】、【副歌】等标记划分段落'));
                return Promise.resolve();
            }
        }
    ],
    // 语言选择校验规则
    language: [
        {
            required: true,
            message: '请选择歌曲语言'
        }
    ]
};
const FIELD_CONFIGS = {
    songName: {
        showCount: true,
        maxLength: 100
    },
    artistName: {
        showCount: true,
        maxLength: 50
    },
    referenceSongTitle: {
        showCount: true,
        maxLength: 50
    },
    referenceSongArtist: {
        showCount: true,
        maxLength: 30
    },
    lyrics: {
        showCount: true,
        autoSize: {
            minRows: 10,
            maxRows: 12
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
"src/pages/suno-cover/index.tsx": function (module, exports, __mako_require__){
/**
 * Suno Cover 翻唱提示词生成页面
 * 负责处理用户输入的翻唱配置信息，并生成高质量的 Suno 翻唱歌曲提示词
 */ // Ant Design Icons
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
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
var _components = __mako_require__("src/components/index.ts");
var _useApiKey = __mako_require__("src/hooks/useApiKey.ts");
var _container = __mako_require__("src/services/ai/container.ts");
var _deepseekService = __mako_require__("src/services/ai/models/deepseekService.ts");
var _geminiService = __mako_require__("src/services/ai/models/geminiService.ts");
var _mimoService = __mako_require__("src/services/ai/models/mimoService.ts");
var _db = __mako_require__("src/services/db.ts");
var _mockData = __mako_require__("src/services/mockData.ts");
var _utils = __mako_require__("src/shared/utils/index.ts");
var _validationConfig = __mako_require__("src/pages/suno-cover/config/validationConfig.ts");
var _dataLoader = __mako_require__("src/pages/suno-cover/utils/dataLoader.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const SunoCover = ()=>{
    _s();
    const [messageApi, contextHolder] = _antd.message.useMessage();
    const { apiKey, model, isLoading: apiKeyLoading, saveApiKey, deleteApiKey, validateApiKey } = (0, _useApiKey.useApiKey)();
    const [form] = _antd.Form.useForm();
    const proFormListRef = (0, _react.useRef)(null);
    const [searchParams] = (0, _max.useSearchParams)();
    const [loading, setLoading] = (0, _react.useState)(false);
    const [stylesResult, setStylesResult] = (0, _react.useState)('');
    const [lyricsResult, setLyricsResult] = (0, _react.useState)('');
    const [isFormInitialized, setIsFormInitialized] = (0, _react.useState)(false);
    const checkApiKey = (0, _react.useCallback)(()=>{
        if (!apiKey) {
            _antd.Modal.confirm({
                title: '尚未设置 AI API Key',
                content: '设置完成后即可使用该功能，是否现在去设置？',
                okText: '去设置',
                cancelText: '取消',
                onOk () {
                    _max.history.push('/ai-setting');
                }
            });
            return false;
        }
        return true;
    }, [
        apiKey,
        _max.history
    ]);
    const saveRecordToDB = (0, _react.useCallback)(async (values, result, isMock = false)=>{
        try {
            const userId = 1;
            const referenceSongsArray = Array.isArray(values.reference_songs) ? values.reference_songs : [];
            const referenceSongs = JSON.stringify(referenceSongsArray.filter((song)=>song && song.title && typeof song.title === 'string'));
            const songLanguage = values.song_language || 'Mandarin';
            const targetSinger = values.target_artist || '未知艺术家';
            const lyrics = values.lyrics_raw || '无歌词';
            const recordToSave = {
                user_id: userId,
                user_input: {
                    song_name: values.song_name,
                    song_language: songLanguage,
                    target_singer: targetSinger,
                    reference_songs: referenceSongs,
                    style_description: values.style_note || '',
                    lyrics,
                    scene: values.extra_note || ''
                },
                ai_result: {
                    styles: result.styles,
                    lyrics: result.lyrics,
                    model: isMock ? 'mock' : model
                }
            };
            const record = await _db.db.createPromptRecord(recordToSave);
            messageApi.success('记录已成功保存');
            return record;
        } catch (dbError) {
            throw dbError;
        }
    }, [
        model,
        messageApi
    ]);
    (0, _react.useEffect)(()=>{
        const loadRecordFromURL = async ()=>{
            const recordId = searchParams.get('recordId');
            const { formValues, hasRecord } = await (0, _dataLoader.loadRecordData)(recordId);
            if (hasRecord) {
                setStylesResult(formValues.stylesResult || '');
                setLyricsResult(formValues.lyricsResult || '');
            }
            form.setFieldsValue(formValues);
            setIsFormInitialized(true);
        };
        loadRecordFromURL();
    }, [
        searchParams,
        form
    ]);
    const getAIService = ()=>{
        switch(model){
            case 'deepseek':
                return _container.container.resolve(_deepseekService.DeepSeekService);
            case 'gemini':
                return _container.container.resolve(_geminiService.GeminiService);
            case 'mimo':
                return _container.container.resolve(_mimoService.MimoService);
            default:
                throw new Error(`Unsupported AI model: ${model}`);
        }
    };
    const handleSubmit = (0, _react.useCallback)(async (values)=>{
        if (!checkApiKey()) return;
        setLoading(true);
        try {
            const aiService = getAIService();
            const result = await aiService.generate({
                ...values,
                api_key: apiKey,
                model
            });
            setStylesResult(result.styles);
            setLyricsResult(result.lyrics);
            messageApi.success('提示词已成功生成！');
            await saveRecordToDB(values, result, false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `调用 ${model} API 失败，请检查 API Key 或稍后再试。`;
            messageApi.error(errorMessage);
        } finally{
            setLoading(false);
        }
    }, [
        checkApiKey,
        apiKey,
        model,
        messageApi
    ]);
    const handleMockGenerate = (0, _react.useCallback)(async ()=>{
        setLoading(true);
        try {
            const formValues = form.getFieldsValue();
            const result = await (0, _mockData.mockGenerate)();
            setStylesResult(result.styles);
            setLyricsResult(result.lyrics);
            messageApi.success('模拟生成已完成');
            await saveRecordToDB(formValues, result, true);
        } catch (error) {
            messageApi.error('模拟生成失败，请稍后再试');
        } finally{
            setLoading(false);
        }
    }, [
        form,
        messageApi
    ]);
    const handleTitleClick = (0, _react.useCallback)(()=>{
        handleMockGenerate();
    }, [
        handleMockGenerate
    ]);
    return (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
        children: [
            contextHolder,
            (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
                children: [
                    !apiKey && (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                        title: "尚未设置 AI API Key，设置完成后即可使用该功能，是否现在去设置？",
                        banner: true,
                        style: {
                            marginBottom: 24
                        },
                        action: (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                            type: "link",
                            onClick: ()=>_max.history.push('/ai-setting'),
                            children: "去设置"
                        }, void 0, false, {
                            fileName: "src/pages/suno-cover/index.tsx",
                            lineNumber: 276,
                            columnNumber: 15
                        }, void 0)
                    }, void 0, false, {
                        fileName: "src/pages/suno-cover/index.tsx",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this),
                    (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                        spinning: loading,
                        fullscreen: true,
                        size: "large"
                    }, void 0, false, {
                        fileName: "src/pages/suno-cover/index.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    (0, _jsxdevruntime.jsxDEV)(_antd.Row, {
                        gutter: [
                            24,
                            0
                        ],
                        children: [
                            (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                span: 8,
                                children: (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                    title: (0, _jsxdevruntime.jsxDEV)("span", {
                                        onClick: handleTitleClick,
                                        style: {
                                            cursor: 'pointer'
                                        },
                                        children: "翻唱配置"
                                    }, void 0, false, {
                                        fileName: "src/pages/suno-cover/index.tsx",
                                        lineNumber: 291,
                                        columnNumber: 17
                                    }, void 0),
                                    style: {
                                        height: '100%'
                                    },
                                    children: !isFormInitialized ? (0, _jsxdevruntime.jsxDEV)("div", {
                                        style: {
                                            textAlign: 'center',
                                            padding: '40px 0'
                                        },
                                        children: (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                                            size: "large"
                                        }, void 0, false, {
                                            fileName: "src/pages/suno-cover/index.tsx",
                                            lineNumber: 300,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "src/pages/suno-cover/index.tsx",
                                        lineNumber: 299,
                                        columnNumber: 17
                                    }, this) : (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
                                        form: form,
                                        layout: "vertical",
                                        onFinish: handleSubmit,
                                        submitter: {
                                            render: ()=>(0, _jsxdevruntime.jsxDEV)(_antd.Flex, {
                                                    vertical: true,
                                                    gap: "small",
                                                    style: {
                                                        marginTop: 16
                                                    },
                                                    children: (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                                        type: "primary",
                                                        onClick: ()=>form.submit(),
                                                        loading: loading,
                                                        size: "large",
                                                        block: true,
                                                        children: "生成提示词"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/suno-cover/index.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 25
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "src/pages/suno-cover/index.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 23
                                                }, void 0)
                                        },
                                        children: [
                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                name: "song_name",
                                                label: "歌曲名称",
                                                placeholder: "请输入歌曲名称，仅作为记录方便查询",
                                                rules: _validationConfig.VALIDATION_RULES.songName,
                                                fieldProps: _validationConfig.FIELD_CONFIGS.songName
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 325,
                                                columnNumber: 19
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "song_language",
                                                label: "歌曲语言",
                                                placeholder: "请选择歌曲语言",
                                                rules: _validationConfig.VALIDATION_RULES.language,
                                                options: [
                                                    {
                                                        value: 'Mandarin',
                                                        label: '华语（普通话）'
                                                    },
                                                    {
                                                        value: 'Cantonese',
                                                        label: '粤语'
                                                    },
                                                    {
                                                        value: 'Minnan',
                                                        label: '闽南语'
                                                    },
                                                    {
                                                        value: 'English',
                                                        label: '英语'
                                                    },
                                                    {
                                                        value: 'Korean',
                                                        label: '韩语'
                                                    },
                                                    {
                                                        value: 'Japanese',
                                                        label: '日语'
                                                    },
                                                    {
                                                        value: 'Other',
                                                        label: '其他'
                                                    }
                                                ]
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 334,
                                                columnNumber: 19
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                name: "target_artist",
                                                label: "想模仿哪位艺术家？",
                                                placeholder: "例如：张惠妹、陈奕迅、周杰伦等",
                                                rules: _validationConfig.VALIDATION_RULES.artistName,
                                                fieldProps: _validationConfig.FIELD_CONFIGS.artistName
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 351,
                                                columnNumber: 19
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormList, {
                                                actionRef: proFormListRef,
                                                name: "reference_songs",
                                                label: "参考歌曲（可选，最多 3 首）",
                                                initialValue: [
                                                    {
                                                        title: '',
                                                        artist: ''
                                                    }
                                                ],
                                                creatorButtonProps: {
                                                    creatorButtonText: '添加参考歌曲',
                                                    type: 'dashed',
                                                    block: true
                                                },
                                                deleteIconProps: {
                                                    tooltipText: '删除该参考歌曲'
                                                },
                                                copyIconProps: false,
                                                max: 3,
                                                children: (meta)=>(0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                        style: {
                                                            width: '100%'
                                                        },
                                                        children: [
                                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                                name: "title",
                                                                placeholder: "歌曲名",
                                                                rules: _validationConfig.VALIDATION_RULES.referenceSongTitle,
                                                                fieldProps: {
                                                                    style: {
                                                                        width: '100%'
                                                                    },
                                                                    ..._validationConfig.FIELD_CONFIGS.referenceSongTitle
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "src/pages/suno-cover/index.tsx",
                                                                lineNumber: 378,
                                                                columnNumber: 25
                                                            }, this),
                                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                                name: "artist",
                                                                placeholder: "演唱者（可选）",
                                                                rules: _validationConfig.VALIDATION_RULES.referenceSongArtist,
                                                                fieldProps: {
                                                                    style: {
                                                                        width: '100%'
                                                                    },
                                                                    ..._validationConfig.FIELD_CONFIGS.referenceSongArtist
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "src/pages/suno-cover/index.tsx",
                                                                lineNumber: 387,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, meta.name, true, {
                                                        fileName: "src/pages/suno-cover/index.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 23
                                                    }, this)
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 360,
                                                columnNumber: 19
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "style_note",
                                                label: "风格备注（可选）",
                                                placeholder: "例如：主歌要像《人质》一样极度克制，副歌接近《听海》的情绪爆发。",
                                                fieldProps: {
                                                    showCount: true,
                                                    rows: 3
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 401,
                                                columnNumber: 19
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "extra_note",
                                                label: "特殊说明（如场景、受众等，可选）",
                                                placeholder: "例如：演唱会现场版、录音室版本等",
                                                fieldProps: {
                                                    showCount: true,
                                                    rows: 3
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this),
                                            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "lyrics_raw",
                                                label: "段落与歌词",
                                                placeholder: "请填写歌词，并使用任意标签划分段落，例如：【主歌】、【副歌】、[Verse]、[Chorus] 等",
                                                rules: _validationConfig.VALIDATION_RULES.lyrics,
                                                fieldProps: _validationConfig.FIELD_CONFIGS.lyrics
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 417,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/suno-cover/index.tsx",
                                        lineNumber: 303,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 289,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/suno-cover/index.tsx",
                                lineNumber: 288,
                                columnNumber: 11
                            }, this),
                            (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                span: 8,
                                children: (0, _jsxdevruntime.jsxDEV)(_components.ResultCard, {
                                    title: "Styles 提示词（可直接复制用于 Suno）",
                                    value: stylesResult,
                                    onCopy: ()=>(0, _utils.copyToClipboard)(stylesResult, 'Styles')
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 431,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/suno-cover/index.tsx",
                                lineNumber: 430,
                                columnNumber: 11
                            }, this),
                            (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                span: 8,
                                children: (0, _jsxdevruntime.jsxDEV)(_components.ResultCard, {
                                    title: "Lyrics 提示词（可直接复制用于 Suno）",
                                    value: lyricsResult,
                                    onCopy: ()=>(0, _utils.copyToClipboard)(lyricsResult, 'Lyrics')
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 440,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/suno-cover/index.tsx",
                                lineNumber: 439,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/suno-cover/index.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/suno-cover/index.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(SunoCover, "9n+XL71qz2kJcOtQxKH4HzEIM+Q=", false, function() {
    return [
        _antd.message.useMessage,
        _useApiKey.useApiKey,
        _antd.Form.useForm,
        _max.useSearchParams
    ];
});
_c = SunoCover;
var _default = SunoCover;
var _c;
$RefreshReg$(_c, "SunoCover");
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
"src/pages/suno-cover/utils/dataLoader.ts": function (module, exports, __mako_require__){
/**
 * 数据加载和参考歌曲处理模块
 * 集中处理从URL参数加载记录数据和参考歌曲数据转换的逻辑
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
    loadRecordData: function() {
        return loadRecordData;
    },
    processReferenceSongs: function() {
        return processReferenceSongs;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _db = __mako_require__("src/services/db.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const processReferenceSongs = async (referenceSongsData)=>{
    try {
        if (!referenceSongsData) return [];
        if (Array.isArray(referenceSongsData)) return referenceSongsData.filter((song)=>song && typeof song === 'object' && song.title && typeof song.title === 'string').map((song)=>({
                title: song.title || '',
                artist: song.artist || ''
            }));
        if (typeof referenceSongsData === 'string') try {
            const parsed = JSON.parse(referenceSongsData);
            if (Array.isArray(parsed)) return parsed.filter((song)=>song && typeof song === 'object' && song.title && typeof song.title === 'string').map((song)=>({
                    title: song.title || '',
                    artist: song.artist || ''
                }));
        } catch (_parseError) {
            return [];
        }
        return [];
    } catch (_error) {
        return [];
    }
};
const loadRecordData = async (recordId)=>{
    const formValues = {
        song_name: '',
        song_language: 'Mandarin',
        target_artist: '',
        style_note: '',
        lyrics_raw: '',
        extra_note: '',
        reference_songs: []
    };
    if (!recordId) return {
        formValues,
        hasRecord: false
    };
    try {
        const record = await _db.db.getPromptRecord(parseInt(recordId));
        if (!record) {
            _antd.message.error('记录不存在');
            return {
                formValues,
                hasRecord: false
            };
        }
        const processedReferenceSongs = await processReferenceSongs(record.user_input.reference_songs);
        Object.assign(formValues, {
            song_name: record.user_input.song_name || '',
            song_language: record.user_input.song_language || 'Mandarin',
            target_artist: record.user_input.target_singer || '',
            style_note: record.user_input.style_description || '',
            lyrics_raw: record.user_input.lyrics || '',
            extra_note: record.user_input.scene || '',
            reference_songs: processedReferenceSongs.length > 0 ? processedReferenceSongs : [
                {
                    title: '',
                    artist: ''
                }
            ]
        });
        return {
            formValues,
            hasRecord: true
        };
    } catch (error) {
        _antd.message.error('数据加载失败');
        return {
            formValues,
            hasRecord: false
        };
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
"src/services/ai/baseAIService.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "BaseAIService", {
    enumerable: true,
    get: function() {
        return BaseAIService;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _prompts = __mako_require__("src/config/prompts.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class BaseAIService {
    generateUserPrompt(request) {
        const { target_artist, lyrics_raw, song_language, reference_songs, style_note, extra_note } = request;
        const getFullLanguageName = (language)=>{
            const languageMap = {
                'Mandarin': 'Mandarin Chinese',
                'Cantonese': 'Cantonese Chinese',
                'English': 'English',
                'Japanese': 'Japanese',
                'Korean': 'Korean',
                'Spanish': 'Spanish',
                'French': 'French',
                'German': 'German'
            };
            return languageMap[language] || language;
        };
        const formatReferenceSongs = (songs, targetArtist)=>{
            if (!songs || songs.length === 0) return 'None provided.';
            return songs.filter((song)=>song.title).map((song)=>{
                const artistPart = song.artist && song.artist !== targetArtist ? ` by ${song.artist}` : '';
                return `- "${song.title}"${artistPart}`;
            }).join('\n  ');
        };
        const fullLanguageName = getFullLanguageName(song_language);
        const referenceSongsBlock = formatReferenceSongs(reference_songs, target_artist);
        return _prompts.USER_PROMPT_TEMPLATE.replace('{fullLanguageName}', fullLanguageName).replace('{targetArtist}', target_artist).replace('{referenceSongsBlock}', referenceSongsBlock).replace('{styleNote}', style_note || '').replace('{extraNote}', extra_note || '').replace('{lyricsRaw}', lyrics_raw);
    }
    validateRequest(request) {
        if (!request.target_artist) throw new Error('请输入目标艺术家');
        if (!request.lyrics_raw) throw new Error('请输入歌词');
        if (!request.song_language) throw new Error('请输入歌曲语言');
    }
    referenceSongsToText(songs) {
        if (!songs || songs.length === 0) return '';
        return songs.map((song, index)=>{
            if (song.title && song.artist) return `${index + 1}. ${song.title} - ${song.artist}`;
            else if (song.title) return `${index + 1}. ${song.title}`;
            return '';
        }).filter(Boolean).join('\n');
    }
    async parseResponse(rawResponse) {
        try {
            let responseText = rawResponse.trim();
            const stylesMatch = responseText.match(/### Styles[\s\S]*?(?=### Lyrics|$)/);
            const lyricsMatch = responseText.match(/### Lyrics[\s\S]*/);
            let stylesContent = '';
            let lyricsContent = '';
            if (stylesMatch) {
                stylesContent = stylesMatch[0].replace(/### Styles/, '').trim();
                stylesContent = stylesContent.replace(/```text\s*([\s\S]*?)\s*```/, '$1').trim();
            }
            if (lyricsMatch) {
                lyricsContent = lyricsMatch[0].replace(/### Lyrics/, '').trim();
                lyricsContent = lyricsContent.replace(/```text\s*([\s\S]*?)\s*```/, '$1').trim();
            }
            return {
                styles: stylesContent,
                lyrics: lyricsContent,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('响应解析失败:', error);
            return {
                styles: rawResponse.trim(),
                lyrics: '',
                timestamp: new Date().toISOString()
            };
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
"src/services/ai/container.ts": function (module, exports, __mako_require__){
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
    container: function() {
        return _tsyringe.container;
    },
    injectable: function() {
        return _tsyringe.injectable;
    },
    registerServices: function() {
        return registerServices;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
var _deepseekService = __mako_require__("src/services/ai/models/deepseekService.ts");
var _geminiService = __mako_require__("src/services/ai/models/geminiService.ts");
var _mimoService = __mako_require__("src/services/ai/models/mimoService.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
function registerServices() {
    _tsyringe.container.register(_deepseekService.DeepSeekService, {
        useClass: _deepseekService.DeepSeekService
    });
    _tsyringe.container.register(_geminiService.GeminiService, {
        useClass: _geminiService.GeminiService
    });
    _tsyringe.container.register(_mimoService.MimoService, {
        useClass: _mimoService.MimoService
    });
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
"src/services/ai/models/deepseekService.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "DeepSeekService", {
    enumerable: true,
    get: function() {
        return DeepSeekService;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _ts_decorate = __mako_require__("node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_ts_decorate.js");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
var _baseAIService = __mako_require__("src/services/ai/baseAIService.ts");
var _prompts = __mako_require__("src/config/prompts.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class DeepSeekService extends _baseAIService.BaseAIService {
    async generate(request) {
        const { api_key: apiKey } = request;
        if (!apiKey) throw new Error('DeepSeek API key is required');
        const userPrompt = this.generateUserPrompt(request);
        const systemPrompt = _prompts.SYSTEM_PROMPT;
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    temperature: 1.3,
                    max_tokens: 4096
                })
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error('DeepSeek API error:', response.status, errorData);
                throw new Error(`DeepSeek API request failed with status ${response.status}`);
            }
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            return this.parseResponse(aiResponse);
        } catch (error) {
            console.error('Error calling DeepSeek API:', error);
            throw error;
        }
    }
}
DeepSeekService = (0, _ts_decorate._)([
    (0, _tsyringe.injectable)()
], DeepSeekService);
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
"src/services/ai/models/geminiService.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "GeminiService", {
    enumerable: true,
    get: function() {
        return GeminiService;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _ts_decorate = __mako_require__("node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_ts_decorate.js");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
var _baseAIService = __mako_require__("src/services/ai/baseAIService.ts");
var _genai = __mako_require__("node_modules/.pnpm/@google+genai@1.34.0/node_modules/@google/genai/dist/web/index.mjs");
var _prompts = __mako_require__("src/config/prompts.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class GeminiService extends _baseAIService.BaseAIService {
    async generate(request) {
        const { api_key: apiKey } = request;
        if (!apiKey) throw new Error('Gemini API key is required');
        const userPrompt = this.generateUserPrompt(request);
        const systemPrompt = _prompts.SYSTEM_PROMPT;
        try {
            const genAI = new _genai.GoogleGenAI({
                apiKey
            });
            const result = await genAI.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    {
                        parts: [
                            {
                                text: systemPrompt + '\n\n' + userPrompt
                            }
                        ]
                    }
                ]
            });
            let aiResponse = '';
            if (result.candidates && result.candidates.length > 0) {
                const firstCandidate = result.candidates[0];
                if (firstCandidate.content && firstCandidate.content.parts) aiResponse = firstCandidate.content.parts.filter((part)=>part.text).map((part)=>part.text).join('\n');
            }
            return this.parseResponse(aiResponse);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw error;
        }
    }
}
GeminiService = (0, _ts_decorate._)([
    (0, _tsyringe.injectable)()
], GeminiService);
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
"src/services/ai/models/mimoService.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "MimoService", {
    enumerable: true,
    get: function() {
        return MimoService;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _ts_decorate = __mako_require__("node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_ts_decorate.js");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
var _baseAIService = __mako_require__("src/services/ai/baseAIService.ts");
var _prompts = __mako_require__("src/config/prompts.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class MimoService extends _baseAIService.BaseAIService {
    async generate(request) {
        const { api_key: apiKey } = request;
        if (!apiKey) throw new Error('MiMo API key is required');
        const userPrompt = this.generateUserPrompt(request);
        const systemPrompt = _prompts.SYSTEM_PROMPT;
        try {
            const apiUrl = '/mimo-api/v1/chat/completions';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'mimo-v2-flash',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    temperature: 0.8,
                    top_p: 0.95,
                    max_tokens: 4096,
                    stream: false,
                    extra_body: {
                        "thinking": {
                            "type": "enabled"
                        }
                    }
                })
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error('MiMo API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    errorData
                });
                throw new Error(`MiMo API request failed with status ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            return this.parseResponse(aiResponse);
        } catch (error) {
            console.error('Error calling MiMo API:', error);
            throw error;
        }
    }
}
MimoService = (0, _ts_decorate._)([
    (0, _tsyringe.injectable)()
], MimoService);
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
"src/services/mockData.ts": function (module, exports, __mako_require__){
/**
 * 模拟数据服务模块
 * 负责提供模拟生成所需的固定数据和逻辑
 * 用于开发环境下的功能测试，避免频繁调用真实API
 */ // 固定的Styles内容
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
    MOCK_LYRICS: function() {
        return MOCK_LYRICS;
    },
    MOCK_STYLES: function() {
        return MOCK_STYLES;
    },
    mockGenerate: function() {
        return mockGenerate;
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
const MOCK_STYLES = `Symphonic Pop-Rock, Mandopop, Baroque Pop-Rock, J-Rock Influence, Heavy distorted guitars over symphonic orchestration, Sophisticated Chord Progressions. Breathy Female Vocals, Clear Emotive Tone, Soaring High Notes, Sustained High Notes, Moderate Vibrato, Introspective to Powerful. Theatrical, Epic.
INTRO: Cinematic atmosphere, slow build up, high strings ensemble in lyrical counterpoint over classical piano arpeggios and warm pad.
VERSE: Breathy female vocals (introspective tone), delicate piano, acoustic guitar arpeggios, light percussion.
PRE-CHORUS: Emotional crescendo, dramatic build-up.
CHORUS: Powerful belting vocals, sustained high notes, richly stacked harmonies, heavy distorted guitars + power chords, high strings unison counterpoint, fast driving cinematic drums, huge wall of sound.
INTERLUDE: Lyrical electric guitar solo trading melodies with high strings.
BRIDGE: Emotional climax, building high tension.
OUTRO: Fading out with piano arpeggio and soft strings.`;
const MOCK_LYRICS = `[Intro Chorus]
[Arrangement: Ethereal atmosphere, Cold Open]
[Instrument: Classical Grand Piano only, No Drums, No Guitar]
[Dynamics: mp, emotional and intimate]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
拥抱彼此的模样
永恒回忆就像恒星不忘

[Instrumental Hook]
[Arrangement: Sudden Energy Explosion, J-Rock Influence]
[Instrument: Heavy Distorted Guitars, High Strings Ensemble, Driving Rock Drums]
[Dynamics: ff, Epic Start]

[Verse 1]
[Vocal: Breathy female vocals, Introspective tone, Near microphone]
[Instrument: Minimalist Piano, Broken Chords, Bass pulse enters]
[Dynamics: p, gentle storytelling]
流星划过喧扰穹苍
可曾回应谁的愿望
我已走到儿时的远方
却遗失了自己的模样

[Verse 2]
[Vocal: Clear emotive tone, slightly stronger presence]
[Arrangement: Building up]
[Instrument: Acoustic Guitar Strumming, Piano high notes, Light Snare]
[Dynamics: mp -> mf, flowing]
梦想逐渐增加重量
我们是否不再幻想
用尽整个青春去荒唐
也用整个人生去飞翔

[Chorus 1]
[Vocal: Power belting, Sustained high notes, Layered Harmonies]
[Texture: Wall of Sound, Symphonic Rock]
[Instrument: Heavy Distorted Guitars (Power Chords), High Strings Unison Counterpoint, Bright Piano Octaves]
[Dynamics: f, explosive release]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
拥抱彼此的模样
永恒回忆就像恒星不忘

[Instrumental Interlude]
[Arrangement: J-Rock influence, soaring atmosphere]
[Instrument: Lyrical electric guitar solo trading melodies with High Strings Section (Duel)]
[Dynamics: ff]

[Verse 3]
[Vocal: Clear emotive tone, emotional friction]
[Instrument: Acoustic Guitar Strumming dominant, String Staccato Rhythm, Piano counter-melody]
[Dynamics: mf, driving rhythm]
庆幸这场别来无恙
沉默里藏着太多话
岁月从不放过谁脸庞
却也在心中留下宝藏

[Verse 4]
[Vocal: High tension, dramatic delivery, Double Tracking]
[Arrangement: Orchestral Swell, Strings Tremolo]
[Instrument: Intense Strumming, Heavy Piano Chords, Snare Rolls]
[Dynamics: mf -> f, dramatic push]
烟火再次绽放辉煌
失落瞳孔倒映希望
每当前路风横雨又狂
让我再陪你展开翅膀

[Chorus 2]
[Vocal: Intense belting, Richly Stacked Harmonies]
[Texture: Dense Wall of Sound]
[Instrument: Heavy Distorted Guitars, High Strings Unison Counterpoint, Crash Cymbals]
[Dynamics: ff, Driving Power]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
拥抱彼此的模样
永恒回忆就像恒星不忘

[Grand Chorus]
[Vocal: Ultimate high notes, Choir Backing, Octave Doubles, High Pitch Ad-libs]
[Arrangement: Explosive anthemic grand finale chorus]
[Instrument: Maximum Distorted Wall, Soaring Strings Melody, Bright Piano Glissando, Full Orchestra]
[Dynamics: fff, Anthemic, Epic Finale]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
重回最好的时光
永恒回忆就像恒星不忘

[Instrumental Outro]
[Arrangement: Fading out]
[Instrument: Piano Arpeggios, Soft Strings]
[Dynamics: Diminuendo, pp]`;
const mockGenerate = async ()=>{
    // 模拟5秒延迟
    await new Promise((resolve)=>setTimeout(resolve, 5000));
    return {
        styles: MOCK_STYLES,
        lyrics: MOCK_LYRICS
    };
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
"src/shared/utils/clipboard.ts": function (module, exports, __mako_require__){
/**
 * 剪贴板工具函数
 * 提供复制文本到剪贴板的功能，并支持成功/失败提示
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
    copyToClipboard: function() {
        return copyToClipboard;
    },
    copyToClipboardSilent: function() {
        return copyToClipboardSilent;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const copyToClipboard = async (text, type)=>{
    try {
        await navigator.clipboard.writeText(text);
        _antd.message.success(`${type || '文本'}已成功复制到剪贴板`);
    } catch (error) {
        console.error('复制到剪贴板失败:', error);
        _antd.message.error('复制失败，请手动复制');
    }
};
const copyToClipboardSilent = async (text)=>{
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('复制到剪贴板失败:', error);
        return false;
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
"src/shared/utils/format.ts": function (module, exports, __mako_require__){
/**
 * 通用格式化工具函数
 * 提供各种数据格式化功能，包括日期、语言、参考歌曲等
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
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const languageMap = {
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

},
"src/shared/utils/index.ts": function (module, exports, __mako_require__){
/**
 * 共享工具函数入口文件
 * 统一导出所有共享工具函数，方便其他模块使用
 */ // 剪贴板工具函数
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
var _export_star = __mako_require__("@swc/helpers/_/_export_star");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
_export_star._(__mako_require__("src/shared/utils/clipboard.ts"), exports);
_export_star._(__mako_require__("src/shared/utils/format.ts"), exports);
_export_star._(__mako_require__("src/shared/utils/validation.ts"), exports);
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
"src/shared/utils/validation.ts": function (module, exports, __mako_require__){
/**
 * 验证工具函数
 * 提供各种数据验证功能，包括API密钥验证、请求参数验证等
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
    validateApiKey: function() {
        return validateApiKey;
    },
    validateEmail: function() {
        return validateEmail;
    },
    validateGenerateRequest: function() {
        return validateGenerateRequest;
    },
    validateRequired: function() {
        return validateRequired;
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
const validateApiKey = (apiKey)=>{
    if (!apiKey || !apiKey.trim()) return false;
    // 简单的格式验证，实际项目中可能需要更严格的验证
    return apiKey.length > 10;
};
const validateGenerateRequest = (values)=>{
    if (!values) throw new Error('生成请求参数不能为空');
    if (!values.target_artist || !values.target_artist.trim()) throw new Error('目标艺术家不能为空');
    if (!values.lyrics_raw || !values.lyrics_raw.trim()) throw new Error('歌词不能为空');
    if (!values.song_language || !values.song_language.trim()) throw new Error('歌曲语言不能为空');
    if (!validateApiKey(values.api_key)) throw new Error('API Key 格式不正确或为空');
};
const validateEmail = (email)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const validateRequired = (value, fieldName)=>{
    if (!value || typeof value === 'string' && !value.trim()) throw new Error(`${fieldName}不能为空`);
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
 }]);
//# sourceMappingURL=src_pages_suno-cover_index_tsx-async.js.map