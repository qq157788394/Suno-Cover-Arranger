import { injectable } from "tsyringe";
import { BaseAIProvider } from "./baseAIProvider";
import type { AIProviderRequest, AIProviderResponse } from "./baseAIProvider";
import { GoogleGenAI } from "@google/genai";
import { AIProviderType } from "../../../config/aiProviderConfig";
import { getTemperatureByConfig } from "../../../config/aiTemperatureConfig";

/**
 * Gemini AI Provider
 * 负责调用Gemini API，返回原始响应
 */
@injectable()
export class GeminiProvider extends BaseAIProvider {
  /**
   * 调用Gemini API生成内容
   * @param request - AI Provider请求参数
   * @returns 包含原始AI响应的标准化响应
   */
  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    try {
      this.validateRequest(request);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "参数验证失败";
      return this.createErrorResponse(errorMessage);
    }

    const {
      api_key: apiKey,
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      business_type: businessType,
      temperature,
    } = request;

    // 从配置文件获取temperature参数，如果request中提供了temperature则优先使用
    const configTemperature = getTemperatureByConfig(
      businessType,
      AIProviderType.GEMINI,
    );
    const finalTemperature =
      temperature !== undefined ? temperature : configTemperature;

    try {
      const client = new GoogleGenAI({ apiKey });

      // 使用Google GenAI SDK调用
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt + "\n\n" + userPrompt,
        config: {
          temperature: finalTemperature,
        },
      });

      const content = response.text;

      if (!content || !content.trim()) {
        return this.createErrorResponse("AI 生成内容为空");
      }

      return this.createSuccessResponse(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      console.error("Gemini API调用失败:", error);
      return this.createErrorResponse(errorMessage);
    }
  }
}
