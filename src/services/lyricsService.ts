/**
 * 歌词生成服务模块
 * 负责处理与AI API的通信，生成高质量的歌词
 * 核心业务逻辑：
 * 1. 使用lyricsPromptService组装的prompt调用AI API
 * 2. 处理AI响应，解析生成的歌词
 * 3. 返回标准化的歌词生成结果
 */

import type { LyricsFormData } from '@/shared/types/types';
import { assembleLyricsPrompt } from './lyricsPromptService';

/**
 * 歌词生成请求参数
 */
export interface LyricsGenerateRequest extends LyricsFormData {
  api_key: string;
}

/**
 * 歌词生成响应
 */
export interface LyricsGenerateResponse {
  success: boolean;
  lyrics: string[];
  error?: string;
  timestamp: string;
}

/**
 * 调用AI API生成歌词
 * 核心业务流程：
 * 1. 使用lyricsPromptService组装system prompt和user prompt
 * 2. 调用DeepSeek API进行歌词生成
 * 3. 解析AI输出，提取生成的歌词
 * 4. 处理错误，返回标准化结果
 * 
 * @param request - 歌词生成请求参数
 * @returns 包含生成的歌词的标准化响应
 */
export const generateLyrics = async (request: LyricsGenerateRequest): Promise<LyricsGenerateResponse> => {
  const { api_key, ...formData } = request;

  if (!api_key || !api_key.trim()) {
    return {
      success: false,
      lyrics: [],
      error: 'API Key不能为空',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const { systemPrompt, userPrompt } = assembleLyricsPrompt(formData);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        stream: false,
        temperature: 0.8,
        max_tokens: 8192
      })
    });

    if (!response.ok) {
      let errorMessage = `API请求失败: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMessage = `API请求失败: ${errorData.error.message}`;
          if (errorMessage.includes('invalid_api_key') || errorMessage.includes('API key not found')) {
            errorMessage = 'API Key 无效，请检查您的 API Key';
          } else if (errorMessage.includes('rate_limit_exceeded')) {
            errorMessage = 'API 请求频率过高，请稍后再试';
          } else if (errorMessage.includes('insufficient_quota')) {
            errorMessage = 'API 调用次数不足，请检查您的配额';
          }
        }
      } catch (parseError) {
      }
      return {
        success: false,
        lyrics: [],
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
    }

    const data = await response.json();

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      return {
        success: false,
        lyrics: [],
        error: 'API 响应数据格式不正确',
        timestamp: new Date().toISOString()
      };
    }

    const aiOutput = data.choices[0].message.content;

    if (!aiOutput || !aiOutput.trim()) {
      return {
        success: false,
        lyrics: [],
        error: 'AI 生成内容为空',
        timestamp: new Date().toISOString()
      };
    }

    const lyrics = parseLyricsOutput(aiOutput, formData.output_count);

    return {
      success: true,
      lyrics,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return {
      success: false,
      lyrics: [],
      error: errorMessage,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * 解析AI输出的歌词
 * 根据output_count参数解析生成的歌词数量
 * 
 * @param aiOutput - AI生成的原始输出
 * @param outputCount - 期望的歌词数量
 * @returns 解析后的歌词数组
 */
const parseLyricsOutput = (aiOutput: string, outputCount: number): string[] => {
  const lyrics: string[] = [];

  const sections = aiOutput.split(/=== 歌词 \d+ ===/g).filter(section => section.trim());

  if (sections.length > 0) {
    sections.forEach((section, index) => {
      if (index < outputCount) {
        const cleanedLyrics = section.trim()
          .replace(/^```.*?\n/, '')
          .replace(/```$/, '')
          .trim();
        if (cleanedLyrics) {
          lyrics.push(cleanedLyrics);
        }
      }
    });
  } else {
    const cleanedLyrics = aiOutput.trim()
      .replace(/^```.*?\n/, '')
      .replace(/```$/, '')
      .trim();
    if (cleanedLyrics) {
      lyrics.push(cleanedLyrics);
    }
  }

  return lyrics;
};

/**
 * 验证歌词生成请求参数
 * 
 * @param request - 歌词生成请求参数
 * @returns 验证结果
 */
export const validateLyricsRequest = (request: LyricsGenerateRequest): { valid: boolean; error?: string } => {
  if (!request.song_name || !request.song_name.trim()) {
    return { valid: false, error: '歌曲名称不能为空' };
  }

  if (!request.raw_material || !request.raw_material.trim()) {
    return { valid: false, error: '原始素材不能为空' };
  }

  if (!request.api_key || !request.api_key.trim()) {
    return { valid: false, error: 'API Key不能为空' };
  }

  if (request.output_count < 1 || request.output_count > 5) {
    return { valid: false, error: '生成数量必须在1-5之间' };
  }

  if (request.closeness < 0 || request.closeness > 100) {
    return { valid: false, error: '贴近度必须在0-100之间' };
  }

  return { valid: true };
};
