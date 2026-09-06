/**
 * beatGridUtils — 拍级和弦网格纯函数工具
 *
 * 从 BeatGrid 组件中抽离的纯函数：
 * - buildBeatCells：变长和弦段 → 拍级映射
 * - splitIntoBars：按「强拍(position==1)」切分小节（支持弱起与变拍）
 * - groupBarsIntoRows：按目标拍数/行分组（恒定行宽，适配 2/4/3/4/4/4/6/8）
 *
 * 设计原则：
 * - 每个拍级格子独立显示，不做 colSpan 合并（弹唱者需要看到"第几拍换和弦"）
 * - 小节长度由逐拍 position 决定，天然支持弱起与中部变拍
 * - 可独立单元测试
 */

import type {
  TranscriptionChordSegment,
  TranscriptionRomanSegment,
} from "@/shared/types/types";

// ── 常量 ───────────────────────────────────────────────

/** 每行目标拍数（恒定行宽，按拍号自适应小节数） */
const TARGET_BEATS_PER_ROW = 16;

// ── 展示模式 ───────────────────────────────────────────

/** 和弦网格展示模式：和弦名称 / 功能级数（与网页版一致） */
export type ChordDisplayMode = "chord" | "degree";

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
  if (isEmpty) return "";
  if (displayMode === "degree") return subLabel || label;
  return label;
}

/**
 * 由「小节内最大拍序」推导拍号标签。
 * - 6 → "6/8"（madmom 把 6/8 当 6 拍/小节建模，无法区分 6/8 与 6/4，按 6/8 标注）
 * - 2/3/4 → "2/4"/"3/4"/"4/4"
 * - 其他 → "${n}/4"
 * maxPos < 2 视为无效，回退 "4/4"。
 */
export function buildMeterLabel(maxPos: number): string {
  if (!maxPos || maxPos < 2) return "4/4";
  if (maxPos === 6) return "6/8";
  return `${maxPos}/4`;
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
  /** 全局拍索引（用于播放高亮，与 rhythm.beats 对齐） */
  beatIndex: number;
  /** 该拍在小节内的序号（1 起，用于表头） */
  beatPosition: number;
}

/** 一行（一个小节）的原始格子数据 */
export interface BarRow {
  barNumber: number;
  cells: GridCell[];
}

/** 多个小节组成的"大行"（页面上的一行 = 约 TARGET_BEATS_PER_ROW 拍） */
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
    const romanLabel = romanSeg ? romanSeg.roman : "";

    cells.push({
      chordLabel: matched?.chordLabel ?? "N",
      romanLabel,
      isEmpty:
        !matched || matched.chordLabel === "N" || matched.chordLabel === "",
    });
  }

  return cells;
}

// ── 核心：按强拍切分为小节（支持弱起/变拍） ────────────

/**
 * 把一维 BeatCell 数组按逐拍 position 切分为 BarRow[]。
 * - 在 position === 1（且非首拍）处开新小节 → 强拍对齐。
 * - 首拍 position 若不为 1（弱起），首小节自然为短小节。
 * - 中部变拍（position 序列长度变化）天然支持，小节长度随之变化。
 * - 每个 GridCell 携带 beatIndex（全局）与 beatPosition（小节内）。
 *
 * beatPositions 应与 cells 等长；缺失时按 4/4 兜底（position = (i%4)+1）。
 */
export function splitIntoBars(
  cells: BeatCell[],
  beatPositions: number[],
): BarRow[] {
  const bars: BarRow[] = [];
  let current: GridCell[] = [];
  let barNumber = 0;

  for (let i = 0; i < cells.length; i++) {
    const pos = beatPositions[i] ?? (i % 4) + 1;
    // 遇到新的强拍：收尾当前小节，开新小节（首拍不切，避免空小节）
    if (i > 0 && pos === 1) {
      bars.push({ barNumber: ++barNumber, cells: current });
      current = [];
    }
    const c = cells[i];
    current.push({
      label: c.chordLabel,
      subLabel: c.romanLabel,
      isEmpty: c.isEmpty,
      beatIndex: i,
      beatPosition: pos,
    });
  }
  if (current.length > 0) {
    bars.push({ barNumber: ++barNumber, cells: current });
  }
  return bars;
}

// ── 核心：按目标拍数/行分组为大行（恒定行宽） ─────────

/**
 * 将 BarRow[] 按每行目标拍数分组为 GridRow[]。
 * 累加当前行的拍数，超过 targetBeatsPerRow 则换行。
 * - 6/8（6 拍/小节）→ 2 小节/行（12 拍）
 * - 4/4（4 拍/小节）→ 4 小节/行（16 拍）
 * - 3/4（3 拍/小节）→ 5 小节/行（15 拍）
 * - 2/4（2 拍/小节）→ 8 小节/行（16 拍）
 * 行宽恒定，避免 6/8 撑爆或 2/4 过空。
 */
export function groupBarsIntoRows(
  bars: BarRow[],
  targetBeatsPerRow: number = TARGET_BEATS_PER_ROW,
): GridRow[] {
  const rows: GridRow[] = [];
  let current: BarRow[] = [];
  let currentBeats = 0;

  for (const bar of bars) {
    const barBeats = bar.cells.length;
    if (current.length > 0 && currentBeats + barBeats > targetBeatsPerRow) {
      rows.push({ barRows: current });
      current = [];
      currentBeats = 0;
    }
    current.push(bar);
    currentBeats += barBeats;
  }
  if (current.length > 0) rows.push({ barRows: current });
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
