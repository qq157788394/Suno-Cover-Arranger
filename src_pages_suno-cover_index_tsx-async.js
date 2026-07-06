((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/suno-cover/index.tsx'],
{ "src/config/prompts.ts": function (module, exports, __mako_require__){
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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const SYSTEM_PROMPT = `You are a senior Suno prompt engineer. Your job is to generate high-quality "Styles" and "Lyrics" prompts for cover songs in Suno (v5), especially for Chinese and East Asian songs (Mandarin, Cantonese, etc.).

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
  - Strictly prohibited from including any names of reference singers or vocalists of reference songs, including stage names and real names.

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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
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
 */ // Ant Design Pro Components
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
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var _components = __mako_require__("src/components/index.ts");
var _aiTemperatureConfig = __mako_require__("src/config/aiTemperatureConfig.ts");
var _prompts = __mako_require__("src/config/prompts.ts");
var _useApiKey = __mako_require__("src/hooks/useApiKey.ts");
var _providers = __mako_require__("src/services/ai/providers/index.ts");
var _db = __mako_require__("src/services/db.ts");
var _mockData = __mako_require__("src/services/mockData.ts");
var _utils = __mako_require__("src/shared/utils/index.ts");
var _validationConfig = __mako_require__("src/pages/suno-cover/config/validationConfig.ts");
var _dataLoader = __mako_require__("src/pages/suno-cover/utils/dataLoader.ts");
var _promptBuilder = __mako_require__("src/pages/suno-cover/utils/promptBuilder.ts");
var _responseParser = __mako_require__("src/pages/suno-cover/utils/responseParser.ts");
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
    // 使用antd的message hook
    const [messageApi, contextHolder] = _antd.message.useMessage();
    // 使用自定义hook管理API Key和模型
    const { apiKey, model, checkApiKey, shouldShowAlert, navigateToSettings } = (0, _useApiKey.useApiKey)();
    // 表单实例，用于管理翻唱配置表单的数据
    const [form] = _antd.Form.useForm();
    // ProFormList实例，用于直接控制参考歌曲列表数据
    const proFormListRef = (0, _react.useRef)(null);
    // 获取URL参数
    const [searchParams] = (0, _max.useSearchParams)();
    // 简化的状态管理
    const [loading, setLoading] = (0, _react.useState)(false); // 加载状态
    const [stylesResult, setStylesResult] = (0, _react.useState)(''); // Styles提示词结果
    const [lyricsResult, setLyricsResult] = (0, _react.useState)(''); // Lyrics提示词结果
    const [isFormInitialized, setIsFormInitialized] = (0, _react.useState)(false); // 表单是否已初始化
    // 统一的数据库保存方法（可复用于正常提交和模拟生成）
    const saveRecordToDB = (0, _react.useCallback)(async (values, result, isMock = false)=>{
        const userId = 1; // 模拟当前用户ID
        // 获取参考歌曲
        const referenceSongsArray = Array.isArray(values.reference_songs) ? values.reference_songs : [];
        const referenceSongs = JSON.stringify(referenceSongsArray.filter((song)=>(song === null || song === void 0 ? void 0 : song.title) && typeof song.title === 'string'));
        // 确保必填字段有默认值
        const songLanguage = values.song_language || 'Mandarin';
        const targetSinger = values.target_artist || '未知艺术家';
        const lyrics = values.lyrics_raw || '无歌词';
        // 准备保存到数据库的记录
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
    }, [
        model,
        messageApi
    ]);
    // 从URL参数加载记录数据并初始化表单
    (0, _react.useEffect)(()=>{
        const loadRecordFromURL = async ()=>{
            const recordId = searchParams.get('recordId');
            // 使用模块化函数加载数据
            const { formValues, hasRecord, stylesResult, lyricsResult } = await (0, _dataLoader.loadRecordData)(recordId);
            // 设置结果数据
            if (hasRecord) {
                setStylesResult(stylesResult || '');
                setLyricsResult(lyricsResult || '');
            }
            // 设置表单值（无论是否有数据都设置）
            form.setFieldsValue(formValues);
            // 标记表单为已初始化
            setIsFormInitialized(true);
        };
        loadRecordFromURL();
    }, [
        searchParams,
        form
    ]);
    /**
   * 表单提交处理函数
   * 验证用户输入，调用选定的 AI 模型 API 生成提示词，并保存结果到数据库
   */ const handleSubmit = (0, _react.useCallback)(async (values)=>{
        if (!checkApiKey()) return;
        setLoading(true);
        try {
            const provider = _providers.AIProviderFactory.createProvider(model);
            const userPrompt = _promptBuilder.SunoCoverPromptBuilder.buildUserPrompt(values);
            const response = await provider.generate({
                api_key: apiKey,
                system_prompt: _prompts.SYSTEM_PROMPT,
                user_prompt: userPrompt,
                business_type: _aiTemperatureConfig.BusinessType.ARRANGEMENT
            });
            if (!response.success) throw new Error(response.error || 'AI生成失败');
            const result = _responseParser.SunoCoverResponseParser.parseResponse(response.content);
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
    /**
   * 模拟生成提示词函数
   * 用于开发和测试，生成模拟的 Styles 和 Lyrics 提示词，并保存结果到数据库
   */ const handleMockGenerate = (0, _react.useCallback)(async ()=>{
        setLoading(true);
        try {
            // 获取表单值并记录
            const formValues = form.getFieldsValue();
            // 调用模拟生成服务
            const result = await (0, _mockData.mockGenerate)();
            // 回填页面内容
            setStylesResult(result.styles);
            setLyricsResult(result.lyrics);
            messageApi.success('模拟生成已完成');
            // 使用统一的数据库保存方法（标记为模拟生成）
            await saveRecordToDB(formValues, result, true);
        } catch (_error) {
            messageApi.error('模拟生成失败，请稍后再试');
        } finally{
            setLoading(false);
        }
    }, [
        form,
        messageApi
    ]);
    // 处理翻唱配置标题点击事件
    const handleTitleClick = (0, _react.useCallback)(()=>{
        handleMockGenerate();
    }, [
        handleMockGenerate
    ]);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
        children: [
            contextHolder,
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
                children: [
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_components.ApiKeyAlert, {
                        visible: shouldShowAlert,
                        onNavigateToSettings: navigateToSettings
                    }, void 0, false, {
                        fileName: "src/pages/suno-cover/index.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                        spinning: loading,
                        fullscreen: true,
                        size: "large"
                    }, void 0, false, {
                        fileName: "src/pages/suno-cover/index.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Row, {
                        gutter: [
                            24,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                xxl: 8,
                                xl: 8,
                                lg: 12,
                                md: 24,
                                sm: 24,
                                xs: 24,
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                    title: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("span", {
                                        onClick: handleTitleClick,
                                        style: {
                                            cursor: 'pointer'
                                        },
                                        children: "翻唱配置"
                                    }, void 0, false, {
                                        fileName: "src/pages/suno-cover/index.tsx",
                                        lineNumber: 234,
                                        columnNumber: 17
                                    }, void 0),
                                    style: {
                                        height: '100%'
                                    },
                                    children: !isFormInitialized ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                                        style: {
                                            textAlign: 'center',
                                            padding: '40px 0'
                                        },
                                        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                                            size: "large"
                                        }, void 0, false, {
                                            fileName: "src/pages/suno-cover/index.tsx",
                                            lineNumber: 243,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "src/pages/suno-cover/index.tsx",
                                        lineNumber: 242,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
                                        form: form,
                                        layout: "vertical",
                                        onFinish: handleSubmit,
                                        submitter: {
                                            render: ()=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Flex, {
                                                    vertical: true,
                                                    gap: "small",
                                                    style: {
                                                        marginTop: 16
                                                    },
                                                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                                        type: "primary",
                                                        onClick: ()=>form.submit(),
                                                        loading: loading,
                                                        size: "large",
                                                        block: true,
                                                        children: "生成提示词"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/suno-cover/index.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 25
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "src/pages/suno-cover/index.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 23
                                                }, void 0)
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                name: "song_name",
                                                label: "歌曲名称",
                                                placeholder: "请输入歌曲名称，仅作为记录方便查询",
                                                rules: _validationConfig.VALIDATION_RULES.songName,
                                                fieldProps: _validationConfig.FIELD_CONFIGS.songName
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 268,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
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
                                                lineNumber: 277,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                name: "target_artist",
                                                label: "想模仿哪位艺术家？",
                                                placeholder: "例如：张惠妹、陈奕迅、周杰伦等",
                                                rules: _validationConfig.VALIDATION_RULES.artistName,
                                                fieldProps: _validationConfig.FIELD_CONFIGS.artistName
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 294,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormList, {
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
                                                children: (meta)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                        style: {
                                                            width: '100%'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
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
                                                                lineNumber: 321,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
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
                                                                lineNumber: 330,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, meta.name, true, {
                                                        fileName: "src/pages/suno-cover/index.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 23
                                                    }, this)
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 303,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "style_note",
                                                label: "风格备注（可选）",
                                                placeholder: "例如：主歌要像《人质》一样极度克制，副歌接近《听海》的情绪爆发。",
                                                fieldProps: {
                                                    showCount: true,
                                                    rows: 3
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 344,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "extra_note",
                                                label: "特殊说明（如场景、受众等，可选）",
                                                placeholder: "例如：演唱会现场版、录音室版本等",
                                                fieldProps: {
                                                    showCount: true,
                                                    rows: 3
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 352,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "lyrics_raw",
                                                label: "段落与歌词",
                                                placeholder: "请填写歌词，并使用任意标签划分段落，例如：【主歌】、【副歌】、[Verse]、[Chorus] 等",
                                                rules: _validationConfig.VALIDATION_RULES.lyrics,
                                                fieldProps: _validationConfig.FIELD_CONFIGS.lyrics
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 360,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/suno-cover/index.tsx",
                                        lineNumber: 246,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 232,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/suno-cover/index.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                xxl: 8,
                                xl: 8,
                                lg: 6,
                                md: 12,
                                sm: 12,
                                xs: 12,
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_components.ResultCard, {
                                    title: "Styles 提示词（可直接复制用于 Suno）",
                                    value: stylesResult,
                                    onCopy: ()=>(0, _utils.copyToClipboard)(stylesResult, 'Styles')
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 374,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/suno-cover/index.tsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                xxl: 8,
                                xl: 8,
                                lg: 6,
                                md: 12,
                                sm: 12,
                                xs: 12,
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_components.ResultCard, {
                                    title: "Lyrics 提示词（可直接复制用于 Suno）",
                                    value: lyricsResult,
                                    onCopy: ()=>(0, _utils.copyToClipboard)(lyricsResult, 'Lyrics')
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 383,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/suno-cover/index.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/suno-cover/index.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/suno-cover/index.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(SunoCover, "QyE1ZLn57tNKFqc14bwXL/LrV48=", false, function() {
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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
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
        // 如果已经是数组格式，直接返回
        if (Array.isArray(referenceSongsData)) return referenceSongsData.filter((song)=>song && typeof song === 'object' && song.title && typeof song.title === 'string').map((song)=>({
                title: song.title || '',
                artist: song.artist || ''
            }));
        // 如果是字符串，尝试解析JSON
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
    // 先定义空的表单数据结构（无论是否有recordId都需要）
    const formValues = {
        song_name: '',
        song_language: 'Mandarin',
        target_artist: '',
        style_note: '',
        lyrics_raw: '',
        extra_note: '',
        reference_songs: []
    };
    // 定义结果数据
    let stylesResult = '';
    let lyricsResult = '';
    // 如果没有recordId，直接返回空表单
    if (!recordId) return {
        formValues,
        hasRecord: false,
        stylesResult,
        lyricsResult
    };
    try {
        // 查询数据库记录
        const record = await _db.db.getPromptRecord(parseInt(recordId, 10));
        if (!record) {
            _antd.message.error('记录不存在');
            return {
                formValues,
                hasRecord: false,
                stylesResult,
                lyricsResult
            };
        }
        // 处理参考歌曲数据
        const processedReferenceSongs = await processReferenceSongs(record.user_input.reference_songs);
        // 更新表单数据
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
        // 提取AI生成的结果数据
        if (record.ai_result) {
            stylesResult = record.ai_result.styles || '';
            lyricsResult = record.ai_result.lyrics || '';
        }
        return {
            formValues,
            hasRecord: true,
            stylesResult,
            lyricsResult
        };
    } catch (_error) {
        _antd.message.error('数据加载失败');
        return {
            formValues,
            hasRecord: false,
            stylesResult,
            lyricsResult
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
"src/pages/suno-cover/utils/promptBuilder.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "SunoCoverPromptBuilder", {
    enumerable: true,
    get: function() {
        return SunoCoverPromptBuilder;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _prompts = __mako_require__("src/config/prompts.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class SunoCoverPromptBuilder {
    /**
   * 生成用户提示词
   * @param request - 生成请求参数
   * @returns 完整的用户提示词
   */ static buildUserPrompt(request) {
        const { target_artist, lyrics_raw, song_language, reference_songs, style_note, extra_note } = request;
        const fullLanguageName = SunoCoverPromptBuilder.getFullLanguageName(song_language);
        const referenceSongsBlock = SunoCoverPromptBuilder.formatReferenceSongs(reference_songs, target_artist);
        return _prompts.USER_PROMPT_TEMPLATE.replace('{fullLanguageName}', fullLanguageName).replace('{targetArtist}', target_artist).replace('{referenceSongsBlock}', referenceSongsBlock).replace('{styleNote}', style_note || '').replace('{extraNote}', extra_note || '').replace('{lyricsRaw}', lyrics_raw);
    }
    /**
   * 获取完整语言名称
   * @param language - 语言代码
   * @returns 完整语言名称
   */ static getFullLanguageName(language) {
        const languageMap = {
            Mandarin: 'Mandarin Chinese',
            Cantonese: 'Cantonese Chinese',
            English: 'English',
            Japanese: 'Japanese',
            Korean: 'Korean',
            Spanish: 'Spanish',
            French: 'French',
            German: 'German'
        };
        return languageMap[language] || language;
    }
    /**
   * 格式化参考歌曲
   * @param songs - 参考歌曲数组
   * @param targetArtist - 目标艺术家
   * @returns 格式化后的参考歌曲文本
   */ static formatReferenceSongs(songs, targetArtist) {
        if (!songs || songs.length === 0) return 'None provided.';
        return songs.filter((song)=>song.title).map((song)=>{
            const artistPart = song.artist && song.artist !== targetArtist ? ` by ${song.artist}` : '';
            return `- "${song.title}"${artistPart}`;
        }).join('\n  ');
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
"src/pages/suno-cover/utils/responseParser.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "SunoCoverResponseParser", {
    enumerable: true,
    get: function() {
        return SunoCoverResponseParser;
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
class SunoCoverResponseParser {
    /**
   * 解析AI响应
   * @param rawResponse - AI返回的原始响应
   * @returns 包含styles和lyrics的生成响应
   */ static parseResponse(rawResponse) {
        try {
            const responseText = rawResponse.trim();
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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
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
 }]);
//# sourceMappingURL=src_pages_suno-cover_index_tsx-async.js.map