import {
  LYRICS_SYSTEM_PROMPT,
  LYRICS_USER_PROMPT_TEMPLATE,
  LYRICS_EXTRA_INFO_TEMPLATE,
  LYRICS_SCENE_TEMPLATE,
  LYRICS_AUDIENCE_TEMPLATE,
  LYRICS_PLATFORM_TEMPLATE,
} from '@/config/lyricsPrompts';
import { MASTER_STYLE_CARDS } from '@/config/masterStyleConfig';
import {
  SONG_LANGUAGE_OPTIONS,
  SONG_STYLE_OPTIONS,
  SONG_STRUCTURE_OPTIONS,
  CREATION_MODE_OPTIONS,
  PERSONA_OPTIONS,
  WORDING_STYLE_OPTIONS,
  RHYME_TYPE_OPTIONS,
  EnumOption,
} from '@/config/lyricsEnums';
import type { LyricsFormData } from '@/shared/types/types';

/**
 * 根据value获取枚举选项的label
 */
function getEnumLabel(value: string | number, options: readonly EnumOption[]): string {
  const option = options.find((opt) => opt.value === value);
  return option?.label || String(value);
}

/**
 * 根据masterId获取大师风格卡
 */
function getMasterStyleCard(masterId: string) {
  return MASTER_STYLE_CARDS.find((card) => card.id === masterId);
}

/**
 * 格式化大师风格信息
 */
function formatMasterStyle(masterId: string): string {
  const master = getMasterStyleCard(masterId);
  if (!master) {
    return '未找到大师风格信息';
  }

  return master.stylesRawData;
}

/**
 * 格式化额外信息（场景、受众、平台）
 */
function formatExtraInfo(formData: LyricsFormData): string {
  let extraInfo = '';

  // 如果没有额外信息，返回提示信息
  extraInfo = '（无额外信息）\n';

  return extraInfo;
}

/**
 * 组装歌词生成的Prompt
 * @param formData - 用户表单数据
 * @returns 包含systemPrompt、userPrompt和closeness的对象
 */
export function assembleLyricsPrompt(formData: LyricsFormData) {
  // 获取枚举选项的标签
  const songLanguageLabel = getEnumLabel(formData.song_language, SONG_LANGUAGE_OPTIONS);
  const songStyleLabel = getEnumLabel(formData.song_style, SONG_STYLE_OPTIONS);
  const songStructureLabel = getEnumLabel(formData.song_structure, SONG_STRUCTURE_OPTIONS);
  const creationModeLabel = getEnumLabel(formData.creation_mode, CREATION_MODE_OPTIONS);
  const personaLabel = getEnumLabel(formData.persona, PERSONA_OPTIONS);
  const wordingStyleLabel = formData.wording_style && formData.wording_style.length > 0
    ? formData.wording_style.map((style) => getEnumLabel(style, WORDING_STYLE_OPTIONS)).join('、')
    : '无';
  const rhymeTypeLabel = getEnumLabel(formData.rhyme_type, RHYME_TYPE_OPTIONS);

  // 获取大师风格信息
  const masterName = formData.master_id
    ? (() => {
        const master = getMasterStyleCard(formData.master_id);
        return master?.name || '未知大师';
      })()
    : '无';
  const masterStyle = formData.master_id
    ? formatMasterStyle(formData.master_id)
    : '未选择风格大师';

  // 格式化额外信息
  const extraInfo = formatExtraInfo(formData);

  // 组装User Prompt
  const userPrompt = LYRICS_USER_PROMPT_TEMPLATE
    .replace('{songName}', formData.song_name)
    .replace('{songLanguage}', songLanguageLabel)
    .replace('{songStyle}', songStyleLabel)
    .replace('{songStructure}', songStructureLabel)
    .replace('{creationMode}', creationModeLabel)
    .replace('{persona}', personaLabel)
    .replace('{wordingStyle}', wordingStyleLabel)
    .replace('{rhymeType}', rhymeTypeLabel)
    .replace('{masterName}', masterName)
    .replace('{closeness}', String(formData.closeness))
  .replace('{masterStyle}', masterStyle)
  .replace('{rawMaterial}', formData.raw_material)
  .replace('{extraInfo}', extraInfo)
  .replace('{outputCount}', String(formData.output_count));

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
