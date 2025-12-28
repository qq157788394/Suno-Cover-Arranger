/**
 * 歌词创作枚举配置
 * 集中管理所有歌词创作业务所需的枚举选项
 */

export interface EnumOption {
  value: string | number; // 唯一标识
  label: string; // 下拉框主标题
  description?: string; // 下拉框副标题/说明
  tooltip_example?: string; // 鼠标悬浮显示的举例
  prompt_instruction?: string; // 核心：传递给 AI 的完整结构指令
}

/**
 * 歌词创作枚举配置 (完整版)
 * 包含 UI 展示字段 (label, description) 和 AI 指令字段 (prompt_instruction)
 */

export interface EnumOption {
  value: string | number; // 唯一标识
  label: string; // 下拉框主标题
  description?: string; // 下拉框副标题/说明
  tooltip_example?: string; // 鼠标悬浮显示的举例
  prompt_instruction?: string; // 核心：传递给 AI 的完整结构指令 (Instruction)
}

/**
 * 歌曲语言枚举配置
 * 指令重点：规定语种和特殊的押韵逻辑
 */
export const SONG_LANGUAGE_OPTIONS: EnumOption[] = [
  {
    value: 'mandarin',
    label: '华语 Mandopop', // 修改点：专业术语，涵盖两岸三地及新马
    description: '标准普通话，押韵遵循汉语拼音规则', // 描述保持“普通话”以明确语言技术标准
    prompt_instruction:
      '【语言要求】：必须使用标准的现代普通话创作。押韵请严格遵循汉语拼音韵辙（如十三辙）。',
  },
  {
    value: 'cantonese',
    label: '粤语 Cantopop',
    description: '遵循粤语九声六调，参考港式流行曲风格',
    prompt_instruction: `
【语言要求】：
1. 必须使用地道的粤语创作，以【香港流行曲 (Hong Kong Cantopop)】为风格基准。
2. 【关键】：请寻找“雅”与“俗”的平衡。主要使用“协音的书面语”（Standard Written Chinese that fits Cantonese tones），但在情感爆发点可适当使用地道口语字（如‘唔’、‘係’、‘嗰’、‘嘅’）来增加亲切感。
3. 允许适度混入英文单词（如 Party, Lonely），体现都市感。
4. 必须严格遵守粤语的九声六调音韵（协音），歌词唱起来不能“倒字”（即字音与旋律走向不冲突）。
`,
  },
  {
    value: 'minnan',
    label: '闽南语 Hokkien', // 1. 修改 Label：用 Hokkien 与 Mandopop/Cantopop 对应，显得国际化且专业
    description: '台语/闽南语，韵味独特，适合表达沧桑、拼搏或江湖情', // 2. 修改描述：更具体，指出适合写什么
    prompt_instruction:
      '【语言要求】：必须使用地道的闽南语（台语）创作。1. 词汇：请务必使用‘伊’(他)、‘咱’(我们)、‘毋’(不)、‘逗阵’(在一起)等台语专用词，严禁直接把普通话转繁体。2. 风格：请着重体现‘沧桑感’、‘宿命论’（如运命、安排）或‘打拼精神’（爱拼才会赢），韵脚要响亮有力，体现男儿气概或女性的坚韧。',
  },
];

export type SongLanguage = (typeof SONG_LANGUAGE_OPTIONS)[number]['value'];

/**
 * 歌曲风格枚举配置
 * 指令重点：规定词汇库(Vocabulary)和语气(Tone)
 */
