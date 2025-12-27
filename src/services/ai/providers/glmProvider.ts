import { injectable } from "tsyringe";
import { BaseAIProvider } from "./baseAIProvider";
import type { AIProviderRequest, AIProviderResponse } from "./baseAIProvider";
import OpenAI from "openai";
import { AIProviderType } from "../../../config/aiProviderConfig";
import { getTemperatureByConfig } from "../../../config/aiTemperatureConfig";

/**
 * GLM AI Provider
 * 负责调用智谱AI GLM-4.6V-Flash API，返回原始响应
 */
@injectable()
export class GLMProvider extends BaseAIProvider {
  /**
   * 调用GLM API生成内容
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
      max_tokens = 8192,
    } = request;

    const configTemperature = getTemperatureByConfig(
      businessType,
      AIProviderType.GLM
    );
    const finalTemperature =
      temperature !== undefined ? temperature : configTemperature;

    try {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://open.bigmodel.cn/api/paas/v4/",
        dangerouslyAllowBrowser: true,
      });

      const response = await client.chat.completions.create({
        model: "glm-4.6v-flash",
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
        temperature: finalTemperature,
        max_tokens,
      });

      const content = response.choices[0]?.message?.content;

      if (!content || !content.trim()) {
        return this.createErrorResponse("AI 生成内容为空");
      }

      return this.createSuccessResponse(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      console.error("GLM API调用失败:", error);
      return this.createErrorResponse(errorMessage);
    }
  }
}
