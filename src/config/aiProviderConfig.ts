/**
 * AI Provider配置文件
 * 统一管理所有AI Provider的类型定义和常量
 */

/**
 * AI Provider类型枚举
 * 定义所有支持的AI提供商类型
 */
export enum AIProviderType {
  /** DeepSeek */
  DEEPSEEK = 'deepseek',
  /** Google Gemini */
  GEMINI = 'gemini',
  /** 智谱AI GLM */
  GLM = 'glm',
  /** 小米MiMo */
  MIMO = 'mimo',
}

/**
 * AI Provider类型联合类型
 * 用于TypeScript类型检查
 */
export type AIProviderModelType =
  | AIProviderType.DEEPSEEK
  | AIProviderType.GEMINI
  | AIProviderType.GLM
  | AIProviderType.MIMO;

/**
 * AI Provider显示名称映射
 * 用于UI展示
 */
export const AI_PROVIDER_DISPLAY_NAMES: Record<AIProviderModelType, string> = {
  [AIProviderType.DEEPSEEK]: 'DeepSeek',
  [AIProviderType.GEMINI]: 'Google Gemini',
  [AIProviderType.GLM]: '智谱AI GLM',
  [AIProviderType.MIMO]: '小米MiMo',
};

/**
 * 支持的AI Provider类型数组
 * 用于遍历和验证
 */
export const SUPPORTED_AI_PROVIDERS: AIProviderModelType[] = [
  AIProviderType.DEEPSEEK,
  AIProviderType.GEMINI,
  AIProviderType.GLM,
  AIProviderType.MIMO,
];

/**
 * 检查是否为支持的AI Provider类型
 * @param model 待检查的模型类型
 * @returns 如果是支持的类型返回true，否则返回false
 */
export const isValidAIProvider = (
  model: string,
): model is AIProviderModelType => {
  return SUPPORTED_AI_PROVIDERS.includes(model as AIProviderModelType);
};
