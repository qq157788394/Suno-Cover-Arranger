import { injectable } from 'tsyringe';
import { BaseAIService } from '../baseAIService';
import type { GenerateRequest, GenerateResponse, DeepSeekResult } from '../../shared/types';
import { SYSTEM_PROMPT } from '../../../config/prompts';

@injectable()
export class DeepSeekService extends BaseAIService {
  /**
   * 调用DeepSeek API生成内容
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const { apiKey } = request;

    // 参数验证
    if (!apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    // 生成用户提示词
    const userPrompt = this.generateUserPrompt(request);

    // 从配置文件读取系统提示词，只有人类可以修改配置文件中的内容
    const systemPrompt = SYSTEM_PROMPT;

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('DeepSeek API error:', response.status, errorData);
        throw new Error(`DeepSeek API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // 解析响应并返回结果
      return this.parseResponse(aiResponse);
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      throw error;
    }
  }
}
