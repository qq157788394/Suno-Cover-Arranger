import {
  getLyricsSystemPrompt,
  getLyricsUserPrompt,
} from "@/services/lyricsPromptService";
import type { LyricsFormData } from "@/shared/types/types";

/**
 * 大师写歌词 - Prompt拼接工具类
 * 负责根据用户输入拼接完整的系统提示词和用户提示词
 */
export class LyricsCraftPromptBuilder {
  /**
   * 生成系统提示词
   * @param request - 歌词生成请求参数
   * @returns 完整的系统提示词
   */
  static buildSystemPrompt(request: LyricsFormData): string {
    return getLyricsSystemPrompt();
  }

  /**
   * 生成用户提示词
   * @param request - 歌词生成请求参数
   * @returns 完整的用户提示词
   */
  static buildUserPrompt(request: LyricsFormData): string {
    return getLyricsUserPrompt(request);
  }
}
