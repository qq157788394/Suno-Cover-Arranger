/**
 * 数据库服务模块
 * 负责处理应用程序的本地数据库操作，使用 Dexie.js 作为数据库管理工具
 * 主要功能：
 * 1. 用户数据的增删改查
 * 2. 项目数据的管理
 * 3. 风格配置的存储和管理
 * 4. 提示词记录的保存和查询
 */

import Dexie from "dexie";
import type { User, Project, StyleConfig } from "@/shared/types";
import type { ApiKey } from "@/shared/types/types";
import type { PromptRecord } from "@/shared/types/types";
import type { LyricsRecord } from "@/shared/types/types";

/**
 * 应用数据库类
 * 继承自 Dexie，用于管理应用程序的本地数据库
 */
class AppDatabase extends Dexie {
  users: Dexie.Table<User, number>; // 用户表
  projects: Dexie.Table<Project, number>; // 项目表
  styleConfigs: Dexie.Table<StyleConfig, number>; // 风格配置表
  promptRecords: Dexie.Table<
    PromptRecord & {
      ai_result?: { styles: string; lyrics: string; model: string };
    },
    number
  >; // 提示词记录表
  apiKeys: Dexie.Table<ApiKey, number>; // API Key 表
  lyricsRecords: Dexie.Table<LyricsRecord, number>; // 歌词记录表

  /**
   * 数据库类构造函数
   * 初始化数据库连接和表结构
   */
  constructor() {
    super("SunoCoverArrangerDB");

    // 定义数据库版本和表结构
    this.version(1).stores({
      users: "++id, name, email, created_at",
      projects: "++id, title, user_id, created_at, updated_at",
      styleConfigs: "++id, name, user_id, is_default, created_at, updated_at",
      promptRecords: "++id, user_id, created_at",
      apiKeys: "++id, user_id, api_key, model, is_current, created_at",
    });

    // 版本2：更新提示词记录表结构，移除可能导致问题的嵌套字段索引
    this.version(2).stores({
      promptRecords: "++id, userId, createdAt",
    });

    // 版本3：重新创建所有表，解决表结构不一致问题
    this.version(3)
      .stores({
        users: "++id, name, email, created_at",
        projects: "++id, title, user_id, created_at, updated_at",
        styleConfigs: "++id, name, user_id, is_default, created_at, updated_at",
        promptRecords: "++id, user_id, created_at",
        apiKeys: "++id, user_id, api_key, model, is_current, created_at",
      })
      .upgrade(async (tx) => {
        // 重新创建所有表，解决可能的表结构不一致问题
        // 这里我们不做任何数据转换，只是让Dexie重新创建表结构
        console.log("数据库升级到版本3，重新创建表结构");
      });

    // 版本4：统一所有字段名为snake_case命名规范
    this.version(4)
      .stores({
        users: "++id, name, email, created_at",
        projects: "++id, title, user_id, created_at, updated_at",
        styleConfigs: "++id, name, user_id, is_default, created_at, updated_at",
        promptRecords: "++id, user_id, created_at",
        apiKeys: "++id, user_id, api_key, model, is_current, created_at",
      })
      .upgrade(async (tx) => {
        // 由于历史数据中可能没有正确的参考歌曲数据，我们不需要做数据迁移
        // 只是重新创建表结构以匹配新的字段命名规范
        console.log("数据库升级到版本4，统一字段命名规范为snake_case");
      });

    // 版本5：添加歌词记录表
    this.version(5)
      .stores({
        users: "++id, name, email, created_at",
        projects: "++id, title, user_id, created_at, updated_at",
        styleConfigs: "++id, name, user_id, is_default, created_at, updated_at",
        promptRecords: "++id, user_id, created_at",
        apiKeys: "++id, user_id, api_key, model, is_current, created_at",
        lyricsRecords: "++id, created_at",
      })
      .upgrade(async (tx) => {
        console.log("数据库升级到版本5，添加歌词记录表");
      });

    // 初始化表
    this.users = this.table("users");
    this.projects = this.table("projects");
    this.styleConfigs = this.table("styleConfigs");
    this.promptRecords = this.table("promptRecords");
    this.apiKeys = this.table("apiKeys");
    this.lyricsRecords = this.table("lyricsRecords");
  }