export const SONG_STYLE_OPTIONS: EnumOption[] = [
  {
    value: 'lyrical_pop',
    label: '抒情流行 Ballad',
    description: '情感细腻，旋律优美，适合走心叙事',
    prompt_instruction:
      '【风格定义】：华语抒情流行歌。基调：感性、细腻、温柔。意象：请多用具象的生活场景（如雨天、街角、旧照片）来烘托情感。句式要流畅优美，富有呼吸感。',
  },
  {
    value: 'rnb',
    label: 'R&B / Soul',
    description: '节奏布鲁斯，律动感强，转音丰富',
    prompt_instruction:
      '【风格定义】：R&B/Soul 风格。基调：律动感强、慵懒、浪漫或略带忧伤。技巧：请在歌词中设计切分音的感觉，多用长短句交替，语言可以更口语化、更有都市感。',
  },
  {
    value: 'rap',
    label: '说唱 Rap/Hip-Hop',
    description: '节奏紧凑，押韵密集，态度鲜明',
    prompt_instruction:
      '【风格定义】：嘻哈/说唱。基调：自信、有冲击力、态度鲜明。硬性要求：必须极度重视押韵（建议多尝试双押或三押），句子Flow要紧凑，要有梗（Punchline）。',
  },
  {
    value: 'chinese_style',
    label: '国风 Chinese Style',
    description: '融合传统元素，辞藻华丽，意境唯美',
    prompt_instruction:
      '【风格定义】：新国风/古风。基调：唯美、古典、怀旧。词汇：请大量使用古典意象（如明月、残酒、长剑、落花、红尘）。严禁出现现代科技词汇（如手机、网络）。',
  },
  {
    value: 'rock',
    label: '摇滚 Rock',
    description: '力量感强，直白宣泄，甚至是嘶吼',
    prompt_instruction:
      '【风格定义】：流行摇滚。基调：热血、叛逆、沧桑或撕裂。词汇：使用强有力的动词，表达渴望自由、挣扎或不妥协的态度。拒绝无病呻吟，要直抒胸臆。',
  },
  {
    value: 'folk',
    label: '民谣 Folk',
    description: '朴实自然，像散文诗一样的叙事',
    prompt_instruction:
      '【风格定义】：城市民谣。基调：真诚、质朴、叙事性强。写法：像讲故事一样娓娓道来，关注生活中的微小细节。词藻不需要华丽，但要能打动人心。',
  },
  {
    value: 'electronic_pop',
    label: '电子流行 Synth Pop',
    description: '迷幻或动感，注重氛围感营造',
    prompt_instruction:
      '【风格定义】：电子流行/EDM。基调：梦幻、未来感或动感。结构：歌词不需要太复杂，重点在于重复的Hook（记忆点）和氛围感的营造。',
  },
];

export type SongStyle = (typeof SONG_STYLE_OPTIONS)[number]['value'];

/**
 * 曲式结构枚举配置
 * 指令重点：Tags 必须英文，解释必须中文
 */
