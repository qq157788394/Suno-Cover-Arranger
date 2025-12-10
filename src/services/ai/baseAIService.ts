import type { GenerateRequest, GenerateResponse } from '../shared/types';
import type { ReferenceSong } from '../shared/types';
import { USER_PROMPT_TEMPLATE } from '../../config/prompts';

export abstract class BaseAIService {
  /**
   * 生成AI回复的统一接口
   */
  abstract generate(request: GenerateRequest): Promise<GenerateResponse>;

  /**
   * 生成用户提示词的模板方法 - 详细版本
   */
  protected generateUserPrompt(request: GenerateRequest): string {
    const { 
      target_artist, 
      lyrics_raw, 
      song_language, 
      reference_songs, 
      style_note, 
      extra_note 
    } = request;

    // 辅助函数：获取完整语言名称
    const getFullLanguageName = (language: string): string => {
      const languageMap: { [key: string]: string } = {
        'Mandarin': 'Mandarin Chinese',
        'Cantonese': 'Cantonese Chinese',
        'English': 'English',
        'Japanese': 'Japanese',
        'Korean': 'Korean',
        'Spanish': 'Spanish',
        'French': 'French',
        'German': 'German',
      };
      return languageMap[language] || language;
    };

    // 辅助函数：格式化参考歌曲
    const formatReferenceSongs = (songs: any[], targetArtist: string): string => {
      if (!songs || songs.length === 0) {
        return 'None provided.';
      }
      return songs
        .filter((song: { title?: string }) => song.title)
        .map((song: { title: string; artist?: string }) => {
          const artistPart = song.artist && song.artist !== targetArtist ? ` by ${song.artist}` : '';
          return `- "${song.title}"${artistPart}`;
        })
        .join('\n  ');
    };

    const fullLanguageName = getFullLanguageName(song_language);
    const referenceSongsBlock = formatReferenceSongs(reference_songs, target_artist);

    // 使用模板字符串替换生成最终的用户提示词
    return USER_PROMPT_TEMPLATE
      .replace('{fullLanguageName}', fullLanguageName)
      .replace('{targetArtist}', target_artist)
      .replace('{referenceSongsBlock}', referenceSongsBlock)
      .replace('{styleNote}', style_note || '')
      .replace('{extraNote}', extra_note || '')
      .replace('{lyricsRaw}', lyrics_raw);
  }

  /**
   * 验证请求参数的方法
   */
  protected validateRequest(request: GenerateRequest): void {
    if (!request.target_artist) {
      throw new Error('请输入目标艺术家');
    }
    if (!request.lyrics_raw) {
      throw new Error('请输入歌词');
    }
    if (!request.song_language) {
      throw new Error('请输入歌曲语言');
    }
  }

  /**
   * 将参考歌曲转换为文本的方法
   */
  protected referenceSongsToText(songs: ReferenceSong[]): string {
    if (!songs || songs.length === 0) {
      return '';
    }
    
    return songs
      .map((song, index) => {
        if (song.title && song.artist) {
          return `${index + 1}. ${song.title} - ${song.artist}`;
        } else if (song.title) {
          return `${index + 1}. ${song.title}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  /**
   * 解析AI响应的模板方法 - 适配Gemini响应格式
   */
  protected async parseResponse(rawResponse: string): Promise<GenerateResponse> {
    try {
      let responseText = rawResponse.trim();
      
      // 专门针对Gemini响应格式进行解析
      // 提取### Styles和### Lyrics部分
      const stylesMatch = responseText.match(/### Styles[\s\S]*?(?=### Lyrics|$)/);
      const lyricsMatch = responseText.match(/### Lyrics[\s\S]*/);
      
      let stylesContent = '';
      let lyricsContent = '';
      
      // 提取Styles内容
      if (stylesMatch) {
        stylesContent = stylesMatch[0].replace(/### Styles/, '').trim();
        // 移除可能的```text```标记
        stylesContent = stylesContent.replace(/```text\s*([\s\S]*?)\s*```/, '$1').trim();
      }
      
      // 提取Lyrics内容
      if (lyricsMatch) {
        lyricsContent = lyricsMatch[0].replace(/### Lyrics/, '').trim();
        // 移除可能的```text```标记
        lyricsContent = lyricsContent.replace(/```text\s*([\s\S]*?)\s*```/, '$1').trim();
      }
      
      // 返回解析结果，严格按照Gemini响应格式处理
      return {
        styles: stylesContent,
        lyrics: lyricsContent,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('响应解析失败:', error);
      // 如果解析失败，返回原始响应作为styles，空字符串作为lyrics
      return {
        styles: rawResponse.trim(),
        lyrics: '',
        timestamp: new Date().toISOString()
      };
    }
  }
}