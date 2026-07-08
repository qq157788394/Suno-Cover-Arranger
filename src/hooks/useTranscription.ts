/**
 * useTranscription — 大师扒谱状态管理 Hook
 *
 * 与 useChordAnalysis 的区别：
 * - 数据源是本地 Python 引擎（localhost HTTP），不是浏览器内 Worker
 * - 不耦合音频播放 / WaveformCanvas（A2 范围）；播放与节奏网格留待 Phase B
 * - 状态更精简：IDLE / ANALYZING / READY / ERROR / ENGINE_OFFLINE
 */

import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeWithLocalEngine,
  ENGINE_OFFLINE_MARKER,
  normalizeRaw,
} from "@/services/transcription/client";
import type {
  TranscriptionResult,
  TranscriptionStatus,
} from "@/shared/types/types";

export function useTranscription() {
  const [status, setStatus] = useState<TranscriptionStatus>("IDLE");
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzedAt, setAnalyzedAt] = useState<number | null>(null);

  const fileRef = useRef<File | null>(null);
  // 单调递增请求序号：每次发起分析 +1。用于丢弃已过期（被重传 / 重置取代）的响应，
  // 解决多次上传 / 重传 / 分析中点「重置」时，更早的请求后到并覆盖最新结果、
  // 导致界面显示错误和弦的竞态（审查 #1）。
  const requestSeqRef = useRef(0);
  // 当前在途请求的可取消控制器；新上传 / 重置时 abort 掉旧请求（审查 gap A）。
  const abortRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (file: File, baseUrl?: string) => {
    // 作废在途的旧请求，避免旧响应后到覆盖新结果
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const seq = ++requestSeqRef.current;

    fileRef.current = file;
    setFileName(file.name);
    setStatus("ANALYZING");
    setError(null);
    try {
      let res: TranscriptionResult;
      if (baseUrl) {
        // 客户端模式：经 Rust 代理调用本地引擎。
        // 网页直连 127.0.0.1 会被 WKWebView 当作混合内容/私有网络拦截，
        // 所以文件以 Uint8Array 经 Tauri IPC 二进制通道送 Rust，
        // 由 Rust 用原生 reqwest 转发——免 base64 中转，去掉 33% 体积与主线程编码（ADR-6 / #5/#7）。
        const buf = await file.arrayBuffer();
        const raw = await invoke<string>("analyze_local_engine", {
          fileName: file.name,
          fileBytes: new Uint8Array(buf),
        });
        res = normalizeRaw(JSON.parse(raw), file.name);
      } else {
        res = await analyzeWithLocalEngine(file, controller.signal);
      }
      // 守卫：若本次响应已过期（期间发生了重传 / 重置），直接丢弃，不污染状态
      if (seq !== requestSeqRef.current) return;
      setResult(res);
      setAnalyzedAt(Date.now());
      setStatus("READY");
    } catch (e) {
      // 过期响应（被重置 / 新上传取代）一律忽略，不再 setState
      if (seq !== requestSeqRef.current) return;
      const msg = e instanceof Error ? e.message : String(e);
      // 结构化分流：Rust 侧在「引擎连不上」时返回带 [ENGINE_OFFLINE] 前缀的错误；
      // 旧版 Rust 仍用「调用本地引擎失败」文案，这里保留兼容（审查 #8）。
      if (
        baseUrl &&
        (msg.includes(ENGINE_OFFLINE_MARKER) ||
          msg.includes("调用本地引擎失败"))
      ) {
        setStatus("ENGINE_OFFLINE");
      } else {
        // 其余（含「引擎返回错误 HTTP xxx」）一律展示真实原因，不再笼统报离线
        setStatus("ERROR");
      }
      setError(msg);
    }
  }, []);

  const handleFileSelect = useCallback(
    (file: File, baseUrl?: string) => analyze(file, baseUrl),
    [analyze],
  );

  const reset = useCallback(() => {
    // 失效在途请求：序号 +1 使任何未完成的响应被丢弃，并 abort 当前控制器
    requestSeqRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("IDLE");
    setResult(null);
    setError(null);
    setFileName(null);
    setAnalyzedAt(null);
  }, []);

  // 卸载时取消在途请求，避免对已卸载组件 setState
  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    status,
    result,
    error,
    fileName,
    analyzedAt,
    handleFileSelect,
    reset,
  };
}

export default useTranscription;
