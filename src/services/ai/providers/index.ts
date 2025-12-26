import { container } from "tsyringe";
import { DeepSeekProvider } from "./deepseekProvider";
import { GeminiProvider } from "./geminiProvider";
import { MimoProvider } from "./mimoProvider";
import type { BaseAIProvider } from "./baseAIProvider";

/**
 * 注册所有AI Provider到tsyringe容器
 */
export function registerAIProviders(): void {
  container.register(DeepSeekProvider, { useClass: DeepSeekProvider });
  container.register(GeminiProvider, { useClass: GeminiProvider });
  container.register(MimoProvider, { useClass: MimoProvider });
}

/**
 * AI Provider工厂类
 * 用于创建不同类型的AI Provider实例
 */
export class AIProviderFactory {
  /**
   * 根据模型类型创建AI Provider实例
   * @param model - 模型类型（deepseek | gemini | mimo）
   * @returns AI Provider实例
   */
  static createProvider(model: "deepseek" | "gemini" | "mimo"): BaseAIProvider {
    switch (model) {
      case "deepseek":
        return container.resolve(DeepSeekProvider);
      case "gemini":
        return container.resolve(GeminiProvider);
      case "mimo":
        return container.resolve(MimoProvider);
      default:
        throw new Error(`Unsupported AI model: ${model}`);
    }
  }
}

/**
 * 导出容器和注册函数
 */
export { container };
