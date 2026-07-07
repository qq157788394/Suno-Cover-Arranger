/**
 * useTranscription — 大师扒谱状态管理 Hook
 *
 * 与 useChordAnalysis 的区别：
 * - 数据源是本地 Python 引擎（localhost HTTP），不是浏览器内 Worker
 * - 不耦合音频播放 / WaveformCanvas（A2 范围）；播放与节奏网格留待 Phase B
 * - 状态更精简：IDLE / ANALYZING / READY / ERROR / ENGINE_OFFLINE
 */

import { useCallback, useRef, useState } from 'react';
import {
  analyzeWithLocalEngine,
  discoverEngine,
  TranscriptionEngineOfflineError,
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

  const handleFileSelect = useCallback(async (file: File) => {
    fileRef.current = file;
    setFileName(file.name);
    setStatus('ANALYZING');
    setError(null);
    try {
      const res = await analyzeWithLocalEngine(file);
      setResult(res);
      setAnalyzedAt(Date.now());
      setStatus('READY');
    } catch (e) {
      if (e instanceof TranscriptionEngineOfflineError) {
        setStatus('ENGINE_OFFLINE');
      } else {
        setStatus('ERROR');
      }
      setError(e instanceof Error ? e.message : '分析失败');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('IDLE');
    setResult(null);
    setError(null);
    setFileName(null);
    setAnalyzedAt(null);
  }, []);

  /** 重新探测引擎：用于「未检测到本地引擎」冷启动竞态下用户手动重试。
   *  引擎就绪且有已选文件时自动重跑分析；无文件则回到 IDLE。 */
  const recheckEngine = useCallback(async () => {
    setStatus('ANALYZING');
    const base = await discoverEngine();
    if (!base) {
      setStatus('ENGINE_OFFLINE');
      setError(
        '仍未检测到本地引擎。请确认引擎已在后台启动，或检查 ~/.dashi_engine_spawn.log。',
      );
      return;
    }
    if (fileRef.current) {
      await handleFileSelect(fileRef.current);
    } else {
      setStatus('IDLE');
      setError(null);
    }
  }, [handleFileSelect]);

  return {
    status,
    result,
    error,
    fileName,
    analyzedAt,
    handleFileSelect,
    recheckEngine,
    reset,
  };
}

export default useTranscription;
