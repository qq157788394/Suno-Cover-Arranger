## 1. 概述

### 1.1 产品目标

* 帮助用户基于「中文/母语需求 + 歌词」，自动生成 Suno 可用的高质量：

  * `"Styles"` 提示词（英文）

  * `"Lyrics"` 提示词（属性列表 + 原文歌词）

* 输出格式直接适配 Suno 官方推荐用法，用户可复制后粘贴到 Suno。

### 1.2 使用场景

* 用户使用 Suno 做「翻唱（Cover）」：

  * 会整理歌词；

  * 会说“像张惠妹《听海》那种爆发”；

  * 英文不好，不会写结构化 Styles/Lyrics。

* 本工具负责把这些中文输入翻译成结构化英文 Prompt。

***

## 2. 架构与技术约束

### 2.1 架构

* 纯前端应用（单页 Web 应用 / 静态站皆可）。

* 无后端服务：

  * 所有逻辑在浏览器端完成；

  * 由前端直接调用 DeepSeek 官方 API：`https://api.deepseek.com/chat/completions`。

### 2.2 DeepSeek API Key

* 用户需在界面中手动输入自己的 DeepSeek API Key。

* 前端在调用时通过 HTTP Header 发送：

  * `Authorization: Bearer <USER_API_KEY>`

  * `Content-Type: application/json`

* API Key 只保存在浏览器端：

  * 至少保存在内存中（React state 等）；

  * 可选：提供“记住 API Key（本机）”开关，使用 `localStorage` 保存。

* 不将用户 API Key 发送到任何自有后端（因为没有后端）。

### 2.3 CORS 风险说明（给开发看的）

* DeepSeek 官方 API 是否允许浏览器直接跨域调用，要以当时 CORS 策略为准。

* 如果浏览器报 CORS 错误，则在「无后端」前提下无法绕过；此时只能：

  * 提示用户“需要自建反向代理或使用桌面客户端”等（不在本 PRD 范围内）。

***

## 3. 前端功能与 UI

### 3.1 页面结构

单页应用，主要区域：

1. 顶部：标题 + 简短说明

2. 左侧：参数输入表单

3) 右侧：AI 输出区域（Styles / Lyrics）

4) 底部：简单说明/使用提示

### 3.2 输入表单字段

#### 3.2.1 DeepSeek API Key

* Label：`DeepSeek API Key`

* 字段名：`apiKey`

* 类型：密码输入框

* 交互：

  * 必填，否则禁用“生成”按钮；

  * 提供「显示/隐藏」按钮；

  * 可选：一枚勾选框 `记住在本机`，勾选则存 `localStorage`。

#### 3.2.2 歌曲语言

* Label：`歌曲语言`

* 字段名：`song_language`

* 类型：下拉框（必填）

* 枚举值（内部英文）：

  * `Mandarin`

  * `Cantonese`

  * `Minnan`

  * `English`

  * `Korean`

  * `Japanese`

  * `Other`

* UI 可显示中文名称，例如：

  * 华语（普通话） / 粤语 / 闽南语 / 英语 / 韩语 / 日语 / 其他

#### 3.2.3 目标翻唱歌手

* Label：`翻唱目标歌手`

* 字段名：`target_artist`

* 类型：单行文本（必填）

* 示例：

  * `张惠妹`

  * `Eason Chan`

  * `F.I.R.`

  * `羽泉`

#### 3.2.4 参考歌曲（0–3 首，可选）

* 字段名：`reference_songs`（数组）

* 每一项：

  * 歌曲名：`title`（必填）

  * 歌手名：`artist`（可选，默认等于 `target_artist`）

* UI：

  * “添加参考歌曲”按钮，最多 3 条。

* 示例：

  * 歌曲名：`听海`，歌手：`张惠妹`

  * 歌曲名：`我最亲爱的`，歌手：`张惠妹`

#### 3.2.5 风格备注（可选）

