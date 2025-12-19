// Jest全局变量会自动注入，无需显式导入
import { generateUserPrompt } from '@/services/deepseek';
import type { GenerateRequest, ReferenceSong } from '@/shared/types/types';

// 模拟fetch API
global.fetch = jest.fn();

describe('deepseek service', () => {
  beforeEach(() => {
    // 清空所有mock调用
    jest.clearAllMocks();
  });

  it('should generate user prompt correctly with reference songs', () => {
    const referenceSongs: ReferenceSong[] = [
      {
        title: 'Song 1',
        artist: 'Singer 1',
      },
      {
        title: 'Song 2',
        artist: 'Singer 2',
      },
    ];

    const request: GenerateRequest = {
      api_key: 'test-api-key',
      model: 'deepseek',
      song_name: 'Test Song',
      song_language: 'Mandarin',
      target_artist: 'Test Singer',
      reference_songs: referenceSongs,
      style_note: 'Test style description',
      lyrics_raw: 'Test lyrics',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否包含所有关键信息
    expect(prompt).toContain('歌曲语言：Mandarin');
    expect(prompt).toContain('目标歌手：Test Singer');
    expect(prompt).toContain('参考歌曲：');
    expect(prompt).toContain('1. 歌曲名：Song 1，表演者：Singer 1');
    expect(prompt).toContain('2. 歌曲名：Song 2，表演者：Singer 2');
    expect(prompt).toContain('风格描述：Test style description');
    expect(prompt).toContain('歌词原文：Test lyrics');
    expect(prompt).toContain('请根据要求生成风格描述与歌词翻译');
  });

  it('should generate user prompt correctly without reference songs', () => {
    const request: GenerateRequest = {
      api_key: 'test-api-key',
      model: 'deepseek',
      song_name: 'Test Song',
      song_language: 'English',
      target_artist: 'Test Singer',
      reference_songs: [],
      style_note: 'Test style description',
      lyrics_raw: 'Test lyrics',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否包含所有关键信息但不包含参考歌曲部分
    expect(prompt).toContain('歌曲语言：English');
    expect(prompt).toContain('目标歌手：Test Singer');
    expect(prompt).not.toContain('参考歌曲：');
    expect(prompt).toContain('风格描述：Test style description');
    expect(prompt).toContain('歌词原文：Test lyrics');
    expect(prompt).toContain('请根据要求生成风格描述与歌词翻译');
  });

  it('should handle empty style description correctly', () => {
    const request: GenerateRequest = {
      api_key: 'test-api-key',
      model: 'deepseek',
      song_name: 'Test Song',
      song_language: 'Mandarin',
      target_artist: 'Test Singer',
      reference_songs: [],
      style_note: '',
      lyrics_raw: 'Test lyrics',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否处理了空风格描述
    expect(prompt).toContain('风格描述：');
    expect(prompt).toContain('歌词原文：Test lyrics');
  });

  it('should handle empty lyrics correctly', () => {
    const request: GenerateRequest = {
      api_key: 'test-api-key',
      model: 'deepseek',
      song_name: 'Test Song',
      song_language: 'Mandarin',
      target_artist: 'Test Singer',
      reference_songs: [],
      style_note: 'Test style description',
      lyrics_raw: '',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否处理了空歌词
    expect(prompt).toContain('风格描述：Test style description');
    expect(prompt).toContain('歌词原文：');
  });
});
