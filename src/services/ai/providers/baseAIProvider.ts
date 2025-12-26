/**
 * AI Provider请求参数
 * 定义统一的AI请求接口，所有业务场景都使用此接口
 */
import { BusinessType } from '../../../config/aiTemperatureConfig';

export interface AIProviderRequest {
  api_key: string;
  system_prompt: string;
  user_prompt: string;
  business_type: BusinessType;
  temperature?: number;
  max_tokens?: number;
}

/**
 * AI Provider响应
 * 返回原始的AI响应文本，不做任何业务解析
 */
export interface AIProviderResponse {
  success: boolean;
  content: string;
  error?: string;
  timestamp: string;
}

/**
 * AI Provider抽象基类
 * 定义统一的AI调用接口，所有具体的AI Provider实现都必须继承此类
 *
 * 设计原则：
 * 1. Provider只负责调用AI接口，返回原始响应
 * 2. Prompt的拼接由业务层负责（核心资产，分开维护）
 * 3. 响应解析由业务层负责（不做任何业务相关的解析）
 */
export abstract class BaseAIProvider {
  /**
   * 调用AI接口生成内容
   * @param request - AI Provider请求参数
   * @returns 包含原始AI响应的标准化响应
   */
  abstract generate(request: AIProviderRequest): Promise<AIProviderResponse>;

  /**
   * 验证请求参数
   * @param request - AI Provider请求参数
   * @throws Error 当参数验证失败时抛出错误
   */
  protected validateRequest(request: AIProviderRequest): void {
    if (!request.api_key || !request.api_key.trim()) {
      throw new Error("API Key不能为空");
    }

    if (!request.system_prompt || !request.system_prompt.trim()) {
      throw new Error("System Prompt不能为空");
    }

    if (!request.user_prompt || !request.user_prompt.trim()) {
      throw new Error("User Prompt不能为空");
    }
  }

  /**
   * 处理API错误响应
   * @param response - Fetch响应对象
   * @returns 标准化的错误消息
   */
  protected async handleAPIError(response: Response): Promise<string> {
    let errorMessage = `API请求失败: ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData.error && errorData.error.message) {
        errorMessage = `API请求失败: ${errorData.error.message}`;

        if (
          errorMessage.includes("invalid_api_key") ||
          errorMessage.includes("API key not found")
        ) {
          errorMessage = "API Key 无效，请检查您的 API Key";
        } else if (errorMessage.includes("rate_limit_exceeded")) {
          errorMessage = "API 请求频率过高，请稍后再试";
        } else if (errorMessage.includes("insufficient_quota")) {
          errorMessage = "API 调用次数不足，请检查您的配额";
        }
      }
    } catch (parseError) {
      console.error("解析错误响应失败:", parseError);
    }

    return errorMessage;
  }

  /**
   * 创建成功响应
   * @param content - AI生成的内容
   * @returns 标准化的成功响应
   */
  protected createSuccessResponse(content: string): AIProviderResponse {
    return {
      success: true,
      content,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 创建失败响应
   * @param error - 错误消息
   * @returns 标准化的失败响应
   */
  protected createErrorResponse(error: string): AIProviderResponse {
    return {
      success: false,
      content: "",
      error,
      timestamp: new Date().toISOString(),
    };
  }
}
