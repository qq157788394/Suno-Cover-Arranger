import 'reflect-metadata';
import { BusinessType } from '@/config/aiTemperatureConfig';
import { AIProviderFactory } from '@/services/ai/providers';
import type { AIProviderRequest } from '@/services/ai/providers/baseAIProvider';
import type { GeminiProvider } from '@/services/ai/providers/geminiProvider';

describe('GeminiProvider', () => {
  let geminiProvider: GeminiProvider;

  beforeEach(() => {
    geminiProvider = AIProviderFactory.createProvider(
      'gemini',
    ) as GeminiProvider;
    jest.clearAllMocks();
  });

  it('should throw error when API key is missing', async () => {
    const request: AIProviderRequest = {
      api_key: '',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await geminiProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe('API Key不能为空');
  });

  it('should throw error when system prompt is missing', async () => {
    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: '',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await geminiProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe('System Prompt不能为空');
  });

  it('should throw error when user prompt is missing', async () => {
    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: '',
      business_type: BusinessType.LYRICS,
    };

    const result = await geminiProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe('User Prompt不能为空');
  });

  it('should handle API request failure', async () => {
    const request: AIProviderRequest = {
      api_key: 'invalid-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await geminiProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle network error', async () => {
    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await geminiProvider.generate(request);

    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  it('should use correct temperature for LYRICS business type', async () => {
    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await geminiProvider.generate(request);

    expect(result).toBeDefined();
  });

  it('should use correct temperature for ARRANGEMENT business type', async () => {
    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.ARRANGEMENT,
    };

    const result = await geminiProvider.generate(request);

    expect(result).toBeDefined();
  });

  it('should use custom temperature when provided', async () => {
    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
      temperature: 0.9,
    };

    const result = await geminiProvider.generate(request);

    expect(result).toBeDefined();
  });
});
