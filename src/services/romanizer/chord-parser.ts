/**
 * 和弦符号解析器
 *
 * 翻译自 chord_parser.py（125 行）。
 * 将和弦符号如 "C#m7/G#" 解析为 {root:"C#", quality:"m7", bass:"G#"}。
 *
 * @module services/romanizer/chord-parser
 */

/** 音名字母（自然音） */
export const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/** 12 个半音名（使用升号） */
export const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

/** 半音名 → 半音值映射（含异名同音） */
export const SEMITONE_MAP: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

/** 非标准音名别名 → 标准音名映射 */
const NOTE_ALIASES: Record<string, string> = {
  CB: 'B',
  'B#': 'C',
  DB: 'C#',
  EB: 'D#',
  'E#': 'F',
  FB: 'E',
  GB: 'F#',
  AB: 'G#',
  BB: 'A#',
  HB: 'B',
  H: 'B',
};

/** 解析后的和弦结构 */
export interface ParsedChord {
  /** 原始符号 */
  symbol: string;
  /** 根音名，如 "C#" */
  root: string;
  /** 品质后缀，如 "m7" */
  quality: string;
  /** 低音名（斜杠和弦），如 "G#" */
  bass?: string;
}

/**
 * 将非标准音名归一化为标准半音名（如 "C#"）
 *
 * @param note - 原始音名
 * @returns 标准化后的半音名，无法识别则返回 null
 */
export function normalizeNotePc(note: string): string | null {
  if (!note) return null;

  const up = note.trim().toUpperCase();
  if (!up) return null;

  // 直接别名匹配
  if (up in NOTE_ALIASES) return NOTE_ALIASES[up];

  // 标准音名直接返回
  if (NOTE_NAMES.includes(up)) return up;

  // 解析：字母 + 变音记号
  const letter = up[0];

  // H 在德式音名中等同于 B
  if (letter === 'H') return 'B';

  const NATURAL_PC: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  if (!(letter in NATURAL_PC)) return null;

  let accidental = 0;
  const rest = up.substring(1);
  for (const ch of rest) {
    if (ch === '#') accidental++;
    else if (ch === 'B') accidental--;
    else if (ch === 'X') accidental += 2;
    else return null;
  }

  const pc = ((NATURAL_PC[letter] + accidental) % 12 + 12) % 12;
  return NOTE_NAMES[pc];
}

/**
 * 标准化拼写：首字母大写，其余不变
 */
function normalizeSpelling(token: string): string {
  const t = token.trim();
  if (!t) return t;
  return t[0].toUpperCase() + t.substring(1);
}

/**
 * 解析和弦符号
 *
 * 支持的格式：
 *   - "C" → {root:"C", quality:""}
 *   - "Dm7" → {root:"D", quality:"m7"}
 *   - "C#m7/G#" → {root:"C#", quality:"m7", bass:"G#"}
 *   - "NC" / "N.C." → {root:"NC", quality:""}
 *
 * @param symbol - 和弦符号字符串
 * @returns 解析结果，格式无效返回 null
 */
export function parseChord(symbol: string): ParsedChord | null {
  if (!symbol) return null;
  const text = symbol.trim();

  // ── 无和弦标记 ──
  const nc = text.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
  if (nc === 'NC' || nc === 'NOCHORD') {
    return { symbol: text, root: 'NC', quality: '' };
  }

  // ── 分离斜杠低音 ──
  let body: string;
  let bass: string | undefined;
  const slashIdx = text.indexOf('/');
  if (slashIdx > 0) {
    body = text.substring(0, slashIdx);
    const bassToken = text.substring(slashIdx + 1).trim();
    if (normalizeNotePc(bassToken) === null) return null;
    bass = normalizeSpelling(bassToken);
  } else {
    body = text;
    bass = undefined;
  }

  body = body.trim();
  if (!body) return null;

  // ── 提取根音 ──
  // 根音 = 第一个字母 + 后续变音记号
  let ptr = 1;
  while (
    ptr < body.length &&
    (body[ptr] === '#' ||
      body[ptr] === 'b' ||
      body[ptr] === 'B' ||
      body[ptr] === 'x' ||
      body[ptr] === 'X')
  ) {
    ptr++;
  }

  const rootToken = body.substring(0, ptr);
  if (normalizeNotePc(rootToken) === null) return null;

  const root = normalizeSpelling(rootToken);
  const quality = body.substring(ptr);

  return { symbol: text, root, quality, bass };
}
