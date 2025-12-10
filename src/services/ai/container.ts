import { container } from 'tsyringe';
import { BaseAIService } from './baseAIService';
import { DeepSeekService } from './models/deepseekService';
import { GeminiService } from './models/geminiService';

// 注册服务到tsyringe容器
export function registerServices(): void {
  // 注册具体服务
  container.register(DeepSeekService, { useClass: DeepSeekService });
  container.register(GeminiService, { useClass: GeminiService });
}

// 导出容器
export { container };

export type AIServiceFactory = (serviceType: 'deepseek' | 'gemini') => BaseAIService;
