import { container } from "tsyringe";
import { DeepSeekProvider } from "./deepseekProvider";
import { GeminiProvider } from "./geminiProvider";
import { GLMProvider } from "./glmProvider";
import { MimoProvider } from "./mimoProvider";
import type { BaseAIProvider } from "./baseAIProvider";
import { AIProviderModelType } from "@/config/aiProviderConfig";

/**
 * 注册所有AI Provider到tsyringe容器
 */
export function registerAIProviders(): void {
  container.register(DeepSeekProvider, { useClass: DeepSeekProvider });
  container.register(GeminiProvider, { useClass: GeminiProvider });
  container.register(GLMProvider, { useClass: GLMProvider });
  container.register(MimoProvider, { useClass: MimoProvider });
}

/**
 * AI Provider工厂类
 * 用于创建不同类型的AI Provider实例
 */
export class AIProviderFactory {
  /**
   * 根据模型类型创建AI Provider实例
   * @param model - 模型类型（从配置文件中定义）
   * @returns AI Provider实例
   */
  static createProvider(model: AIProviderModelType): BaseAIProvider {
    switch (model) {
      case "deepseek":
        return container.resolve(DeepSeekProvider);
      case "gemini":
        return container.resolve(GeminiProvider);
      case "glm":
        return container.resolve(GLMProvider);
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
