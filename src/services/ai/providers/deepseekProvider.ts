import { injectable } from "tsyringe";
import { BaseAIProvider } from "./baseAIProvider";
import type { AIProviderRequest, AIProviderResponse } from "./baseAIProvider";
import { AIProviderType } from "../../../config/aiProviderConfig";
import { getTemperatureByConfig } from "../../../config/aiTemperatureConfig";

/**
 * DeepSeek AI Provider
 * 负责调用DeepSeek API，返回原始响应
 */
@injectable()
export class DeepSeekProvider extends BaseAIProvider {
  /**
   * 调用DeepSeek API生成内容
   * @param request - AI Provider请求参数
   * @returns 包含原始AI响应的标准化响应
   */
  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    this.validateRequest(request);

    const {
      api_key: apiKey,
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      business_type: businessType,
      temperature,
      max_tokens = 8192,
    } = request;

    // 从配置文件获取temperature参数，如果request中提供了temperature则优先使用
    const configTemperature = getTemperatureByConfig(
      businessType,
      AIProviderType.DEEPSEEK
    );
    const finalTemperature =
      temperature !== undefined ? temperature : configTemperature;

    try {
      const response = await fetch(
        "https://api.deepseek.com/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
            stream: false,
            temperature: finalTemperature,
            max_tokens,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await this.handleAPIError(response);
        return this.createErrorResponse(errorMessage);
      }

      const data = await response.json();

      if (
        !data.choices ||
        !Array.isArray(data.choices) ||
        data.choices.length === 0
      ) {
        return this.createErrorResponse("API 响应数据格式不正确");
      }

      const content = data.choices[0].message.content;

      if (!content || !content.trim()) {
        return this.createErrorResponse("AI 生成内容为空");
      }

      return this.createSuccessResponse(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      console.error("DeepSeek API调用失败:", error);
      return this.createErrorResponse(errorMessage);
    }
  }
}
