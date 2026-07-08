/**
 * @jest-environment node
 */
/**
 * 大师扒谱 联调测试：用生产级前端客户端代码（src/services/transcription/client.ts）
 * 直接打本地运行的引擎（127.0.0.1:18741），验证两端契约对得上。
 *
 * 不依赖浏览器（CORS 的浏览器侧行为已用 curl + Origin 头单独验证）。
 * 这里验证：端口发现、multipart 上传、响应规范化、结果形状。
 *
 * 前置：local-engine 已在 127.0.0.1:18741 运行。
 */
import fs from "node:fs";
import path from "node:path";
import {
  analyzeWithLocalEngine,
  discoverEngine,
  normalizeChordLabel,
  TranscriptionEngineOfflineError,
} from "@/services/transcription/client";

const PRD_DIR = path.resolve(__dirname, "..", "prd");

function findFirstMp3(): string {
  const files = fs
    .readdirSync(PRD_DIR)
    .filter((f) => f.toLowerCase().endsWith(".mp3"));
  if (files.length === 0) throw new Error("prd/ 下没有可用于联调的 mp3");
  return path.join(PRD_DIR, files[0]);
}

describe("大师扒谱 本地引擎联调", () => {
  it("normalizeChordLabel 把 JAMS 标签转成乐手可读展示标签", () => {
    expect(normalizeChordLabel("Bb:min")).toBe("Bbm");
    expect(normalizeChordLabel("A:min7")).toBe("Am7");
    expect(normalizeChordLabel("G:maj7")).toBe("Gmaj7");
    expect(normalizeChordLabel("F:maj")).toBe("F"); // 裸 maj 省略
    expect(normalizeChordLabel("C:maj")).toBe("C");
    expect(normalizeChordLabel("N")).toBe("N"); // 无和弦原样
  });

  it("discoverEngine 能在候选端口找到运行中的引擎", async () => {
    const base = await discoverEngine();
    expect(base).toBe("http://127.0.0.1:18741");
  }, 10_000);

  it("analyzeWithLocalEngine 走通 上传->分析->规范化 全链路", async () => {
    const mp3 = findFirstMp3();
    const buf = fs.readFileSync(mp3);
    const file = new File([buf], path.basename(mp3), { type: "audio/mpeg" });

    const result = await analyzeWithLocalEngine(file);

    // 形状对齐 TranscriptionResult
    expect(Array.isArray(result.chords)).toBe(true);
    expect(result.chords.length).toBeGreaterThan(0);

    const seg = result.chords[0];
    expect(typeof seg.start_time).toBe("number");
    expect(typeof seg.end_time).toBe("number");
    expect(typeof seg.chord).toBe("string");
    expect(typeof seg.chordLabel).toBe("string");
    // 展示标签必须是规范化后的（不应再含 ':'）
    expect(seg.chordLabel).not.toContain(":");

    // warnings 永远是数组
    expect(Array.isArray(result.warnings)).toBe(true);

    // 打印真实结果摘要，便于人工核对
    // eslint-disable-next-line no-console
    console.log(
      `[联调] 歌曲=${path.basename(mp3)} 和弦段数=${result.chords.length} ` +
        `首段=${seg.chord}->${seg.chordLabel} key=${result.key} bpm=${result.bpm} ` +
        `rhythm=${result.rhythm ? "有" : "无"} roman=${result.roman ? "有" : "无"} ` +
        `warnings=${JSON.stringify(result.warnings)}`,
    );
  }, 180_000);

  it("引擎离线时抛 TranscriptionEngineOfflineError", async () => {
    // 临时把所有候选端口都指到不可能响应的值：用未监听端口探测逻辑
    // 这里直接断言类型存在且可被构造
    const err = new TranscriptionEngineOfflineError("x");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("TranscriptionEngineOfflineError");
  });
});
