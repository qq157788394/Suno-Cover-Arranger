/**
 * 和弦 → 罗马数字级数映射引擎
 *
 * 完整翻译自 chord-romanizer (MIT, 1298 行 Python)。
 * 提供和弦序列的功能级数标注，包括：
 *   - 调式内自然和弦的罗马数字标注
 *   - 次级属和弦检测（V7/VI 等）
 *   - 增三/半减九/Sus4 混合和弦自动识别
 *   - 三全音/那不勒斯和弦推理
 *   - II-V-I 检测
 *   - 转调支持
 *   - 异名同音简化
 *
 * @module services/romanizer/romanizer
 * @see https://pypi.org/project/chord-romanizer/ — 原作 (MIT)
 */

import {
  type ParsedChord,
  normalizeNotePc,
  SEMITONE_MAP,
  NOTE_LETTERS,
} from './chord-parser';
import { NoteSpeller } from './note-speller';

// ── 内部类型 ──

/** 分析节点（预处理后的和弦信息） */
interface AnalysisNode {
  originalChord: ParsedChord;
  effectiveRoot: string;
  effectiveQuality: string;
  isDominant: boolean;
  isMinor: boolean;
  isDiminished: boolean;
  isIiVStart?: boolean;
  isResolutionTarget?: boolean;
  resolutionType?: string | null;
}

/** 上下文提示（影响异名同音拼写选择） */
interface ContextHint {
  preferSharps?: boolean | null;
  node?: AnalysisNode;
}

/** 混合和弦分析结果 */
interface HybridAnalysis {
  isHybrid: boolean;
  alter?: string | null;
  bassPreference?: boolean | null;
  rootOverride?: string | null;
  kind: HybridKind;
}

/** 混合和弦类型 */
enum HybridKind {
  NONE = 'none',
  BLACKADDER = 'blackadder',
  SEC_DOM_3_IN_BASS = 'sec_dom_3inbass',
  HALFDIM_9 = 'halfdim9',
  SUS4_9 = '9sus4',
  SUS4_7_B9 = '7sus4(b9)',
}

// ── 导出类型 ──

/** 级数标注后的单个和弦 */
export interface RomanizedChord {
  /** 原始解析结果 */
  chord: ParsedChord;
  /** 主要罗马数字标注 */
  roman: string;
  /** 备选标注 */
  alternateLabels: string[];
  /** 级数根音 */
  degreeRoot: string;
  /** 级数低音（斜杠和弦） */
  degreeBass?: string | null;
  /** 带低音的完整级数标注 */
  romanRootBass?: string | null;
  /** 是否为混合和弦 */
  isHybrid: boolean;
  /** 混合和弦的替换解释 */
  alter?: string | null;
  /** 修正后的和弦符号 */
  symbolFixed?: string | null;
  /** 是否为 II-V 起始和弦 */
  isIiVStart: boolean;
  /** 是否为属→主解决的目标和弦 */
  isResolutionTarget: boolean;
  /** 解决类型 */
  resolutionType?: string | null;
}

// ── 评分常量 ──
const SCORES = {
  SEMITONE: 3.0,
  BACKDOOR: 5.0,
  STRONG: 6.0,
  WEAK: 2.0,
  BIAS: 0.5,
};

/**
 * 罗马数字级数映射器
 *
 * ## 使用示例
 *
 * ```typescript
 * import { Romanizer } from '@/services/romanizer/romanizer';
 * import { parseChord } from '@/services/romanizer/chord-parser';
 *
 * const romanizer = new Romanizer('C'); // C Major
 * const symbols = ['Dm7', 'G7', 'Cmaj7'];
 * const parsed = symbols.map(s => parseChord(s)!);
 * const results = romanizer.annotateProgression(parsed);
 * // results[0].roman → "IIm7"
 * // results[1].roman → "V7"
 * // results[2].roman → "IM7"
 * ```
 */
