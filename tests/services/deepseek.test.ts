// Jest全局变量会自动注入，无需显式导入

import { container } from '@/services/ai/container';
import { DeepSeekService } from '@/services/ai/models/deepseekService';
import type { GenerateRequest, ReferenceSong } from '@/shared/types/types';

// 模拟fetch API
global.fetch = jest.fn();

describe('DeepSeekService', () => {
  let deepSeekService: DeepSeekService;

  beforeEach(() => {
    deepSeekService = container.resolve(DeepSeekService);
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

    const prompt = (deepSeekService as any).generateUserPrompt(request);

    expect(prompt).toContain('Song language: Mandarin Chinese');
    expect(prompt).toContain('Target cover artist');
    expect(prompt).toContain('Test Singer');
    expect(prompt).toContain('Song 1');
    expect(prompt).toContain('Song 2');
    expect(prompt).toContain('Test style description');
    expect(prompt).toContain('Test lyrics');
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

    const prompt = (deepSeekService as any).generateUserPrompt(request);

    expect(prompt).toContain('Song language: English');
    expect(prompt).toContain('Target cover artist');
    expect(prompt).toContain('Test Singer');
    expect(prompt).toContain('None provided');
    expect(prompt).toContain('Test style description');
    expect(prompt).toContain('Test lyrics');
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

    const prompt = (deepSeekService as any).generateUserPrompt(request);

    expect(prompt).toContain('User style note');
    expect(prompt).toContain('""');
    expect(prompt).toContain('Test lyrics');
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

    const prompt = (deepSeekService as any).generateUserPrompt(request);

    expect(prompt).toContain('Test style description');
    expect(prompt).toContain('Here are the raw lyrics:');
  });

  it('should call DeepSeek API with correct parameters', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                '### Styles\n```text\nTest styles\n```\n\n### Lyrics\n```text\nTest lyrics\n```',
            },
          },
        ],
      }),
    } as Response);

    const request: GenerateRequest = {
      api_key: 'test-api-key',
      model: 'deepseek',
      song_name: 'Test Song',
      song_language: 'Mandarin',
      target_artist: 'Test Singer',
      reference_songs: [],
      style_note: 'Test style',
      lyrics_raw: 'Test lyrics',
    };

    const result = await deepSeekService.generate(request);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.deepseek.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        }),
        body: expect.stringContaining('deepseek-chat'),
      }),
    );

    expect(result).toEqual({
      styles: 'Test styles',
      lyrics: 'Test lyrics',
      timestamp: expect.any(String),
    });
  });

  it('should throw error when API key is missing', async () => {
    const request: GenerateRequest = {
      api_key: '',
      model: 'deepseek',
      song_name: 'Test Song',
      song_language: 'Mandarin',
      target_artist: 'Test Singer',
      reference_songs: [],
      style_note: 'Test style',
      lyrics_raw: 'Test lyrics',
    };

    await expect(deepSeekService.generate(request)).rejects.toThrow(
      'DeepSeek API key is required',
    );
  });

  it('should throw error when API request fails', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'API Error',
    } as Response);

    const request: GenerateRequest = {
      api_key: 'test-api-key',
      model: 'deepseek',
      song_name: 'Test Song',
      song_language: 'Mandarin',
      target_artist: 'Test Singer',
      reference_songs: [],
      style_note: 'Test style',
      lyrics_raw: 'Test lyrics',
    };

    await expect(deepSeekService.generate(request)).rejects.toThrow(
      'DeepSeek API request failed',
    );
  });
});
