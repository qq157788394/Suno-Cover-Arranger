// Jest全局变量会自动注入，无需显式导入

import { AIProviderFactory } from "@/services/ai/providers";
import type { DeepSeekProvider } from "@/services/ai/providers/deepseekProvider";
import type { AIProviderRequest } from "@/services/ai/providers/baseAIProvider";
import { BusinessType } from "@/config/aiTemperatureConfig";

// 模拟fetch API
global.fetch = jest.fn();

describe("DeepSeekProvider", () => {
  let deepSeekProvider: DeepSeekProvider;

  beforeEach(() => {
    deepSeekProvider = AIProviderFactory.createProvider(
      "deepseek"
    ) as DeepSeekProvider;
    jest.clearAllMocks();
  });

  it("should call DeepSeek API with correct parameters", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Test response content",
            },
          },
        ],
      }),
    } as Response);

    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.deepseek.com/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer test-api-key",
        }),
        body: expect.stringContaining("deepseek-chat"),
      })
    );

    expect(result.success).toBe(true);
    expect(result.content).toBe("Test response content");
  });

  it("should throw error when API key is missing", async () => {
    const request: AIProviderRequest = {
      api_key: "",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("API Key不能为空");
  });

  it("should throw error when system prompt is missing", async () => {
    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("System Prompt不能为空");
  });

  it("should throw error when user prompt is missing", async () => {
    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("User Prompt不能为空");
  });

  it("should handle API request failure", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: "API Error",
        },
      }),
    } as Response);

    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toContain("API请求失败");
  });

  it("should handle invalid API key error", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: "invalid_api_key",
        },
      }),
    } as Response);

    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("API Key 无效，请检查您的 API Key");
  });

  it("should handle rate limit error", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: "rate_limit_exceeded",
        },
      }),
    } as Response);

    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("API 请求频率过高，请稍后再试");
  });

  it("should handle empty response content", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "",
            },
          },
        ],
      }),
    } as Response);

    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("AI 生成内容为空");
  });

  it("should handle malformed response", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [],
      }),
    } as Response);

    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("API 响应数据格式不正确");
  });

  it("should handle network error", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const request: AIProviderRequest = {
      api_key: "test-api-key",
      system_prompt: "Test system prompt",
      user_prompt: "Test user prompt",
      business_type: BusinessType.LYRICS,
    };

    const result = await deepSeekProvider.generate(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });
});