export class Romanizer {
  /** 大调音阶的半音模式 */
  private static MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];

  /** 罗马数字符号 */
  private static ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  /** 默认调式根音 */
  private defaultTonic: string;

  /** 是否启用异名同音简化 */
  private simplifyAccidentals: boolean;

  constructor(defaultTonic: string = 'C', simplifyAccidentals: boolean = false) {
    this.defaultTonic = defaultTonic;
    this.simplifyAccidentals = simplifyAccidentals;
  }

  // ================================================================
  // Public API
  // ================================================================

  /**
   * 对和弦序列进行批量级数标注
   *
   * 包含全局上下文分析：II-V 检测、半音推进推理、解决关系检测。
   *
   * @param progression - 和弦序列（ParsedChord 数组）
   * @returns 级数标注结果数组
   */
  annotateProgression(progression: ParsedChord[]): RomanizedChord[] {
    if (progression.length === 0) return [];

    const hints = this.analyzeGlobalContext(progression);
    const results: RomanizedChord[] = [];

    for (let i = 0; i < progression.length; i++) {
      const chord = progression[i];
      if (!chord) continue;

      const prevChord = i > 0 ? progression[i - 1] : undefined;
      const nextChord = i + 1 < progression.length ? progression[i + 1] : undefined;
      const hint = hints[i];

      const result = this.processChord(
        chord,
        this.defaultTonic,
        prevChord,
        nextChord,
        hint,
      );
      if (result) results.push(result);
    }

    return results;
  }

  // ================================================================
  // 全局上下文分析
  // ================================================================

  /**
   * 分析全局上下文：II-V 检测、半音推进推理
   */
  private analyzeGlobalContext(chords: ParsedChord[]): ContextHint[] {
    const nodes = this.preAnalyze(chords);
    this.detectIiVAndResolutions(nodes);

    const hints: ContextHint[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const hint: ContextHint = { node };

      // 半音推进 → 确定升降号偏好
      if (i + 1 < nodes.length) {
        const next = nodes[i + 1];
        const dist = NoteSpeller.semitoneDistance(
          next.effectiveRoot,
          node.effectiveRoot,
        );
        if (dist === 1) {
          hint.preferSharps = !node.isDiminished;
        } else if (dist === 11) {
          hint.preferSharps = false;
        }
      }

      // 属→主解决的目标音 → 按目标拼写偏好
      let targetNode: AnalysisNode | undefined;
      if (node.isIiVStart && i + 2 < nodes.length) {
        targetNode = nodes[i + 2];
      } else if (node.isDominant && i + 1 < nodes.length) {
        const next = nodes[i + 1];
        const d = NoteSpeller.semitoneDistance(
          next.effectiveRoot,
          node.effectiveRoot,
        );
        if (d === 5) targetNode = next;
      }
      if (targetNode) {
        const pref = this.targetAccidentalPref(targetNode.effectiveRoot);
        if (pref !== null) hint.preferSharps = pref;
      }

      hints.push(hint);
    }
    return hints;
  }

  /**
   * 对每个和弦进行预处理：确定有效根音、品质、功能类型
   */
  private preAnalyze(chords: ParsedChord[]): AnalysisNode[] {
    return chords.map((chord) => {
      const analysis = this.analyzeSlashChord(chord);
      let effRoot = chord.root;
      let effQuality = chord.quality || '';

      if (analysis.isHybrid) {
        if (
          [
            HybridKind.SUS4_9,
            HybridKind.SUS4_7_B9,
            HybridKind.SEC_DOM_3_IN_BASS,
          ].includes(analysis.kind)
        ) {
          effRoot = chord.bass!;
          effQuality = '7';
        }
      }

      const isDom = this.isDominantQuality(effQuality);
      const isMin = this.isMinorQuality(effQuality);
      const isDim =
        effQuality.toLowerCase().includes('dim') ||
        effQuality.toLowerCase().includes('m7-5') ||
        effQuality.toLowerCase().includes('m7b5');

      return {
        originalChord: chord,
        effectiveRoot: effRoot,
        effectiveQuality: effQuality,
        isDominant: isDom,
        isMinor: isMin,
        isDiminished: isDim,
      };
    });
  }

  /**
   * 检测 II-V 进行和属→主解决关系
   */
  private detectIiVAndResolutions(nodes: AnalysisNode[]): void {
    for (let i = 0; i < nodes.length - 1; i++) {
      const curr = nodes[i];
      const next = nodes[i + 1];
      const d = NoteSpeller.semitoneDistance(
        next.effectiveRoot,
        curr.effectiveRoot,
      );
      if (d === null) continue;

      // II-V 检测：上四度的 minor→dominant
      if (
        d === 5 &&
        (curr.isMinor || curr.isDiminished) &&
        next.isDominant
      ) {
        curr.isIiVStart = true;
      }

      // 解决检测：属→主（下五度或上半音）
      if (curr.isDominant) {
        if (d === 5) {
          next.isResolutionTarget = true;
          next.resolutionType = 'perfect';
        } else if (d === 11) {
          next.isResolutionTarget = true;
          next.resolutionType = 'semitone';
        }
      }
    }
  }

  /**
   * 根据调式根音确定升降号偏好
   */
  private targetAccidentalPref(root: string): boolean | null {
    if (root.includes('b')) return false;
    if (root.includes('#')) return true;
    if (root === 'F') return false;
    if (['G', 'D', 'A', 'E', 'B'].includes(root)) return true;
    return null;
  }

  // ================================================================
  // 单个和弦处理
  // ================================================================

  /**
   * 处理单个和弦：计算级数、处理斜杠/混合和弦
   */
  private processChord(
    chord: ParsedChord,
    key: string,
    prevChord?: ParsedChord,
    nextChord?: ParsedChord,
    hint?: ContextHint,
  ): RomanizedChord | null {
    // 无和弦
    if (chord.root === 'NC') {
      return {
        chord,
        roman: '-',
        alternateLabels: [],
        degreeRoot: '-',
        isHybrid: false,
        isIiVStart: false,
        isResolutionTarget: false,
      };
    }

    const dist = NoteSpeller.semitoneDistance(chord.root, key);
    if (dist === null) return null;

    const preferSharps = hint?.preferSharps ?? null;

    // 确定级数名
    const [baseDegree, alternates] = this.determineDegreeName(
      dist,
      key,
      chord,
      prevChord,
      nextChord,
      preferSharps,
    );

    const primaryRoot = this.formatRoman(baseDegree, chord.quality);
    const altRoots = alternates.map((a) => this.formatRoman(a, chord.quality));

    // Slash / Hybrid 解析
    const analysis = this.analyzeSlashChord(chord, nextChord);

    // Root 拼写
    let rootFixed = this.spellDegreeNote(baseDegree, key);
    if (analysis.rootOverride) rootFixed = analysis.rootOverride;

    // 低音处理
    let degreeBass: string | null = null;
    let romanRootBass: string | null = null;
    let bassFixed: string | null = null;
    let redundantBass = false;

    if (chord.bass) {
      redundantBass = this.samePitch(chord.root, chord.bass);

      if (!analysis.isHybrid) {
        // 转位和弦：低音在和弦音内
        bassFixed = this.spellBassInversion(chord, rootFixed || chord.root);
        if (!bassFixed) {
          bassFixed = this.spellBassByKey(chord.bass, key);
        }
      } else {
        // 混合和弦：低音按拼写偏好
        const bassPc = NoteSpeller.pitchClassOf(chord.bass);
        if (
          analysis.bassPreference !== null &&
          analysis.bassPreference !== undefined &&
          bassPc !== null
        ) {
          bassFixed = NoteSpeller.nameOfPitchClass(
            bassPc,
            analysis.bassPreference,
          );
        } else {
          bassFixed = this.spellBassByKey(chord.bass, key);
        }
      }

      const bassForDegree = bassFixed || chord.bass;
      if (bassForDegree) {
        degreeBass = this.degreeFromSpelling(bassForDegree, key);
      }
      if (degreeBass) {
        romanRootBass = `${baseDegree}/${degreeBass}`;
      }
    }

    // 组装罗马数字标注
    let romanLabel = primaryRoot;
    if (
      chord.bass &&
      degreeBass &&
      chord.symbol.includes('/') &&
      !redundantBass
    ) {
      romanLabel = `${primaryRoot}/${degreeBass}`;
      if (!altRoots.includes(primaryRoot)) altRoots.push(primaryRoot);
    }
    if (redundantBass) {
      degreeBass = null;
      romanRootBass = null;
    }

    // 异名同音简化
    if (this.simplifyAccidentals) {
      if (rootFixed) rootFixed = this.simplifySpelling(rootFixed);
      if (bassFixed) bassFixed = this.simplifySpelling(bassFixed);
    }

    const symbolFixed = this.rewriteSymbol(
      chord.symbol,
      chord.root,
      rootFixed,
      chord.bass,
      bassFixed,
    );

    const iiVStart = hint?.node?.isIiVStart ?? false;
    const resTarget = hint?.node?.isResolutionTarget ?? false;
    const resType = hint?.node?.resolutionType ?? null;

    return {
      chord,
      roman: romanLabel,
      alternateLabels: altRoots,
      degreeRoot: baseDegree,
      degreeBass,
      romanRootBass,
      isHybrid: analysis.isHybrid,
      alter: analysis.alter
        ? this.romanizeAbsoluteSymbol(analysis.alter, key)
        : null,
      symbolFixed,
      isIiVStart: iiVStart,
      isResolutionTarget: resTarget,
      resolutionType: resType,
    };
  }

  // ================================================================
  // 混合和弦分析
  // ================================================================

  /**
   * 分析斜杠和弦（混合和弦 / 分数和弦）
   */
  private analyzeSlashChord(
    chord: ParsedChord,
    nextChord?: ParsedChord,
  ): HybridAnalysis {
    if (!chord.bass) {
      return {
        isHybrid: false,
        kind: HybridKind.NONE,
      };
    }

    // 1. 转位判断：低音在和弦音内
    if (this.isInversion(chord.root, chord.bass, chord.quality)) {
      return {
        isHybrid: false,
        kind: HybridKind.NONE,
      };
    }

    // 2. 增三斜杠和弦
    if (this.isAugQuality(chord.quality)) {
      const result = this.inferAugSlash(chord, nextChord);
      if (result) return result;
    }

    // 3. 常规混合和弦
    const [alter, kind] = this.inferNormalHybrid(chord);
    if (alter) {
      return { isHybrid: true, alter, kind };
    }

    return { isHybrid: true, kind: HybridKind.NONE };
  }

  /**
   * 增三斜杠和弦推理
   */
  private inferAugSlash(
    chord: ParsedChord,
    nextChord?: ParsedChord,
  ): HybridAnalysis | null {
    const candidates: [number, HybridAnalysis][] = [];
    const ba = this.checkBlackadder(chord, nextChord);
    if (ba) candidates.push(ba);
    const hd = this.checkHalfdim(chord, nextChord);
    if (hd) candidates.push(hd);

    if (candidates.length === 0) return null;
    // 返回得分最高的解释
    return candidates.sort((a, b) => b[0] - a[0])[0][1];
  }

  /**
   * Blackadder 和弦检测：增三+低音 → 属七 altered
   */
  private checkBlackadder(
    chord: ParsedChord,
    nextChord?: ParsedChord,
  ): [number, HybridAnalysis] | null {
    if (!chord.bass) return null;
    const bassPc = NoteSpeller.pitchClassOf(chord.bass);
    const triadPcs = this.getAugTriadPcs(chord.root);
    if (bassPc === null || !triadPcs) return null;

    const anchorPc = (bassPc + 6) % 12;
    if (!triadPcs.has(anchorPc)) return null;

    let score = 0.0;
    const bassPref = this.bassPrefFromResolution(chord.bass!, nextChord);
    const bassFixed = NoteSpeller.nameOfPitchClass(bassPc, bassPref);

    let alter = `${bassFixed}7(9,#11)`;
    let kind = HybridKind.BLACKADDER;

    if (nextChord) {
      const bassToNext = NoteSpeller.semitoneDistance(
        nextChord.root,
        chord.bass!,
      );
      if (bassToNext === 1 || bassToNext === 11) score += SCORES.SEMITONE;
      if (
        bassToNext === 2 &&
        this.isTonicQuality(nextChord.quality)
      ) {
        score += SCORES.BACKDOOR;
      }
    }

    // 三级在低音的次级属和弦
    const anchorName = NoteSpeller.nameOfPitchClass(anchorPc, bassPref);
    const anchorParsed = NoteSpeller.parseNote(anchorName);
    if (anchorParsed && nextChord) {
      const domLetter = NoteSpeller.shiftLetter(anchorParsed[0], 1);
      const domPc = (anchorPc + 2) % 12;
      const domName = NoteSpeller.spellPitchClass(domLetter, domPc);
      const domToNext = NoteSpeller.semitoneDistance(
        nextChord.root,
        domName,
      );
      if (
        domToNext !== null &&
        [5, 7].includes(domToNext) &&
        this.isTonicQuality(nextChord.quality)
      ) {
        alter = `${domName}7(9,#11)/${bassFixed}`;
        kind = HybridKind.SEC_DOM_3_IN_BASS;
        score += SCORES.STRONG;
      }
    }

    const origPc = NoteSpeller.pitchClassOf(chord.root);
    const rootOverride = origPc === anchorPc ? null : anchorName;

    return [
      score,
      {
        isHybrid: true,
        kind,
        alter,
        bassPreference: bassPref,
        rootOverride,
      },
    ];
  }

  /**
   * 半减九和弦检测
   */
  private checkHalfdim(
    chord: ParsedChord,
    nextChord?: ParsedChord,
  ): [number, HybridAnalysis] | null {
    if (!chord.bass) return null;
    const bassPc = NoteSpeller.pitchClassOf(chord.bass);
    const triadPcs = this.getAugTriadPcs(chord.root);
    if (bassPc === null || !triadPcs) return null;

    const relative = new Set(
      [...triadPcs].map((p) => ((p - bassPc) % 12 + 12) % 12),
    );
    if (!relative.has(2) || !relative.has(6) || !relative.has(10)) return null;

    let score = SCORES.BIAS;
    const bassFixed = NoteSpeller.nameOfPitchClass(bassPc, null);

    if (nextChord) {
      const d = NoteSpeller.semitoneDistance(nextChord.root, chord.bass!);
      if (
        d !== null &&
        (d === 5 || d === 7) &&
        this.isDominantQuality(nextChord.quality)
      ) {
        score += SCORES.STRONG;
      } else if (this.isDominantQuality(nextChord.quality)) {
        score += SCORES.WEAK;
      }
    }

    return [
      score,
      {
        isHybrid: true,
        kind: HybridKind.HALFDIM_9,
        alter: `${bassFixed}m7-5(9)`,
      },
    ];
  }

  /**
   * 常规混合和弦推理：F/G → G9sus4, Fm/G → G7sus4(b9)
   */
  private inferNormalHybrid(
    chord: ParsedChord,
  ): [string | null, HybridKind] {
    const dist = NoteSpeller.semitoneDistance(chord.root, chord.bass!);
    if (dist === null) return [null, HybridKind.NONE];

    const intervals = this.getIntervals(chord.quality);
    const rel = new Set(
      [...intervals].map((i) => ((i + dist) % 12 + 12) % 12),
    );

    const hasThird = rel.has(3) || rel.has(4);
    if (!hasThird) {
      if (rel.has(2) && rel.has(5) && rel.has(10)) {
        return [`${chord.bass}9sus4`, HybridKind.SUS4_9];
      }
      if (rel.has(1) && rel.has(5) && rel.has(10)) {
        return [`${chord.bass}7sus4(b9)`, HybridKind.SUS4_7_B9];
      }
    }

    return [null, HybridKind.NONE];
  }

  // ================================================================
  // 和弦品质判定
  // ================================================================

  /**
   * 和弦品质 → 音程集合
   */
  private getIntervals(quality: string): Set<number> {
    if (quality.includes('M7')) return new Set([0, 4, 7, 11]);
    const q = (quality || '').toLowerCase();
    if (q.includes('m7-5') || q.includes('m7b5'))
      return new Set([0, 3, 6, 10]);
    if (q.includes('dim') || q.includes('o'))
      return new Set([0, 3, 6]);
    if (q.includes('maj7') || q.includes('ma7'))
      return new Set([0, 4, 7, 11]);
    if (q.includes('m7')) return new Set([0, 3, 7, 10]);
    if (q.includes('7')) return new Set([0, 4, 7, 10]);
    if (q.includes('m')) return new Set([0, 3, 7]);
    return new Set([0, 4, 7]);
  }

  /**
   * 是否转位：低音在和弦音内但不是根音
   */
  private isInversion(
    root: string,
    bass: string,
    quality: string,
  ): boolean {
    const dist = NoteSpeller.semitoneDistance(bass, root);
    if (dist === null || dist === 0) return false;
    return this.getIntervals(quality).has(dist);
  }

  /**
   * 机能上是否为属和弦
   */
  private isDominantQuality(quality: string): boolean {
    if (quality.includes('M7')) return false;
    const q = quality.toLowerCase();
    if (q.includes('maj7') || q.includes('ma7')) return false;
    if (q.includes('m') && !q.includes('dim')) return false;
    return q.includes('7');
  }

  /**
   * 机能上是否为主和弦（非属）
   */
  private isTonicQuality(quality: string): boolean {
    return !this.isDominantQuality(quality);
  }

  /**
   * 机能上是否为小和弦系
   */
  private isMinorQuality(quality: string): boolean {
    if (quality.includes('M7')) return false;
    const q = quality.toLowerCase();
    return q.includes('m') && !q.includes('maj') && !q.includes('dim');
  }

  /**
   * 是否为增三和弦
   */
  private isAugQuality(quality: string): boolean {
    const q = (quality || '').toLowerCase();
    return q.includes('aug') || quality.includes('+');
  }

  /**
   * 增三和弦的半音集合
   */
  private getAugTriadPcs(root: string): Set<number> | null {
    const pc = NoteSpeller.pitchClassOf(root);
    if (pc === null) return null;
    return new Set([pc % 12, (pc + 4) % 12, (pc + 8) % 12]);
  }

  // ================================================================
  // 级数计算
  // ================================================================

  /**
   * 确定级数名称（处理三全音、那不勒斯等特殊情况）
   */
  private determineDegreeName(
    dist: number,
    key: string,
    chord: ParsedChord,
    prevChord?: ParsedChord,
    nextChord?: ParsedChord,
    preferSharps?: boolean | null,
  ): [string, string[]] {
    // ── 三全音处理 ──
    if (dist === 6) {
      const q = (chord.quality || '').toLowerCase();
      const isHalfDim = q.includes('m7-5') || q.includes('m7b5');
      const isDim = q.includes('dim');

      let sharp = preferSharps ?? true;
      if (isHalfDim || isDim) sharp = true;
      else if (nextChord) {
        const nd = NoteSpeller.semitoneDistance(nextChord.root, key);
        if (nd === 5) sharp = false;
      }
      if (chord.bass) {
        const bd = NoteSpeller.semitoneDistance(chord.bass, key);
        if (bd !== null && [3, 8, 10].includes(bd)) sharp = false;
      }

      const main = sharp ? '#IV' : 'bV';
      return [main, [sharp ? 'bV' : '#IV']];
    }

    // ── 那不勒斯降 II 级处理 ──
    if (dist === 1 && nextChord) {
      const nd = NoteSpeller.semitoneDistance(nextChord.root, key);
      if (nd === 0) return ['bII', []];
    }

    // ── 降 I 级处理（斜杠和弦）──
    if (dist === 11 && chord.bass) {
      const bd = NoteSpeller.semitoneDistance(chord.bass, key);
      if (bd === 1 && preferSharps !== true) {
        return ['bI', ['VII']];
      }
    }

    // ── 通用计算 ──
    const prefer = preferSharps ?? false;
    const [base] = this.calcDegreeBase(dist, prefer);
    const [alt] = this.calcDegreeBase(dist, !prefer);
    return [base, base !== alt ? [alt] : []];
  }

  /**
   * 计算基本级数（找到最近的大调音阶音）
   */
  private calcDegreeBase(
    dist: number,
    preferSharps?: boolean | null,
  ): [string, number] {
    const prefer = preferSharps ?? false;
    const ref = Romanizer.MAJOR_SCALE;
    let bestScore = 99;
    let bestIdx = 0;
    let bestAlt = 0;

    for (let i = 0; i < 7; i++) {
      const delta = ((dist - ref[i]) % 12 + 12) % 12;
      const alt = delta <= 6 ? delta : delta - 12;
      const score = Math.abs(alt);

      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
        bestAlt = alt;
      } else if (score === bestScore) {
        if (prefer && alt > bestAlt) {
          bestIdx = i;
          bestAlt = alt;
        } else if (!prefer && alt < bestAlt) {
          bestIdx = i;
          bestAlt = alt;
        }
      }
    }

    const acc =
      bestAlt === 0
        ? ''
        : bestAlt > 0
          ? '#'.repeat(bestAlt)
          : 'b'.repeat(-bestAlt);

    return [`${acc}${Romanizer.ROMAN_NUMERALS[bestIdx]}`, bestAlt];
  }

  /**
   * 格式化罗马数字：附加品质后缀
   */
  private formatRoman(degree: string, quality: string): string {
    const displayQ = quality.replace('maj7', 'M7').replace('ma7', 'M7');
    return `${degree}${displayQ}`;
  }

  /**
   * 根据拼写后的音名反推级数
   */
  private degreeFromSpelling(
    note: string,
    key: string,
  ): string | null {
    const np = NoteSpeller.parseNote(note);
    const kp = NoteSpeller.parseNote(key);
    if (!np || !kp) return null;

    const degreeIdx =
      ((NOTE_LETTERS.indexOf(np[0]) - NOTE_LETTERS.indexOf(kp[0])) % 7 + 7) %
      7;

    const NATURAL_PC: Record<string, number> = {
      C: 0,
      D: 2,
      E: 4,
      F: 5,
      G: 7,
      A: 9,
      B: 11,
    };
    const tonicPc =
      (((NATURAL_PC[kp[0]] ?? 0) + kp[1]) % 12 + 12) % 12;
    const expected =
      (tonicPc + Romanizer.MAJOR_SCALE[degreeIdx]) % 12;
    const actual = NoteSpeller.pitchClassOf(note);
    if (actual === null) return null;

    let diff = ((actual - expected) % 12 + 12) % 12;
    if (diff > 6) diff -= 12;

    const acc =
      diff === 0 ? '' : diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff);
    return `${acc}${Romanizer.ROMAN_NUMERALS[degreeIdx]}`;
  }

  /**
   * 根据级数名拼写对应的实际音名
   */
  private spellDegreeNote(degree: string, key: string): string | null {
    if (!degree) return null;

    // 解析变音前缀
    let acc = 0;
    let i = 0;
    while (i < degree.length && (degree[i] === '#' || degree[i] === 'b')) {
      acc += degree[i] === '#' ? 1 : -1;
      i++;
    }

    const body = degree.substring(i);
    const idx = Romanizer.ROMAN_NUMERALS.indexOf(body);
    if (idx === -1) return null;

    const kp = NoteSpeller.parseNote(key);
    if (!kp) return null;

    const NATURAL_PC: Record<string, number> = {
      C: 0,
      D: 2,
      E: 4,
      F: 5,
      G: 7,
      A: 9,
      B: 11,
    };
    const tonicPc =
      (((NATURAL_PC[kp[0]] ?? 0) + kp[1]) % 12 + 12) % 12;
    const targetPc =
      ((tonicPc + Romanizer.MAJOR_SCALE[idx] + acc) % 12 + 12) % 12;
    const targetLetter = NoteSpeller.shiftLetter(kp[0], idx);
    return NoteSpeller.spellPitchClass(targetLetter, targetPc);
  }

  // ================================================================
  // 辅助方法
  // ================================================================

  /**
   * 两个音名是否为同音异名
   */
  private samePitch(a: string, b: string): boolean {
    const pa = NoteSpeller.pitchClassOf(a);
    const pb = NoteSpeller.pitchClassOf(b);
    if (pa !== null && pb !== null) return pa === pb;
    const na = normalizeNotePc(a);
    const nb = normalizeNotePc(b);
    if (!na || !nb) return false;
    return SEMITONE_MAP[na] === SEMITONE_MAP[nb];
  }

  /**
   * 转位低音拼写
   */
  private spellBassInversion(
    chord: ParsedChord,
    rootFixed: string,
  ): string | null {
    if (!chord.bass) return null;
    const bassPc = NoteSpeller.pitchClassOf(chord.bass);
    if (bassPc === null) return null;

    // 尝试在和弦音中找到匹配的低音拼写
    const rp = NoteSpeller.parseNote(rootFixed || chord.root);
    if (!rp) return null;
    const [letter] = rp;

    const NATURAL_PC: Record<string, number> = {
      C: 0,
      D: 2,
      E: 4,
      F: 5,
      G: 7,
      A: 9,
      B: 11,
    };

    type DefItem = [number, number];
    let triad: DefItem[];
    const intervals = this.getIntervals(chord.quality);
    const dist = NoteSpeller.semitoneDistance(chord.bass, chord.root);

    if (dist !== null && dist !== 0 && intervals.has(dist)) {
      // 找到对应的和弦音步骤
      const stepMap: Record<number, number> = {
        3: 2,
        4: 2,
        5: 4,
        7: 4,
        8: 4,
        9: 6,
        10: 6,
        11: 6,
      };
      const step = stepMap[dist];

      if (step !== undefined) {
        const l = NoteSpeller.shiftLetter(letter, step);
        return NoteSpeller.spellPitchClass(l, bassPc);
      }
    }

    return null;
  }

  /**
   * 根据调式 key 尝试拼写低音
   */
  private spellBassByKey(bass: string, key: string): string | null {
    const bd = NoteSpeller.semitoneDistance(bass, key);
    if (bd === null) return null;

    if (Romanizer.MAJOR_SCALE.includes(bd) || [3, 8, 10].includes(bd)) {
      const [deg] = this.calcDegreeBase(bd, false);
      return this.spellDegreeNote(deg, key);
    }

    return null;
  }

  /**
   * 低音解决偏好：半音上升=升号，下降=降号
   */
  private bassPrefFromResolution(
    bass: string,
    nextChord?: ParsedChord,
  ): boolean | null {
    if (!nextChord) return null;
    const d = NoteSpeller.semitoneDistance(nextChord.root, bass);
    if (d === 1) return true;
    if (d === 11) return false;
    return null;
  }

  /**
   * 重写和弦符号（用修正后的音名替换原始音名）
   */
  private rewriteSymbol(
    symbol: string,
    oldRoot: string,
    newRoot?: string | null,
    oldBass?: string | null,
    newBass?: string | null,
  ): string {
    let s = symbol;
    if (newRoot && s.startsWith(oldRoot)) {
      s = newRoot + s.substring(oldRoot.length);
    }
    if (newBass && oldBass && s.includes('/')) {
      const slashIdx = s.indexOf('/');
      const head = s.substring(0, slashIdx);
      const tail = s.substring(slashIdx + 1);
      if (tail.startsWith(oldBass)) {
        s = head + '/' + newBass + tail.substring(oldBass.length);
      }
    }
    return s;
  }

  /**
   * 将绝对和弦符号转换为罗马数字标注
   */
  private romanizeAbsoluteSymbol(
    symbol: string,
    key: string,
  ): string | null {
    const parts = symbol.split('/');
    const rootPart = parts[0];
    const bassPart = parts.length > 1 ? parts[1] : undefined;

    const [rootNote, suffix] = this.splitNoteAndSuffix(rootPart);
    if (!rootNote) return symbol;

    const degree = this.degreeFromSpelling(rootNote, key);
    if (!degree) return symbol;

    const acc = degree[0] === '#' || degree[0] === 'b' ? degree[0] : '';
    const body = acc ? degree.substring(1) : degree;
    let roman = `${acc}${body}${suffix}`;

    if (bassPart) {
      const bd = this.degreeFromSpelling(bassPart, key);
      if (bd) roman += `/${bd}`;
    }

    return roman;
  }

  /**
   * 分离音名和后缀
   */
  private splitNoteAndSuffix(
    text: string,
  ): [string | null, string] {
    if (!text || !NOTE_LETTERS.includes(text[0].toUpperCase())) {
      return [null, text];
    }
    let i = 1;
    while (
      i < text.length &&
      (text[i] === '#' || text[i] === 'b')
    ) {
      i++;
    }
    return [text.substring(0, i), text.substring(i)];
  }

  /**
   * 异名同音简化（多重升降号 → 更简单的拼写）
   */
  private simplifySpelling(note: string): string {
    if (!note) return note;
    const accCount =
      (note.match(/#/g) || []).length - (note.match(/b/g) || []).length;
    if (Math.abs(accCount) < 2) return note;

    const pc = NoteSpeller.pitchClassOf(note);
    if (pc === null) return note;
    return NoteSpeller.nameOfPitchClass(pc, accCount > 0);
  }
}
