import { injectable } from "tsyringe";
import { BaseAIProvider } from "./baseAIProvider";
import type { AIProviderRequest, AIProviderResponse } from "./baseAIProvider";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AIProviderType,
  getTemperatureByConfig,
} from "../../../config/aiTemperatureConfig";

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
    this.validateRequest(request);

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
      AIProviderType.GEMINI
    );
    const finalTemperature =
      temperature !== undefined ? temperature : configTemperature;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      // 使用Google GenAI SDK的正确方法调用
      const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
          temperature: finalTemperature,
        },
      });

      const result = await model.generateContent(
        systemPrompt + "\n\n" + userPrompt
      );
      const response = await result.response;
      const content = response.text();

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