export const SONG_STRUCTURE_OPTIONS: EnumOption[] = [
  {
    value: 'classic_three_verse',
    label: '经典三段式',
    // 改写后：点明基石地位、核心手段（三段主歌与间奏后转折）与最终效果。
    description:
      '华语抒情基石。以三段主歌扎实叙事，间奏后第三段主歌实现关键转折，情感层次丰富。',
    tooltip_example:
      '典范之作：S.H.E《热带雨林》、张惠妹《人质》、齐秦《悬崖》',
    prompt_instruction: `...`, // 保持不变
  },
  {
    value: 'classic_with_bridge',
    label: '经典升华式（含桥段）',
    // 改写后：明确其与“经典三段式”的衍生关系，并强调桥段的核心价值是“升华”与“增强张力”。
    description:
      '经典三段式的升华变体。在最终高潮前加入独立桥段，深化情感，极大增强戏剧张力。',
    tooltip_example: '李圣杰《痴心绝对》、孙燕姿《我怀念的》',
    prompt_instruction: `...`,
  },
  {
    value: 'power_engine_two_verse',
    label: '动力引擎式（两段主歌）',
    // 改写后：强调“预副歌”的引擎作用、结构特点（两段主歌）和商业效果（记忆点密集）。
    description:
      '流行热歌公式。预副歌作为动力引擎，推动两段主歌叙事，情绪爆发力强，记忆点密集。',
    tooltip_example: '张惠妹《如果你也听说》、陈奕迅《十年》、周杰伦《明明就》',
    prompt_instruction: `...`,
  },
  {
    value: 'power_engine_one_verse',
    label: '紧凑引擎式（一段主歌）',
    // 改写后：点明其作为“动力引擎式”变体的身份，并精简描述其“省略主歌、连续推动”的核心特点。
    description:
      '动力引擎式的紧凑变体。省略一段主歌，依靠预副歌连续推动，节奏更快，直奔高潮。',
    tooltip_example: '李圣杰《手放开》、周杰伦《黑色幽默》、毛不易《消愁》',
    prompt_instruction: `...`,
  },
  {
    value: 'power_engine_with_bridge',
    label: '复合张力式（预副歌+桥段）',
    // 改写后：清晰说明其是两种核心技巧（预副歌推进+桥段升华）的融合，并点明“结构复杂”与“戏剧性强”的结果。
    description:
      '融合动力引擎与桥段升华。预副歌持续推进，桥段实现转折，结构复杂，戏剧性极强。',
    tooltip_example: '孙燕姿《逆光》、梁静茹《勇气》、张杰《逆战》',
    prompt_instruction: `...`,
  },
  {
    value: 'hook_first_variant',
    label: '高光先行式',
    // 改写后：明确其源头是“经典三段式”，核心手法是“副歌前置”，直接目的就是“瞬间抓耳”。
    description:
      '经典三段式的抓耳变体。副歌高潮前置，瞬间吸引听众，后再展开主歌叙事，适合传播。',
    tooltip_example: '周杰伦《恒星不忘》',
    prompt_instruction: `...`,
  },
  {
    value: 'pop_with_rap_break',
    label: '流行说唱融合式',
    description:
      '经典三段式的高张力变体。在间奏位置插入完整说唱桥段，形成旋律与节奏的强烈对比，戏剧性极强。',
    tooltip_example:
      '参考思路：周杰伦《不爱我就拉倒》间奏后说唱段、王菲《梦中人》。',
    prompt_instruction: `
你是一位顶尖的作词人。请严格按照以下段落顺序创作，**核心是在流行旋律框架中，精准设计一段承上启下、极具爆发力的说唱桥段**。

[Intro]
(前奏：流行音乐氛围。)

[Verse 1]
(主歌1：4-6行。旋律性演唱，开启故事或情绪。)

[Chorus]
(副歌：4-6行。旋律高潮，记忆点。)

[Verse 2]
(主歌2：4-6行。旋律发展，深化情感。)

[Chorus]
(副歌：4-6行。重复强化。)

[Rap Bridge] <!-- 或 [Rap Interlude] -->
(**核心说唱段落**：8-12行。**此处替代了传统的纯音乐间奏或旋律桥段**。必须切换为说唱风格：使用鲜明的Flow和押韵技巧，承担“转折”功能。内容应为：对前情的总结、激烈的内心冲突、故事的新转折或情绪的彻底宣泄，为终场副歌蓄满动力。)

[Final Chorus]
(终段副歌：6-8行。在说唱段落的冲击后，旋律强势回归，情感得到最终升华与释放。)

[Outro]
(尾奏：流行音乐淡出。)
`,
  },

  {
    value: 'classic_rap_narrative',
    label: '经典说唱式',
    description:
      '以多段超长主歌为核心，深入叙事或表达观点，Hook段落重复强化主题。结构自由，重在展现Flow与押韵技巧。',
    tooltip_example:
      '典型作品：热狗《差不多先生》、Jony J《不用去猜》、Nas《NY State of Mind》',
    prompt_instruction: `
你是一位顶尖的说唱歌手/作词人。请严格按照以下段落顺序和功能创作，**核心是展现Verse部分的叙事密度、节奏Flow和精妙押韵**。

[Intro]
(引言：可使用标志性采样或氛围音乐，可加入1-2句开场白定调。)

[Hook]
(副歌：4-8行。旋律性较强，高度重复，提炼全曲核心态度或主题，制造记忆点。)

[Verse 1]
(**核心段落1**：12-16行。这是你展示的第一个完整段落。必须设计鲜明的Flow，使用多层押韵（双押、三押、连环押），并建立一个强烈的叙事或观点。)

[Hook]
(副歌：4-8行。重复，强化主题。)

[Verse 2]
(**核心段落2**：12-16行。Flow应有明显变化，或提升押韵难度。歌词内容需推进故事、展开另一面观点或增加细节深度。)

[Hook]
(副歌：4-8行。重复。)

[Break]
(间歇：此处可设计为器乐独奏或节奏抽空，为最终段落蓄力。也可写一句标志性的过渡句。)

[Verse 3]
(**升华/爆发段**：8-12行。情感或技术的顶峰。可以是速度加快的Fast Flow，情感最强烈的叙述，或最巧妙的Wordplay总结。)

[Outro]
(尾奏：音乐淡出，或留下一句有回味的结束语。)
`,
  },

  {
    value: 'melodic_pop_rap',
    label: '流行说唱式',
    description:
      'Hook的旋律部分大幅增强，结构更规整紧凑，在主歌说唱与流行副歌间取得平衡，兼顾流行度与说唱技巧。',
    tooltip_example:
      '典型作品：周杰伦《以父之名》、王以太《阿司匹林》、Post Malone《Congratulations》',
    prompt_instruction: `
你是一位擅长旋律说唱的作词人。请严格按照以下结构创作，**注重Hook的旋律流行性，同时保持Verse的说唱质感**。

[Intro]
(前奏：带有旋律性的氛围。)

[Hook]
(**强旋律副歌**：4-6行。旋律上口，易于跟唱，情感表达直接，是流行度的关键。)

[Verse 1]
(主歌1：8-12行。保持说唱的Flow和押韵，但节奏可更贴合旋律，叙事为主。)

[Hook]
(强旋律副歌：4-6行。重复。)

[Verse 2]
(主歌2：8-12行。延续或发展故事。)

[Hook]
(强旋律副歌：4-6行。重复。)

[Bridge]
(桥段：4-6行。**可设计为纯演唱的旋律段落**，或Flow舒缓的说唱段落，实现情感转折。)

[Hook]
(强旋律副歌：4-6行。重复并可能加入和声层。)

[Outro]
(尾奏：以副歌的旋律片段淡出。)
`,
  },
];

