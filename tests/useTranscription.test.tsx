/**
 * @jest-environment jsdom
 *
 * useTranscription 单元测试（审查 #1 / #8 / gap A）
 *
 * 通过 mock 客户端 analyzeWithLocalEngine 控制响应顺序，验证：
 * - 异步竞态守卫：后到的更早响应被丢弃，最新结果生效
 * - reset() 使在途请求失效（AbortController + seq）
 * - [ENGINE_OFFLINE] 标记分流到 ENGINE_OFFLINE 面板状态
 * - 其余错误（引擎 HTTP 错误）分流入 ERROR
 */

import { invoke } from "@tauri-apps/api/core";
import { act, renderHook } from "@testing-library/react";
import { useTranscription } from "@/hooks/useTranscription";
import {
  analyzeWithLocalEngine,
  ENGINE_OFFLINE_MARKER,
} from "@/services/transcription/client";

jest.mock("@tauri-apps/api/core", () => ({
  invoke: jest.fn(),
}));

jest.mock("@/services/transcription/client", () => {
  const actual = jest.requireActual("@/services/transcription/client");
  return {
    ...actual,
    analyzeWithLocalEngine: jest.fn(),
  };
});

// jsdom 未实现 Blob.arrayBuffer；生产环境浏览器原生支持。
// 为让客户端 invoke 路径（file.arrayBuffer()）在测试中走通，注入最小 polyfill。
Blob.prototype.arrayBuffer = function (this: Blob) {
  const view = new Uint8Array(this.size || 0);
  return Promise.resolve(view.buffer);
};

const mockAnalyze = analyzeWithLocalEngine as jest.Mock;

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function makeFile(name = "a.mp3") {
  return new File([new Uint8Array(8)], name, { type: "audio/mpeg" });
}

function okResult(fileName: string) {
  return {
    chords: [],
    key: "C",
    bpm: 1,
    rhythm: null,
    roman: null,
    warnings: [],
    fileName,
  };
}

describe("useTranscription 竞态守卫（#1）", () => {
  it("后到但更早的响应被丢弃，最新结果生效", async () => {
    const d1 = deferred<any>();
    const d2 = deferred<any>();
    mockAnalyze.mockImplementationOnce(() => d1.promise);
    mockAnalyze.mockImplementationOnce(() => d2.promise);

    const { result } = renderHook(() => useTranscription());
    await act(async () => {
      result.current.handleFileSelect(makeFile("a.mp3"));
    });
    await act(async () => {
      result.current.handleFileSelect(makeFile("b.mp3"));
    });

    // 先解决「后一次」请求（b），再解决「前一次」请求（a）
    await act(async () => {
      d2.resolve(okResult("b.mp3"));
    });
    await act(async () => {
      d1.resolve(okResult("a.mp3"));
    });

    // 仅最新结果（b）应生效，旧的（a）被 seq 守卫丢弃
    expect(result.current.result?.fileName).toBe("b.mp3");
    expect(result.current.status).toBe("READY");
  });

  it("reset 使在途请求失效，其响应被丢弃", async () => {
    const d = deferred<any>();
    mockAnalyze.mockImplementationOnce(() => d.promise);
    const { result } = renderHook(() => useTranscription());
    await act(async () => {
      result.current.handleFileSelect(makeFile("a.mp3"));
    });
    await act(async () => {
      result.current.reset();
    });
    await act(async () => {
      d.resolve(okResult("a.mp3"));
    });
    expect(result.current.status).toBe("IDLE");
    expect(result.current.result).toBeNull();
  });
});

describe("useTranscription 错误分流（#8）", () => {
  it("[ENGINE_OFFLINE] 标记分流到 ENGINE_OFFLINE（客户端路径）", async () => {
    // 客户端路径（带 baseUrl）经 Tauri invoke 调用；引擎连不上时 Rust 返回带标记的错误。
    (invoke as jest.Mock).mockRejectedValueOnce(
      new Error(`${ENGINE_OFFLINE_MARKER}: 无法连接`),
    );
    const { result } = renderHook(() => useTranscription());
    await act(async () => {
      result.current.handleFileSelect(
        makeFile("a.mp3"),
        "http://127.0.0.1:18741",
      );
    });
    expect(result.current.status).toBe("ENGINE_OFFLINE");
    expect(result.current.error).toContain(ENGINE_OFFLINE_MARKER);
  });

  it("引擎返回错误（非离线）分流入 ERROR", async () => {
    mockAnalyze.mockImplementationOnce(() =>
      Promise.reject(new Error("本地引擎返回错误 (500): boom")),
    );
    const { result } = renderHook(() => useTranscription());
    await act(async () => {
      result.current.handleFileSelect(makeFile("a.mp3"));
    });
    expect(result.current.status).toBe("ERROR");
  });
});

describe("useTranscription 客户端 invoke 路径（ADR-6：去 base64 中转）", () => {
  it("客户端模式经 invoke 以 Uint8Array 传原始字节并正确规整结果", async () => {
    const payload = JSON.stringify(okResult("song.wav"));
    (invoke as jest.Mock).mockResolvedValueOnce(payload);

    const { result } = renderHook(() => useTranscription());
    await act(async () => {
      result.current.handleFileSelect(
        makeFile("song.wav"),
        "http://127.0.0.1:18741",
      );
    });

    // invoke 应使用 Uint8Array 传原始字节（而非 base64 字符串）
    expect(invoke).toHaveBeenCalledWith(
      "analyze_local_engine",
      expect.objectContaining({
        fileName: "song.wav",
        fileBytes: expect.any(Uint8Array),
      }),
    );
    expect(result.current.status).toBe("READY");
    expect(result.current.result?.fileName).toBe("song.wav");
  });
});
