import Dexie from 'dexie';

// 定义数据模型
interface User {
  id?: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface Project {
  id?: number;
  title: string;
  description: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface StyleConfig {
  id?: number;
  name: string;
  config: Record<string, any>;
  userId: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 创建数据库类
class AppDatabase extends Dexie {
  users: Dexie.Table<User, number>;
  projects: Dexie.Table<Project, number>;
  styleConfigs: Dexie.Table<StyleConfig, number>;

  constructor() {
    super('SunoCoverArrangerDB');

    // 定义数据库版本和表结构
    this.version(1).stores({
      users: '++id, name, email, createdAt',
      projects: '++id, title, userId, createdAt, updatedAt',
      styleConfigs: '++id, name, userId, isDefault, createdAt, updatedAt'
    });

    // 初始化表
    this.users = this.table('users');
    this.projects = this.table('projects');
    this.styleConfigs = this.table('styleConfigs');
  }

  // 用户相关操作
  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = {
      ...user,
      createdAt: new Date()
    };
    const id = await this.users.add(newUser);
    return { ...newUser, id };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<number> {
    return this.users.update(id, updates);
  }

  async deleteUser(id: number): Promise<void> {
    await this.users.delete(id);
  }

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
}

// 导出单例实例
export const db = new AppDatabase();

// 导出类型
export type { User, Project, StyleConfig };
