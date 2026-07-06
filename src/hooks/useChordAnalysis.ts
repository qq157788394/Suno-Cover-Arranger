/**
 * useChordAnalysis — 和弦分析状态管理 Hook
 *
 * 管理分析全生命周期状态：
 * - 文件选择 → Worker 分析 → 缓存检查 → 状态转移
 * - 播放控制（播放/暂停/停止/跳转）
 * - 当前和弦跟随
 * - 错误处理 + 重试
 */

import { message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AnalysisStatus,
  AnalysisStep,
  ChordSegment,
  PlaybackState,
  SongAnalysis,
} from '@/shared/types/types';

/** 音名上行指定半音数（用于 Minor → 相对大调显示） */
const NOTE_SEMITONES_MAP: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const NOTE_LETTERS_ARR = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
function transposeSemitones(note: string, semitones: number): string {
  const letter = note.charAt(0).toUpperCase();
  const acc = (note.match(/#/g) || []).length - (note.match(/b/g) || []).length;
  const basePc = NOTE_SEMITONES_MAP[letter] ?? 0;
  const targetPc = (((basePc + acc + semitones) % 12) + 12) % 12;
  const steps = Math.round((semitones * 7) / 12);
  const idx = (NOTE_LETTERS_ARR.indexOf(letter) + steps) % 7;
  const targetLetter = NOTE_LETTERS_ARR[idx >= 0 ? idx : idx + 7];
  const naturalPc = NOTE_SEMITONES_MAP[targetLetter] ?? 0;
  let diff = (((targetPc - naturalPc) % 12) + 12) % 12;
  if (diff > 6) diff -= 12;
  return (
    targetLetter +
    (diff === 0 ? '' : diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff))
  );
}

export interface UseChordAnalysisReturn {
  /** 当前分析状态 */
  analysisStatus: AnalysisStatus;
  /** 播放状态 */
  playbackState: PlaybackState;
  /** 当前播放时间（秒） */
  currentTime: number;
  /** 当前和弦段落 */
  currentChord: ChordSegment | null;
  /** 完整分析结果 */
  songAnalysis: SongAnalysis | null;
  /** 错误信息 */
  error: string | null;
  /** 是否可重试 */
  retryable: boolean;
  /** 当前进度步骤 */
  currentStep: AnalysisStep | undefined;
  /** 进度百分比 */
  progressPercent: number;
  /** 文件名 */
  fileName: string | null;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 处理文件选择 */
  handleFileSelect: (file: File) => void;
  /** 播放 */
  handlePlay: () => void;
  /** 暂停 */
  handlePause: () => void;
  /** 停止 */
  handleStop: () => void;
  /** 跳转 */
  handleSeek: (time: number) => void;
  /** 设置当前时间 */
  setCurrentTime: (time: number) => void;
  /** 重试分析 */
  handleRetry: () => void;
  /** 音频 ref */
  audioRef: React.RefObject<HTMLAudioElement | null>;
  /** 音频 URL */
  audioUrl: string | null;
  /** 波形峰值数据 */
  peaks: Float32Array;
}

export function useChordAnalysis(): UseChordAnalysisReturn {
  // 分析状态
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('IDLE');
  const [playbackState, setPlaybackState] = useState<PlaybackState>('STOPPED');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentChord, setCurrentChord] = useState<ChordSegment | null>(null);
  const [songAnalysis, setSongAnalysis] = useState<SongAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<AnalysisStep | undefined>();
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [peaks, setPeaks] = useState<Float32Array>(new Float32Array(0));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const lastFileRef = useRef<File | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading =
    analysisStatus === 'FILE_LOADING' ||
    analysisStatus === 'WASM_LOADING' ||
    analysisStatus === 'DECODING' ||
    analysisStatus === 'ANALYZING';

  /** 终止 Worker */
  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  /** 清理超时定时器 */
  const clearTimeout_ = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /** 清理音频资源 */
  const cleanupAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setCurrentTime(0);
    setCurrentChord(null);
    setPlaybackState('STOPPED');
  }, [audioUrl]);

  /** 提取音频峰值数据（降采样波形） */
  const extractPeaks = useCallback(
    async (
      file: File,
    ): Promise<{ peaks: Float32Array; audioBuffer: AudioBuffer }> => {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const channelData = audioBuffer.getChannelData(0);
        const targetLength = 2000; // 降采样到 2000 个点
        const step = Math.floor(channelData.length / targetLength);
        const peaks = new Float32Array(targetLength);

        for (let i = 0; i < targetLength; i++) {
          let max = 0;
          const start = i * step;
          const end = Math.min(start + step, channelData.length);
          for (let j = start; j < end; j++) {
            const abs = Math.abs(channelData[j]);
            if (abs > max) max = abs;
          }
          peaks[i] = max;
        }

        // 归一化
        const maxPeak = Math.max(...peaks, 0.01);
        for (let i = 0; i < peaks.length; i++) {
          peaks[i] = peaks[i] / maxPeak;
        }

        return { peaks, audioBuffer };
      } finally {
        await audioContext.close();
      }
    },
    [],
  );

  /** 启动分析流程 */
  const startAnalysis = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setAnalysisStatus('FILE_LOADING');
      setError(null);
      setProgressPercent(0);
      setCurrentStep(undefined);

      try {
        // 1. 创建音频 URL
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(file));

        // 2. 解码音频 + 提取峰值
        setAnalysisStatus('DECODING');
        const { peaks: extractedPeaks, audioBuffer } = await extractPeaks(file);
        setPeaks(extractedPeaks);

        // 5. Worker 提取 essentia 特征
        setAnalysisStatus('WASM_LOADING');

        const features = await new Promise<any>((resolve, reject) => {
          const baseUrl = window.location.pathname.startsWith('/Suno-Cover-Arranger') ? '/Suno-Cover-Arranger/' : '/';
          const workerUrl = baseUrl + 'chord-analysis.worker.js';
          const w = new Worker(workerUrl);
          workerRef.current = w;
          const timeout = setTimeout(() => {
            w.terminate();
            workerRef.current = null;
            reject(new Error('分析超时'));
          }, 90000);

          w.onmessage = (e) => {
            if (e.data.type === 'error') {
              clearTimeout(timeout);
              w.terminate();
              workerRef.current = null;
              reject(new Error(e.data.error));
            } else if (e.data.type === 'result') {
              clearTimeout(timeout);
              w.terminate();
              workerRef.current = null;
              resolve(e.data.features);
            } else if (e.data.type === 'log') {
              console.log('[Worker]', e.data.msg);
            }
          };
          w.onerror = (err) => {
            clearTimeout(timeout);
            w.terminate();
            reject(
              new Error(
                `Worker error: ${err.message || `${err.filename}:${err.lineno} ${(err as any).error}`}`,
              ),
            );
          };

          // 拷贝一份 ArrayBuffer 传给 Worker（Transferable 零拷贝）
          const copy = audioBuffer.getChannelData(0).buffer.slice(0);
          w.postMessage(
            {
              type: 'analyze',
              audioBuffer: copy,
              sampleRate: audioBuffer.sampleRate,
            },
            [copy],
          );
        });

        // 6. 构建结果
        setAnalysisStatus('ANALYZING');
        setCurrentStep('done');
        setProgressPercent(100);

        // Worker 返回 chordSegments（自有和弦匹配）
        const chordSegs =
          features.chordSegments && features.chordSegments.length > 0
            ? features.chordSegments
            : [
                {
                  startTime: 0,
                  endTime: audioBuffer.duration,
                  chord: `${features.key}${features.scale === 'minor' ? 'm' : ''}`,
                  degree: features.scale === 'minor' ? 'Im' : 'I',
                  confidence: features.keyStrength || 0.5,
                },
              ];

        const result: SongAnalysis = {
          fileHash: file.name + Date.now(), // 用于类型兼容，缓存逻辑已移除
          fileName: file.name,
          fileSize: file.size,
          duration: audioBuffer.duration,
          sampleRate: audioBuffer.sampleRate,
          // Minor 键同步显示相对大调：A Minor / C Major
          key:
            features.scale === 'minor'
              ? `${features.key} Minor / ${transposeSemitones(features.key, 3)} Major`
              : `${features.key} ${features.scale.charAt(0).toUpperCase()}${features.scale.slice(1)}`,
          keyConfidence: features.keyStrength,
          bpm: features.bpm,
          bpmConfidence: features.bpmConfidence || 0.6,
          chordSegments: chordSegs,
          beatChords: features.beatChords || [],
          beatList: features.beatList || [],
          vocabularyLevel: 'extended' as const,
          analyzedAt: Date.now(),
          analysisDurationMs: 0,
        } as any;
        setSongAnalysis(result);
        setAnalysisStatus('READY');
        setCurrentChord(chordSegs[0]);
        message.success(`分析完成: ${result.key}, ${features.bpm} BPM`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '未知错误';
        setAnalysisStatus('ERROR');
        setError(`分析失败：${errMsg}`);
        setRetryable(true);
      }
    },
    [audioUrl, extractPeaks],
  );

  /** 处理文件选择 */
  const handleFileSelect = useCallback(
    (file: File) => {
      lastFileRef.current = file;
      startAnalysis(file);
    },
    [startAnalysis],
  );

  /** 播放 */
  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlaybackState('PLAYING');
    }
  }, []);

  /** 暂停 */
  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState('PAUSED');
    }
  }, []);

  /** 停止 */
  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaybackState('STOPPED');
      setCurrentTime(0);
      setCurrentChord(
        songAnalysis && songAnalysis.chordSegments.length > 0
          ? songAnalysis.chordSegments[0]
          : null,
      );
    }
  }, [songAnalysis]);

  /** 跳转 */
  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  /** 重试分析 */
  const handleRetry = useCallback(() => {
    cleanupAudio();
    setError(null);
    setRetryable(false);
    setAnalysisStatus('IDLE');
    setSongAnalysis(null);
    setCurrentChord(null);

    if (lastFileRef.current) {
      startAnalysis(lastFileRef.current);
    }
  }, [cleanupAudio, startAnalysis]);

  // audio 时间更新事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const t = audio.currentTime;
      setCurrentTime(t);

      // 查找当前和弦（找不到则为 null，不表示无和弦，UI 显示默认符号）
      if (songAnalysis) {
        const seg = songAnalysis.chordSegments.find(
          (seg) => t >= seg.startTime && t < seg.endTime,
        );
        setCurrentChord(seg || null);
      }
    };

    const onEnded = () => {
      setPlaybackState('STOPPED');
      setCurrentTime(0);
      setCurrentChord(
        songAnalysis && songAnalysis.chordSegments.length > 0
          ? songAnalysis.chordSegments[0]
          : null,
      );
    };

    const onPause = () => {
      if (!audio.ended) {
        setPlaybackState('PAUSED');
      }
    };

    const onPlay = () => {
      setPlaybackState('PLAYING');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
    };
  }, [songAnalysis]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      terminateWorker();
      clearTimeout_();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [terminateWorker, clearTimeout_, audioUrl]);

  return {
    analysisStatus,
    playbackState,
    currentTime,
    currentChord,
    songAnalysis,
    error,
    retryable,
    currentStep,
    progressPercent,
    fileName,
    isLoading,
    handleFileSelect,
    handlePlay,
    handlePause,
    handleStop,
    handleSeek,
    setCurrentTime,
    handleRetry,
    audioRef,
    audioUrl,
    peaks,
  };
}

export default useChordAnalysis;
