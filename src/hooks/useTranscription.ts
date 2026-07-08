/**
 * useTranscription — 大师扒谱状态管理 Hook
 *
 * 与 useChordAnalysis 的区别：
 * - 数据源是本地 Python 引擎（localhost HTTP），不是浏览器内 Worker
 * - 不耦合音频播放 / WaveformCanvas（A2 范围）；播放与节奏网格留待 Phase B
 * - 状态更精简：IDLE / ANALYZING / READY / ERROR / ENGINE_OFFLINE
 */

import { invoke } from '@tauri-apps/api/core';
import { useCallback, useRef, useState } from 'react';
import {
  analyzeWithLocalEngine,
  fileToBase64,
  normalizeRaw,
} from '@/services/transcription/client';
import type {
  TranscriptionResult,
  TranscriptionStatus,
} from '@/shared/types/types';

export function useTranscription() {
  const [status, setStatus] = useState<TranscriptionStatus>('IDLE');
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzedAt, setAnalyzedAt] = useState<number | null>(null);

  const fileRef = useRef<File | null>(null);

  const handleFileSelect = useCallback(async (file: File, baseUrl?: string) => {
    fileRef.current = file;
    setFileName(file.name);
    setStatus('ANALYZING');
    setError(null);
    try {
      let res: TranscriptionResult;
      if (baseUrl) {
        // 客户端模式：经 Rust 代理调用本地引擎。
        // 网页直连 127.0.0.1 会被 WKWebView 当作混合内容/私有网络拦截，
        // 所以文件经 Tauri 二进制通道送 Rust，由 Rust 用 curl 转发（可靠）。
        // 文件以 base64 字符串传入（规避 tauri-build 对 Vec<u8> 参数的权限代码生成缺陷）。
        const b64 = await fileToBase64(file);
        const raw = await invoke<string>('analyze_local_engine', {
          fileName: file.name,
          fileBytes: b64,
        });
        res = normalizeRaw(JSON.parse(raw), file.name);
      } else {
        res = await analyzeWithLocalEngine(file);
      }
      setResult(res);
      setAnalyzedAt(Date.now());
      setStatus('READY');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (baseUrl && msg.includes('调用本地引擎失败')) {
        // curl 连不上 = 引擎确实没在跑（与浏览器内引擎离线同语义）
        setStatus('ENGINE_OFFLINE');
      } else {
        // 其余（含「引擎返回错误 HTTP xxx」）一律展示真实原因，不再笼统报离线
        setStatus('ERROR');
      }
      setError(msg);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('IDLE');
    setResult(null);
    setError(null);
    setFileName(null);
    setAnalyzedAt(null);
  }, []);

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
