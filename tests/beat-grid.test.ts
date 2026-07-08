/**
 * BeatGrid 核心算法单元测试
 *
 * 覆盖：
 * - buildBeatCells：时间段 → 拍级映射
 * - splitIntoBars：按小节切分
 * - groupBarsIntoRows：按 4 小节/行分组
 * - findActiveBeatIndex：播放进度 → beat 索引
 */

import {
  BARS_PER_ROW,
  buildBeatCells,
  findActiveBeatIndex,
  groupBarsIntoRows,
  splitIntoBars,
} from '@/pages/chord-transcription/components/beatGridUtils';

// ── 测试数据 ─────────────────────────────────────────

const MOCK_CHORDS = [
  { start_time: 0, end_time: 2, chord: 'C:maj', chordLabel: 'C' },
  { start_time: 2, end_time: 4, chord: 'G:maj', chordLabel: 'G' },
  { start_time: 4, end_time: 6, chord: 'A:min', chordLabel: 'Am' },
  { start_time: 6, end_time: 8, chord: 'F:maj', chordLabel: 'F' },
];

// ── buildBeatCells ─────────────────────────────────────

describe('buildBeatCells', () => {
  it('应将和弦段映射到每拍上', () => {
    const cells = buildBeatCells(MOCK_CHORDS, [0, 1, 2, 3, 4, 5, 6, 7]);
    expect(cells).toHaveLength(8);
    // 0-1s → C (beat 0,1), 2-3s → G (beat 2,3), etc.
    expect(cells[0].chordLabel).toBe('C');
    expect(cells[1].chordLabel).toBe('C');
    expect(cells[2].chordLabel).toBe('G');
    expect(cells[3].chordLabel).toBe('G');
    expect(cells[4].chordLabel).toBe('Am');
    expect(cells[5].chordLabel).toBe('Am');
    expect(cells[6].chordLabel).toBe('F');
    expect(cells[7].chordLabel).toBe('F');
  });

  it('无匹配和弦时标记为空', () => {
    const cells = buildBeatCells([], [0, 1, 2]);
    expect(cells[0].isEmpty).toBe(true);
    expect(cells[0].chordLabel).toBe('N');
  });

  it('最后一拍用 <= 包含结束边界', () => {
    const chords = [
      { start_time: 0, end_time: 2, chord: 'C:maj', chordLabel: 'C' },
    ];
    const cells = buildBeatCells(chords, [0, 1, 2]);
    // beat at t=2 应仍匹配（最后一拍 <= end_time）
    expect(cells[2].chordLabel).toBe('C');
  });

  it('romanSegments 映射到对应拍', () => {
    const roman = [
      { start_time: 0, end_time: 4, roman: 'I' },
      { start_time: 4, end_time: 8, roman: 'V' },
    ];
    const cells = buildBeatCells(MOCK_CHORDS, [0, 1, 2, 3, 4, 5, 6, 7], roman);
    expect(cells[0].romanLabel).toBe('I');
    expect(cells[4].romanLabel).toBe('V');
  });
});

// ── splitIntoBars ──────────────────────────────────────

describe('splitIntoBars', () => {
  it('按 beatsPerBar 分组为 BarRow', () => {
    const cells = Array.from({ length: 16 }, (_, i) => ({
      chordLabel: ['C', 'G', 'Am', 'F'][i % 4],
      romanLabel: '',
      isEmpty: false,
    }));
    const bars = splitIntoBars(cells, 4);
    expect(bars).toHaveLength(4);
    expect(bars[0].barNumber).toBe(1);
    expect(bars[0].cells).toHaveLength(4);
    expect(bars[3].barNumber).toBe(4);
  });

  it('末尾不足一小节时填充空格', () => {
    const cells = [
      { chordLabel: 'C', romanLabel: '', isEmpty: false },
      { chordLabel: 'G', romanLabel: '', isEmpty: false },
    ];
    const bars = splitIntoBars(cells, 4);
    expect(bars).toHaveLength(1);
    expect(bars[0].cells).toHaveLength(4);
    expect(bars[0].cells[2].isEmpty).toBe(true);
    expect(bars[0].cells[3].isEmpty).toBe(true);
  });

  it('每个格独立不合并', () => {
    const cells = Array.from({ length: 8 }, () => ({
      chordLabel: 'C',
      romanLabel: '',
      isEmpty: false,
    }));
    const bars = splitIntoBars(cells, 4);
    // 同和弦 C 出现在所有 8 个格中，不合并
    expect(bars[0].cells.length).toBe(4);
    expect(bars[1].cells.length).toBe(4);
    expect(bars[0].cells.every((c) => c.label === 'C')).toBe(true);
    expect(bars[1].cells.every((c) => c.label === 'C')).toBe(true);
  });
});

// ── groupBarsIntoRows ───────────────────────────────────

describe('groupBarsIntoRows', () => {
  it('按 BARS_PER_ROW 分组', () => {
    const bars = Array.from({ length: 10 }, (_, i) => ({
      barNumber: i + 1,
      cells: [],
    }));
    const rows = groupBarsIntoRows(bars, BARS_PER_ROW);
    expect(rows).toHaveLength(3); // ceil(10/4)=3
    expect(rows[0].barRows).toHaveLength(4);
    expect(rows[1].barRows).toHaveLength(4);
    expect(rows[2].barRows).toHaveLength(2); // 最后一个不满
  });
});

// ── findActiveBeatIndex ────────────────────────────────

