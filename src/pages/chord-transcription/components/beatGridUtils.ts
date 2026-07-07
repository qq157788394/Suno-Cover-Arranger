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
 * 把变长和弦段落映射到每一拍上。
 * 对每个 beat 时间戳 t，找到包含它的和弦段（start_time <= t < end_time）。
 * 最后一拍用 <= 包含结束边界（避免末尾拍丢失）。
 */
export function buildBeatCells(
  chords: TranscriptionChordSegment[],
  beatTimes: number[],
  romanSegments?: TranscriptionRomanSegment[],
): BeatCell[] {
  const cells: BeatCell[] = [];

  for (let i = 0; i < beatTimes.length; i++) {
    const t = beatTimes[i];
    const isLast = i === beatTimes.length - 1;

    let matched: TranscriptionChordSegment | undefined;
    for (const c of chords) {
      if (c.start_time <= t && (isLast ? t <= c.end_time : t < c.end_time)) {
        matched = c;
        break;
      }
    }

    let romanLabel = '';
    if (romanSegments) {
      for (const r of romanSegments) {
        if (r.start_time <= t && (isLast ? t <= r.end_time : t < r.end_time)) {
          romanLabel = r.roman;
          break;
        }
      }
    }

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
