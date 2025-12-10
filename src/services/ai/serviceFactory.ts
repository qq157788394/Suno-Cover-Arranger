import { container, TYPES } from './container';
import type { BaseAIService } from './baseAIService';

/**
 * AI服务工厂类，用于创建不同类型的AI服务实例
 */
export class AIServiceFactory {
  /**
   * 根据服务类型创建AI服务实例
   * @param type 服务类型（deepseek | gemini）
   * @returns AI服务实例
   */
  static createService(type: 'deepseek' | 'gemini'): BaseAIService {
    switch (type) {
      case 'deepseek':
        return container.get<BaseAIService>(TYPES.DeepSeekService);
      case 'gemini':
        return container.get<BaseAIService>(TYPES.GeminiService);
      default:
        throw new Error(`Unsupported AI service type: ${type}`);
    }
  }
}
