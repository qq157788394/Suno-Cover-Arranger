/**
 * 和弦模板定义
 *
 * 翻写自 Chordino 的 chord.dict 和弦词典文件。
 * 定义 24 个基本和弦 + 12 个扩展和弦 = 36 个模板（extended 词汇表）。
 * 每个模板包含和弦名、音程集合、12 维权重向量（binary/weighted chroma）。
 *
 * @module services/chord/chord-templates
 * @see https://isophonics.net/nnls-chroma — Chordino (NNLS Chroma)
 */

/** 和弦品质类型 */
export type ChordQualityType =
  | 'major'
  | 'minor'
  | 'dominant'
  | 'diminished'
  | 'augmented'
  | 'suspended';

/** 和弦词汇级别 */
export type VocabularyLevel = 'basic' | 'extended' | 'rich';

/** 和弦品质定义 */
export interface ChordQuality {
  /** 后缀，如 "m7" */
  suffix: string;
  /** 音程（半音数），从根音起 */
  intervals: number[];
  /** 各音程的权重 */
  weights: number[];
  /** 品质类型 */
  qualityType: ChordQualityType;
  /** 词汇级别 */
  level: VocabularyLevel;
}

/** 和弦模板（展开到 12 个根音后） */
export interface ChordTemplate {
  /** 和弦名，如 "Dm7" */
  name: string;
  /** 各音的半音值 [0-11] */
  intervals: number[];
  /** 12 维权重向量 */
  weight: number[];
  /** 品质类型 */
  qualityType: ChordQualityType;
}

/** 12 个音符名（使用升号） */
const NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

/** 和弦品质定义 —— 来源：Chordino chord.dict */
const CHORD_QUALITIES: ChordQuality[] = [
  // ── 基本和弦 (basic) ──
  {
    suffix: '',
    intervals: [0, 4, 7],
    weights: [1.0, 0.8, 0.7],
    qualityType: 'major',
    level: 'basic',
  },
  {
    suffix: 'm',
    intervals: [0, 3, 7],
    weights: [1.0, 0.8, 0.7],
    qualityType: 'minor',
    level: 'basic',
  },

  // ── 扩展和弦 (extended) ──
  {
    suffix: '7',
    intervals: [0, 4, 7, 10],
    weights: [1.0, 0.7, 0.6, 0.5],
    qualityType: 'dominant',
    level: 'extended',
  },
  {
    suffix: 'maj7',
    intervals: [0, 4, 7, 11],
    weights: [1.0, 0.7, 0.6, 0.5],
    qualityType: 'major',
    level: 'extended',
  },
  {
    suffix: 'm7',
    intervals: [0, 3, 7, 10],
    weights: [1.0, 0.7, 0.6, 0.5],
    qualityType: 'minor',
    level: 'extended',
  },

  // ── 丰富和弦 (rich) ──
  {
    suffix: 'dim',
    intervals: [0, 3, 6],
    weights: [1.0, 0.8, 0.7],
    qualityType: 'diminished',
    level: 'rich',
  },
  {
    suffix: 'aug',
    intervals: [0, 4, 8],
    weights: [1.0, 0.8, 0.7],
    qualityType: 'augmented',
    level: 'rich',
  },
  {
    suffix: 'sus4',
    intervals: [0, 5, 7],
    weights: [1.0, 0.8, 0.7],
    qualityType: 'suspended',
    level: 'rich',
  },
  {
    suffix: 'sus2',
    intervals: [0, 2, 7],
    weights: [1.0, 0.8, 0.7],
    qualityType: 'suspended',
    level: 'rich',
  },
  {
    suffix: 'm7b5',
    intervals: [0, 3, 6, 10],
    weights: [1.0, 0.7, 0.6, 0.5],
    qualityType: 'diminished',
    level: 'rich',
  },
];

/**
 * 根据词汇级别生成全部和弦模板（12 根音 × N 品质）
 *
 * @param level - 词汇级别：basic/extended/rich
 * @returns 展开后的和弦模板数组
 */
export function generateTemplates(
  level: VocabularyLevel = 'extended',
): ChordTemplate[] {
  const templates: ChordTemplate[] = [];

  // 按级别筛选品质
  const qualities = CHORD_QUALITIES.filter((q) => {
    switch (level) {
      case 'basic':
        return q.level === 'basic';
      case 'extended':
        return q.level === 'basic' || q.level === 'extended';
      case 'rich':
        return true;
    }
  });

  // 展开：每个根音 × 每个品质
  for (let rootIdx = 0; rootIdx < 12; rootIdx++) {
    const rootName = NOTES[rootIdx];
    for (const q of qualities) {
      // 计算每个音的实际半音值
      const intervals = q.intervals.map((i) => (rootIdx + i) % 12);

      // 构建 12 维权重向量
      const weight = new Array(12).fill(0);
      for (let j = 0; j < q.intervals.length; j++) {
        weight[intervals[j]] = Math.max(weight[intervals[j]], q.weights[j]);
      }

      templates.push({
        name: `${rootName}${q.suffix}`,
        intervals,
        weight,
        qualityType: q.qualityType,
      });
    }
  }

  // 添加 N（无和弦）作为特殊模板
  templates.push({
    name: 'N',
    intervals: [],
    weight: new Array(12).fill(0),
    qualityType: 'major',
  });

  return templates;
}

/**
 * 预生成的 extended 级别和弦名列表（供 Viterbi 等使用）
 */
export const EXTENDED_CHORD_NAMES: string[] = generateTemplates('extended')
  .map((t) => t.name);

/**
 * 导出品质定义常量（供 chord-romanizer 等模块使用）
 */
export { CHORD_QUALITIES, NOTES };
