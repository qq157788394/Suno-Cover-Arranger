import type { GenerateResponse } from "@/shared/types/types";

/**
 * 翻唱编曲大师 - 响应解析工具类
 * 负责解析AI返回的原始响应，提取Styles和Lyrics
 */
export class SunoCoverResponseParser {
  /**
   * 解析AI响应
   * @param rawResponse - AI返回的原始响应
   * @returns 包含styles和lyrics的生成响应
   */
  static parseResponse(rawResponse: string): GenerateResponse {
    try {
      let responseText = rawResponse.trim();

      const stylesMatch = responseText.match(
        /### Styles[\s\S]*?(?=### Lyrics|$)/
      );
      const lyricsMatch = responseText.match(/### Lyrics[\s\S]*/);

      let stylesContent = "";
      let lyricsContent = "";

      if (stylesMatch) {
        stylesContent = stylesMatch[0].replace(/### Styles/, "").trim();
        stylesContent = stylesContent
          .replace(/```text\s*([\s\S]*?)\s*```/, "$1")
          .trim();
      }

      if (lyricsMatch) {
        lyricsContent = lyricsMatch[0].replace(/### Lyrics/, "").trim();
        lyricsContent = lyricsContent
          .replace(/```text\s*([\s\S]*?)\s*```/, "$1")
          .trim();
      }

      return {
        styles: stylesContent,
        lyrics: lyricsContent,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("响应解析失败:", error);
      return {
        styles: rawResponse.trim(),
        lyrics: "",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