export type SongStructure = (typeof SONG_STRUCTURE_OPTIONS)[number]['value'];

/**
 * 创作模式枚举配置
 * 指令重点：规定是对素材的“翻译”还是“发散”
 */
export const CREATION_MODE_OPTIONS: EnumOption[] = [
  {
    value: 'new',
    label: '新写',
    description: '按原始素材意思，全新创作',
    prompt_instruction:
      '【创作模式】：全新创作。请理解用户提供的素材核心含义，然后完全用新的语言、新的歌词结构重新撰写。不要直接照搬原始素材的句子。',
  },
  {
    value: 'expand',
    label: '扩写',
    description: '保留原始素材原句，进行扩写',
    prompt_instruction:
      '【创作模式】：基于原句扩写。请尽量保留用户提供素材中的金句或核心句子，在此基础上进行延伸、补充和润色，使其成为一首完整的歌词。',
  },
];

export type CreationMode = (typeof CREATION_MODE_OPTIONS)[number]['value'];

/**
 * 叙事人设枚举配置
 * 指令重点：规定代词的使用 (我/你/他)
 */
export const PERSONA_OPTIONS: EnumOption[] = [
  {
    value: 'unlimited',
    label: '不限',
    description: '不限制叙事视角，AI 自由选择',
    prompt_instruction: '不限制叙事视角，AI 自由选择',
  },
  {
    value: 'first_person',
    label: '第一人称 (我)',
    description: '以"我"的视角叙述，强调代入感',
    prompt_instruction:
      '【叙事视角】：第一人称。请使用“我”作为主语，注重描写主观感受、内心独白，让听众产生强烈的代入感。',
  },
  {
    value: 'second_person',
    label: '第二人称 (你)',
    description: '以"你"的视角叙述，强调对话感',
    prompt_instruction:
      '【叙事视角】：第二人称。请使用“你”作为倾诉对象，仿佛在面对面对话，或者在读一封写给对方的信。',
  },
  {
    value: 'third_person',
    label: '第三人称',
    description: '上帝视角，讲述别人的故事',
    prompt_instruction:
      '【叙事视角】：第三人称。请使用上帝视角（他/她/他们）来讲述一个故事，保持客观冷静或像讲故事的人一样。',
  },
  {
    value: 'observer',
    label: '旁观叙事',
    description: '像电影镜头一样记录，不带入主观评判',
    prompt_instruction:
      '【叙事视角】：旁观者。像一台摄像机一样记录画面和发生的事，尽量减少主观的情绪评价，通过画面细节来映射情感。',
  },
  {
    value: 'duet',
    label: '男女对唱/对话',
    description: '模仿男女对话或合唱，歌词中标注男/女',
    prompt_instruction:
      '【叙事视角】：男女对唱/对话。这首歌是两个人的互动。请务必在每一段歌词前清楚地标注 [Male] (男声部分)、[Female] (女声部分) 或 [Together] (合唱部分)。歌词内容要体现两人之间的对话感。',
  },
];

