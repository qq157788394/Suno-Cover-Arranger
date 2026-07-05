/**
 * 音名拼写与音程计算
 *
 * 翻译自 note_speller.py（80 行）。
 * 提供半音值 ↔ 音名的双向转换、半音距离计算、音名字母移位等功能。
 *
 * @module services/romanizer/note-speller
 */

import {
  NOTE_NAMES,
  SEMITONE_MAP,
  normalizeNotePc,
  NOTE_LETTERS,
} from './chord-parser';

/** 自然音名 → 半音值（不含变音记号） */
const NATURAL_PC: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** 升号 → 降号异名同音映射 */
const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
};

/**
 * 音名拼写工具类
 */
export class NoteSpeller {
  /**
   * 根据半音值获取音名
   *
   * @param pc - 半音值 [0-11]
   * @param preferSharps - 偏好升号（null=默认升号, true=升号, false=降号）
   * @returns 音名
   */
  static nameOfPitchClass(
    pc: number,
    preferSharps?: boolean | null,
  ): string {
    const normalized = ((pc % 12) + 12) % 12;
    const sharp = NOTE_NAMES[normalized];
    if (preferSharps === false && sharp in SHARP_TO_FLAT) {
      return SHARP_TO_FLAT[sharp];
    }
    return sharp;
  }

  /**
   * 解析音名为 [字母, 变音数]
   *
   * @param note - 音名，如 "C#" → ["C", 1]
   * @returns [字母, 变音偏移] 或 null
   */
  static parseNote(note: string): [string, number] | null {
    if (!note) return null;
    const letter = note[0].toUpperCase();
    if (!(letter in NATURAL_PC)) return null;
    let acc = 0;
    const rest = note.substring(1).replace(/x/g, '##');
    for (const ch of rest) {
      if (ch === '#') acc++;
      else if (ch.toLowerCase() === 'b') acc--;
    }
    return [letter, acc];
  }

  /**
   * 获取音名的半音值
   *
   * @param note - 音名
   * @returns 半音值 [0-11] 或 null
   */
  static pitchClassOf(note: string): number | null {
    const p = NoteSpeller.parseNote(note);
    if (!p) return null;
    return (((NATURAL_PC[p[0]] + p[1]) % 12) + 12) % 12;
  }

  /**
   * 计算两个音名之间的半音距离（target - reference）
   *
   * @param target - 目标音名
   * @param reference - 参考音名
   * @returns 半音距离 [0-11] 或 null
   */
  static semitoneDistance(
    target: string,
    reference: string,
  ): number | null {
    const tp = normalizeNotePc(target);
    const rp = normalizeNotePc(reference);
    if (!tp || !rp) return null;
    const tpc = SEMITONE_MAP[tp];
    const rpc = SEMITONE_MAP[rp];
    if (tpc === undefined || rpc === undefined) return null;
    return ((tpc - rpc) % 12 + 12) % 12;
  }

  /**
   * 给定基准字母和目标半音值，拼写正确的音名
   *
   * 确保输出音名以正确的字母开头（如 Eb 而非 D# 在降号调上下文中）。
   *
   * @param baseLetter - 基准字母（A-G）
   * @param targetPc - 目标半音值
   * @returns 拼写后的音名
   */
  static spellPitchClass(baseLetter: string, targetPc: number): string {
    const basePc = NATURAL_PC[baseLetter];
    if (basePc === undefined) return NOTE_NAMES[((targetPc % 12) + 12) % 12];

    let diff = ((targetPc - basePc) % 12 + 12) % 12;
    if (diff > 6) diff -= 12;

    if (diff === 0) return baseLetter;
    return baseLetter + (diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff));
  }

  /**
   * 音名字母按音阶移位
   *
   * @param letter - 当前字母
   * @param steps - 移位步数（音阶度数差）
   * @returns 移位后的字母
   */
  static shiftLetter(letter: string, steps: number): string {
    const idx = NOTE_LETTERS.indexOf(letter);
    if (idx < 0) return letter;
    return NOTE_LETTERS[((idx + steps) % 7 + 7) % 7];
  }
}
