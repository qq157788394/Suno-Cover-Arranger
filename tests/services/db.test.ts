import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Dexie from 'dexie';
import AppDatabase from '@/services/db';

// 模拟Dexie数据库
jest.mock('dexie', () => {
  const mockTable = {
    add: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(null),
    where: jest.fn().mockReturnThis(),
    equals: jest.fn().mockReturnThis(),
    modify: jest.fn().mockResolvedValue(1),
    toArray: jest.fn().mockResolvedValue([]),
  };

  const mockDexie = jest.fn().mockImplementation(() => ({
    users: mockTable,
    projects: mockTable,
    styleConfigs: mockTable,
    promptRecords: mockTable,
    version: jest.fn().mockReturnThis(),
    stores: jest.fn().mockReturnThis(),
  }));

  return mockDexie;
});

describe('AppDatabase', () => {
  let db: AppDatabase;

  beforeEach(() => {
    // 清空所有mock调用
    jest.clearAllMocks();

    // 创建数据库实例
    db = new AppDatabase();
  });

  it('should create a database instance with correct structure', () => {
    expect(Dexie).toHaveBeenCalledTimes(1);
    expect(db).toBeInstanceOf(AppDatabase);
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
    };

    const userId = await db.createUser(userData);

    expect(db.users.add).toHaveBeenCalledTimes(1);
    expect(db.users.add).toHaveBeenCalledWith(
      expect.objectContaining(userData),
    );
    expect(userId).toBe(1);
  });

  it('should get a user by id', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
    };

    // 模拟get方法返回用户数据
    (db.users.get as jest.Mock).mockResolvedValue(mockUser);

    const user = await db.getUser(1);

    expect(db.users.get).toHaveBeenCalledTimes(1);
    expect(db.users.get).toHaveBeenCalledWith(1);
    expect(user).toEqual(mockUser);
  });

  it('should create a new project', async () => {
    const projectData = {
      title: 'Test Project',
      description: 'This is a test project',
      userId: 1,
    };

    const projectId = await db.createProject(projectData);

    expect(db.projects.add).toHaveBeenCalledTimes(1);
    expect(db.projects.add).toHaveBeenCalledWith(
      expect.objectContaining(projectData),
    );
    expect(projectId).toBe(1);
  });

  it('should get projects by user id', async () => {
    const mockProjects = [
      {
        id: 1,
        title: 'Test Project 1',
        description: 'This is test project 1',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Test Project 2',
        description: 'This is test project 2',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 模拟where和toArray方法
    (db.projects.where as jest.Mock).mockReturnThis();
    (db.projects.equals as jest.Mock).mockReturnThis();
    (db.projects.toArray as jest.Mock).mockResolvedValue(mockProjects);

    const projects = await db.getProjectsByUserId(1);

    expect(db.projects.where).toHaveBeenCalledTimes(1);
    expect(db.projects.where).toHaveBeenCalledWith('userId');
    expect(db.projects.equals).toHaveBeenCalledTimes(1);
    expect(db.projects.equals).toHaveBeenCalledWith(1);
    expect(db.projects.toArray).toHaveBeenCalledTimes(1);
    expect(projects).toEqual(mockProjects);
  });

  it('should create a new style config with default flag', async () => {
    const styleConfigData = {
      name: 'Test Style Config',
      config: { test: 'value' },
      userId: 1,
      isDefault: true,
    };

    // 模拟modify方法
    (db.styleConfigs.where as jest.Mock).mockReturnThis();
    (db.styleConfigs.equals as jest.Mock).mockReturnThis();
    (db.styleConfigs.modify as jest.Mock).mockResolvedValue(1);

    const configId = await db.createStyleConfig(styleConfigData);

    expect(db.styleConfigs.add).toHaveBeenCalledTimes(1);
    expect(db.styleConfigs.add).toHaveBeenCalledWith(
      expect.objectContaining(styleConfigData),
    );
    expect(configId).toBe(1);

    // 检查是否取消了其他默认配置
    expect(db.styleConfigs.where).toHaveBeenCalledTimes(1);
    expect(db.styleConfigs.where).toHaveBeenCalledWith({
      userId: 1,
      isDefault: true,
    });
    expect(db.styleConfigs.modify).toHaveBeenCalledTimes(1);
  });

  it('should create a new prompt record', async () => {
    const promptRecordData = {
      userId: 1,
      userInput: {
        songLanguage: 'Mandarin',
        targetSinger: 'Test Singer',
        referenceSongs: ['Song 1', 'Song 2'],
        styleDescription: 'Test style',
        lyrics: 'Test lyrics',
      },
      deepSeekResult: {
        styles: 'Test styles',
        lyrics: 'Test lyrics',
      },
    };

    const recordId = await db.createPromptRecord(promptRecordData);

    expect(db.promptRecords.add).toHaveBeenCalledTimes(1);
    expect(db.promptRecords.add).toHaveBeenCalledWith(
      expect.objectContaining(promptRecordData),
    );
    expect(recordId).toBe(1);
  });
});
