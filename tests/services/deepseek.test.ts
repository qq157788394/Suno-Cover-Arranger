import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { generateUserPrompt } from '@/services/deepseek';
import type { GenerateRequest, ReferenceSong } from '@/services/types';

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
        singer: 'Singer 1',
      },
      {
        title: 'Song 2',
        singer: 'Singer 2',
      },
    ];

    const request: GenerateRequest = {
      songLanguage: 'Mandarin',
      targetSinger: 'Test Singer',
      referenceSongs,
      styleDescription: 'Test style description',
      lyrics: 'Test lyrics',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否包含所有关键信息
    expect(prompt).toContain('歌曲语言：Mandarin');
    expect(prompt).toContain('目标翻唱歌手：Test Singer');
    expect(prompt).toContain('参考歌曲：');
    expect(prompt).toContain('1. 歌曲名称：Song 1，歌手：Singer 1');
    expect(prompt).toContain('2. 歌曲名称：Song 2，歌手：Singer 2');
    expect(prompt).toContain('风格描述：Test style description');
    expect(prompt).toContain('原始歌词：Test lyrics');
    expect(prompt).toContain('请按照要求生成风格描述和歌词翻译');
  });

  it('should generate user prompt correctly without reference songs', () => {
    const request: GenerateRequest = {
      songLanguage: 'English',
      targetSinger: 'Test Singer',
      referenceSongs: [],
      styleDescription: 'Test style description',
      lyrics: 'Test lyrics',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否包含所有关键信息但不包含参考歌曲部分
    expect(prompt).toContain('歌曲语言：English');
    expect(prompt).toContain('目标翻唱歌手：Test Singer');
    expect(prompt).not.toContain('参考歌曲：');
    expect(prompt).toContain('风格描述：Test style description');
    expect(prompt).toContain('原始歌词：Test lyrics');
    expect(prompt).toContain('请按照要求生成风格描述和歌词翻译');
  });

  it('should handle empty style description correctly', () => {
    const request: GenerateRequest = {
      songLanguage: 'Mandarin',
      targetSinger: 'Test Singer',
      referenceSongs: [],
      styleDescription: '',
      lyrics: 'Test lyrics',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否处理了空风格描述
    expect(prompt).toContain('风格描述：');
    expect(prompt).toContain('原始歌词：Test lyrics');
  });

  it('should handle empty lyrics correctly', () => {
    const request: GenerateRequest = {
      songLanguage: 'Mandarin',
      targetSinger: 'Test Singer',
      referenceSongs: [],
      styleDescription: 'Test style description',
      lyrics: '',
    };

    const prompt = generateUserPrompt(request);

    // 检查提示词是否处理了空歌词
    expect(prompt).toContain('风格描述：Test style description');
    expect(prompt).toContain('原始歌词：');
  });
});
