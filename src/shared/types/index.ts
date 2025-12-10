/**
 * 共享类型定义模块
 * 包含项目中多个模块共享的 TypeScript 类型定义
 */

/**
 * 用户类型
 * 用于表示应用程序的用户信息
 */
export interface User {
  /** 用户ID（自动生成） */
  id?: number;
  /** 用户名 */
  name: string;
  /** 用户邮箱 */
  email: string;
  /** 创建时间（自动生成） */
  createdAt?: Date;
}

/**
 * 项目类型
 * 用于表示用户创建的项目信息
 */
export interface Project {
  /** 项目ID（自动生成） */
  id?: number;
  /** 项目标题 */
  title: string;
  /** 用户ID（关联到用户表） */
  userId: number;
  /** 创建时间（自动生成） */
  createdAt?: Date;
  /** 更新时间（自动生成） */
  updatedAt?: Date;
}

/**
 * 风格配置类型
 * 用于表示用户的风格配置信息
 */
export interface StyleConfig {
  /** 配置ID（自动生成） */
  id?: number;
  /** 配置名称 */
  name: string;
  /** 用户ID（关联到用户表） */
  userId: number;
  /** 是否为默认配置 */
  isDefault: boolean;
  /** 创建时间（自动生成） */
  createdAt?: Date;
  /** 更新时间（自动生成） */
  updatedAt?: Date;
}

/**
 * 用户输入类型
 * 用于表示用户生成提示词时的输入信息
 */
export interface UserInput {
  /** 歌曲语言 */
  songLanguage: string;
  /** 目标歌手 */
  targetSinger: string;
  /** 参考歌曲列表 */
  referenceSongs: string[];
  /** 风格描述 */
  styleDescription: string;
  /** 歌词 */
  lyrics: string;
  /** 场景描述（可选） */
  scene?: string;
}

/**
 * DeepSeek结果类型
 * 用于表示DeepSeek API返回的结果信息
 */
export interface DeepSeekResult {
  /** 生成的Styles提示词 */
  styles: string;
  /** 生成的Lyrics提示词 */
  lyrics: string;
}

/**
 * 提示词记录类型
 * 用于表示用户生成提示词的记录信息
 */
export interface PromptRecord {
  /** 记录ID（自动生成） */
  id?: number;
  /** 用户ID（关联到用户表） */
  userId: number;
  /** 用户输入信息 */
  userInput: UserInput;
  /** DeepSeek API返回的结果信息 */
  deepSeekResult: DeepSeekResult;
  /** 创建时间（自动生成） */
  createdAt?: Date;
}

/**
 * API Key 类型
 * 用于表示用户的 DeepSeek API Key 信息
 */
export interface ApiKey {
  /** API Key ID（自动生成） */
  id?: number;
  /** 用户ID（关联到用户表） */
  userId: number;
  /** DeepSeek API Key */
  apiKey: string;
  /** 是否为当前使用的 API Key */
  isCurrent: boolean;
  /** 创建时间（自动生成） */
  createdAt?: Date;
}

/**
 * 参考歌曲类型
 * 用于表示用户提供的参考歌曲信息
 */
export interface ReferenceSong {
  /** 歌曲标题 */
  title: string;
  /** 艺术家名称（可选） */
  artist?: string;
}

/**
 * 生成请求类型
 * 用于表示用户生成 Suno 提示词的请求参数
 */
export interface GenerateRequest {
  /** API 密钥 */
  apiKey: string;
  /** 歌曲语言 */
  song_language: string;
  /** 目标艺术家 */
  target_artist: string;
  /** 参考歌曲列表 */
  reference_songs: ReferenceSong[];
  /** 风格备注（可选） */
  style_note?: string;
  /** 额外备注（可选） */
  extra_note?: string;
  /** 原始歌词 */
  lyrics_raw: string;
}

/**
 * 生成响应类型
 * 用于表示 AI 生成的 Suno 提示词结果
 */
export interface GenerateResponse {
  /** 生成的 Styles 提示词 */
  styles: string;
  /** 生成的 Lyrics 提示词 */
  lyrics: string;
  /** 生成时间戳 */
  timestamp: string;
}
