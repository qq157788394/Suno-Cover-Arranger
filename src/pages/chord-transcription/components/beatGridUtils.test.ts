import {
  type BeatCell,
  buildMeterLabel,
  groupBarsIntoRows,
  resolveCellDisplay,
  splitIntoBars,
} from "./beatGridUtils";

// ── 测试辅助 ───────────────────────────────────────────

/** 生成 n 个 BeatCell,chordLabel 依次 C1..Cn */
function mkCells(n: number): BeatCell[] {
  return Array.from({ length: n }, (_, i) => ({
    chordLabel: `C${i + 1}`,
    romanLabel: `R${i + 1}`,
    isEmpty: false,
  }));
}

describe("resolveCellDisplay", () => {
  it("chord 模式返回和弦名 (label)", () => {
    expect(resolveCellDisplay("Cmaj7", "IM7", false, "chord")).toBe("Cmaj7");
  });

  it("degree 模式返回功能级数 (subLabel)", () => {
    expect(resolveCellDisplay("Cmaj7", "IM7", false, "degree")).toBe("IM7");
  });

  it("degree 模式 subLabel 为空时回退和弦名", () => {
    expect(resolveCellDisplay("Dm7", "", false, "degree")).toBe("Dm7");
  });

  it("isEmpty 时返回空串（chord 模式）", () => {
    expect(resolveCellDisplay("N", "", true, "chord")).toBe("");
  });

  it("isEmpty 时返回空串（degree 模式）", () => {
    expect(resolveCellDisplay("N", "IM7", true, "degree")).toBe("");
  });

  it("非空的 chord 名为空字符串也按回退处理（degree 模式）", () => {
    expect(resolveCellDisplay("G7", "", false, "degree")).toBe("G7");
  });
});

describe("buildMeterLabel", () => {
  it("2 → 2/4", () => expect(buildMeterLabel(2)).toBe("2/4"));
  it("3 → 3/4", () => expect(buildMeterLabel(3)).toBe("3/4"));
  it("4 → 4/4", () => expect(buildMeterLabel(4)).toBe("4/4"));
  it("6 → 6/8（复拍子按 6/8 标注）", () =>
    expect(buildMeterLabel(6)).toBe("6/8"));
  it("5 → 5/4（非常规拍号回退 /4）", () =>
    expect(buildMeterLabel(5)).toBe("5/4"));
});

describe("splitIntoBars（positions 驱动，支持弱起/变拍）", () => {
  it("正常 4/4：8 拍 → 2 个长度 4 的小节", () => {
    const cells = mkCells(8);
    const positions = [1, 2, 3, 4, 1, 2, 3, 4];
    const bars = splitIntoBars(cells, positions);
    expect(bars).toHaveLength(2);
    expect(bars[0].cells).toHaveLength(4);
    expect(bars[1].cells).toHaveLength(4);
    // 携带全局 beatIndex 与小节内 beatPosition
    expect(bars[0].cells.map((c) => c.beatIndex)).toEqual([0, 1, 2, 3]);
    expect(bars[0].cells.map((c) => c.beatPosition)).toEqual([1, 2, 3, 4]);
    expect(bars[1].cells.map((c) => c.beatIndex)).toEqual([4, 5, 6, 7]);
    expect(bars[1].cells.map((c) => c.beatPosition)).toEqual([1, 2, 3, 4]);
  });

  it("弱起：首小节为 2 拍（position 3,4），随后 4 拍", () => {
    const cells = mkCells(6);
    const positions = [3, 4, 1, 2, 3, 4];
    const bars = splitIntoBars(cells, positions);
    expect(bars).toHaveLength(2);
    expect(bars[0].cells).toHaveLength(2); // 弱起小节短
    expect(bars[1].cells).toHaveLength(4);
    expect(bars[0].cells.map((c) => c.beatPosition)).toEqual([3, 4]);
    expect(bars[1].cells.map((c) => c.beatPosition)).toEqual([1, 2, 3, 4]);
  });

  it("混合拍号：4/4 + 3/4 + 4/4 → 小节长度 [4,3,4]", () => {
    const cells = mkCells(11);
    const positions = [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 4];
    const bars = splitIntoBars(cells, positions);
    expect(bars).toHaveLength(3);
    expect(bars.map((b) => b.cells.length)).toEqual([4, 3, 4]);
  });

  it("label 透传 chordLabel", () => {
    const cells = mkCells(4);
    const bars = splitIntoBars(cells, [1, 2, 3, 4]);
    expect(bars[0].cells[0].label).toBe("C1");
    expect(bars[0].cells[0].subLabel).toBe("R1");
  });
});

describe("groupBarsIntoRows（目标拍数/行，恒定行宽）", () => {
  /** 构造 count 个长度为 len 的小节 */
  function mkBars(count: number, len: number) {
    return Array.from({ length: count }, (_, bi) => ({
      barNumber: bi + 1,
      cells: Array.from({ length: len }, (_, ci) => ({
        label: `b${bi}c${ci}`,
        subLabel: "",
        isEmpty: false,
        beatIndex: bi * len + ci,
        beatPosition: ci + 1,
      })),
    }));
  }

  it("4/4（每节 4 拍）：8 节 → 2 行 × 4 节（16 拍/行）", () => {
    const rows = groupBarsIntoRows(mkBars(8, 4));
    expect(rows).toHaveLength(2);
    expect(rows[0].barRows).toHaveLength(4);
    expect(rows[1].barRows).toHaveLength(4);
  });

  it("6/8（每节 6 拍）：4 节 → 2 行 × 2 节（12 拍/行）", () => {
    const rows = groupBarsIntoRows(mkBars(4, 6));
    expect(rows).toHaveLength(2);
    expect(rows[0].barRows).toHaveLength(2);
    expect(rows[1].barRows).toHaveLength(2);
  });

  it("单节拍数超过目标仍自成一行", () => {
    const rows = groupBarsIntoRows(mkBars(1, 20));
    expect(rows).toHaveLength(1);
    expect(rows[0].barRows).toHaveLength(1);
  });
});
