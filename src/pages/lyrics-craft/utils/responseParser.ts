import type { LyricsGenerateResponse } from "@/shared/types/types";

/**
 * 大师写歌词 - 响应解析工具类
 * 直接返回AI的原始响应内容，不做任何处理
 */
export class LyricsCraftResponseParser {
  /**
   * 解析AI响应
   * 直接返回AI的原始内容，不做任何处理
   * @param rawResponse - AI返回的原始响应
   * @returns 包含歌词的生成响应
   */
  static parseResponse(rawResponse: string): LyricsGenerateResponse {
    try {
      const content = rawResponse.trim();

      if (!content) {
        return {
          success: false,
          error: "AI 生成内容为空",
          lyrics: "",
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        lyrics: content,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("响应解析失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "响应解析失败",
        lyrics: "",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
