import { resolveCellDisplay } from "./beatGridUtils";

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