export type Persona = (typeof PERSONA_OPTIONS)[number]['value'];

/**
 * 用词风格枚举配置 (V2.0 扩充版)
 * 指令重点：规定词汇的难易度、修辞浓度以及性别气质
 */
export const WORDING_STYLE_OPTIONS: EnumOption[] = [
  // --- 新增：性别/气质维度 ---
  {
    value: 'feminine_delicate',
    label: '细腻 / 柔情 (女性视角)',
    description: '注重微观感官描写，捕捉敏感脆弱的情绪',
    prompt_instruction:
      '【用词风格】：细腻柔美（女性视角）。请注重“微观感官”的描写（如：指尖的温度、呼吸的频率）。用词要敏感、柔软、具有易碎感，多挖掘内心深处的纠结与细腻独白。',
  },
  {
    value: 'masculine_rough',
    label: '沧桑 / 豪迈 (男性视角)',
    description: '硬朗、深沉，注重责任与行动，拒绝矫情',
    prompt_instruction:
      '【用词风格】：沧桑豪迈（男性视角）。请使用更具“颗粒感”和“重量感”的词汇（如：肩膀、风雨、胸膛、沉默）。语气要深沉、硬朗，多写责任与行动，拒绝过度矫情的小女生词汇。',
  },

  // --- 原有基础风格 ---
  {
    value: 'colloquial',
    label: '大白话 / 口语',
    description: '直白、不做作，贴近生活',
    prompt_instruction:
      '【用词风格】：极度口语化。请使用日常生活中最简单的词汇，像平时聊天一样自然。严禁堆砌辞藻，拒绝成语和生僻字。',
  },
  {
    value: 'literary',
    label: '文艺 / 诗意',
    description: '善用修辞和意象，优美含蓄',
    prompt_instruction:
      '【用词风格】：文艺诗意。请多使用比喻、拟人等修辞手法。用词要优美、含蓄，注重意境的营造，避免太直白的大白话。',
  },
  {
    value: 'restrained',
    label: '克制 / 隐忍',
    description: '哀而不伤，用冷静的词写深沉的情',
    prompt_instruction:
      '【用词风格】：克制内敛。情感表达要隐忍，不要大喊大叫。通过细节描写来侧面烘托深沉的情感，做到“哀而不伤”。',
  },
  {
    value: 'intense',
    label: '情绪浓烈 / 抓马',
    description: '爱恨分明，用词犀利，宣泄感强',
    prompt_instruction:
      '【用词风格】：情绪浓烈。用词要犀利、有爆发力。多使用强烈的形容词和感叹句，直抒胸臆，淋漓尽致地宣泄爱恨。',
  },
  {
    value: 'stream_of_consciousness',
    label: '意识流 / 王菲式',
    description: '跳跃、抽象、碎片化，不追求逻辑',
    prompt_instruction:
      '【用词风格】：意识流。歌词逻辑可以跳跃、破碎、抽象。注重营造迷离的氛围和独特的画面感，不强求叙事的连贯性。',
  },
];

export type WordingStyle = (typeof WORDING_STYLE_OPTIONS)[number]['value'];

/**
 * 押韵类型枚举配置
 * 指令重点：规定押韵的密度和方式
 */
export const RHYME_TYPE_OPTIONS: EnumOption[] = [
  {
    value: 'mix',
    label: '分段换韵 (标准)',
    description: '主歌和副歌使用不同韵脚，层次更丰富',
    prompt_instruction:
      '【押韵规则】：分段换韵。主歌部分使用一种韵脚，副歌部分请更换为另一种韵脚（最好是开口音，如a/o/e），以区分层次并推动情绪。',
  },
  {
    value: 'single',
    label: '单押',
    description: '句尾单字押韵，简单直接',
    prompt_instruction:
      '【押韵规则】：单押。每一句歌词的最后一个字必须押韵。保持韵脚的统一性。',
  },
  {
    value: 'double',
    label: '双押',
    description: '句尾双字押韵，律动感更强',
    prompt_instruction:
      '【押韵规则】：双押。尝试让每句歌词的最后两个字都押韵（例如：‘光明’押‘长行’）。这通常用于说唱或R&B风格，以增加律动感。',
  },
  {
    value: 'unified',
    label: '一韵到底',
    description: '全篇使用同一个韵脚，难度高',
    prompt_instruction:
      '【押韵规则】：一韵到底。整首歌曲，从头到尾严格使用同一个韵脚，中途不得换韵。',
  },
];