* Label：`风格备注`

* 字段名：`style_note`

* 类型：多行文本

* 示例：

  * “主歌要像《人质》一样极度克制，副歌接近《听海》的情绪爆发。”

#### 3.2.6 附加说明（可选）

* Label：`附加说明（场景/受众等）`

* 字段名：`extra_note`

* 类型：多行文本

* 示例：

  * “B站翻唱视频，40+ 男性怀旧向。”

#### 3.2.7 歌词全文

* Label：`歌词（带段落标签）`

* 字段名：`lyrics_raw`

* 类型：大多行文本（必填）

* 要求：

  * 用户自行用任意标签划分段落：

    * 如：`【主歌】`、`【主歌1】`、`[主歌]`、`[Verse]`、`[副歌]` 等；

  * 中间保留换行、空行。

* 前端只做简单校验：

  * 非空；

  * 最大长度（如 6000 字）。

***

## 4. 数据结构（前端内部）

### 4.1 输入数据对象

```typescript
type ReferenceSong = {
  title: string;
  artist?: string;
};

type GenerateRequest = {
  apiKey: string;           // 不发送给任何自有后端
  song_language: string;    // "Mandarin" | "Cantonese" | ...
  target_artist: string;
  reference_songs: ReferenceSong[];
  style_note?: string;
  extra_note?: string;
  lyrics_raw: string;
};
```

## 5. DeepSeek API 调用

### 5.1 Endpoint

* `POST https://api.deepseek.com/chat/completions`

### 5.2 Headers

* `Authorization: Bearer <apiKey>`

* `Content-Type: application/json`

### 5.3 Request Body（前端构造）

`{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "<SYSTEM_PROMPT_V2>"
    },
    {
      "role": "user",
      "content": "<USER_PROMPT_FILLED_WITH_FIELDS>"
    }
  ],
  "stream": false
}`

`<SYSTEM_PROMPT_V2>` 和 `<USER_PROMPT_FILLED_WITH_FIELDS>` 内容见下文第 6 / 7 章。

### 5.4 Response 解析

* 取 `choices[0].message.content` 作为完整输出。

* 期望 AI 输出 Markdown 结构：

````yaml
### Styles
```text
...Styles 内容...
```

### Lyrics
```text
...Lyrics 内容...
```
````

前端用简单字符串解析：

1. 从 `choices[0].message.content` 读取完整字符串。

2. 查找 `### Styles` 和 `### Lyrics` 标题。

3. 截取：

   * `### Styles` 下方第一对 `text 与 `之间的内容 → Styles 输出。

   * `### Lyrics` 下方第一对 `text 与 `之间的内容 → Lyrics 输出。

