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
      // 直接使用MiMo API地址，不使用代理
      // 注意：在GitHub Pages上可能会遇到CORS问题
      const apiUrl = 'https://api.xiaomimimo.com/v1/chat/completions';
      
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
      
      // 检测是否为CORS错误
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(
          'MiMo API 请求失败：遇到跨域问题（CORS）。\n' +
          '解决方案：\n' +
          '1. 建议在本地开发环境中使用 MiMo 模型\n' +
          '2. 或使用其他模型如 DeepSeek 或 Gemini\n' +
          '3. 或部署自己的 CORS 代理服务\n' +
          '\n本地开发环境启动方式：\n' +
          '1. 克隆仓库到本地\n' +
          '2. 运行 pnpm install 安装依赖\n' +
          '3. 运行 pnpm dev 启动开发服务器\n' +
          '4. 在 http://localhost:8000 上使用应用'
        );
      }
      
      throw error;
    }
  }
}