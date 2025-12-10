// AI服务模块统一导出

export { BaseAIService } from './baseAIService';
export { AIServiceFactory } from './serviceFactory';
export { container, TYPES, injectable } from './container';
export { DeepSeekService } from './models/deepseekService';
export { GeminiService } from './models/geminiService';

// 导出服务类型
export type { AIServiceFactory as AIServiceFactoryType } from './container';
