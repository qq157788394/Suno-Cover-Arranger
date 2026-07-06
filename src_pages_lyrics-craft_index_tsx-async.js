((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['src/pages/lyrics-craft/index.tsx'],
{ "src/config/lyricsPrompts.ts": function (module, exports, __mako_require__){
/**
 * 歌词生成提示词配置文件
 * 包含System Prompt和User Prompt模板，用于AI歌词生成
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
    LYRICS_SYSTEM_PROMPT: function() {
        return LYRICS_SYSTEM_PROMPT;
    },
    LYRICS_USER_PROMPT_TEMPLATE: function() {
        return LYRICS_USER_PROMPT_TEMPLATE;
    },
    getClosenessLevelInstruction: function() {
        return getClosenessLevelInstruction;
    },
    getClosenessLevelLabel: function() {
        return getClosenessLevelLabel;
    },
    getOutputCountInstruction: function() {
        return getOutputCountInstruction;
    },
    getPersonaInstruction: function() {
        return getPersonaInstruction;
    },
    getWordingStyleInstruction: function() {
        return getWordingStyleInstruction;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _lyricsEnums = __mako_require__("src/config/lyricsEnums.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const LYRICS_SYSTEM_PROMPT = `# 《大师写歌词 / LyricCraft》System Prompt

## 一、你的角色定义 (Role)
你是一名**世界级华语音乐制作人与歌词创作辅助 LLM**，服务于专业产品 **《大师写歌词 (LyricCraft)》**。
你的核心职责是：
- 深度理解用户输入的 **大师风格数据 (Style Cards)**。
- 运用顶尖填词人的 **创作技法与美学逻辑**。
- 生成 **高度原创、结构严谨、极具演唱感且无版权风险** 的歌词文本。
你 **只负责输出最终歌词成品**，严禁输出任何分析、解释或闲聊文本。

---

## 二、核心创作原则 (强制遵守)
### 1. 原创性防火墙 (Non-Plagiarism)
- **绝对禁忌**：不得复刻、拼接任何已存在歌曲（特别是大师代表作）的具体句子。例如：模仿方文山时，**严禁**出现"天青色等烟雨"。
- **模仿边界**：你只能模仿大师的 **"滤镜"**（世界观、意象密度、句法结构、叙事逻辑），而不能复制 **"画面"**。

### 2. 音乐性原则 (Musicality)
- **呼吸感**：歌词是听觉艺术。必须控制长短句的节奏，模拟歌手的换气点，严禁堆砌密不透风的文字块。
- **演唱感**：用词必须考虑发音的流畅度，避免拗口的生僻字组合（除非风格卡明确要求）。

---

## 三、语言与方言规则 (硬约束)
用户将通过 \`language\` 参数指定输出语言，你必须严格执行：
1. **华语 (Mandopop)**：标准普通话，押韵遵循十三辙。
2. **粤语 (Cantopop)**：
- 以 **香港流行曲** 为标准，追求雅俗共赏。
- **[关键]**：严禁出现普通话特有词汇（如：的、是、什么、这里）。必须使用粤语正字（如：嘅、係、乜嘢、呢度）。
- **严格协音**：必须符合九声六调，严禁出现"倒字"（字音与旋律反冲）。
3. **闽南语 (Hokkien)**：
- 使用地道台语词汇（如：伊、咱、毋、逗阵），体现沧桑或江湖气。严禁直接将普通话转繁体。

---

## 四、大师风格与贴近度规则
你将接收到一段 \`## 风格卡数据 (Master Style Data)\`。请根据用户指定的 \`closeness_level\` (1-5) 进行不同程度的注入：
- **Level 1 (只借神韵)**：**忽略** 风格卡中的具体词汇表。仅参考其情感逻辑，用 **你自己的现代语言** 重写。
- **Level 2 (学他说话)**：模仿叙事口吻（如：旁观者、过来人），但内容完全原创。
- **Level 3 (学他招式)**：使用风格卡中的"句法特征"（如：倒装句、长短句），复刻其结构美感。
- **Level 4 (用他词汇)**：高频调用风格卡中的"意象与词库"，确保一眼就能认出是谁的风格。
- **Level 5 (就是本人)**：极致还原。允许为了风格而牺牲一定的通俗性，完全沉浸在大师的语境中。

---

## 五、歌曲结构规范 (Suno 专用)

### 1. 标签规范
- **必须** 使用英文方括号标签，**严禁** 使用中文。
- 允许标签：\`[Intro]\`, \`[Verse]\`, \`[Pre-Chorus]\`, \`[Chorus]\`, \`[Bridge]\`, \`[Interlude]\`, \`[Outro]\`。

### 2. 格式规范
- 每个结构标签 **单独成行**。
- 标签与歌词之间不加空行，段落之间加空行。
- 严格执行 User Prompt 中传入的 \`structure_template\`。

---

## 六、押韵规则 (韵律红线)
- **严格执行**：必须遵守用户指定的 \`RhymeType\`（单押/双押/换韵）。
- **自然优先**：严禁为了押韵而强行拼凑逻辑不通的词汇（"凑韵"是最低级的错误）。
- **韵辙统一**：同一段落（如 Verse 1）内韵脚必须保持一致，除非指定了特殊流派。

---

## 七、输出数量规则
- 用户指定输出方案数量：**1 个或 3 个**。
- 若为 3 个方案，方案之间必须在 **"切入角度"** 或 **"用词风格"** 上有明显差异，不得重复堆砌。

---

## 八、LLM 深度自检机制 (Deep Self-Correction)
**【这是最重要的步骤】**
在输出最终歌词之前，你必须在后台（思维链中）执行以下 **3 次循环扫描**。只要有 **任何一项** 不通过，必须 **立即推翻重写**。

### 🔍 扫描一：语言与韵律 (Language & Rhyme Scan)
1. **方言过滤**：
- (若为粤语) 检查是否混入了"的、是、什么、没有"？ -> **有则重写**。
- (若为闽南语) 检查是否混入了普通话常用词？ -> **有则重写**。

2. **押韵审计**：
- 检查每一句的尾字是否符合指定的韵脚？
- 检查是否存在"为了押韵而押韵"的狗屁不通句子？ -> **有则重写**。

### 🔍 扫描二：风格与贴近度 (Style & Level Scan)
1. **等级核对**：
- (若 Level=1) 检查是否错误地堆砌了大师的招牌词汇（如"青花瓷"）？ -> **是则重写，改用现代词**。
- (若 Level=5) 检查味道是否太淡、太像白开水？ -> **是则重写，增加浓度**。

2. **去 AI 味**：
- 全文检索是否包含："岁月的长河"、"心中的涟漪"、"未知的远方"、"梦想的翅膀"。 -> **发现一个删一个**。

### 🔍 扫描三：格式与结构 (Format Scan)
1. **标签纯净度**：检查是否有 \`[主歌]\` 或 \`Chorus:\` 这种错误格式？ -> **修正为标准英文 [Chorus]**。
2. **闲聊过滤**：检查开头结尾是否有"好的"、"希望你喜欢"？ -> **全部删除**。

---

## 九、输出格式示例 (Strict Output)
(仅以markdown格式输出以下内容，使用两个换行符分隔段落，不包含代码块标记，也不包含自检过程)

[Song Title]

[Verse 1]
歌词内容...
歌词内容...

[Chorus]
歌词内容...
歌词内容...

[Outro]
歌词内容...
`;
const LYRICS_USER_PROMPT_TEMPLATE = `# 📋 歌词创作任务书 (User Prompt)

## 1. 基础信息 (Basic Info)
- **歌曲名称**：{song_name}
- **输出方案数量**：{output_count_instruction} (请确保方案之间有明显的切入点差异)
- **创作模式**：{creation_mode_instruction}

## 2. 核心输入与参考 (Inputs & References)
请仔细阅读以下用户提供的核心素材/故事背景，这是歌词的内容基石：

**A. 核心素材/故事背景 (Content Base)**
"""
{raw_material}
"""

**B. 参考歌曲 (Reference Track)**
- **参考指令**：请分析该参考歌曲的**情绪基调 (Vibe)**、**叙事节奏**或**结构张力**，将其神韵融入本次创作。
- **⚠️ 警告**：仅参考感觉，**严禁**抄袭参考歌曲的具体歌词或旋律线暗示。
- **目标参考**：{{reference_lyrics}}

**C. 用户额外要求 (Extra Constraints)**
{requirements}

## 3. 音乐与结构框架 (Framework)

**必须严格执行以下音乐性约束：**
- **语言/方言**：{song_language_instruction}
- **音乐流派**：{song_style_instruction}
- **曲式结构**：{song_structure_instruction}
- **押韵规则**：{rhyme_type_instruction}

## 4. 叙事与笔法 (Narrative & Tone)
- **叙事人设**：{persona_instruction}
- **用词风格**：{wording_style_instruction}

---

## 5. 大师风格注入 (Master Style Injection)
**目标模仿大师**：【{master_name}】
**指定贴近度等级**：{closeness_level_label}

**>>> 风格卡数据 (Master DNA) <<<**
以下是该大师的核心创作特征，请根据"贴近度等级"进行调用：
"""
{master_style_styles_raw_data}
"""

**>>> 贴近度执行指令 (Level Instruction) <<<**
{closeness_level_instruction}

---

## 6. 最终执行指令 (Execution)
请立即启动 **[LLM 深度自检机制]**，在后台完成语言、押韵、风格、原创性的扫描。

**输出要求：**
1.  仅以markdown格式输出歌词文本，**严禁**输出任何开场白、解释或自检过程。
2.  必须严格遵守 System Prompt 中的"禁忌红线"（无 AI 味、无抄袭、无中文标签）。
3.  开始创作！`;
function getClosenessLevelLabel(closenessLevel) {
    const option = _lyricsEnums.CLOSENESS_LEVEL_OPTIONS.find((opt)=>opt.value === closenessLevel);
    return (option === null || option === void 0 ? void 0 : option.label) || `Level ${closenessLevel}`;
}
function getClosenessLevelInstruction(closenessLevel) {
    const option = _lyricsEnums.CLOSENESS_LEVEL_OPTIONS.find((opt)=>opt.value === closenessLevel);
    return (option === null || option === void 0 ? void 0 : option.prompt_instruction) || '';
}
function getOutputCountInstruction(outputCount) {
    const option = _lyricsEnums.OUTPUT_COUNT_OPTIONS.find((opt)=>opt.value === outputCount);
    return (option === null || option === void 0 ? void 0 : option.prompt_instruction) || '请提供 1 个完整的创作方案。';
}
function getWordingStyleInstruction(wordingStyles) {
    if (!wordingStyles || wordingStyles.length === 0) return '【用词风格】：不限。请根据歌曲风格和内容自然选择用词风格。';
    const selectedOptions = wordingStyles.map((style)=>_lyricsEnums.WORDING_STYLE_OPTIONS.find((opt)=>opt.value === style)).filter((opt)=>opt !== undefined);
    if (selectedOptions.length === 0) return '【用词风格】：不限。请根据歌曲风格和内容自然选择用词风格。';
    const styleNames = selectedOptions.map((opt)=>opt.label).join(' + ');
    const instructions = selectedOptions.map((opt)=>opt.prompt_instruction).filter((instruction)=>instruction !== undefined).join('\n');
    return `【用词风格】：${styleNames}。\n${instructions}`;
}
function getPersonaInstruction(persona) {
    const option = _lyricsEnums.PERSONA_OPTIONS.find((opt)=>opt.value === persona);
    return (option === null || option === void 0 ? void 0 : option.prompt_instruction) || _lyricsEnums.PERSONA_OPTIONS[0].prompt_instruction || '不限制叙事视角，AI 自由选择';
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
"src/pages/lyrics-craft/index.tsx": function (module, exports, __mako_require__){
/**
 * 大师写歌词页面
 * 负责处理歌词创作相关功能，使用ProForm实现15个表单项
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
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.3.2_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@ant-design/icons/es/index.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19._39948e61760ff9ce55bb289fa3c0c022/node_modules/@ant-design/pro-components/es/index.js");
var _xmarkdown = __mako_require__("node_modules/.pnpm/@ant-design+x-markdown@2.8.0_@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@ant-design/x-markdown/es/index.js");
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
"";
"";
var _components = __mako_require__("src/components/index.ts");
var _aiTemperatureConfig = __mako_require__("src/config/aiTemperatureConfig.ts");
var _lyricsEnums = __mako_require__("src/config/lyricsEnums.ts");
var _masterStyleConfig = __mako_require__("src/config/masterStyleConfig.ts");
var _useApiKey = __mako_require__("src/hooks/useApiKey.ts");
var _useLyricsRecords = __mako_require__("src/hooks/useLyricsRecords.ts");
var _providers = __mako_require__("src/services/ai/providers/index.ts");
var _utils = __mako_require__("src/shared/utils/index.ts");
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
    const [generatedLyrics, setGeneratedLyrics] = (0, _react.useState)('');
    const [inspirationModalVisible, setInspirationModalVisible] = (0, _react.useState)(false);
    const [selectedInspiration, setSelectedInspiration] = (0, _react.useState)('');
    const [masterSearchKeyword, setMasterSearchKeyword] = (0, _react.useState)('');
    const [messageApi, contextHolder] = _antd.message.useMessage();
    const formRef = (0, _react.useRef)(null);
    const { initialState } = (0, _max.useModel)('@@initialState');
    // 根据主题设置确定XMarkdown的主题类
    const isDarkTheme = (initialState === null || initialState === void 0 ? void 0 : (_initialState_settings = initialState.settings) === null || _initialState_settings === void 0 ? void 0 : _initialState_settings.navTheme) === 'realDark';
    const markdownThemeClass = isDarkTheme ? 'x-markdown-dark' : 'x-markdown-light';
    const defaultFormValues = {
        song_language: 'mandarin',
        song_style: 'lyrical_pop',
        song_structure: 'classic_three_verse',
        creation_mode: 'new',
        persona: 'unlimited',
        wording_style: [],
        allow_english: false,
        closeness: 3,
        rhyme_type: 'mix',
        rhyme_strict: true,
        output_count: 1
    };
    const filteredMasterOptions = _react.default.useMemo(()=>{
        if (!masterSearchKeyword.trim()) return _masterStyleConfig.MASTER_GROUPS.map((group)=>({
                label: group.name,
                options: _masterStyleConfig.MASTER_STYLE_CARDS.filter((master)=>master.groupId === group.id).map((master)=>({
                        label: master.description ? `${master.name} - ${master.description}` : master.name,
                        value: master.id
                    }))
            }));
        const keyword = masterSearchKeyword.toLowerCase();
        return _masterStyleConfig.MASTER_GROUPS.map((group)=>{
            const filteredMasters = _masterStyleConfig.MASTER_STYLE_CARDS.filter((master)=>master.groupId === group.id && (`${master.name} ${master.description || ''}`.toLowerCase().includes(keyword) || group.name.toLowerCase().includes(keyword)));
            if (filteredMasters.length === 0) return null;
            return {
                label: group.name,
                options: filteredMasters.map((master)=>({
                        label: master.description ? `${master.name} - ${master.description}` : master.name,
                        value: master.id
                    }))
            };
        }).filter((group)=>group !== null);
    }, [
        masterSearchKeyword
    ]);
    const handleSubmit = async (values)=>{
        var _values_song_name, _values_raw_material;
        if (!checkApiKey()) return;
        if (!((_values_song_name = values.song_name) === null || _values_song_name === void 0 ? void 0 : _values_song_name.trim())) {
            messageApi.error('歌曲名称不能为空');
            return;
        }
        if (!((_values_raw_material = values.raw_material) === null || _values_raw_material === void 0 ? void 0 : _values_raw_material.trim())) {
            messageApi.error('原始素材不能为空');
            return;
        }
        if (values.output_count < 1 || values.output_count > 5) {
            messageApi.error('生成数量必须在1-5之间');
            return;
        }
        if (values.closeness < 0 || values.closeness > 100) {
            messageApi.error('贴近度必须在0-100之间');
            return;
        }
        setLoading(true);
        setGeneratedLyrics('');
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
            if (!response.success) throw new Error(response.error || 'AI生成失败');
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
                if (result.success && ((_result_data = result.data) === null || _result_data === void 0 ? void 0 : _result_data.id)) messageApi.success('歌词生成成功！');
                else messageApi.error('歌词生成成功，但保存失败');
            } else messageApi.error(parsedResponse.error || '歌词生成失败');
        } catch (error) {
            console.error('歌词生成失败：', error);
            messageApi.error('歌词生成失败，请稍后重试');
        } finally{
            setLoading(false);
        }
    };
    /**
   * 处理灵感选择
   */ const handleInspirationSelect = async (values)=>{
        if (formRef.current) {
            // 使用ProForm API获取当前原始素材的值
            const currentValues = formRef.current.getFieldsValue();
            const currentRawMaterial = currentValues.raw_material || '';
            // 构建新的原始素材内容
            const newRawMaterial = currentRawMaterial ? `${currentRawMaterial}\n\n${values.inspiration}` : values.inspiration;
            // 使用ProForm API设置新的值
            formRef.current.setFieldsValue({
                raw_material: newRawMaterial
            });
            messageApi.success('灵感已添加到原始素材中');
            setInspirationModalVisible(false);
            setSelectedInspiration('');
            return true;
        }
        return false;
    };
    /**
   * 打开灵感选择弹窗
   */ const handleOpenInspirationModal = ()=>{
        setInspirationModalVisible(true);
    };
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
        children: [
            contextHolder,
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ModalForm, {
                title: "灵感来了",
                open: inspirationModalVisible,
                onOpenChange: setInspirationModalVisible,
                onFinish: handleInspirationSelect,
                modalProps: {
                    destroyOnClose: true,
                    maskClosable: false
                },
                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm.Item, {
                    name: "inspiration",
                    label: "选择一个灵感吧，自动生成原始素材",
                    rules: [
                        {
                            required: true,
                            message: '请选择一个灵感'
                        }
                    ],
                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Radio.Group, {
                        style: {
                            width: '100%'
                        },
                        value: selectedInspiration,
                        onChange: (e)=>setSelectedInspiration(e.target.value),
                        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions, {
                            column: 1,
                            layout: "vertical",
                            bordered: true,
                            size: "middle",
                            style: {
                                width: '100%'
                            },
                            children: _lyricsEnums.INSPIRATION_SCENARIOS.map((category)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProDescriptions.Item, {
                                    label: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                        strong: true,
                                        children: category.categoryName
                                    }, void 0, false, {
                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                        lineNumber: 291,
                                        columnNumber: 26
                                    }, void 0),
                                    valueType: "text",
                                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                        size: "middle",
                                        wrap: true,
                                        children: category.items.map((item)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Radio, {
                                                value: item.value,
                                                children: item.label
                                            }, item.label, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 296,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                        lineNumber: 294,
                                        columnNumber: 19
                                    }, this)
                                }, category.categoryName, false, {
                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                    lineNumber: 289,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "src/pages/lyrics-craft/index.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-craft/index.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/lyrics-craft/index.tsx",
                    lineNumber: 271,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "src/pages/lyrics-craft/index.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
                children: [
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_components.ApiKeyAlert, {
                        visible: shouldShowAlert,
                        onNavigateToSettings: navigateToSettings
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-craft/index.tsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                        spinning: loading,
                        fullscreen: true,
                        size: "large"
                    }, void 0, false, {
                        fileName: "src/pages/lyrics-craft/index.tsx",
                        lineNumber: 314,
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
                                lg: 24,
                                md: 24,
                                sm: 24,
                                xs: 24,
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                    title: "创作配置",
                                    style: {
                                        height: '100%'
                                    },
                                    children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
                                        layout: "vertical",
                                        grid: true,
                                        onFinish: handleSubmit,
                                        formRef: formRef,
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
                                                    lineNumber: 325,
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
                                                        message: '请输入歌曲名称'
                                                    },
                                                    {
                                                        max: 50,
                                                        message: '歌曲名称最多 50 个字'
                                                    }
                                                ],
                                                colProps: {
                                                    span: 24
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 338,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "song_language",
                                                label: "歌曲语言",
                                                placeholder: "请选择歌曲语言",
                                                options: _lyricsEnums.SONG_LANGUAGE_OPTIONS.map((option)=>({
                                                        label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
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
                                                        }, void 0, true, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 354,
                                                            columnNumber: 23
                                                        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
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
                                                        message: '请选择歌曲语言'
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
                                                lineNumber: 367,
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
                                                        message: '请选择输出方案数量'
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
                                                lineNumber: 373,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "master_id",
                                                label: `大师风格（${_masterStyleConfig.MASTER_STYLE_CARDS.length} 位大师风格供选择）`,
                                                placeholder: "请选择 / 搜索大师风格",
                                                options: filteredMasterOptions,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择大师风格'
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
                                                    showSearch: true,
                                                    onSearch: (value)=>setMasterSearchKeyword(value),
                                                    filterOption: false
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 383,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "wording_style",
                                                label: "措辞要求（可选，最多可选 2 项）",
                                                options: _lyricsEnums.WORDING_STYLE_OPTIONS.map((option)=>({
                                                        label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    children: option.label
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 403,
                                                                    columnNumber: 25
                                                                }, void 0),
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    type: "secondary",
                                                                    children: option.description
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 404,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 23
                                                        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            children: option.label
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 23
                                                        }, void 0),
                                                        value: option.value
                                                    })),
                                                mode: "multiple",
                                                rules: [
                                                    {
                                                        type: 'array',
                                                        max: 2,
                                                        message: '措辞要求最多选择 2 项'
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
                                                    maxTagCount: 'responsive'
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 397,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSlider, {
                                                name: "closeness",
                                                label: "贴近度",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择贴近度'
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
                                                            if (value === undefined) return '';
                                                            const option = _lyricsEnums.CLOSENESS_LEVEL_OPTIONS.find((opt)=>opt.value === value);
                                                            if (!option) return String(value);
                                                            return option.tooltip_example ? `${option.description}。${option.tooltip_example}` : option.description;
                                                        }
                                                    },
                                                    style: {
                                                        margin: '0 32px'
                                                    }
                                                }
                                            }, void 0, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 426,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "creation_mode",
                                                label: "创作模式",
                                                placeholder: "请选择创作模式",
                                                options: _lyricsEnums.CREATION_MODE_OPTIONS.map((option)=>({
                                                        label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    children: option.label
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 464,
                                                                    columnNumber: 25
                                                                }, void 0),
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    type: "secondary",
                                                                    children: option.description
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 23
                                                        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            children: option.label
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 468,
                                                            columnNumber: 23
                                                        }, void 0),
                                                        value: option.value
                                                    })),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择创作模式'
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
                                                lineNumber: 457,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "song_style",
                                                label: "歌曲风格",
                                                placeholder: "请选择歌曲风格",
                                                options: _lyricsEnums.SONG_STYLE_OPTIONS.map((option)=>({
                                                        label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    children: option.label
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 483,
                                                                    columnNumber: 25
                                                                }, void 0),
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    type: "secondary",
                                                                    children: option.description
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 482,
                                                            columnNumber: 23
                                                        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            children: option.label
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 23
                                                        }, void 0),
                                                        value: option.value
                                                    })),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择歌曲风格'
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
                                                lineNumber: 476,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "song_structure",
                                                label: "曲式结构",
                                                placeholder: "请选择曲式结构",
                                                options: _lyricsEnums.SONG_STRUCTURE_OPTIONS.map((option)=>({
                                                        label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    children: option.label
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 503,
                                                                    columnNumber: 25
                                                                }, void 0),
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    type: "secondary",
                                                                    children: option.description
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 504,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 23
                                                        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            children: option.label
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 507,
                                                            columnNumber: 23
                                                        }, void 0),
                                                        value: option.value
                                                    })),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择曲式结构'
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
                                                lineNumber: 496,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "persona",
                                                label: "叙事人设",
                                                placeholder: "请选择叙事人设",
                                                options: _lyricsEnums.PERSONA_OPTIONS.map((option)=>({
                                                        label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    children: option.label
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 522,
                                                                    columnNumber: 25
                                                                }, void 0),
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    type: "secondary",
                                                                    children: option.description
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 523,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 521,
                                                            columnNumber: 23
                                                        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            children: option.label
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 526,
                                                            columnNumber: 23
                                                        }, void 0),
                                                        value: option.value
                                                    })),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择叙事人设'
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
                                                lineNumber: 515,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "raw_material",
                                                // label="原始素材"
                                                placeholder: "请输入原始素材（主题、大意、歌词片段等），每一行视为一个参考素材",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入原始素材'
                                                    },
                                                    {
                                                        max: 1000,
                                                        message: '原始素材最多1000字'
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
                                                },
                                                label: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                    align: "center",
                                                    children: [
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            children: "原始素材"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 550,
                                                            columnNumber: 23
                                                        }, void 0),
                                                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                                            type: "primary",
                                                            size: "small",
                                                            icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.LikeFilled, {}, void 0, false, {
                                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                                lineNumber: 555,
                                                                columnNumber: 31
                                                            }, void 0),
                                                            onClick: handleOpenInspirationModal,
                                                            children: "找灵感"
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 552,
                                                            columnNumber: 23
                                                        }, void 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 21
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "src/pages/lyrics-craft/index.tsx",
                                                lineNumber: 534,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "reference_lyrics",
                                                label: "参考歌曲和歌词（可选）",
                                                placeholder: "请输入参考歌曲名称和歌词全文，仅作为技法参考，不要求结构对齐",
                                                rules: [
                                                    {
                                                        max: 1000,
                                                        message: '参考歌曲和歌词最多1000字'
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
                                                lineNumber: 563,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                name: "requirements",
                                                label: "创作要求（可选）",
                                                placeholder: "请输入创作要求（情绪走向、禁止出现的内容等）",
                                                rules: [
                                                    {
                                                        max: 1000,
                                                        message: '创作要求最多1000字'
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
                                                lineNumber: 575,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                name: "rhyme_type",
                                                label: "押韵类型",
                                                placeholder: "请选择押韵类型",
                                                options: _lyricsEnums.RHYME_TYPE_OPTIONS.map((option)=>({
                                                        label: option.description ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    children: option.label
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 594,
                                                                    columnNumber: 25
                                                                }, void 0),
                                                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                                    type: "secondary",
                                                                    children: option.description
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                                                    lineNumber: 595,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 593,
                                                            columnNumber: 23
                                                        }, void 0) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(Text, {
                                                            children: option.label
                                                        }, void 0, false, {
                                                            fileName: "src/pages/lyrics-craft/index.tsx",
                                                            lineNumber: 598,
                                                            columnNumber: 23
                                                        }, void 0),
                                                        value: option.value
                                                    })),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择押韵类型'
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
                                                lineNumber: 587,
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
                                                lineNumber: 606,
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
                                                lineNumber: 612,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/lyrics-craft/index.tsx",
                                lineNumber: 316,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                xxl: 8,
                                xl: 12,
                                lg: 24,
                                md: 24,
                                sm: 24,
                                xs: 24,
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                    title: "生成的歌词",
                                    extra: generatedLyrics && /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                        size: "small",
                                        onClick: ()=>(0, _utils.copyToClipboard)(generatedLyrics, '歌词'),
                                        children: "复制歌词"
                                    }, void 0, false, {
                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                        lineNumber: 627,
                                        columnNumber: 19
                                    }, void 0),
                                    style: {
                                        height: '100%'
                                    },
                                    children: !generatedLyrics ? /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Empty, {
                                        description: "请填写左侧表单并点击生成按钮",
                                        style: {
                                            marginTop: 80
                                        }
                                    }, void 0, false, {
                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                        lineNumber: 638,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_xmarkdown.XMarkdown, {
                                        className: markdownThemeClass,
                                        config: {
                                            breaks: true
                                        },
                                        children: generatedLyrics
                                    }, void 0, false, {
                                        fileName: "src/pages/lyrics-craft/index.tsx",
                                        lineNumber: 643,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "src/pages/lyrics-craft/index.tsx",
                                    lineNumber: 623,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/lyrics-craft/index.tsx",
                                lineNumber: 622,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/lyrics-craft/index.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "src/pages/lyrics-craft/index.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(LyricsCraftPage, "WkMLqLwVLz6o5gviDfwX/Qhyj/w=", false, function() {
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

},
"src/pages/lyrics-craft/utils/promptBuilder.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "LyricsCraftPromptBuilder", {
    enumerable: true,
    get: function() {
        return LyricsCraftPromptBuilder;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _lyricsPromptService = __mako_require__("src/services/lyricsPromptService.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class LyricsCraftPromptBuilder {
    /**
   * 生成系统提示词
   * @param request - 歌词生成请求参数
   * @returns 完整的系统提示词
   */ static buildSystemPrompt(_request) {
        return (0, _lyricsPromptService.getLyricsSystemPrompt)();
    }
    /**
   * 生成用户提示词
   * @param request - 歌词生成请求参数
   * @returns 完整的用户提示词
   */ static buildUserPrompt(request) {
        return (0, _lyricsPromptService.getLyricsUserPrompt)(request);
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
"src/pages/lyrics-craft/utils/responseParser.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "LyricsCraftResponseParser", {
    enumerable: true,
    get: function() {
        return LyricsCraftResponseParser;
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
class LyricsCraftResponseParser {
    /**
   * 解析AI响应
   * 直接返回AI的原始内容，不做任何处理
   * @param rawResponse - AI返回的原始响应
   * @returns 包含歌词的生成响应
   */ static parseResponse(rawResponse) {
        try {
            const content = rawResponse.trim();
            if (!content) return {
                success: false,
                error: 'AI 生成内容为空',
                lyrics: '',
                timestamp: new Date().toISOString()
            };
            return {
                success: true,
                lyrics: content,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('响应解析失败:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '响应解析失败',
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
"src/services/lyricsPromptService.ts": function (module, exports, __mako_require__){
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
    assembleLyricsPrompt: function() {
        return assembleLyricsPrompt;
    },
    getCloseness: function() {
        return getCloseness;
    },
    getLyricsSystemPrompt: function() {
        return getLyricsSystemPrompt;
    },
    getLyricsUserPrompt: function() {
        return getLyricsUserPrompt;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _lyricsPrompts = __mako_require__("src/config/lyricsPrompts.ts");
var _masterStyleConfig = __mako_require__("src/config/masterStyleConfig.ts");
var _lyricsEnums = __mako_require__("src/config/lyricsEnums.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
/**
 * 根据value获取枚举选项的prompt_instruction
 */ function getEnumInstruction(value, options) {
    const option = options.find((opt)=>opt.value === value);
    return (option === null || option === void 0 ? void 0 : option.prompt_instruction) || "";
}
/**
 * 根据masterId获取大师风格卡
 */ function getMasterStyleCard(masterId) {
    return _masterStyleConfig.MASTER_STYLE_CARDS.find((card)=>card.id === masterId);
}
function assembleLyricsPrompt(formData) {
    const songLanguageInstruction = getEnumInstruction(formData.song_language, _lyricsEnums.SONG_LANGUAGE_OPTIONS);
    const songStyleInstruction = getEnumInstruction(formData.song_style, _lyricsEnums.SONG_STYLE_OPTIONS);
    const songStructureInstruction = getEnumInstruction(formData.song_structure, _lyricsEnums.SONG_STRUCTURE_OPTIONS);
    const creationModeInstruction = getEnumInstruction(formData.creation_mode, _lyricsEnums.CREATION_MODE_OPTIONS);
    const rhymeTypeInstruction = getEnumInstruction(formData.rhyme_type, _lyricsEnums.SONG_LANGUAGE_OPTIONS);
    const outputCountInstruction = (0, _lyricsPrompts.getOutputCountInstruction)(formData.output_count);
    const wordingStyleInstruction = (0, _lyricsPrompts.getWordingStyleInstruction)(formData.wording_style);
    const personaInstruction = (0, _lyricsPrompts.getPersonaInstruction)(formData.persona);
    const closenessLevelLabel = (0, _lyricsPrompts.getClosenessLevelLabel)(formData.closeness);
    const closenessLevelInstruction = (0, _lyricsPrompts.getClosenessLevelInstruction)(formData.closeness);
    const masterName = formData.master_id ? (()=>{
        const master = getMasterStyleCard(formData.master_id);
        return (master === null || master === void 0 ? void 0 : master.name) || "未知大师";
    })() : "无";
    const masterStyleStylesRawData = formData.master_id ? (()=>{
        const master = getMasterStyleCard(formData.master_id);
        return (master === null || master === void 0 ? void 0 : master.stylesRawData) || "";
    })() : "";
    const userPrompt = _lyricsPrompts.LYRICS_USER_PROMPT_TEMPLATE.replace("{song_name}", formData.song_name).replace("{output_count_instruction}", outputCountInstruction).replace("{creation_mode_instruction}", creationModeInstruction).replace("{raw_material}", formData.raw_material).replace("{requirements}", formData.requirements || "无").replace("{{reference_lyrics}}", formData.reference_lyrics || "无").replace("{song_language_instruction}", songLanguageInstruction).replace("{song_style_instruction}", songStyleInstruction).replace("{song_structure_instruction}", songStructureInstruction).replace("{rhyme_type_instruction}", rhymeTypeInstruction).replace("{persona_instruction}", personaInstruction).replace("{wording_style_instruction}", wordingStyleInstruction).replace("{master_name}", masterName).replace("{closeness_level_label}", closenessLevelLabel).replace("{master_style_styles_raw_data}", masterStyleStylesRawData).replace("{closeness_level_instruction}", closenessLevelInstruction);
    return {
        systemPrompt: _lyricsPrompts.LYRICS_SYSTEM_PROMPT,
        userPrompt,
        closeness: formData.closeness
    };
}
function getLyricsSystemPrompt() {
    return _lyricsPrompts.LYRICS_SYSTEM_PROMPT;
}
function getLyricsUserPrompt(formData) {
    const { userPrompt } = assembleLyricsPrompt(formData);
    return userPrompt;
}
function getCloseness(formData) {
    return formData.closeness;
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
 }]);
//# sourceMappingURL=src_pages_lyrics-craft_index_tsx-async.js.map