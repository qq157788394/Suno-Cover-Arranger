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
  model: string; // AI 模型名称（如 deepseek, gemini 等）
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
  model: string; // AI 模型名称（如 deepseek, gemini 等）
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
