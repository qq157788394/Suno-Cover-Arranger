import { formatKeyLabel, transposeSemitones } from "../src/shared/utils/note";

describe("transposeSemitones", () => {
  it("小调上移小三度得关系大调主音", () => {
    expect(transposeSemitones("A", 3)).toBe("C");
    expect(transposeSemitones("E", 3)).toBe("G");
    expect(transposeSemitones("B", 3)).toBe("D");
    expect(transposeSemitones("F#", 3)).toBe("A");
  });
});

describe("formatKeyLabel", () => {
  it("小调显示关系大调双标签", () => {
    expect(formatKeyLabel("A minor")).toBe("A minor / C major");
    expect(formatKeyLabel("E minor")).toBe("E minor / G major");
    expect(formatKeyLabel("F# minor")).toBe("F# minor / A major");
  });

  it("大调原样显示", () => {
    expect(formatKeyLabel("C major")).toBe("C major");
    expect(formatKeyLabel("G major")).toBe("G major");
  });

  it("null / 空 / 非标准返回空串或原样", () => {
    expect(formatKeyLabel(null)).toBe("");
    expect(formatKeyLabel(undefined)).toBe("");
    expect(formatKeyLabel("")).toBe("");
    expect(formatKeyLabel("weird key")).toBe("weird key");
  });
});
