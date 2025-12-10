/**
 * 服务层数据模型和类型定义
 * 统一管理所有服务模块的数据类型
 */

// 导出所有类型定义

// 参考歌曲接口定义
export interface ReferenceSong {
  title: string;          // 歌曲标题
  artist?: string;        // 歌曲艺术家（可选）
}

// 生成请求接口定义
export interface GenerateRequest {
  apiKey: string;                // DeepSeek API 密钥
  song_language: string;         // 歌曲语言（如 Mandarin, English 等）
  target_artist: string;         // 目标翻唱艺术家
  reference_songs: ReferenceSong[]; // 参考歌曲列表
  style_note?: string;           // 风格备注（可选）
  extra_note?: string;           // 额外备注（可选，包含场景、受众、平台等信息）
  lyrics_raw: string;            // 原始歌词（包含用户自定义的段落标记）
  rememberApiKey?: boolean;      // 是否记住 API 密钥（前端使用）
}

// 生成响应接口定义
export interface GenerateResponse {
  styles: string;        // 生成的歌曲风格描述
  lyrics: string;        // 生成的带属性的歌词段落
}

// 用户数据模型
export interface User {
  id?: number;
  name: string;
  email: string;
  createdAt: Date;
}

// 项目数据模型
export interface Project {
  id?: number;
  title: string;
  description: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// 风格配置数据模型
export interface StyleConfig {
  id?: number;
  name: string;
  config: Record<string, any>;
  userId: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 提示词记录数据模型
export interface PromptRecord {
  id?: number;
  userId: number;
  // 用户提交的内容
  userInput: {
    songLanguage: string;
    targetSinger: string;
    referenceSongs: string[];
    styleDescription: string;
    lyrics: string;
    scene?: string;
  };
  // DeepSeek返回的结果
  deepSeekResult: {
    styles: string;
    lyrics: string;
  };
  // 生成时间
  createdAt: Date;
  // 可选的标签或备注
  tags?: string[];
}
