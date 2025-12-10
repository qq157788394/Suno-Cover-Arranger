/**
 * DeepSeek API 服务模块
 * 负责处理与 DeepSeek API 的通信，生成高质量的 Suno 翻唱歌曲提示词
 * 核心业务逻辑：
 * 1. 生成结构化的用户提示模板
 * 2. 调用 DeepSeek API 生成 Styles 和 Lyrics
 * 3. 解析 AI 输出，返回标准化结果
 */

import type { ReferenceSong, GenerateRequest, GenerateResponse } from '../shared/types';
import { validateApiKey, validateGenerateRequest } from '@/shared/utils';
import { getFullLanguageName, formatReferenceSongs } from '@/shared/utils';

// 重新导出类型以便其他模块使用
export type { ReferenceSong, GenerateRequest, GenerateResponse };

// 重新导出验证函数以便其他模块使用
export { validateApiKey, validateGenerateRequest };

/**
 * 生成用户提示模板
 * 根据输入参数生成结构化的用户提示，用于指导 DeepSeek API 生成高质量的 Suno 提示词
 * @param values - 生成请求参数
 * @returns 格式化的用户提示字符串
 */
export const generateUserPrompt = (values: GenerateRequest): string => {
  // 使用共享的格式化函数
  const fullLanguageName = getFullLanguageName(values.song_language);
  const referenceSongsBlock = formatReferenceSongs(values.reference_songs, values.target_artist);

  return 'You are generating Suno "Styles" and "Lyrics" prompts for a COVER version of a song. Read all the information below carefully and then produce the final output strictly following the system rules and the format requirements.\n\n' +
    '------------------------------\n' +
    '[1] Song language and context\n' +
    '------------------------------\n\n' +
    '- Song language: ' + fullLanguageName + ' .\n' +
    '- The lyrics are provided in this language and MUST be preserved exactly.\n' +
    '- This is a COVER version, not an original composition. You should shape the sound to match the target artist and references below.\n\n' +
    '------------------------------\n' +
    '[2] Target artist and references\n' +
    '------------------------------\n\n' +
    '- Target cover artist (user input, may be in Chinese or another language):\n' +
    '  "' + values.target_artist + '"\n\n' +
    '- Reference songs from the user (if any):\n' +
    '  ' + referenceSongsBlock + '\n\n' +
    'These names indicate the general style, vocal approach, and arrangement flavor you should lean toward. You do NOT need to describe these songs explicitly, but your Styles and section attributes should feel consistent with this artist and these references.\n\n' +
    '------------------------------\n' +
    '[3] User style notes (free-form, for your understanding only)\n' +
    '------------------------------\n\n' +
    'The user has provided extra style notes in their own words (often Chinese). You may use these notes to refine dynamics, emotion curve, and arrangement choices, but they are NOT additional lyrics.\n\n' +
    '- User style note (may be empty):\n' +
    '  "' + (values.style_note || '') + '"\n\n' +
    '- Extra note (may be empty, can include scene / audience / platform, etc.):\n' +
    '  "' + (values.extra_note || '') + '"\n\n' +
    'You can understand these notes in any language, but you MUST still output Styles and all [Key: Value] attributes in English.\n\n' +
    '------------------------------\n' +
    '[4] User lyrics (DO NOT MODIFY)\n' +
    '------------------------------\n\n' +
    'Below are the complete lyrics provided by the user, with their own section labels and line breaks. They may use Chinese labels such as 【主歌】、【副歌】 or non-standard English labels like [verse], [chorus], etc.\n\n' +
    'You MUST:\n' +
    '- Keep all lyric lines exactly as they are.\n' +
    '- Use these labels only to infer your standardized section labels.\n' +
    '- NOT copy these raw labels into your final output; instead, replace them with standardized English labels such as [Verse 1], [Chorus], [Bridge], [Intro], etc.\n\n' +
    'Here are the raw lyrics:\n\n' +
    values.lyrics_raw + '\n\n' +
    '------------------------------\n' +
    '[5] Your output task\n' +
    '------------------------------\n\n' +
    'Now, using everything above and following the system rules, you MUST:\n\n' +
    '1) Generate the "Styles" section in English\n' +
    '- A single paragraph of 800–900 characters (hard limit 1000).\n' +
    '- It should describe the overall sound of this COVER version, taking into account:\n' +
    '  - The song language: ' + fullLanguageName + ' .\n' +
    '  - The target artist: ' + values.target_artist + '.\n' +
    '  - The reference songs (if any).\n' +
    '  - The user style notes and extra note.\n' +
    '- Mention genre / style, vocal character, dynamic contour, instrumentation, arrangement, and production / space feel.\n\n' +
    '2) Generate the "Lyrics" section as an attribute list\n' +
    '- Split the song into logical sections using standardized English labels in square brackets:\n' +
    '  [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro], etc.\n' +
    '- For each section:\n' +
    '  - Create 2–4 attribute lines in the form [Key: Value], using English Keys (Vocal, Dynamics, Instrument, Texture, Mood, Arrangement, etc.) and concise English Values.\n' +
    '  - Then paste the original lyric lines for that section exactly as provided, without any change.\n' +
    '- For purely instrumental sections (no lyrics), only write the attributes and make it clear there is no vocal.\n\n' +
    '------------------------------\n' +
    '[6] Output format (VERY IMPORTANT)\n' +
    '------------------------------\n\n' +
    'Return your answer in EXACTLY this Markdown structure and nothing else:\n\n' +
    '### Styles\n' +
    '```text\n' +
    '(put the Styles paragraph here in English, MUST be under 900 characters)\n' +
    '```\n\n' +
    '### Lyrics\n' +
    '```text\n' +
    '(put the full Lyrics attribute list here, with all sections, attributes, and original lyrics)\n' +
    '```\n\n' +
    'Do NOT add any extra headings, explanations, or comments outside this format.';
};

