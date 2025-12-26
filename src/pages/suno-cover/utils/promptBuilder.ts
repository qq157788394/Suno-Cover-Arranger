import { USER_PROMPT_TEMPLATE } from "@/config/prompts";
import type { GenerateRequest } from "@/shared/types/types";

/**
 * 翻唱编曲大师 - Prompt拼接工具类
 * 负责根据用户输入拼接完整的用户提示词
 */
export class SunoCoverPromptBuilder {
  /**
   * 生成用户提示词
   * @param request - 生成请求参数
   * @returns 完整的用户提示词
   */
  static buildUserPrompt(request: GenerateRequest): string {
    const {
      target_artist,
      lyrics_raw,
      song_language,
      reference_songs,
      style_note,
      extra_note,
    } = request;

    const fullLanguageName = this.getFullLanguageName(song_language);
    const referenceSongsBlock = this.formatReferenceSongs(
      reference_songs,
      target_artist
    );

    return USER_PROMPT_TEMPLATE.replace("{fullLanguageName}", fullLanguageName)
      .replace("{targetArtist}", target_artist)
      .replace("{referenceSongsBlock}", referenceSongsBlock)
      .replace("{styleNote}", style_note || "")
      .replace("{extraNote}", extra_note || "")
      .replace("{lyricsRaw}", lyrics_raw);
  }

  /**
   * 获取完整语言名称
   * @param language - 语言代码
   * @returns 完整语言名称
   */
  private static getFullLanguageName(language: string): string {
    const languageMap: { [key: string]: string } = {
      Mandarin: "Mandarin Chinese",
      Cantonese: "Cantonese Chinese",
      English: "English",
      Japanese: "Japanese",
      Korean: "Korean",
      Spanish: "Spanish",
      French: "French",
      German: "German",
    };
    return languageMap[language] || language;
  }

  /**
   * 格式化参考歌曲
   * @param songs - 参考歌曲数组
   * @param targetArtist - 目标艺术家
   * @returns 格式化后的参考歌曲文本
   */
  private static formatReferenceSongs(
    songs: any[],
    targetArtist: string
  ): string {
    if (!songs || songs.length === 0) {
      return "None provided.";
    }
    return songs
      .filter((song: { title?: string }) => song.title)
      .map((song: { title: string; artist?: string }) => {
        const artistPart =
          song.artist && song.artist !== targetArtist
            ? ` by ${song.artist}`
            : "";
        return `- "${song.title}"${artistPart}`;
      })
      .join("\n  ");
  }
}
