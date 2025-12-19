import { container, injectable } from 'tsyringe';
import { BaseAIService } from './baseAIService';
import { DeepSeekService } from './models/deepseekService';
import { GeminiService } from './models/geminiService';
import { MimoService } from './models/mimoService';

// 注册服务到tsyringe容器
export function registerServices(): void {
  // 注册具体服务
  container.register(DeepSeekService, { useClass: DeepSeekService });
  container.register(GeminiService, { useClass: GeminiService });
  container.register(MimoService, { useClass: MimoService });
}

// 导出容器
export { container, injectable };

export type AIServiceFactory = (serviceType: 'deepseek' | 'gemini' | 'mimo') => BaseAIService;
