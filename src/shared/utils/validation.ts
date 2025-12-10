/**
 * 验证工具函数
 * 提供各种数据验证功能，包括API密钥验证、请求参数验证等
 */
import type { GenerateRequest } from '../types';

/**
 * 验证API密钥格式
 * @param apiKey - 要验证的API密钥
 * @returns boolean - 验证通过返回true，失败返回false
 */
export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || !apiKey.trim()) {
    return false;
  }
  // 简单的格式验证，实际项目中可能需要更严格的验证
  return apiKey.length > 10;
};

/**
 * 验证生成请求参数
 * @param values - 生成请求参数
 * @throws Error if validation fails
 */
export const validateGenerateRequest = (values: GenerateRequest): void => {
  if (!values) {
    throw new Error('生成请求参数不能为空');
  }

  if (!values.target_artist || !values.target_artist.trim()) {
    throw new Error('目标艺术家不能为空');
  }

  if (!values.lyrics_raw || !values.lyrics_raw.trim()) {
    throw new Error('歌词不能为空');
  }

  if (!values.song_language || !values.song_language.trim()) {
    throw new Error('歌曲语言不能为空');
  }

  if (!validateApiKey(values.apiKey)) {
    throw new Error('API Key 格式不正确或为空');
  }
};

/**
 * 验证电子邮件格式
 * @param email - 要验证的电子邮件地址
 * @returns boolean - 验证通过返回true，失败返回false
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证必填字段
 * @param value - 要验证的值
 * @param fieldName - 字段名称（用于错误信息）
 * @throws Error if validation fails
 */
export const validateRequired = (value: any, fieldName: string): void => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw new Error(`${fieldName}不能为空`);
  }
};
