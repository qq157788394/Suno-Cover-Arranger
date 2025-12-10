import { useCallback, useMemo, useState } from 'react';
import { db } from '@/services/db';
import type { PromptRecord } from '@/shared/types';

export interface PromptRecordFilters {
  keyword?: string;
  dateRange?: [string, string];
  songLanguages?: string | string[];
  targetSinger?: string;
  styleDescription?: string;
}

export const usePromptRecords = (currentUserId: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<PromptRecord[]>([]);

  // 获取原始记录
  const getRawRecords = useCallback(
    async (keyword?: string) => {
      if (keyword) {
        return await db.searchPromptRecords(currentUserId, keyword);
      }
      return await db.getUserPromptRecords(currentUserId);
    },
    [currentUserId],
  );

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
        const recordDate = new Date(record.createdAt || new Date(0));
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
        languages.includes(record.userInput.songLanguage),
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
        record.userInput?.targetSinger
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
        record.userInput?.styleDescription
          ?.toLowerCase()
          .includes(lowerCaseStyleDescription),
      );
    },
    [],
  );

  // 获取记录列表（整合筛选逻辑）
  const fetchRecords = useCallback(
    async (filters: PromptRecordFilters = {}) => {
      setLoading(true);
      try {
        let fetchedRecords = await getRawRecords(filters.keyword);

        // 应用所有筛选条件
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
      getRawRecords,
      filterByDateRange,
      filterBySongLanguages,
      filterByTargetSinger,
      filterByStyleDescription,
    ],
  );

  // 删除单条记录
  const deleteRecord = useCallback(async (recordId: number) => {
    try {
      await db.deletePromptRecord(recordId);
      // 更新本地状态
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== recordId),
      );
      return { success: true };
    } catch (error) {
      console.error('删除记录失败：', error);
      return { success: false, error };
    }
  }, []);

  // 清空所有记录
  const clearAllRecords = useCallback(async () => {
    try {
      const userRecords = await db.getUserPromptRecords(currentUserId);
      await Promise.all(
        userRecords.map((record) => db.deletePromptRecord(record.id!)),
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
