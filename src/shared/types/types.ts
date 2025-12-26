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
