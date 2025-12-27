import 'reflect-metadata';
import OpenAI from 'openai';
import { BusinessType } from '@/config/aiTemperatureConfig';
import { AIProviderFactory } from '@/services/ai/providers';
import type { AIProviderRequest } from '@/services/ai/providers/baseAIProvider';
import type { GLMProvider } from '@/services/ai/providers/glmProvider';

jest.mock('openai');

describe('GLMProvider', () => {
  let glmProvider: GLMProvider;
  let mockOpenAI: jest.MockedClass<typeof OpenAI>;
  let mockChatCompletions: {
    create: jest.Mock;
  };

  beforeEach(() => {
    mockChatCompletions = {
      create: jest.fn(),
    };

    mockOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;
    mockOpenAI.mockImplementation(
      () =>
        ({
          chat: {
            completions: mockChatCompletions,
          },
        }) as unknown as OpenAI,
    );

    glmProvider = AIProviderFactory.createProvider('glm') as GLMProvider;
    jest.clearAllMocks();
  });

  it('should call GLM API with correct parameters', async () => {
    mockChatCompletions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response content',
          },
        },
      ],
    } as unknown as OpenAI.Chat.Completions.ChatCompletion);

    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await glmProvider.generate(request);

    expect(mockOpenAI).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    });

    expect(mockChatCompletions.create).toHaveBeenCalledWith({
      model: 'glm-4.6v-flash',
      messages: [
        {
          role: 'system',
          content: 'Test system prompt',
        },
        {
          role: 'user',
          content: 'Test user prompt',
        },
      ],
      temperature: 1,
      max_tokens: 8192,
    });

    expect(result.success).toBe(true);
    expect(result.content).toBe('Test response content');
  });

  it('should throw error when API key is missing', async () => {
    const request: AIProviderRequest = {
      api_key: '',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await glmProvider.generate(request);

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

    const result = await glmProvider.generate(request);

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

    const result = await glmProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe('User Prompt不能为空');
  });

  it('should handle API request failure', async () => {
    mockChatCompletions.create.mockRejectedValueOnce(new Error('API Error'));

    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await glmProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe('API Error');
  });

  it('should handle empty response content', async () => {
    mockChatCompletions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: '',
          },
        },
      ],
    } as unknown as OpenAI.Chat.Completions.ChatCompletion);

    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
    };

    const result = await glmProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe('AI 生成内容为空');
  });

  it('should handle custom temperature', async () => {
    mockChatCompletions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response content',
          },
        },
      ],
    } as unknown as OpenAI.Chat.Completions.ChatCompletion);

    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
      temperature: 0.5,
    };

    const result = await glmProvider.generate(request);

    expect(mockChatCompletions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        temperature: 0.5,
      }),
    );

    expect(result.success).toBe(true);
  });

  it('should handle custom max_tokens', async () => {
    mockChatCompletions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response content',
          },
        },
      ],
    } as unknown as OpenAI.Chat.Completions.ChatCompletion);

    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.LYRICS,
      max_tokens: 4096,
    };

    const result = await glmProvider.generate(request);

    expect(mockChatCompletions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        max_tokens: 4096,
      }),
    );

    expect(result.success).toBe(true);
  });

  it('should use default temperature from config', async () => {
    mockChatCompletions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response content',
          },
        },
      ],
    } as unknown as OpenAI.Chat.Completions.ChatCompletion);

    const request: AIProviderRequest = {
      api_key: 'test-api-key',
      system_prompt: 'Test system prompt',
      user_prompt: 'Test user prompt',
      business_type: BusinessType.ARRANGEMENT,
    };

    const result = await glmProvider.generate(request);

    expect(mockChatCompletions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        temperature: 1,
      }),
    );

    expect(result.success).toBe(true);
  });
});
