import {
  LYRICS_SYSTEM_PROMPT,
  LYRICS_USER_PROMPT_TEMPLATE,
  getClosenessLevelLabel,
  getClosenessLevelInstruction,
  getOutputCountInstruction,
  getWordingStyleInstruction,
  getPersonaInstruction,
} from "@/config/lyricsPrompts";
import { MASTER_STYLE_CARDS } from "@/config/masterStyleConfig";
import {
  SONG_LANGUAGE_OPTIONS,
  SONG_STYLE_OPTIONS,
  SONG_STRUCTURE_OPTIONS,
  CREATION_MODE_OPTIONS,
  EnumOption,
} from "@/config/lyricsEnums";
import type { LyricsFormData } from "@/shared/types/types";

/**
 * 根据value获取枚举选项的prompt_instruction
 */
function getEnumInstruction(
  value: string | number,
  options: readonly EnumOption[]
): string {
  const option = options.find((opt) => opt.value === value);
  return option?.prompt_instruction || "";
}

/**
 * 根据masterId获取大师风格卡
 */
function getMasterStyleCard(masterId: string) {
  return MASTER_STYLE_CARDS.find((card) => card.id === masterId);
}

/**
 * 组装歌词生成的Prompt
 * @param formData - 用户表单数据
 * @returns 包含systemPrompt、userPrompt和closeness的对象
 */
export function assembleLyricsPrompt(formData: LyricsFormData) {
  const songLanguageInstruction = getEnumInstruction(
    formData.song_language,
    SONG_LANGUAGE_OPTIONS
  );
  const songStyleInstruction = getEnumInstruction(
    formData.song_style,
    SONG_STYLE_OPTIONS
  );
  const songStructureInstruction = getEnumInstruction(
    formData.song_structure,
    SONG_STRUCTURE_OPTIONS
  );
  const creationModeInstruction = getEnumInstruction(
    formData.creation_mode,
    CREATION_MODE_OPTIONS
  );
  const rhymeTypeInstruction = getEnumInstruction(
    formData.rhyme_type,
    SONG_LANGUAGE_OPTIONS
  );

  const outputCountInstruction = getOutputCountInstruction(
    formData.output_count
  );
  const wordingStyleInstruction = getWordingStyleInstruction(
    formData.wording_style
  );
  const personaInstruction = getPersonaInstruction(formData.persona);

  const closenessLevelLabel = getClosenessLevelLabel(formData.closeness);
  const closenessLevelInstruction = getClosenessLevelInstruction(
    formData.closeness
  );

  const masterName = formData.master_id
    ? (() => {
        const master = getMasterStyleCard(formData.master_id);
        return master?.name || "未知大师";
      })()
    : "无";

  const masterStyleStylesRawData = formData.master_id
    ? (() => {
        const master = getMasterStyleCard(formData.master_id);
        return master?.stylesRawData || "";
      })()
    : "";

  const userPrompt = LYRICS_USER_PROMPT_TEMPLATE.replace(
    "{song_name}",
    formData.song_name
  )
    .replace("{output_count_instruction}", outputCountInstruction)
    .replace("{creation_mode_instruction}", creationModeInstruction)
    .replace("{raw_material}", formData.raw_material)
    .replace("{requirements}", formData.requirements || "无")
    .replace("{{reference_lyrics}}", formData.reference_lyrics || "无")
    .replace("{song_language_instruction}", songLanguageInstruction)
    .replace("{song_style_instruction}", songStyleInstruction)
    .replace("{song_structure_instruction}", songStructureInstruction)
    .replace("{rhyme_type_instruction}", rhymeTypeInstruction)
    .replace("{persona_instruction}", personaInstruction)
    .replace("{wording_style_instruction}", wordingStyleInstruction)
    .replace("{master_name}", masterName)
    .replace("{closeness_level_label}", closenessLevelLabel)
    .replace("{master_style_styles_raw_data}", masterStyleStylesRawData)
    .replace("{closeness_level_instruction}", closenessLevelInstruction);

  return {
    systemPrompt: LYRICS_SYSTEM_PROMPT,
    userPrompt,
    closeness: formData.closeness,
  };
}

/**
 * 组装歌词生成的System Prompt
 * @returns System Prompt字符串
 */
export function getLyricsSystemPrompt(): string {
  return LYRICS_SYSTEM_PROMPT;
}

/**
 * 组装歌词生成的User Prompt
 * @param formData - 用户表单数据
 * @returns User Prompt字符串
 */
export function getLyricsUserPrompt(formData: LyricsFormData): string {
  const { userPrompt } = assembleLyricsPrompt(formData);
  return userPrompt;
}

/**
 * 获取贴近度参数
 * @param formData - 用户表单数据
 * @returns 贴近度数值（0-100）
 */
export function getCloseness(formData: LyricsFormData): number {
  return formData.closeness;
}
