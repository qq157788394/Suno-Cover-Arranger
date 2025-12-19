import { injectable } from 'tsyringe';
import { BaseAIService } from '../baseAIService';
import { GoogleGenAI } from '@google/genai';
import type { GenerateRequest, GenerateResponse } from '../../../shared/types/types';
import { SYSTEM_PROMPT } from '../../../config/prompts';

@injectable()
export class GeminiService extends BaseAIService {
  /**
   * 调用Gemini API生成内容
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const { api_key: apiKey } = request;

    // 参数验证
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }

    // 生成用户提示词
    const userPrompt = this.generateUserPrompt(request);

    // 从配置文件读取系统提示词，只有人类可以修改配置文件中的内容
    const systemPrompt = SYSTEM_PROMPT;

    try {
      // 使用@google/genai库调用Gemini API
      const genAI = new GoogleGenAI({ apiKey });

      const result = await genAI.models.generateContent({ 
        model: 'gemini-3-pro-preview',
        contents: [
          {
            parts: [
              {
                text: systemPrompt + '\n\n' + userPrompt
              }
            ]
          }
        ],
      });

      // 正确解析Gemini API响应
      let aiResponse = '';
      
      if (result.candidates && result.candidates.length > 0) {
        const firstCandidate = result.candidates[0];
        if (firstCandidate.content && firstCandidate.content.parts) {
          // 提取所有文本部分并合并
          aiResponse = firstCandidate.content.parts
            .filter(part => part.text)
            .map(part => part.text)
            .join('\n');
        }
      }

      // 解析响应并返回结果
      return this.parseResponse(aiResponse);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}
