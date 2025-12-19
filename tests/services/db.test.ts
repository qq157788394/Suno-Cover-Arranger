// Jest全局变量会自动注入，无需显式导入
import Dexie from 'dexie';
import AppDatabase from '@/services/db';

// 模拟Dexie数据库
jest.mock('dexie', () => {
  const mockWhereClause = {
    equals: jest.fn().mockReturnThis(),
    modify: jest.fn().mockResolvedValue(1),
    toArray: jest.fn().mockResolvedValue([]),
    first: jest.fn().mockResolvedValue(null),
  };

  const mockTable = {
    add: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(null),
    where: jest.fn().mockReturnValue(mockWhereClause),
    toArray: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue(1),
    delete: jest.fn().mockResolvedValue(undefined),
    first: jest.fn().mockResolvedValue(null),
  };

  const mockDexie = jest.fn().mockImplementation(() => ({
    users: mockTable,
    projects: mockTable,
    styleConfigs: mockTable,
    promptRecords: mockTable,
    apiKeys: mockTable,
    version: jest.fn().mockReturnThis(),
    stores: jest.fn().mockReturnThis(),
    table: jest.fn().mockReturnValue(mockTable),
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
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        title: 'Test Project 2',
        description: 'This is test project 2',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // 模拟where和toArray方法
    const mockWhereClause = (db.projects.where as jest.Mock).mockReturnValue({
      equals: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue(mockProjects),
    });

    const projects = await db.getUserProjects(1);

    expect(db.projects.where).toHaveBeenCalledTimes(1);
    expect(db.projects.where).toHaveBeenCalledWith('userId');
    expect(mockWhereClause().equals).toHaveBeenCalledTimes(1);
    expect(mockWhereClause().equals).toHaveBeenCalledWith(1);
    expect(mockWhereClause().toArray).toHaveBeenCalledTimes(1);
    expect(projects).toEqual(mockProjects);
  });

  it('should create a new style config with default flag', async () => {
    const styleConfigData = {
      name: 'Test Style Config',
      config: { test: 'value' },
      userId: 1,
      isDefault: true,
    };

    // 模拟where和modify方法
    const mockWhereClause = (
      db.styleConfigs.where as jest.Mock
    ).mockReturnValue({
      equals: jest.fn().mockReturnThis(),
      modify: jest.fn().mockResolvedValue(1),
    });

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
    expect(mockWhereClause().modify).toHaveBeenCalledTimes(1);
  });

  it('should create a new prompt record', async () => {
    const promptRecordData = {
      user_id: 1,
      user_input: {
        song_name: 'Test Song',
        song_language: 'Mandarin',
        target_singer: 'Test Singer',
        reference_songs: JSON.stringify(['Song 1', 'Song 2']),
        style_description: 'Test style',
        lyrics: 'Test lyrics',
      },
      ai_result: {
        styles: 'Test styles',
        lyrics: 'Test lyrics',
        model: 'deepseek',
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
