import { injectable } from 'tsyringe';
import { BaseAIService } from '../baseAIService';
import type { GenerateRequest, GenerateResponse } from '../../../shared/types/types';
import { SYSTEM_PROMPT } from '../../../config/prompts';

@injectable()
export class MimoService extends BaseAIService {
  /**
   * 调用小米MiMo-V2-Flash API生成内容
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const { api_key: apiKey } = request;

    // 参数验证
    if (!apiKey) {
      throw new Error('MiMo API key is required');
    }

    // 生成用户提示词
    const userPrompt = this.generateUserPrompt(request);

    // 从配置文件读取系统提示词，只有人类可以修改配置文件中的内容
    const systemPrompt = SYSTEM_PROMPT;

    try {
      // 确定API请求URL
      // 开发环境：使用代理地址避免CORS问题
      // 生产环境：直接使用真实的API域名
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/mimo-api/v1/chat/completions' 
        : 'https://api.xiaomimimo.com/v1/chat/completions';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mimo-v2-flash',
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
          temperature: 0.8,
          top_p: 0.95,
          max_tokens: 4096,
          stream: false,
          extra_body: {
            "thinking": {"type": "enabled"}
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('MiMo API error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errorData
        });
        throw new Error(`MiMo API request failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // 解析响应并返回结果
      return this.parseResponse(aiResponse);
    } catch (error) {
      console.error('Error calling MiMo API:', error);
      throw error;
    }
  }
}