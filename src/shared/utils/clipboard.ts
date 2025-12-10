/**
 * 剪贴板工具函数
 * 提供复制文本到剪贴板的功能，并支持成功/失败提示
 */
import { message } from 'antd';

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本内容
 * @param type - 文本类型，用于提示信息（如："Styles提示词"）
 * @returns Promise<void>
 */
export const copyToClipboard = async (
  text: string,
  type?: string,
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    message.success(`${type || '文本'}已成功复制到剪贴板`);
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    message.error('复制失败，请手动复制');
  }
};

/**
 * 复制文本到剪贴板（无提示版本）
 * @param text - 要复制的文本内容
 * @returns Promise<boolean> - 复制成功返回true，失败返回false
 */
export const copyToClipboardSilent = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    return false;
  }
};
