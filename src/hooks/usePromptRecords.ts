import { useCallback, useState } from 'react';
import { db } from '@/services/db';
import type { PromptRecord } from '@/shared/types/types';

export interface PromptRecordFilters {
  keyword?: string;
  dateRange?: [string, string];
  songLanguages?: string | string[];
  targetSinger?: string;
  styleDescription?: string;
  songName?: string;
}

export const usePromptRecords = (currentUserId: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<PromptRecord[]>([]);

  // 获取所有记录
  const getAllRecords = useCallback(async () => {
    return await db.getUserPromptRecords(currentUserId);
  }, [currentUserId]);

  // 日期范围筛选
  const filterByDateRange = useCallback(
    (records: PromptRecord[], dateRange?: [string, string]) => {
      if (
        !dateRange ||
        !Array.isArray(dateRange) ||
        !dateRange[0] ||
        !dateRange[1]
      ) {
        return records;
      }
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      endDate.setHours(23, 59, 59, 999);
      return records.filter((record) => {
        const recordDate = new Date(record.created_at || new Date(0));
        return recordDate >= startDate && recordDate <= endDate;
      });
    },
    [],
  );

  // 歌曲语言筛选
  const filterBySongLanguages = useCallback(
    (records: PromptRecord[], songLanguages?: string | string[]) => {
      if (!songLanguages) {
        return records;
      }
      const languages = Array.isArray(songLanguages)
        ? songLanguages
        : [songLanguages];
      return records.filter((record) =>
        languages.includes(record.user_input.song_language),
      );
    },
    [],
  );

  // 目标歌手筛选
  const filterByTargetSinger = useCallback(
    (records: PromptRecord[], targetSinger?: string) => {
      if (!targetSinger || !targetSinger.trim()) {
        return records;
      }
      const lowerCaseTargetSinger = targetSinger.toLowerCase();
      return records.filter((record) =>
        record.user_input?.target_singer
          ?.toLowerCase()
          .includes(lowerCaseTargetSinger),
      );
    },
    [],
  );

  // 风格描述筛选
  const filterByStyleDescription = useCallback(
    (records: PromptRecord[], styleDescription?: string) => {
      if (!styleDescription || !styleDescription.trim()) {
        return records;
      }
      const lowerCaseStyleDescription = styleDescription.toLowerCase();
      return records.filter((record) =>
        record.user_input?.style_description
          ?.toLowerCase()
          .includes(lowerCaseStyleDescription),
      );
    },
    [],
  );

  // 歌曲名称筛选
  const filterBySongName = useCallback(
    (records: PromptRecord[], songName?: string) => {
      if (!songName || !songName.trim()) {
        return records;
      }
      const lowerCaseSongName = songName.toLowerCase();
      return records.filter((record) =>
        record.user_input?.song_name?.toLowerCase().includes(lowerCaseSongName),
      );
    },
    [],
  );

  // 关键词筛选
  const filterByKeyword = useCallback(
    (records: PromptRecord[], keyword?: string) => {
      if (!keyword || !keyword.trim()) {
        return records;
      }
      const lowerCaseKeyword = keyword.toLowerCase();
      return records.filter((record) => {
        // 在歌曲名称、目标歌手、风格描述中搜索关键词
        return (
          record.user_input?.song_name
            ?.toLowerCase()
            .includes(lowerCaseKeyword) ||
          record.user_input?.target_singer
            ?.toLowerCase()
            .includes(lowerCaseKeyword) ||
          record.user_input?.style_description
            ?.toLowerCase()
            .includes(lowerCaseKeyword) ||
          record.ai_result?.styles?.toLowerCase().includes(lowerCaseKeyword) ||
          record.ai_result?.lyrics?.toLowerCase().includes(lowerCaseKeyword)
        );
      });
    },
    [],
  );

  // 获取记录列表（整合筛选逻辑）
  const fetchRecords = useCallback(
    async (filters: PromptRecordFilters = {}) => {
      setLoading(true);
      try {
        let fetchedRecords = await getAllRecords();

        // 应用所有筛选条件
        fetchedRecords = filterByKeyword(fetchedRecords, filters.keyword);
        fetchedRecords = filterByDateRange(fetchedRecords, filters.dateRange);
        fetchedRecords = filterBySongLanguages(
          fetchedRecords,
          filters.songLanguages,
        );
        fetchedRecords = filterByTargetSinger(
          fetchedRecords,
          filters.targetSinger,
        );
        fetchedRecords = filterByStyleDescription(
          fetchedRecords,
          filters.styleDescription,
        );
        fetchedRecords = filterBySongName(fetchedRecords, filters.songName);

        setRecords(fetchedRecords);
        return fetchedRecords;
      } catch (error) {
        console.error('获取记录失败：', error);
        setRecords([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [
      getAllRecords,
      filterByKeyword,
      filterByDateRange,
      filterBySongLanguages,
      filterByTargetSinger,
      filterByStyleDescription,
      filterBySongName,
    ],
  );

  // 删除单条记录
  const deleteRecord = useCallback(
    async (recordId: number) => {
      try {
        await db.deletePromptRecord(recordId);
        // 刷新数据
        await fetchRecords();
        return { success: true };
      } catch (error) {
        console.error('删除记录失败：', error);
        return { success: false, error };
      }
    },
    [fetchRecords],
  );

  // 清空所有记录
  const clearAllRecords = useCallback(async () => {
    try {
      const userRecords = await db.getUserPromptRecords(currentUserId);
      await Promise.all(
        userRecords.map((record) => {
          if (record.id) {
            return db.deletePromptRecord(record.id);
          }
          return Promise.resolve();
        }),
      );
      setRecords([]);
      return { success: true };
    } catch (error) {
      console.error('清空记录失败：', error);
      return { success: false, error };
    }
  }, [currentUserId]);

  return {
    records,
    loading,
    fetchRecords,
    deleteRecord,
    clearAllRecords,
  };
};