  // 用户相关操作
  /**
   * 创建新用户
   * @param user - 用户信息（不包含id和createdAt）
   * @returns 包含id和createdAt的完整用户信息
   */
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser = {
      ...user,
      createdAt: new Date(),
    };
    const id = await this.users.add(newUser);
    return { ...newUser, id };
  }

  /**
   * 根据ID获取用户信息
   * @param id - 用户ID
   * @returns 用户信息或undefined（如果用户不存在）
   */
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  /**
   * 更新用户信息
   * @param id - 用户ID
   * @param updates - 要更新的用户信息部分
   * @returns 更新的记录数
   */
  async updateUser(id: number, updates: Partial<User>): Promise<number> {
    return this.users.update(id, updates);
  }

  /**
   * 根据ID删除用户
   * @param id - 用户ID
   */
  async deleteUser(id: number): Promise<void> {
    await this.users.delete(id);
  }

  /**
   * 获取所有用户信息
   * @returns 用户信息数组
   */
  async getAllUsers(): Promise<User[]> {
    return this.users.toArray();
  }

  // 项目相关操作
  async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    const now = new Date();
    const newProject = {
      ...project,
      createdAt: now,
      updatedAt: now,
    };
    const id = await this.projects.add(newProject);
    return { ...newProject, id };
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<number> {
    return this.projects.update(id, { ...updates, updatedAt: new Date() });
  }

  async deleteProject(id: number): Promise<void> {
    await this.projects.delete(id);
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    return this.projects.where("userId").equals(userId).toArray();
  }

  // 风格配置相关操作
  async createStyleConfig(
    config: Omit<StyleConfig, "id" | "createdAt" | "updatedAt">
  ): Promise<StyleConfig> {
    const now = new Date();
    const newConfig = {
      ...config,
      createdAt: now,
      updatedAt: now,
    };

    // 如果设置为默认，取消其他默认配置
    if (newConfig.isDefault) {
      await this.styleConfigs
        .where({ userId: newConfig.userId, isDefault: true })
        .modify({ isDefault: false, updatedAt: now });
    }

    const id = await this.styleConfigs.add(newConfig);
    return { ...newConfig, id };
  }

  async getStyleConfig(id: number): Promise<StyleConfig | undefined> {
    return this.styleConfigs.get(id);
  }

  async updateStyleConfig(
    id: number,
    updates: Partial<StyleConfig>
  ): Promise<number> {
    const now = new Date();

    // 如果设置为默认，取消其他默认配置
    if (updates.isDefault) {
      const config = await this.styleConfigs.get(id);
      if (config) {
        await this.styleConfigs
          .where({ userId: config.userId, isDefault: true })
          .modify({ isDefault: false, updatedAt: now });
      }
    }

    return this.styleConfigs.update(id, { ...updates, updatedAt: now });
  }

  async deleteStyleConfig(id: number): Promise<void> {
    await this.styleConfigs.delete(id);
  }

  async getUserStyleConfigs(userId: number): Promise<StyleConfig[]> {
    return this.styleConfigs.where("userId").equals(userId).toArray();
  }

  async getDefaultStyleConfig(
    userId: number
  ): Promise<StyleConfig | undefined> {
    return this.styleConfigs.where({ userId, isDefault: true }).first();
  }

  // 提示词生成记录相关操作
  async createPromptRecord(
    record: Omit<PromptRecord, "id" | "created_at">
  ): Promise<PromptRecord> {
    const newRecord = {
      ...record,
      created_at: new Date(),
    };
    const id = await this.promptRecords.add(newRecord);
    return { ...newRecord, id };
  }

  async getPromptRecord(id: number): Promise<PromptRecord | undefined> {
    return this.promptRecords.get(id);
  }

  async updatePromptRecord(
    id: number,
    updates: Partial<PromptRecord>
  ): Promise<number> {
    return this.promptRecords.update(id, updates);
  }

  async deletePromptRecord(id: number): Promise<void> {
    await this.promptRecords.delete(id);
  }

  async getUserPromptRecords(
    user_id: number,
    limit?: number
  ): Promise<PromptRecord[]> {
    const query = this.promptRecords
      .where("user_id")
      .equals(user_id)
      .sortBy("created_at")
      .then((records) => records.reverse()); // 先排序，再反转，实现倒序

    if (limit) {
      return (await query).slice(0, limit);
    }
    return query;
  }

  async searchPromptRecords(
    user_id: number,
    keyword: string,
    limit?: number
  ): Promise<PromptRecord[]> {
    const allRecords = await this.getUserPromptRecords(user_id);

    const filteredRecords = allRecords.filter((record) => {
      const searchText = JSON.stringify(record).toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });

    if (limit) {
      return filteredRecords.slice(0, limit);
    }
    return filteredRecords;
  }

  async getRecentPromptRecords(
    user_id: number,
    days: number = 7
  ): Promise<PromptRecord[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.promptRecords
      .where("user_id")
      .equals(user_id)
      .and((record) => (record.created_at || new Date(0)) >= cutoffDate)
      .sortBy("created_at")
      .then((records) => records.reverse());
  }

  // API Key 相关操作
  async createApiKey(
    apiKey: Omit<ApiKey, "id" | "created_at">
  ): Promise<ApiKey> {
    console.log("Creating new API Key:", apiKey);
    const newApiKey = {
      ...apiKey,
      created_at: new Date(),
    };

    // 如果设置为当前使用的 API Key，取消其他 API Key 的当前状态
    if (newApiKey.is_current) {
      console.log(
        "Setting new API Key as current, updating existing current keys..."
      );
      await this.apiKeys
        .where({ user_id: newApiKey.user_id, is_current: true })
        .modify({ is_current: false });
    }

    const id = await this.apiKeys.add(newApiKey);
    const createdApiKey = { ...newApiKey, id };
    console.log("Created API Key:", createdApiKey);
    return createdApiKey;
  }

  async getApiKey(id: number): Promise<ApiKey | undefined> {
    return this.apiKeys.get(id);
  }

  async updateApiKey(id: number, updates: Partial<ApiKey>): Promise<number> {
    // 如果设置为当前使用的 API Key，取消其他 API Key 的当前状态
    if (updates.is_current) {
      const apiKey = await this.apiKeys.get(id);
      if (apiKey) {
        await this.apiKeys
          .where({ user_id: apiKey.user_id, is_current: true })
          .modify({ is_current: false });
      }
    }

    return this.apiKeys.update(id, updates);
  }

  async deleteApiKey(id: number): Promise<void> {
    await this.apiKeys.delete(id);
  }

  async getUserApiKeys(user_id: number): Promise<ApiKey[]> {
    return this.apiKeys.where("user_id").equals(user_id).toArray();
  }

  async getCurrentApiKey(user_id: number): Promise<ApiKey | undefined> {
    // 优化查询：先获取所有该用户的API Key，然后找到is_current为true的那个
    // 避免使用复合查询 {user_id, is_current} 来消除性能警告
    const userApiKeys = await this.apiKeys
      .where("user_id")
      .equals(user_id)
      .toArray();

    const currentApiKey = userApiKeys.find((key) => key.is_current);
    return currentApiKey;
  }

  // 歌词记录相关操作
  async createLyricsRecord(
    record: Omit<LyricsRecord, "id">
  ): Promise<LyricsRecord> {
    const newRecord = {
      ...record,
      created_at: record.created_at || new Date(),
    };
    const id = await this.lyricsRecords.add(newRecord);
    return { ...newRecord, id };
  }

  async getLyricsRecord(id: number): Promise<LyricsRecord | undefined> {
    return this.lyricsRecords.get(id);
  }

  async updateLyricsRecord(
    id: number,
    updates: Partial<LyricsRecord>
  ): Promise<number> {
    return this.lyricsRecords.update(id, updates);
  }

  async deleteLyricsRecord(id: number): Promise<void> {
    await this.lyricsRecords.delete(id);
  }

  async getAllLyricsRecords(limit?: number): Promise<LyricsRecord[]> {
    const records = await this.lyricsRecords.toArray();
    const sortedRecords = records.sort(
      (a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0)
    );

    if (limit) {
      return sortedRecords.slice(0, limit);
    }
    return sortedRecords;
  }

  async searchLyricsRecords(
    keyword: string,
    limit?: number
  ): Promise<LyricsRecord[]> {
    const allRecords = await this.getAllLyricsRecords();

    const filteredRecords = allRecords.filter((record) => {
      const searchText = JSON.stringify(record).toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });

    if (limit) {
      return filteredRecords.slice(0, limit);
    }
    return filteredRecords;
  }

  async getRecentLyricsRecords(days: number = 7): Promise<LyricsRecord[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const records = await this.lyricsRecords.toArray();
    const filteredRecords = records.filter(
      (record) => (record.created_at || new Date(0)) >= cutoffDate
    );
    const sortedRecords = filteredRecords.sort(
      (a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0)
    );
    return sortedRecords;
  }
}

// 导出类
export default AppDatabase;

// 导出单例实例
export const db = new AppDatabase();

// 导出类型
export type { User, Project, StyleConfig, PromptRecord, ApiKey, LyricsRecord };
