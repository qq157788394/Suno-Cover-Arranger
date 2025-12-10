/**
 * 数据库服务模块
 * 负责处理应用程序的本地数据库操作，使用 Dexie.js 作为数据库管理工具
 * 主要功能：
 * 1. 用户数据的增删改查
 * 2. 项目数据的管理
 * 3. 风格配置的存储和管理
 * 4. 提示词记录的保存和查询
 */

import Dexie from 'dexie';
import type { User, Project, StyleConfig, PromptRecord } from './types';

/**
 * 应用数据库类
 * 继承自 Dexie，用于管理应用程序的本地数据库
 */
class AppDatabase extends Dexie {
  users: Dexie.Table<User, number>;         // 用户表
  projects: Dexie.Table<Project, number>;   // 项目表
  styleConfigs: Dexie.Table<StyleConfig, number>; // 风格配置表
  promptRecords: Dexie.Table<PromptRecord, number>; // 提示词记录表

  /**
   * 数据库类构造函数
   * 初始化数据库连接和表结构
   */
  constructor() {
    super('SunoCoverArrangerDB');

    // 定义数据库版本和表结构
    this.version(1).stores({
      users: '++id, name, email, createdAt',
      projects: '++id, title, userId, createdAt, updatedAt',
      styleConfigs: '++id, name, userId, isDefault, createdAt, updatedAt',
      promptRecords: '++id, userId, createdAt'
    });

    // 初始化表
    this.users = this.table('users');
    this.projects = this.table('projects');
    this.styleConfigs = this.table('styleConfigs');
    this.promptRecords = this.table('promptRecords');
  }

  // 用户相关操作
  /**
   * 创建新用户
   * @param user - 用户信息（不包含id和createdAt）
   * @returns 包含id和createdAt的完整用户信息
   */
  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = {
      ...user,
      createdAt: new Date()
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
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const now = new Date();
    const newProject = {
      ...project,
      createdAt: now,
      updatedAt: now
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
    return this.projects.where('userId').equals(userId).toArray();
  }

  // 风格配置相关操作
  async createStyleConfig(config: Omit<StyleConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<StyleConfig> {
    const now = new Date();
    const newConfig = {
      ...config,
      createdAt: now,
      updatedAt: now
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

  async updateStyleConfig(id: number, updates: Partial<StyleConfig>): Promise<number> {
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
    return this.styleConfigs.where('userId').equals(userId).toArray();
  }

  async getDefaultStyleConfig(userId: number): Promise<StyleConfig | undefined> {
    return this.styleConfigs
      .where({ userId, isDefault: true })
      .first();
  }

  // 提示词生成记录相关操作
  async createPromptRecord(record: Omit<PromptRecord, 'id' | 'createdAt'>): Promise<PromptRecord> {
    const newRecord = {
      ...record,
      createdAt: new Date()
    };
    const id = await this.promptRecords.add(newRecord);
    return { ...newRecord, id };
  }

  async getPromptRecord(id: number): Promise<PromptRecord | undefined> {
    return this.promptRecords.get(id);
  }

  async updatePromptRecord(id: number, updates: Partial<PromptRecord>): Promise<number> {
    return this.promptRecords.update(id, updates);
  }

  async deletePromptRecord(id: number): Promise<void> {
    await this.promptRecords.delete(id);
  }

  async getUserPromptRecords(userId: number, limit?: number): Promise<PromptRecord[]> {
    const query = this.promptRecords
      .where('userId')
      .equals(userId)
      .sortBy('createdAt')
      .then(records => records.reverse()); // 先排序，再反转，实现倒序

    if (limit) {
      return (await query).slice(0, limit);
    }
    return query;
  }

  async searchPromptRecords(userId: number, keyword: string, limit?: number): Promise<PromptRecord[]> {
    const allRecords = await this.getUserPromptRecords(userId);
    
    const filteredRecords = allRecords.filter(record => {
      const searchText = JSON.stringify(record).toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });

    if (limit) {
      return filteredRecords.slice(0, limit);
    }
    return filteredRecords;
  }

  async getRecentPromptRecords(userId: number, days: number = 7): Promise<PromptRecord[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.promptRecords
      .where('userId')
      .equals(userId)
      .and(record => record.createdAt >= cutoffDate)
      .sortBy('createdAt')
      .then(records => records.reverse());
  }
}

// 导出单例实例
export const db = new AppDatabase();

// 导出类型
export type { User, Project, StyleConfig, PromptRecord };
