/**
 * beatGridUtils — 拍级和弦网格纯函数工具
 *
 * 从 BeatGrid 组件中抽离的纯函数：
 * - buildBeatCells：变长和弦段 → 拍级映射
 * - splitIntoBars：按小节切分（每个 BarRow = 一小节的格子）
 * - groupBarsIntoRows：把多个 BarRow 按 BARS_PER_ROW 分组为大行
 *
 * 设计原则：
 * - 每个拍级格子独立显示，不做 colSpan 合并（弹唱者需要看到"第几拍换和弦"）
 * - 可独立单元测试
 */

import type {
  TranscriptionChordSegment,
  TranscriptionRomanSegment,
} from '@/shared/types/types';

// ── 常量 ───────────────────────────────────────────────

/** 每行显示的小节数 */
export const BARS_PER_ROW = 4;

// ── 展示模式 ───────────────────────────────────────────

/** 和弦网格展示模式：和弦名称 / 功能级数（与网页版一致） */
export type ChordDisplayMode = 'chord' | 'degree';

/**
 * 根据展示模式解析单元格主显示文本。
 * - chord 模式：显示和弦名 (label)
 * - degree 模式：显示功能级数 (subLabel)；若 subLabel 为空则回退和弦名
 * - 空格 (isEmpty)：返回空串
 *
 * 行为与网页版 ChordGrid 对齐（级数缺省回退和弦名），便于两版体验一致。
 */
export function resolveCellDisplay(
  label: string,
  subLabel: string,
  isEmpty: boolean,
  displayMode: ChordDisplayMode,
): string {
  if (isEmpty) return '';
  if (displayMode === 'degree') return subLabel || label;
  return label;
}

// ── 类型 ───────────────────────────────────────────────

/** 单个拍级格子的原始数据 */
export interface BeatCell {
  chordLabel: string;
  romanLabel: string;
  isEmpty: boolean;
}

/** 一个拍级格子（渲染用，无合并）*/
export interface GridCell {
  label: string;
  subLabel: string;
  isEmpty: boolean;
}

/** 一行（一个小节）的原始格子数据 */
export interface BarRow {
  barNumber: number;
  cells: GridCell[];
}

/** 多个小节组成的"大行"（页面上的一行 = BARS_PER_ROW 个小节） */
export interface GridRow {
  barRows: BarRow[];
}

// ── 核心：时间段 → 拍级映射 ────────────────────────────

/**
 * 在按 start_time 排序、互不重叠的段落中，二分查找包含时间 t 的段
 * （start_time <= t < end_time；最后一拍用 <= 包含结束边界，避免末尾拍丢失）。
 * 返回 undefined 表示 t 落在任何段之外（无和弦）。
 *
 * 复杂度 O(log n)，避免对每拍线性扫描全部段落导致的 O(beats×chords)（审查 #19）。
 */
function findSegmentAtTime<T extends { start_time: number; end_time: number }>(
  segments: T[],
  t: number,
  isLast: boolean,
): T | undefined {
  if (segments.length === 0) return undefined;
  let lo = 0;
  let hi = segments.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const s = segments[mid];
    if (t < s.start_time) {
      hi = mid - 1;
    } else if (t >= s.end_time) {
      lo = mid + 1;
    } else {
      return s;
    }
  }
  // 二分未命中（落在段间隙或恰好压在结束边界）：线性兜底，优先取 start_time <= t 且含 t 的段。
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (s.start_time <= t && (isLast ? t <= s.end_time : t < s.end_time)) {
      return s;
    }
  }
  return undefined;
}

/**
 * 把变长和弦段落映射到每一拍上。
 * 对每个 beat 时间戳 t，找到包含它的和弦段（start_time <= t < end_time）。
 * 最后一拍用 <= 包含结束边界（避免末尾拍丢失）。
 */
export function buildBeatCells(
  chords: TranscriptionChordSegment[],
  beatTimes: number[],
  romanSegments?: TranscriptionRomanSegment[],
): BeatCell[] {
  // 防御性排序（按 start_time 升序），保证二分查找前提；原数组不被修改。
  const sortedChords = [...chords].sort((a, b) => a.start_time - b.start_time);
  const sortedRoman = romanSegments
    ? [...romanSegments].sort((a, b) => a.start_time - b.start_time)
    : undefined;

  const cells: BeatCell[] = [];
  for (let i = 0; i < beatTimes.length; i++) {
    const t = beatTimes[i];
    const isLast = i === beatTimes.length - 1;

    const matched = findSegmentAtTime(sortedChords, t, isLast);
    const romanSeg = sortedRoman
      ? findSegmentAtTime(sortedRoman, t, isLast)
      : undefined;
    const romanLabel = romanSeg ? romanSeg.roman : '';

    cells.push({
      chordLabel: matched?.chordLabel ?? 'N',
      romanLabel,
      isEmpty:
        !matched || matched.chordLabel === 'N' || matched.chordLabel === '',
    });
  }

  return cells;
}

// ── 核心：拆分为小节行（每格独立，不合并） ─────────────

/**
 * 把一维的 BeatCell 数组按 beatsPerBar 切成 BarRow[]。
 * 每个 BarRow.cells 长度 = beatsPerBar（通常 4），每格独立不合并。
 */
export function splitIntoBars(
  cells: BeatCell[],
  beatsPerBar: number,
): BarRow[] {
  const bars: BarRow[] = [];
  for (let i = 0; i < cells.length; i += beatsPerBar) {
    const chunk = cells.slice(i, i + beatsPerBar);
    // 填充末尾不足一拍的空格
    while (chunk.length < beatsPerBar) {
      chunk.push({ chordLabel: 'N', romanLabel: '', isEmpty: true });
    }
    bars.push({
      barNumber: Math.floor(i / beatsPerBar) + 1,
      cells: chunk.map((c) => ({
        label: c.chordLabel,
        subLabel: c.romanLabel,
        isEmpty: c.isEmpty,
      })),
    });
  }
  return bars;
}

// ── 核心：按 BARS_PER_ROW 分组为大行 ───────────────────

/**
 * 将 BarRow[] 按每行 N 个小节分组为 GridRow[]。
 * 用于页面渲染时一行显示多小节。
 */
export function groupBarsIntoRows(
  bars: BarRow[],
  barsPerRow: number = BARS_PER_ROW,
): GridRow[] {
  const rows: GridRow[] = [];
  for (let i = 0; i < bars.length; i += barsPerRow) {
    rows.push({ barRows: bars.slice(i, i + barsPerRow) });
  }
  return rows;
}

// ── 辅助：根据当前播放时间找到活跃 beat 索引 ──────────

/**
 * 根据 audio currentTime 在 rhythm.beats 时间戳数组中二分查找当前所在 beat 索引。
 * 返回值范围 [0, beats.length)，超出返回 -1。
 */
export function findActiveBeatIndex(
  currentTime: number,
  beatTimes: number[],
): number {
  if (!beatTimes || beatTimes.length === 0) return -1;
  if (currentTime <= 0) return 0;
  if (currentTime >= beatTimes[beatTimes.length - 1])
    return beatTimes.length - 1;

  // 二分查找：找最大的 beatTime <= currentTime
  let lo = 0;
  let hi = beatTimes.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (beatTimes[mid] <= currentTime) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}
