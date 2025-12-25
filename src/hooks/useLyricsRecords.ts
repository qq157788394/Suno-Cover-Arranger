import { useCallback, useState } from 'react';
import { db } from '@/services/db';
import type { LyricsRecord } from '@/shared/types/types';

export interface LyricsRecordFilters {
  keyword?: string;
  dateRange?: [string, string];
  songName?: string;
  songLanguage?: string;
  songStyle?: string;
  masterId?: string;
}

export const useLyricsRecords = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<LyricsRecord[]>([]);

  // 获取所有记录
  const getAllRecords = useCallback(async () => {
    return await db.getAllLyricsRecords();
  }, []);

  // 日期范围筛选
  const filterByDateRange = useCallback(
    (records: LyricsRecord[], dateRange?: [string, string]) => {
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

  // 歌曲名称筛选
  const filterBySongName = useCallback(
    (records: LyricsRecord[], songName?: string) => {
      if (!songName || !songName.trim()) {
        return records;
      }
      const lowerCaseSongName = songName.toLowerCase();
      return records.filter((record) =>
        record.form_data?.song_name?.toLowerCase().includes(lowerCaseSongName),
      );
    },
    [],
  );

  // 歌曲语言筛选
  const filterBySongLanguage = useCallback(
    (records: LyricsRecord[], songLanguage?: string) => {
      if (!songLanguage) {
        return records;
      }
      return records.filter(
        (record) => record.form_data?.song_language === songLanguage,
      );
    },
    [],
  );

  // 歌曲风格筛选
  const filterBySongStyle = useCallback(
    (records: LyricsRecord[], songStyle?: string) => {
      if (!songStyle) {
        return records;
      }
      return records.filter(
        (record) => record.form_data?.song_style === songStyle,
      );
    },
    [],
  );

  // 大师ID筛选
  const filterByMasterId = useCallback(
    (records: LyricsRecord[], masterId?: string) => {
      if (!masterId) {
        return records;
      }
      return records.filter(
        (record) => record.form_data?.master_id === masterId,
      );
    },
    [],
  );

  // 关键词筛选
  const filterByKeyword = useCallback(
    (records: LyricsRecord[], keyword?: string) => {
      if (!keyword || !keyword.trim()) {
        return records;
      }
      const lowerCaseKeyword = keyword.toLowerCase();
      return records.filter((record) => {
        const searchText = JSON.stringify(record).toLowerCase();
        return searchText.includes(lowerCaseKeyword);
      });
    },
    [],
  );

  // 获取记录列表（整合筛选逻辑）
  const fetchRecords = useCallback(
    async (filters: LyricsRecordFilters = {}) => {
      setLoading(true);
      try {
        let fetchedRecords = await getAllRecords();

        // 应用所有筛选条件
        fetchedRecords = filterByKeyword(fetchedRecords, filters.keyword);
        fetchedRecords = filterByDateRange(fetchedRecords, filters.dateRange);
        fetchedRecords = filterBySongName(fetchedRecords, filters.songName);
        fetchedRecords = filterBySongLanguage(
          fetchedRecords,
          filters.songLanguage,
        );
        fetchedRecords = filterBySongStyle(fetchedRecords, filters.songStyle);
        fetchedRecords = filterByMasterId(fetchedRecords, filters.masterId);

        setRecords(fetchedRecords);
        return fetchedRecords;
      } catch (error) {
        console.error('获取歌词记录失败：', error);
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
      filterBySongName,
      filterBySongLanguage,
      filterBySongStyle,
      filterByMasterId,
    ],
  );

  // 获取单条记录
  const getRecord = useCallback(async (id: number) => {
    try {
      return await db.getLyricsRecord(id);
    } catch (error) {
      console.error('获取歌词记录失败：', error);
      return undefined;
    }
  }, []);

  // 创建记录
  const createRecord = useCallback(
    async (record: Omit<LyricsRecord, 'id'>) => {
      try {
        const createdRecord = await db.createLyricsRecord(record);
        // 刷新数据
        await fetchRecords({});
        return { success: true, data: createdRecord };
      } catch (error) {
        console.error('创建歌词记录失败：', error);
        return { success: false, error };
      }
    },
    [fetchRecords],
  );

  // 更新记录
  const updateRecord = useCallback(
    async (id: number, updates: Partial<LyricsRecord>) => {
      try {
        await db.updateLyricsRecord(id, updates);
        // 刷新数据
        await fetchRecords();
        return { success: true };
      } catch (error) {
        console.error('更新歌词记录失败：', error);
        return { success: false, error };
      }
    },
    [fetchRecords],
  );

  // 删除单条记录
  const deleteRecord = useCallback(
    async (recordId: number) => {
      try {
        await db.deleteLyricsRecord(recordId);
        // 刷新数据
        await fetchRecords({});
        return { success: true };
      } catch (error) {
        console.error('删除歌词记录失败：', error);
        return { success: false, error };
      }
    },
    [fetchRecords],
  );

  // 清空所有记录
  const clearAllRecords = useCallback(async () => {
    try {
      const allRecords = await db.getAllLyricsRecords();
      await Promise.all(
        allRecords.map((record) => {
          if (record.id) {
            return db.deleteLyricsRecord(record.id);
          }
          return Promise.resolve();
        }),
      );
      setRecords([]);
      return { success: true };
    } catch (error) {
      console.error('清空歌词记录失败：', error);
      return { success: false, error };
    }
  }, []);

  // 获取最近N天的记录
  const getRecentRecords = useCallback(async (days: number = 7) => {
    try {
      return await db.getRecentLyricsRecords(days);
    } catch (error) {
      console.error('获取最近歌词记录失败：', error);
      return [];
    }
  }, []);

  // 搜索记录
  const searchRecords = useCallback(async (keyword: string, limit?: number) => {
    try {
      return await db.searchLyricsRecords(keyword, limit);
    } catch (error) {
      console.error('搜索歌词记录失败：', error);
      return [];
    }
  }, []);

  return {
    records,
    loading,
    fetchRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord,
    clearAllRecords,
    getRecentRecords,
    searchRecords,
  };
};
