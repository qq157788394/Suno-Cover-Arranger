/**
 * 服务层数据模型和类型定义
 * 统一管理所有服务模块的数据类型
 */

// 导出所有类型定义

// 参考歌曲接口定义
export interface ReferenceSong {
  title: string; // 歌曲标题
  artist?: string; // 歌曲艺术家（可选）
}

// 生成请求接口定义
export interface GenerateRequest {
  api_key: string; // AI 模型 API 密钥
  model: string; // AI 模型名称（如 deepseek, gemini, mimo 等）
  song_name: string; // 歌曲名称
  song_language: string; // 歌曲语言（如 Mandarin, English 等）
  target_artist: string; // 目标翻唱艺术家
  reference_songs: ReferenceSong[]; // 参考歌曲列表
  style_note?: string; // 风格备注（可选）
  extra_note?: string; // 额外备注（可选，包含场景、受众、平台等信息）
  lyrics_raw: string; // 原始歌词（包含用户自定义的段落标记）
  remember_api_key?: boolean; // 是否记住 API 密钥（前端使用）
}

// 生成响应接口定义
export interface GenerateResponse {
  styles: string; // 生成的歌曲风格描述
  lyrics: string; // 生成的带属性的歌词段落
  timestamp?: string; // 生成时间戳（可选）
}

// 用户数据模型
export interface User {
  id?: number;
  name: string;
  email: string;
  created_at: Date;
}

