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
