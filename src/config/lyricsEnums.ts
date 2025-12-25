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
    label: '华语 (Mandopop)', // 修改点：专业术语，涵盖两岸三地及新马
    description: '标准普通话，押韵遵循汉语拼音规则', // 描述保持“普通话”以明确语言技术标准
    prompt_instruction:
      '【语言要求】：必须使用标准的现代普通话创作。押韵请严格遵循汉语拼音韵辙（如十三辙）。',
  },
  {
    value: 'cantonese',
    label: '粤语 (Cantopop)',
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
    label: '闽南语 (Hokkien)', // 1. 修改 Label：用 Hokkien 与 Mandopop/Cantopop 对应，显得国际化且专业
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
    label: '抒情流行 (Ballad)',
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
    label: '说唱 (Rap/Hip-Hop)',
    description: '节奏紧凑，押韵密集，态度鲜明',
    prompt_instruction:
      '【风格定义】：嘻哈/说唱。基调：自信、有冲击力、态度鲜明。硬性要求：必须极度重视押韵（建议多尝试双押或三押），句子Flow要紧凑，要有梗（Punchline）。',
  },
  {
    value: 'chinese_style',
    label: '国风 (Chinese Style)',
    description: '融合传统元素，辞藻华丽，意境唯美',
    prompt_instruction:
      '【风格定义】：新国风/古风。基调：唯美、古典、怀旧。词汇：请大量使用古典意象（如明月、残酒、长剑、落花、红尘）。严禁出现现代科技词汇（如手机、网络）。',
  },
  {
    value: 'rock',
    label: '摇滚 (Rock)',
    description: '力量感强，直白宣泄，甚至是嘶吼',
    prompt_instruction:
      '【风格定义】：流行摇滚。基调：热血、叛逆、沧桑或撕裂。词汇：使用强有力的动词，表达渴望自由、挣扎或不妥协的态度。拒绝无病呻吟，要直抒胸臆。',
  },
  {
    value: 'folk',
    label: '民谣 (Folk)',
    description: '朴实自然，像散文诗一样的叙事',
    prompt_instruction:
      '【风格定义】：城市民谣。基调：真诚、质朴、叙事性强。写法：像讲故事一样娓娓道来，关注生活中的微小细节。词藻不需要华丽，但要能打动人心。',
  },
  {
    value: 'electronic_pop',
    label: '电子流行 (Synth Pop)',
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
    value: 'standard_pop',
    label: '经典流行 (ABAB)',
    description: '最稳妥结构：主歌铺垫-副歌高潮，含过门与桥段(Bridge)。',
    tooltip_example: '例：周杰伦《简单爱》、大多数华语情歌',
    prompt_instruction: `
请严格按照以下结构进行创作：
[Intro] (前奏：纯音乐，营造情绪氛围，无需歌词)
[Verse 1] (主歌1：故事开篇，平稳叙事，交代背景)
[Chorus] (副歌：全曲核心，情感爆发，最洗脑的记忆点)
[Verse 2] (主歌2：推进情节，细节描写)
[Chorus] (副歌：重复核心旋律，加强记忆)
[Bridge] (桥段：情绪转折或升华，打破重复感，准备最后冲刺)
[Chorus] (副歌：最后的高潮爆发)
[Outro] (尾奏：情绪渐落，余音绕梁)
`,
  },
  {
    value: 'verse_pre_chorus',
    label: '层递进阶 (Pre-Chorus)',
    description: "增加'导歌'段落，情绪层层递进，适合大线条抒情歌。",
    tooltip_example: '例：邓紫棋《泡沫》（主歌 -> 预副歌 -> 副歌）',
    prompt_instruction: `
请严格按照以下结构进行创作：
[Intro] (前奏：器乐引入)
[Verse 1] (主歌1：低吟浅唱，叙事铺垫)
[Pre-Chorus] (导歌：情绪爬坡，如同暴风雨前的宁静)
[Chorus] (副歌：彻底释放，情感宣泄)
[Verse 2] (主歌2：延续情绪，深入内心)
[Pre-Chorus] (导歌：再次蓄力，准备爆发)
[Chorus] (副歌：情感宣泄)
[Bridge] (高音/独白：全曲最高亢或最深刻的时刻)
[Chorus] (副歌：最后的辉煌)
[Outro] (尾奏：慢慢结束)
`,
  },
  {
    value: 'hook_first',
    label: '倒叙/开门见山',
    description: '开篇即副歌(Hook)，瞬间抓住听众耳朵，适合短视频。',
    tooltip_example: '例：凤凰传奇《最炫民族风》、抖音神曲',
    prompt_instruction: `
请严格按照以下结构进行创作（倒叙结构）：
[Chorus] (副歌前置：开篇即高潮！第一句就要抓住听众耳朵)
[Verse 1] (主歌：回溯故事原委，解释背景)
[Pre-Chorus] (导歌：情绪推进)
[Chorus] (副歌：强化核心记忆点)
[Verse 2] (主歌：故事发展)
[Chorus] (副歌：全场大合唱的感觉)
[Outro] (尾奏：短促有力或淡出)
`,
  },
  {
    value: 'double_verse_chorus',
    label: '叙事铺陈 (AAB)',
    description: '双段主歌连续叙事，再进副歌。适合信息量大的故事。',
    tooltip_example: '例：李宗盛《山丘》（大段念白式主歌）',
    prompt_instruction: `
请严格按照以下结构进行创作（长叙事）：
[Intro] (前奏：舒缓，像讲故事的开场)
[Verse 1] (主歌1：第一层叙事，娓娓道来)
[Verse 2] (主歌2：第二层叙事，深化细节，暂不进副歌)
[Chorus] (副歌：总结感悟，情感的总爆发)
[Verse 3] (主歌3：新的视角或反思)
[Chorus] (副歌：再次爆发)
[Outro] (尾奏：独白或留白)
`,
  },
  {
    value: 'narrative',
    label: '民谣/独白 (Narrative)',
    description: '弱化副歌，像讲故事一样娓娓道来，依靠旋律循环。',
    tooltip_example: '例：赵雷《成都》、朴树《白桦林》',
    prompt_instruction: `
请严格按照以下结构进行创作（民谣体）：
[Intro] (前奏：吉他或钢琴独奏)
[Verse 1] (第一段：画面描写)
[Verse 2] (第二段：叙事推进)
[Interlude] (间奏：器乐独奏，口琴或吉他，给予呼吸空间)
[Verse 3] (第三段：情感深化)
[Verse 4] (第四段：结局或远去)
[Outro] (尾奏：轻声结束)
(注意：此结构不强调爆发式副歌，注重歌词的流淌感)
`,
  },
  {
    value: 'free',
    label: '自由结构 (Free Form)',
    description: '不拘泥于固定格式，随情绪起伏而变化。',
    tooltip_example: '例：王菲《浮躁》、实验音乐',
    prompt_instruction: `
请严格按照以下结构进行创作（自由体）：
[Intro] (前奏)
[Verse] (主歌：自由表达)
[Chorus] (副歌：随情绪插入)
(自由发挥：根据歌词意境，自由插入 [Bridge] 桥段或 [Interlude] 间奏)
[Outro] (尾奏)
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
    prompt_instruction: '', // 留空代表不强制
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
    description: '模仿男女对话或合唱，歌词中标注(男)/(女)',
    prompt_instruction:
      '【叙事视角】：男女对唱/对话。这首歌是两个人的互动。请务必在每一段歌词前清楚地标注 [Male] (男声部分)、[Female] (女声部分) 或 [Together] (合唱部分)。歌词内容要体现两人之间的对话感。',
  },
];

export type Persona = (typeof PERSONA_OPTIONS)[number]['value'];

/**
 * 用词风格枚举配置
 * 指令重点：规定词汇的难易度和修辞浓度
 */
export const WORDING_STYLE_OPTIONS: EnumOption[] = [
  {
    value: 'colloquial',
    label: '大白话 (口语)',
    description: '直白、不做作，贴近生活',
    prompt_instruction:
      '【用词风格】：极度口语化。请使用日常生活中最简单的词汇，像平时聊天一样自然。严禁堆砌辞藻，拒绝成语和生僻字。',
  },
  {
    value: 'literary',
    label: '文艺 (诗意)',
    description: '善用修辞和意象，优美含蓄',
    prompt_instruction:
      '【用词风格】：文艺诗意。请多使用比喻、拟人等修辞手法。用词要优美、含蓄，注重意境的营造，避免太直白的大白话。',
  },
  {
    value: 'restrained',
    label: '克制 (隐忍)',
    description: '哀而不伤，用冷静的词写深沉的情',
    prompt_instruction:
      '【用词风格】：克制内敛。情感表达要隐忍，不要大喊大叫。通过细节描写来侧面烘托深沉的情感，做到“哀而不伤”。',
  },
  {
    value: 'intense',
    label: '情绪浓烈 (抓马)',
    description: '爱恨分明，用词犀利，宣泄感强',
    prompt_instruction:
      '【用词风格】：情绪浓烈。用词要犀利、有爆发力。多使用强烈的形容词和感叹句，直抒胸臆，淋漓尽致地宣泄爱恨。',
  },
  {
    value: 'stream_of_consciousness',
    label: '意识流 (王菲式)',
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
    description: '主歌和副歌使用不同韵脚，层次更丰富（推荐）',
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
    label: '就是本人',
    description: '以假乱真，仿佛是未发布的新歌',
    tooltip_example: '例：完全沉浸在那个年代，连生僻字都一模一样',
    prompt_instruction:
      '【模仿强度】：Level 5 (复刻)。请完全沉浸在大师的语境中，允许‘过拟合’。即便牺牲一定的现代通顺度，也要极致还原大师的用词癖好、生僻字和特定的年代感。',
  },
];

export type ClosenessLevel = (typeof CLOSENESS_LEVEL_OPTIONS)[number]['value'];