export type RhymeType = (typeof RHYME_TYPE_OPTIONS)[number]['value'];

/**
 * 输出方案数量枚举配置
 */
export const OUTPUT_COUNT_OPTIONS: EnumOption[] = [
  {
    value: 1,
    label: '1个',
    prompt_instruction: '请提供 1 个完整的创作方案。',
  },
  {
    value: 3,
    label: '3个',
    prompt_instruction: '请提供 3 个风格略有差异的完整创作方案，以便用户选择。',
  },
];

export type OutputCount = (typeof OUTPUT_COUNT_OPTIONS)[number]['value'];

/**
 * 贴近度枚举配置
 * 指令重点：规定模仿的深度 (神韵 vs 词汇)
 */
export const CLOSENESS_LEVEL_OPTIONS: EnumOption[] = [
  {
    value: 1,
    label: '只借神韵',
    description: '只学大师的那种感觉，但用你自己的话写',
    tooltip_example: '例：用李宗盛的沧桑感写程序员，但不出现“凡人”这种老词',
    prompt_instruction:
      '【模仿强度】：Level 1 (神韵)。请参考大师的【情感逻辑】和【观察角度】，但严禁使用大师的惯用词汇。请用完全现代、属于用户自己的语言体系来表达。',
  },
  {
    value: 2,
    label: '学他说话',
    description: '模仿大师的口头禅和叙事角度',
    tooltip_example: '例：像方文山那样用讲电影画面的方式说话',
    prompt_instruction:
      '【模仿强度】：Level 2 (语气)。请模仿大师的【叙事口吻】（例如：旁观者的冷静、或者过来人的感叹）。学习他说话的方式，但歌词内容结构保持常规。',
  },
  {
    value: 3,
    label: '学他招式 (推荐)',
    description: '学习大师的经典写法和套路',
    tooltip_example: '例：像周杰伦/方文山那样大量使用倒装句',
    prompt_instruction:
      '【模仿强度】：Level 3 (技法)。请重点模仿大师的【修辞技法】和【句式结构】（例如：倒装句、排比、长短句的呼吸感）。这是模仿的平衡点，既要有大师的影子，又要通顺。',
  },
  {
    value: 4,
    label: '用他词汇',
    description: '大量使用大师爱用的招牌词汇',
    tooltip_example: '例：歌词里必须出现“斑驳、红尘”等大师专属词汇',
    prompt_instruction:
      '【模仿强度】：Level 4 (遣词)。请大量使用该大师风格卡中记录的【高频词汇】和【标志性意象】。让歌词一眼看去就像是该大师的作品，词汇重合度要高。',
  },
  {
    value: 5,
    label: '仿佛本人',
    description: '以假乱真，仿佛是未发布的新歌',
    tooltip_example: '例：完全沉浸在那个年代，连生僻字都一模一样',
    prompt_instruction:
      '【模仿强度】：Level 5 (复刻)。请完全沉浸在大师的语境中，允许‘过拟合’。即便牺牲一定的现代通顺度，也要极致还原大师的用词癖好、生僻字和特定的年代感。',
  },
];

export type ClosenessLevel = (typeof CLOSENESS_LEVEL_OPTIONS)[number]['value'];

/**
 * 灵感预置配置 (场景需求版)
 * 设计理念：用户点菜，系统自动补全详细的 Prompt 描述
 */

export interface InspirationCategory {
  categoryName: string; // 分类名，如 "💘 爱情百态"
  items: {
    label: string; // 按钮显示的文字，如 "舔狗情歌"
    value: string; // 填入输入框的完整描述
  }[];
}

