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
  /** 歌曲名称 */
  songName?: string;
  /** 歌曲语言 */
  songLanguage: string;
  /** 目标歌手 */
  targetSinger: string;
  /** 参考歌曲列表（JSON 字符串） */
  referenceSongs: string;
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
 * AI 结果类型
 * 用于表示不同 AI 模型返回的结果信息
 */
export interface AIResult {
  /** 生成的 Styles 提示词 */
  styles: string;
  /** 生成的 Lyrics 提示词 */
  lyrics: string;
  /** 使用的 AI 模型名称 */
  model: string;
}

// 提示词记录类型已移至 types.ts 文件中，使用统一的 snake_case 命名规范
// 请从 '@/shared/types/types' 导入 PromptRecord 类型

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

// 生成请求和响应类型已移至 types.ts 文件中，使用统一的 snake_case 命名规范
// 请从 '@/shared/types/types' 导入 GenerateRequest 和 GenerateResponse 类型
