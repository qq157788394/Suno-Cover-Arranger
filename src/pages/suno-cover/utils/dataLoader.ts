/**
 * 数据加载和参考歌曲处理模块
 * 集中处理从URL参数加载记录数据和参考歌曲数据转换的逻辑
 */

import { message } from 'antd';
import { db } from '../../../services/db';

/**
 * 处理参考歌曲数据
 * 将数据库中的参考歌曲字符串或数组转换为标准格式
 */
export const processReferenceSongs = async (
  referenceSongsData: any,
): Promise<Array<{ title: string; artist: string }>> => {
  try {
    if (!referenceSongsData) {
      return [];
    }

    // 如果已经是数组格式，直接返回
    if (Array.isArray(referenceSongsData)) {
      return referenceSongsData
        .filter(
          (song: any) =>
            song &&
            typeof song === 'object' &&
            song.title &&
            typeof song.title === 'string',
        )
        .map((song: any) => ({
          title: song.title || '',
          artist: song.artist || '',
        }));
    }

    // 如果是字符串，尝试解析JSON
    if (typeof referenceSongsData === 'string') {
      try {
        const parsed = JSON.parse(referenceSongsData);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(
              (song: any) =>
                song &&
                typeof song === 'object' &&
                song.title &&
                typeof song.title === 'string',
            )
            .map((song: any) => ({
              title: song.title || '',
              artist: song.artist || '',
            }));
        }
      } catch (_parseError) {
        return [];
      }
    }

    return [];
  } catch (_error) {
    return [];
  }
};

/**
 * 从URL参数加载记录数据
 * @param recordId 记录ID
 * @returns 表单初始值
 */
export const loadRecordData = async (
  recordId: string | null,
): Promise<{
  formValues: any;
  hasRecord: boolean;
}> => {
  // 先定义空的表单数据结构（无论是否有recordId都需要）
  const formValues = {
    song_name: '',
    song_language: 'Mandarin',
    target_artist: '',
    style_note: '',
    lyrics_raw: '',
    extra_note: '',
    reference_songs: [] as Array<{ title: string; artist: string }>,
  };

  // 如果没有recordId，直接返回空表单
  if (!recordId) {
    return { formValues, hasRecord: false };
  }

  try {
    // 查询数据库记录
    const record = await db.getPromptRecord(parseInt(recordId, 10));

    if (!record) {
      message.error('记录不存在');
      return { formValues, hasRecord: false };
    }

    // 处理参考歌曲数据
    const processedReferenceSongs = await processReferenceSongs(
      record.user_input.reference_songs,
    );

    // 更新表单数据
    Object.assign(formValues, {
      song_name: record.user_input.song_name || '',
      song_language: record.user_input.song_language || 'Mandarin',
      target_artist: record.user_input.target_singer || '',
      style_note: record.user_input.style_description || '',
      lyrics_raw: record.user_input.lyrics || '',
      extra_note: record.user_input.scene || '',
      reference_songs:
        processedReferenceSongs.length > 0
          ? processedReferenceSongs
          : [{ title: '', artist: '' }],
    });

    return { formValues, hasRecord: true };
  } catch (_error) {
    message.error('数据加载失败');
    return { formValues, hasRecord: false };
  }
};