4. 去掉外层 \`\`\`text 包裹，填入 UI 文本框。

若解析失败则视为格式错误。

***

## 6. **SYSTEM\_PROMPT\_V2（英文原文，直接引用）**

> 下面整段内容请原样作为 \`messages\[0].content\` 传入 DeepSeek。

````plain&#x20;text
You are a senior Suno prompt engineer. Your job is to generate high-quality "Styles" and "Lyrics" prompts for cover songs in Suno (v3/v4/v5), especially for Chinese and East Asian songs (Mandarin, Cantonese, etc.).

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
You must ALWAYS output exactly two sections in this order:

### Styles
```text
(Styles content here)
```

### Lyrics
```text
(Lyrics content here)
```

Do NOT output anything before or after these two sections.

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
- You have reasonably interpreted user labels into standardized section labels and numbered them in order of appearance.
- Styles and Lyrics are consistent with each other (no contradictions in dynamics, instrumentation, or mood).

If any rule conflicts with another, ALWAYS prioritize preserving the original lyrics and keeping the required output format.

````

***

## 7. USER\_PROMPT 模板 v2（英文原文 + 占位符）

下面整段内容作为 `messages[1].content`，用花括号占位符替换为实际参数。

### 7.1 占位符说明

* `{{SONG_LANGUAGE_EN}}`：简短英文描述，例如：

  * `Mandarin Chinese` / `Cantonese` / `Minnan` / `English` / `Korean` / `Japanese` / `Other`.

* `{{TARGET_ARTIST_RAW}}`：用户输入的歌手名原文（可能是中文）。

* `{{REFERENCE_SONGS_BLOCK}}`：多行文本，每行形如 `"Title" by Artist`；无参考歌曲时填 `None`。

* `{{STYLE_NOTE_RAW}}`：风格备注原文（可为空）。

* `{{EXTRA_NOTE_RAW}}`：附加说明原文（可为空）。

* `{{LYRICS_RAW}}`：用户原始歌词全文，原样粘贴，包括标签和换行。

### 7.2 User Prompt 模板正文

````plain&#x20;text
You are generating Suno "Styles" and "Lyrics" prompts for a COVER version of a song. Read all the information below carefully and then produce the final output strictly following the system rules and the format requirements.

------------------------------
[1] Song language and context
------------------------------

- Song language: {{SONG_LANGUAGE_EN}}.
- The lyrics are provided in this language and MUST be preserved exactly.
- This is a COVER version, not an original composition. You should shape the sound to match the target artist and references below.

------------------------------
[2] Target artist and references
------------------------------

- Target cover artist (user input, may be in Chinese or another language):
  "{{TARGET_ARTIST_RAW}}"

- Reference songs from the user (if any):
  {{REFERENCE_SONGS_BLOCK}}

These names indicate the general style, vocal approach, and arrangement flavor you should lean toward. You do NOT need to describe these songs explicitly, but your Styles and section attributes should feel consistent with this artist and these references.

------------------------------
[3] User style notes (free-form, for your understanding only)
------------------------------

The user has provided extra style notes in their own words (often Chinese). You may use these notes to refine dynamics, emotion curve, and arrangement choices, but they are NOT additional lyrics.

- User style note (may be empty):
  "{{STYLE_NOTE_RAW}}"

- Extra note (may be empty, can include scene / audience / platform, etc.):
  "{{EXTRA_NOTE_RAW}}"

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

{{LYRICS_RAW}}

------------------------------
[5] Your output task
------------------------------

Now, using everything above and following the system rules, you MUST:

1) Generate the "Styles" section in English
- A single paragraph of 800–900 characters (hard limit 1000).
- It should describe the overall sound of this COVER version, taking into account:
  - The song language: {{SONG_LANGUAGE_EN}}.
  - The target artist: {{TARGET_ARTIST_RAW}}.
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
```text
Characters: <N>
(put the Styles paragraph here in English, MUST be under 900 characters)
```

### Lyrics
```text
(put the full Lyrics attribute list here, with all sections, attributes, and original lyrics)
```

Do NOT add any extra headings, explanations, or comments outside this format.
````

***

## 8. 前端错误处理逻辑

### 8.1 请求失败（网络 / 非 2xx 状态码）：

* 提示：“调用 DeepSeek API 失败，请检查 API Key 或稍后重试。”

### 8.2 AI 输出解析失败：

* 若未同时找到 `### Styles` 与 `### Lyrics`：

  * 提示：“AI 输出格式不符合预期，请稍微修改输入或重试。”

  * 可选：在开发模式下打印原始文本方便调试。

### 8.3 用户输入校验失败：

* 缺少 API Key / 必填字段 → 禁用“生成”按钮，并在对应字段下方展示错误信息。

***

## 9. 后续扩展建议（非必须）

* 若日后希望提高风格稳定性，可为少数高频歌手增加“风格提示片段”，追加到 User Prompt 中，而不必维护完整风格库。

* 可增加：

  * 导出为 JSON/文件的功能；

  * 自动检测 Styles 字数是否超限的前端校验；

  * 模型选择下拉框（不同 DeepSeek 模型）。