// 项目数据模型
export interface Project {
  id?: number;
  title: string;
  description: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

// 风格配置数据模型
export interface StyleConfig {
  id?: number;
  name: string;
  config: Record<string, any>;
  user_id: number;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

// API Key 数据模型
export interface ApiKey {
  id?: number;
  user_id: number;
  api_key: string;
  model: string; // AI 模型名称（如 deepseek, gemini, mimo 等）
  is_current: boolean;
  created_at: Date;
}

// 提示词记录数据模型
export interface PromptRecord {
  id?: number;
  user_id: number;
  // 用户提交的内容
  user_input: {
    song_name: string; // 歌曲名称字段
    song_language: string;
    target_singer: string;
    reference_songs: string; // JSON序列化后的参考歌曲数组
    style_description: string;
    lyrics: string;
    scene?: string;
  };
  // AI 返回的结果
  ai_result: {
    styles: string;
    lyrics: string;
    model: string; // 使用的 AI 模型名称
  };
  // 生成时间
  created_at: Date;
  // 可选的标签或备注
  tags?: string[];
}

// 枚举选项接口定义
export interface EnumOption {
  value: string;
  label: string;
  description: string;
}

/**
 * 大师风格卡接口定义
 */
export interface MasterStyleCard {
  id: string;
  name: string;
  description: string;
  stylesRawData: string;
  groupId?: string; // 风格组ID（可选）
}

/**
 * 大师风格组接口定义
 */
export interface MasterGroup {
  id: string; // 分组ID
  name: string; // 分组名称
  description: string; // 分组描述
}

// 歌词表单数据模型
export interface LyricsFormData {
  song_name: string; // 歌曲名称
  song_language: string; // 歌曲语言
  song_style: string; // 歌曲风格
  song_structure: string; // 曲式结构
  creation_mode: string; // 创作模式
  raw_material: string; // 原始素材
  requirements?: string; // 创作要求（可选）
  persona: string; // 叙事人设
  wording_style?: string[]; // 用词风格（可选，最多2项）
  allow_english: boolean; // 是否允许英文词汇
  master_id?: string; // 参考风格（风格卡，可选）
  reference_lyrics?: string; // 参考歌词（可选）
  closeness: number; // 贴近度（1-5）
  rhyme_type: string; // 押韵类型
  rhyme_tone?: string; // 韵脚（可选）
  rhyme_strict: boolean; // 是否严格押韵
  output_count: number; // 输出数量
}

// 歌词生成请求
export interface LyricsGenerationRequest {
  system_prompt: string; // 系统提示词
  user_prompt: string; // 用户提示词
  model: string; // AI 模型名称
  closeness: number; // 贴近度（0-100）
}

// 歌词生成响应
export interface LyricsGenerationResponse {
  lyrics: string; // 生成的歌词
  model: string; // 使用的 AI 模型名称
  timestamp: string; // 生成时间戳
}

// 歌词生成响应（用于AI Provider）
export interface LyricsGenerateResponse {
  success: boolean; // 是否成功
  error?: string; // 错误信息（可选）
  lyrics: string; // 生成的歌词（原始内容）
  timestamp: string; // 生成时间戳
}

// ==================== 参考音频预处理类型 ====================

/** 预设强度等级 */
export type PresetLevel = 'none' | 'light' | 'medium' | 'heavy';

/** EQ 频段定义 */
export interface EqBand {
  freq: number; // 中心频率（Hz）
  gain: number; // 增益（线性乘数）
}

/** Phaser 相位器配置（对齐 ffmpeg 版 aphaser） */
export interface PhaserConfig {
  in_gain: number; // 输入增益
  out_gain: number; // 输出增益
  delay: number; // 延迟时间 (ms)
  decay: number; // 衰减系数
  speed: number; // 调制速度
  type: 'triangular' | 'sinusoidal'; // 调制波形类型
}

/** 频域峰值位置微扰配置（对抗星座图特征提取） */
export interface SpectralPeakShiftConfig {
  enabled: boolean; // 是否启用
  shift_range: number; // 最大频率偏移（bin数），建议1~3
  attenuation: number; // 原位置衰减系数（0~1），如0.3
}

/** 频谱包络随机化配置（对抗音频向量嵌入） */
export interface SpectralEnvelopeConfig {
  enabled: boolean; // 是否启用
  band_width: number; // 子带宽度（bin数），建议8~16
  mix_min: number; // 混合比例下限，如0.3
  mix_max: number; // 混合比例上限，如0.7
}

/** 立体声通道去相关配置 */
export interface StereoDecorrelationConfig {
  enabled: boolean; // 是否启用（仅立体声音频有效）
  delay_ms: number; // 通道间微延迟（ms），建议5~20
  phase_offset: number; // 相位偏移系数（0~1），建议0.1~0.5
}

/** Stage 2 预设配置 */
export interface PresetConfig {
  highpass_hz: number;
  lowpass_hz: number;
  eq_bands: EqBand[];
  threshold: number; // 线性幅度阈值
  ratio: number; // 压缩比
  noise_floor_db: number; // 噪声底电平（dB）
  phaser: PhaserConfig | null; // 相位偏移器（null=不启用）
  rubberband: boolean; // 是否启用 rubberband 谱涂抹（仅 heavy）
  rubberband_phase_jitter: number; // rubberband 相位扰动范围（rad），如0.6
  rubberband_mag_jitter: number; // rubberband 幅度微扰范围，如0.1
  spectral_peak_shift: SpectralPeakShiftConfig | null; // 频域峰值位置微扰（null=不启用）
  spectral_envelope: SpectralEnvelopeConfig | null; // 频谱包络随机化（null=不启用）
  stereo_decorrelation: StereoDecorrelationConfig | null; // 立体声通道去相关（null=不启用）
}

/** 处理进度回调 */
export interface PipelineProgress {
  stage: 'decode' | 'stage2' | 'stage3' | 'encode' | 'done';
  progress: number; // 0-100
  label: string;
}

/** Stage 3 变速模式 */
export type SpeedMode = 'none' | 'slowdown' | 'speedup';

/** 流水线输入 */
export interface PipelineInput {
  audioFile: File;
  preset: PresetLevel;
  speedMode: SpeedMode;
  onProgress?: (progress: PipelineProgress) => void;
}

/** 流水线输出 */
export interface PipelineOutput {
  mp3Blob: Blob;
  originalDuration: number; // 原始时长（秒）
  processedDuration: number; // 处理后时长（秒）
  preset: PresetLevel;
  processingTimeMs: number; // 处理总耗时（毫秒）
}

/** FFT Backend 接口 */
export interface FFTBackend {
  rfft(input: Float32Array): Float32Array;
  irfft(spectrum: Float32Array, outputLength: number): Float32Array;
  dispose(): void;
}

// ==================== 和弦分析 (ChordSync) 类型 ====================

/**
 * 和弦段落
 * 表示音频中一段连续时间的和弦
 */
export interface ChordSegment {
  /** 和弦名称，如 "Dm7" */
  chord: string;
  /** 功能级数，如 "IIm7" */
  degree: string;
  /** 段落起始时间（秒） */
  startTime: number;
  /** 段落结束时间（秒） */
  endTime: number;
  /** 匹配置信度 0-1 */
  confidence: number;
}

/**
 * 完整歌曲分析结果
 */
export interface SongAnalysis {
  /** SHA-256 文件哈希 */
  fileHash: string;
  /** 原始文件名 */
  fileName: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 音频时长（秒） */
  duration: number;
  /** 采样率 */
  sampleRate: number;
  /** 调式，如 "C Major" */
  key: string;
  /** 调式置信度 0-1 */
  keyConfidence: number;
  /** BPM */
  bpm: number;
  /** BPM 置信度 0-1 */
  bpmConfidence: number;
  /** 和弦段落列表 */
  chordSegments: ChordSegment[];
  /** 节拍位置 + 强/弱标记 */
  beatList?: { time: number; isDownbeat: boolean }[];
  /** 和弦词汇级别 */
  vocabularyLevel: 'extended';
  /** 分析完成时间戳 */
  analyzedAt: number;
  /** 分析耗时（毫秒） */
  analysisDurationMs: number;
}

/** Essentia.js 特征提取结果 */
export interface ExtractedFeatures {
  /** 原始 36-bin HPCP 帧 */
  hpcp: Float32Array[];
  /** 折叠后的 12-bin chroma 帧 */
  chroma: Float32Array[];
  /** 调式根音，如 "C" */
  key: string;
  /** 调式音阶，如 "major" */
  scale: string;
  /** 调式强度 0-1 */
  keyStrength: number;
  /** BPM */
  bpm: number;
  /** 节拍时间点列表（秒） */
  beats: number[];
}

// ==================== 歌词记录数据模型 ====================

// 歌词记录数据模型
export interface LyricsRecord {
  id?: number; // 记录ID
  created_at: Date; // 创建时间
  // 用户提交的表单数据
  form_data: LyricsFormData;
  // AI 返回的结果
  ai_result: {
    lyrics: string; // 生成的歌词
    model: string; // 使用的 AI 模型名称
    closeness: number; // 贴近度
  };
  // 可选的标签或备注
  tags?: string[];
}

// ==================== 状态机类型 ====================

/** 分析状态 */
export type AnalysisStatus =
  | 'IDLE'
  | 'FILE_LOADING'
  | 'WASM_LOADING'
  | 'DECODING'
  | 'ANALYZING'
  | 'READY'
  | 'ERROR';

/** 播放状态 */
export type PlaybackState = 'PLAYING' | 'PAUSED' | 'STOPPED';

/** Worker 进度步骤（供前端 useChordAnalysis 使用） */
export type AnalysisStep =
  | 'hpcp'
  | 'key_bpm'
  | 'chord_match'
  | 'viterbi'
  | 'romanize'
  | 'done';