describe('findActiveBeatIndex', () => {
  const beats = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]; // 7 拍

  it('currentTime=0 返回第一拍', () => {
    expect(findActiveBeatIndex(0, beats)).toBe(0);
  });

  it('在两拍之间返回前一拍', () => {
    expect(findActiveBeatIndex(0.75, beats)).toBe(1); // 在 beat[1]=0.5 和 beat[2]=1.0 之间
  });

  it('精确命中某拍返回该拍索引', () => {
    expect(findActiveBeatIndex(1.5, beats)).toBe(3);
  });

  it('超过最后时间返回末尾索引', () => {
    expect(findActiveBeatIndex(99, beats)).toBe(beats.length - 1);
  });

  it('空 beats 返回 -1', () => {
    expect(findActiveBeatIndex(1, [])).toBe(-1);
  });
});

// ── 网格全局拍索引不变量（高亮跟随播放的前提） ──────────
//
// 组件渲染时用 exactGlobalIdx = (barNumber-1)*bpb + ci 计算每格的全局拍序，
// 再与 findActiveBeatIndex(currentTime) 的结果比较来高亮。
// 该不变量要求：逐行遍历 rows→bars→cells 时，exactGlobalIdx
// 必须严格递增且等于 0,1,2,...,N-1（与拍级序列顺序一致）。
// 一旦分组/编号逻辑错位，高亮就会偏移到错误的拍，此测试立即红。

describe('网格全局拍索引不变量', () => {
  const bpb = 4;

  const buildGrid = (totalBeats: number) => {
    const cells = Array.from({ length: totalBeats }, (_, i) => ({
      chordLabel: `C${i}`,
      romanLabel: '',
      isEmpty: false,
    }));
    const bars = splitIntoBars(cells, bpb);
    return groupBarsIntoRows(bars, BARS_PER_ROW);
  };

  it('恰好一行（4 小节）时索引连续 0..15', () => {
    const rows = buildGrid(16);
    const seen: number[] = [];
    rows.forEach((row) => {
      row.barRows.forEach((bar) => {
        bar.cells.forEach((_, ci) => {
          seen.push((bar.barNumber - 1) * bpb + ci);
        });
      });
    });
    expect(seen).toEqual(Array.from({ length: 16 }, (_, i) => i));
  });

  it('跨行（10 小节）时索引连续且不分页断号', () => {
    const rows = buildGrid(40); // 10 小节
    const seen: number[] = [];
    rows.forEach((row) => {
      row.barRows.forEach((bar) => {
        bar.cells.forEach((_, ci) => {
          seen.push((bar.barNumber - 1) * bpb + ci);
        });
      });
    });
    // 第 3 行只有 2 小节（8 格），但仍应接在 31 之后为 32..39
    expect(seen).toEqual(Array.from({ length: 40 }, (_, i) => i));
  });

  it('每小节内拍序从 0 开始递增', () => {
    const rows = buildGrid(16);
    const firstRow = rows[0];
    const inBarIdx = firstRow.barRows.map((bar) =>
      bar.cells
        .map((_, ci) => (bar.barNumber - 1) * bpb + ci)
        .map((g) => g % bpb),
    );
    // 第一个小节内应为 [0,1,2,3]
    expect(inBarIdx[0]).toEqual([0, 1, 2, 3]);
  });
});

// ── buildBeatCells 二分查找等价性（审查 #19） ─────────────
// 二分版本须与朴素的「线性逐拍扫描」结果完全一致，只是复杂度从 O(beats×chords) 降为 O(beats×log chords)。

describe('buildBeatCells 二分查找等价性', () => {
  // 朴素线性参考实现（与修复前行为一致）
  const linearBuild = (
    chords: { start_time: number; end_time: number; chordLabel: string }[],
    beatTimes: number[],
  ): string[] =>
    beatTimes.map((t, i) => {
      const isLast = i === beatTimes.length - 1;
      const m = chords.find(
        (c) => c.start_time <= t && (isLast ? t <= c.end_time : t < c.end_time),
      );
      return m ? m.chordLabel : 'N';
    });

  it('大量非重叠和弦段与线性参考完全一致', () => {
    const N = 500;
    const chords = Array.from({ length: N }, (_, i) => ({
      start_time: i * 2,
      end_time: i * 2 + 2,
      chord: `C${i % 7}`,
      chordLabel: `C${i % 7}`,
    }));
    const beats = Array.from({ length: N * 2 }, (_, i) => i * 1); // 0..999 每 1s
    const got = buildBeatCells(chords, beats).map((c) => c.chordLabel);
    const ref = linearBuild(chords, beats);
    expect(got).toEqual(ref);
  });

  it('乱序输入（防御性排序后）仍与排序后的线性参考一致', () => {
    const chords = [
      { start_time: 6, end_time: 8, chord: 'F', chordLabel: 'F' },
      { start_time: 0, end_time: 2, chord: 'C', chordLabel: 'C' },
      { start_time: 4, end_time: 6, chord: 'A', chordLabel: 'A' },
      { start_time: 2, end_time: 4, chord: 'G', chordLabel: 'G' },
    ];
    const beats = [0, 1, 2, 3, 4, 5, 6, 7];
    const got = buildBeatCells(chords, beats).map((c) => c.chordLabel);
    const ref = linearBuild(
      [...chords].sort((a, b) => a.start_time - b.start_time),
      beats,
    );
    expect(got).toEqual(ref);
  });
});
