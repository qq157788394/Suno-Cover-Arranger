import { container } from './container';
import type { BaseAIService } from './baseAIService';
import { DeepSeekService } from './models/deepseekService';
import { GeminiService } from './models/geminiService';
import { MimoService } from './models/mimoService';

/**
 * AI服务工厂类，用于创建不同类型的AI服务实例
 */
export class AIServiceFactory {
  /**
   * 根据服务类型创建AI服务实例
   * @param type 服务类型（deepseek | gemini | mimo）
   * @returns AI服务实例
   */
  static createService(type: 'deepseek' | 'gemini' | 'mimo'): BaseAIService {
    switch (type) {
      case 'deepseek':
        return container.resolve(DeepSeekService);
      case 'gemini':
        return container.resolve(GeminiService);
      case 'mimo':
        return container.resolve(MimoService);
      default:
        throw new Error(`Unsupported AI service type: ${type}`);
    }
  }
}
