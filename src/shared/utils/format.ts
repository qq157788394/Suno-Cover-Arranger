/**
 * 通用格式化工具函数
 * 提供各种数据格式化功能，包括日期、语言、参考歌曲等
 */
import type { ReferenceSong } from '../types';

/**
 * 语言映射：将内部语言代码转换为对外显示的完整语言名称
 * 用于在提示中确保语言描述的一致性和准确性
 */
const languageMap: Record<string, string> = {
  Mandarin: 'Mandarin Chinese',
  Cantonese: 'Cantonese',
  Minnan: 'Minnan',
  English: 'English',
  Korean: 'Korean',
  Japanese: 'Japanese',
  Other: 'Other',
};

/**
 * 获取完整的语言名称
 * @param languageCode - 内部语言代码
 * @returns 完整的语言名称
 */
export const getFullLanguageName = (languageCode: string): string => {
  return languageMap[languageCode] || languageCode;
};

/**
 * 生成参考歌曲块文本
 * 将参考歌曲列表格式化为易读的文本块
 * @param referenceSongs - 参考歌曲列表
 * @param targetArtist - 目标艺术家（当歌曲没有艺术家时使用）
 * @returns 格式化后的参考歌曲文本块
 */
export const formatReferenceSongs = (
  referenceSongs: ReferenceSong[],
  targetArtist: string,
): string => {
  if (referenceSongs.length === 0) {
    return 'None';
  }

  return referenceSongs
    .filter((song) => song.title)
    .map((song) => `${song.title} by ${song.artist || targetArtist}`)
    .join('\n');
};

/**
 * 格式化日期为可读字符串
 * @param date - 日期对象或日期字符串
 * @param format - 格式字符串（可选）
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: Date | string,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 格式化数字为千分位格式
 * @param number - 要格式化的数字
 * @returns 千分位格式的数字字符串
 */
export const formatNumber = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 截取文本并添加省略号
 * @param text - 要截取的文本
 * @param maxLength - 最大长度
 * @returns 截取后的文本（包含省略号）
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
};
