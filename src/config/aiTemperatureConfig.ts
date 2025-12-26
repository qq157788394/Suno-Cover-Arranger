/**
 * AI Temperature配置文件
 * 定义不同业务场景下不同AI提供商的temperature参数
 * temperature参数控制AI生成内容的创造性，值越高越有创造性，值越低越保守
 */

/**
 * AI提供商类型枚举
 */
export enum AIProviderType {
  DEEPSEEK = "deepseek",
  GEMINI = "gemini",
  MIMO = "mimo",
}

/**
 * 业务类型枚举
 */
export enum BusinessType {
  /** 大师做编曲业务 */
  ARRANGEMENT = "arrangement",
  /** 大师写歌词业务 */
  LYRICS = "lyrics",
}

/**
 * AI Temperature配置接口
 */
export interface AITemperatureConfig {
  [businessType: string]: {
    [providerType: string]: number;
  };
}

/**
 * AI Temperature配置
 * 分别配置大师做编曲和大师写歌词两个业务的temperature参数
 */
export const aiTemperatureConfig: AITemperatureConfig = {
  // 大师做编曲业务
  [BusinessType.ARRANGEMENT]: {
    [AIProviderType.DEEPSEEK]: 1.5,
    [AIProviderType.GEMINI]: 1,
    [AIProviderType.MIMO]: 0.8,
  },
  // 大师写歌词业务
  [BusinessType.LYRICS]: {
    [AIProviderType.DEEPSEEK]: 1.5,
    [AIProviderType.GEMINI]: 1,
    [AIProviderType.MIMO]: 0.8,
  },
};

/**
 * 获取指定业务和AI提供商的temperature参数
 * @param businessType 业务类型
 * @param providerType AI提供商类型
 * @returns temperature参数值
 */
export const getTemperatureByConfig = (
  businessType: BusinessType,
  providerType: AIProviderType
): number => {
  return aiTemperatureConfig[businessType]?.[providerType] || 1;
};
