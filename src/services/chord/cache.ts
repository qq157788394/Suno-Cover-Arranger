/**
 * Dexie.js 和弦分析缓存
 *
 * 基于 IndexedDB (Dexie.js v5/v6) 的缓存层。
 * 缓存策略：LRU 50 条上限 + TTL 30 天自动过期。
 * 缓存键：SHA-256 文件哈希（fileHash）。
 *
 * @module services/chord/cache
 */

import { db } from '@/services/db';
import type { CachedAnalysis, SongAnalysis } from '@/shared/types/types';

/** 最大缓存条目数 */
const MAX_CACHE_ENTRIES = 50;

/** TTL 天数 */
const CACHE_TTL_DAYS = 30;

/**
 * 查询缓存的分析结果
 *
 * @param fileHash - SHA-256 文件哈希
 * @returns 分析结果，若未命中或已过期则返回 null
 */
export async function getCachedAnalysis(
  fileHash: string,
): Promise<SongAnalysis | null> {
  try {
    const entry = await db.chordAnalysisCache.get(fileHash);

    if (!entry) return null;

    // TTL 检查
    const now = Date.now();
    const ttlMs = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;
    if (now - entry.createdAt > ttlMs) {
      // 过期 → 删除并返回 null
      await db.chordAnalysisCache.delete(fileHash);
      return null;
    }

    return entry.analysis;
  } catch (error) {
    console.warn('[Cache] 查询缓存失败:', error);
    return null;
  }
}

/**
 * 存入分析结果到缓存
 *
 * 写入后自动触发 LRU 淘汰（超过 50 条时删除最旧的条目）。
 *
 * @param analysis - 完整分析结果
 */
export async function cacheAnalysis(analysis: SongAnalysis): Promise<void> {
  try {
    const entry: CachedAnalysis = {
      fileHash: analysis.fileHash,
      vocabularyLevel: analysis.vocabularyLevel,
      version: 1,
      analysis,
      createdAt: Date.now(),
      fileSize: analysis.fileSize,
    };

    await db.chordAnalysisCache.put(entry);

    // 写入后触发 LRU 淘汰
    await evictLRU();
  } catch (error) {
    console.warn('[Cache] 缓存写入失败:', error);
    throw error;
  }
}

/**
 * LRU 淘汰：删除最旧的条目以保持在 MAX_CACHE_ENTRIES 以下
 */
async function evictLRU(): Promise<void> {
  try {
    const count = await db.chordAnalysisCache.count();

    if (count <= MAX_CACHE_ENTRIES) return;

    const excess = count - MAX_CACHE_ENTRIES;

    // 按 createdAt 升序排列（最旧的在前）
    const oldest = await db.chordAnalysisCache
      .orderBy('createdAt')
      .limit(excess)
      .toArray();

    const keysToDelete = oldest
      .map((e) => e.fileHash)
      .filter(Boolean);

    if (keysToDelete.length > 0) {
      await db.chordAnalysisCache.bulkDelete(keysToDelete);
      console.log(`[Cache] LRU 淘汰: 删除 ${keysToDelete.length} 条旧缓存`);
    }
  } catch (error) {
    console.warn('[Cache] LRU 淘汰失败:', error);
  }
}

/**
 * TTL 清理：删除所有超过 TTL 的过期条目
 *
 * 建议在应用启动时调用一次。
 */
export async function cleanExpired(): Promise<void> {
  try {
    const cutoff = Date.now() - CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

    const allEntries = await db.chordAnalysisCache.toArray();
    const expiredKeys = allEntries
      .filter((e) => e.createdAt < cutoff)
      .map((e) => e.fileHash);

    if (expiredKeys.length > 0) {
      await db.chordAnalysisCache.bulkDelete(expiredKeys);
      console.log(`[Cache] TTL 清理: 删除 ${expiredKeys.length} 条过期缓存`);
    }
  } catch (error) {
    console.warn('[Cache] TTL 清理失败:', error);
  }
}

/**
 * 获取缓存统计信息
 *
 * @returns 缓存条目数和存储占用估算
 */
export async function getCacheStats(): Promise<{
  count: number;
  estimatedSizeBytes: number;
}> {
  try {
    const count = await db.chordAnalysisCache.count();
    const entries = await db.chordAnalysisCache.toArray();
    const estimatedSizeBytes = entries.reduce(
      (sum, e) => sum + e.fileSize + 2000, // 分析结果 JSON 开销约 2KB
      0,
    );
    return { count, estimatedSizeBytes };
  } catch {
    return { count: 0, estimatedSizeBytes: 0 };
  }
}

/**
 * 清空所有缓存
 */
export async function clearAllCache(): Promise<void> {
  try {
    await db.chordAnalysisCache.clear();
    console.log('[Cache] 已清空全部缓存');
  } catch (error) {
    console.warn('[Cache] 清空缓存失败:', error);
  }
}