/**
 * 调用 DeepSeek API 生成 Suno 翻唱歌曲提示词
 * 核心业务流程：
 * 1. 生成系统提示，定义 AI 助手的角色和行为规则
 * 2. 生成用户提示，包含具体的歌曲信息和生成要求
 * 3. 调用 DeepSeek API 进行文本生成
 * 4. 解析 AI 输出，提取 Styles 和 Lyrics
 * 5. 处理错误，返回标准化结果
 * 
 * @param values - 生成请求参数
 * @returns 包含生成的 Styles 和 Lyrics 的标准化响应
 */
export const callDeepSeekAPI = async (values: GenerateRequest): Promise<GenerateResponse> => {
  // 验证生成请求参数
  validateGenerateRequest(values);
  // 系统提示：定义 AI 助手的角色、职责和严格的输出规则
  // 包含 9 条核心规则，确保生成的提示词符合 Suno 要求和用户预期
  const systemPrompt = 'You are a senior Suno prompt engineer. Your job is to generate high-quality "Styles" and "Lyrics" prompts for cover songs in Suno (v3/v4/v5), especially for Chinese and East Asian songs (Mandarin, Cantonese, etc.).\n\n' +
    'You MUST strictly follow ALL rules below:\n\n' +
    '0. Highest priority rule about Styles length\n' +
    '- The single most important constraint for the Styles section is LENGTH.\n' +
    '- Under NO circumstances may the Styles section exceed 900 characters (including spaces).\n' +
    '- If following any other instruction would cause the Styles section to go over 900 characters, you MUST ignore that other instruction and keep the Styles section within 900 characters.\n\n' +
    '1. Never modify lyrics\n' +
    '- The user will provide complete lyrics in the original language (often Chinese).\n' +
    '- You MUST treat these lyrics as immutable text.\n' +
    '- You MUST NOT change, rewrite, translate, add, or delete any words, punctuation, or line breaks.\n' +
    '- You MUST NOT invent any new lyrics.\n' +
    '- You MUST preserve the original order of all lyric lines.\n\n' +
    '2. Always output TWO parts only\n' +
    'You must ALWAYS output exactly two sections in this order:\n\n' +
    '### Styles\n' +
    '```text\n' +
    '(Styles content here)\n' +
    '```\n\n' +
    '### Lyrics\n' +
    '```text\n' +
    '(Lyrics content here)\n' +
    '```\n\n' +
    'Do NOT output anything before or after these two sections.\n\n' +
    '3. Styles requirements\n' +
    '- Language: English only.\n' +
    '- Length: you MUST NOT exceed 900 characters, including spaces. Your target range is 750–850 characters. If your drafted Styles text is longer than 900 characters, you MUST shorten and compress it BEFORE you output your final answer.\n' +
    '- Purpose: describe the overall sound of this specific COVER VERSION, including:\n' +
    '  - Overall genres / style labels (e.g., pop, rock, ballad, symphonic, ambient, etc., combined as needed).\n' +
    '  - Vocal character and evolution (e.g., intimate, breathy, warm, powerful, belt, falsetto, etc.).\n' +
    '  - Dynamic contour across the whole song (e.g., restrained verse → build-up → explosive chorus → drop → grand finale).\n' +
    '  - Core instrumentation and arrangement (e.g., solo piano, acoustic guitar, distorted electric guitars, full string ensemble, live drums, synth pads, etc.).\n' +
    '  - Production / space feel if relevant (e.g., studio clean vs live concert feeling, dry vs reverb-heavy, wide stereo image, etc.).\n' +
    '- The Styles description MUST:\n' +
    '  - Stay consistent with the target artist and reference songs provided by the user.\n' +
    '  - Respect the user’s style notes and extra notes as much as possible.\n' +
    '- Writing style for Styles:\n' +
    '  - Use dense, information-rich sentences.\n' +
    '  - Avoid repeating the same idea with different words.\n' +
    '  - Do not list long chains of near-synonyms.\n' +
    '  - Prioritize key information about genre, vocal character, dynamics, instrumentation, and mood; omit minor decorative details if necessary to stay under the length limit.\n\n' +
    '4. Lyrics requirements: section-by-section attribute list\n' +
    'For the "Lyrics" part, you MUST use an attribute-list format:\n\n' +
    '- For each SECTION:\n' +
    '  1) Use a standardized English section label in square brackets, for example:\n' +
    '     [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro].\n' +
    '  2) Under that label, write 2–4 attribute lines in the form:\n' +
    '     [Key: Value]\n' +
    '  3) After the attribute lines, paste the original lyrics for that section EXACTLY as provided by the user.\n\n' +
    'Example pattern (this is only a pattern, NOT actual content):\n\n' +
    '[Verse 1]\n' +
    '[Vocal: Warm, intimate female vocal, close-mic]\n' +
    '[Dynamics: Soft and restrained, subtle build into the last line]\n' +
    '[Instrument: Piano and subtle strings, light percussion]\n' +
    '[Mood: Nostalgic, bittersweet, reflective]\n\n' +
    '(Original lyrics lines here, unchanged)\n\n' +
    '5. Standardized section labels and mapping from user labels\n' +
    '- The user’s raw lyrics may contain non-standard labels such as:\n' +
    '  【主歌】, 【主歌1】, [主歌], [verse], [Verse], 【副歌】, [chorus], 【桥段】, 【前奏】, 【间奏】, etc.\n' +
    '- Your job is to INTERPRET these raw labels and map them onto standardized English labels in your output.\n' +
    '- Mapping guidelines:\n' +
    '  - All main narrative sections → [Verse 1], [Verse 2], [Verse 3], … in order of appearance.\n' +
    '  - Repeated hook / main message sections → [Chorus], [Chorus 2], [Chorus 3], … in order of appearance.\n' +
    '  - Transitional build sections → [Pre-Chorus] (and numbered if multiple distinct ones).\n' +
    '  - Intro sections → [Intro].\n' +
    '  - Instrumental breaks → [Interlude].\n' +
    '  - Bridges → [Bridge].\n' +
    '  - Ending sections → [Outro].\n' +
    '- You are allowed to change ONLY the section labels. You are NOT allowed to change the lyrics content or order.\n\n' +
    '6. Attribute keys and vocabulary\n' +
    '- All attribute keys and values MUST be in English.\n' +
    '- Use the following keys whenever helpful (you do NOT need to use all of them for every section):\n' +
    '  - Vocal, Dynamics, Instrument, Texture, Mood, Arrangement, Harmony, Rhythm, FX.\n' +
    '- For values, you should use short, precise musical phrases. You can combine and reuse terms such as:\n' +
    '  - Vocal: warm, airy, breathy, raspy, powerful, intimate, close-mic, distant, belt, falsetto, head voice, chest voice, mixed voice, double-tracked, harmonized, a cappella, call and response, etc.\n' +
    '  - Dynamics: soft, medium, loud, gradually building, crescendo, decrescendo, explosive, accented, staccato, legato, sustained, etc.\n' +
    '  - Instrument: solo piano, acoustic guitar, electric guitar, distorted guitar, bass, string quartet, full string ensemble, synth pad, analog synth bass, live drum kit, electronic drums, etc.\n' +
    '  - Texture: sparse, dense, layered, atmospheric, monophonic, homophonic, polyphonic, wide stereo, narrow, etc.\n' +
    '  - Mood: nostalgic, melancholic, hopeful, uplifting, bittersweet, dark, tense, peaceful, triumphant, etc.\n' +
    '  - Arrangement / Rhythm / FX: verse-chorus-bridge form, syncopated groove, straight 4/4, reverb-heavy, delay, compression, distortion, filtered intro, etc.\n' +
    '- These terms are inspired by the official “Music Glossary for Suno”. You do not need to explain them; just use them appropriately in Keys and Values.\n\n' +
    '7. Handling instrumental sections\n' +
    '- If a section has NO lyrics (e.g., Intro, Interlude, Outro), you MUST:\n' +
    '  - Still create the section label and 2–4 attribute lines.\n' +
    '  - Make it explicit that it is instrumental only, for example:\n' +
    '    [Vocal: No vocal, purely instrumental section]\n' +
    '  - Do NOT fabricate any humming or nonsense syllables.\n\n' +
    '8. Language rules\n' +
    '- Styles: English only.\n' +
    '- All [Key: Value] attribute lines: English only.\n' +
    '- Original lyrics: keep in the original language exactly as provided (often Chinese).\n' +
    '- You may read and understand the user’s Chinese notes and labels, but you MUST NOT copy Chinese text into Styles or into any [Key: Value] line.\n\n' +
    '9. Internal QA checklist before finalizing your answer\n' +
    'Before you output the result, mentally check that:\n\n' +
    '- You have output exactly two sections with the exact headings:\n' +
    '  "### Styles" and "### Lyrics".\n' +
    '- The Styles section is written in English and is clearly under 900 characters (including spaces). If it might be close to the limit, you MUST shorten it further before outputting.\n' +
    '- Every lyric section has:\n' +
    '  - One standardized English section label in square brackets.\n' +
    '  - 2–4 [Key: Value] lines with English Keys and Values.\n' +
    '  - The original lyrics reproduced exactly, with the same lines and order.\n' +
    '- You have not invented, removed, or altered any lyrics.\n' +
    '- You have reasonably interpreted user labels into standardized English labels and numbered them in order of appearance.\n' +
    '- Styles and Lyrics are consistent with each other (no contradictions in dynamics, instrumentation, or mood).\n\n' +
    'If any rule conflicts with another, ALWAYS prioritize preserving the original lyrics and keeping the required output format.';

  // 生成用户提示：根据请求参数生成包含具体歌曲信息的用户提示
  const userPrompt = generateUserPrompt(values);

  // 调用 DeepSeek API：使用系统提示和用户提示生成 AI 响应
  let response: Response;
  try {
    response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + values.apiKey,  // API 认证头
        'Content-Type': 'application/json'           // 请求内容类型
      },
      body: JSON.stringify({
        'model': 'deepseek-chat',  // 使用的 AI 模型
        'messages': [              // 消息数组：系统提示 + 用户提示
          {
            'role': 'system',
            'content': systemPrompt
          },
          {
            'role': 'user',
            'content': userPrompt
          }
        ],
        'stream': false,  // 非流式响应，等待完整结果
        'temperature': 0.7, // 控制生成文本的随机性
        'max_tokens': 4096 // 控制生成文本的最大长度
      })
    });
  } catch (networkError) {
    throw new Error('网络请求失败，请检查网络连接');
  }

  // 检查 API 响应状态
  if (!response.ok) {
    // 尝试解析 API 错误响应，获取更详细的错误信息
    let errorMessage = 'API请求失败: ' + response.status;
    try {
      const errorData = await response.json();
      if (errorData.error && errorData.error.message) {
        errorMessage = `API请求失败: ${errorData.error.message}`;
        // 针对常见的错误类型提供更友好的提示
        if (errorMessage.includes('invalid_api_key') || errorMessage.includes('API key not found')) {
          errorMessage = 'API Key 无效，请检查您的 API Key';
        } else if (errorMessage.includes('rate_limit_exceeded')) {
          errorMessage = 'API 请求频率过高，请稍后再试';
        } else if (errorMessage.includes('insufficient_quota')) {
          errorMessage = 'API 调用次数不足，请检查您的配额';
        }
      }
    } catch (parseError) {
      // 如果无法解析错误响应，使用默认错误信息
    }
    throw new Error(errorMessage);
  }

  // 解析 API 响应
  let data: any;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('API 响应解析失败');
  }

  // 检查 API 响应数据格式
  if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
    throw new Error('API 响应数据格式不正确');
  }

  const aiOutput = data.choices[0].message.content;  // 提取 AI 生成的内容
  
  if (!aiOutput || !aiOutput.trim()) {
    throw new Error('AI 生成内容为空');
  }

  // 使用正则表达式解析 AI 输出，提取 Styles 和 Lyrics 部分
  // 正则匹配规则：寻找 ### Styles 或 ### Lyrics 标记下的 ```text 代码块
  const stylesMatch = aiOutput.match(/### Styles[\s\S]*?```text\n(.*?)```/s);
  const lyricsMatch = aiOutput.match(/### Lyrics[\s\S]*?```text\n(.*?)```/s);

  // 验证解析结果，确保同时提取到 Styles 和 Lyrics
  if (stylesMatch && lyricsMatch) {
    return {
      styles: stylesMatch[1].trim(),  // 提取并清理 Styles 内容
      lyrics: lyricsMatch[1].trim(),  // 提取并清理 Lyrics 内容
      timestamp: new Date().toISOString()  // 添加当前时间戳
    };
  } else {
    throw new Error('AI输出格式不符合预期，无法提取Styles或Lyrics');
  }
};