export const INSPIRATION_SCENARIOS: InspirationCategory[] = [
  {
    categoryName: '💘 爱情百态',
    items: [
      {
        label: '🐶 舔狗/备胎',
        value:
          '主题：卑微的单恋。描述一个人无怨无悔地付出，明明知道没有结果，却依然心甘情愿做配角。情感基调：酸楚、自我感动。',
      },
      {
        label: '💔 分手/失恋',
        value:
          '主题：痛彻心扉的分手。描述失恋后的戒断反应，看着熟悉的旧物，回忆涌上心头。情感基调：遗憾、不舍、泪崩。',
      },
      {
        label: '🍬 甜蜜/热恋',
        value:
          '主题：甜甜的恋爱。描述两个人在一起的各种小确幸，看星星、吹晚风，全世界都充满了粉色泡泡。情感基调：轻松、浪漫、治愈。',
      },
      {
        label: '🌫️ 暧昧/拉扯',
        value:
          '主题：成年人的暧昧。描述友达以上、恋人未满的推拉感，互相试探又不敢戳破。情感基调：迷离、纠结、心跳。',
      },
      {
        label: '💍 婚礼/告白',
        value:
          '主题：神圣的承诺。适合婚礼或求婚场景，回顾一路走来的不容易，许下相伴一生的誓言。情感基调：感动、坚定、幸福。',
      },
    ],
  },
  {
    categoryName: '🔥 梦想热血',
    items: [
      {
        label: '🏢 团队/荣耀',
        value:
          '主题：团队凝聚力。适合公司年会大合唱，描述大家为了同一个目标并肩作战，共创辉煌。情感基调：激情澎湃、振奋人心、正能量。',
      },
      {
        label: '🏃‍♂️ 奋斗/追梦',
        value:
          '主题：不屈的梦想。描述在逆境中跌倒又爬起，虽然没人理解，但依然要坚持跑向终点。情感基调：热血、励志、燃。',
      },
      {
        label: '🎓 毕业/离别',
        value:
          '主题：青春散场。描写毕业季的夏天，操场、校服、最后一次聚餐，约定未来顶峰相见。情感基调：怀念、不舍、希冀。',
      },
      {
        label: '🏋️ 极限/挑战',
        value:
          '主题：突破极限。适合健身房或跑步BGM，描写汗水滴落、心跳加速、战胜惰性。情感基调：快节奏、强劲、爆发。',
      },
    ],
  },
  {
    categoryName: '🏙️ 人生自我',
    items: [
      {
        label: '🌃 深夜EMO',
        value:
          '主题：深夜的孤独。描述忙碌一天后回到空房间，卸下面具，独自面对内心的脆弱与迷茫。情感基调：孤独、清冷、自我对话。',
      },
      {
        label: '🚬 浪子江湖',
        value:
          '主题：男人的江湖。描述四海为家、漂泊在外的沧桑，敬往事一杯酒，擦干泪继续走。情感基调：豪迈、粗犷、重情重义。',
      },
      {
        label: '🧘 躺平佛系',
        value:
          '主题：拒绝内卷。描述不想努力了，只想晒太阳、喝咖啡，过一种慢节奏的随性生活。情感基调：慵懒、放松、反讽。',
      },
      {
        label: '👩 女性成长',
        value:
          '主题：独立女性。描述不再依附于爱情，学会爱自己，活出自己的精彩与从容。情感基调：自信、洒脱、清醒。',
      },
    ],
  },
  {
    categoryName: '🐉 特色风格',
    items: [
      {
        label: '🎎 唯美古风',
        value:
          '主题：国风古韵。描述江南烟雨、断桥残雪或江湖恩怨，用词要雅致，意境要美。情感基调：凄美、古典、诗意。',
      },
      {
        label: '🚗 公路旅行',
        value:
          '主题：在路上。描述开车行驶在无人的公路上，车窗外的风景后退，追逐自由与地平线。情感基调：广阔、自由、风的感觉。',
      },
      {
        label: '🤣 玩梗/整活',
        value:
          '主题：幽默吐槽。用诙谐的语气吐槽生活中的奇葩事（如甲方、减肥、水逆），好玩有趣。情感基调：搞怪、快乐、解压。',
      },
    ],
  },
];
