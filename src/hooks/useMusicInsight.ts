/**
 * useMusicInsight — 两阶段音乐理解 Hook
 *
 * Phase 1: 上传音频 → 降采样 → Worker 特征提取 → 缓存 features
 * Phase 2: 点击模型/分组 → Worker 逐个加载模型 → 推理 → 返回结果 → 卸载模型
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { ModelRawOutput } from "@/shared/types/types";

export type InsightStatus =
  "IDLE" | "DECODING" | "EXTRACTING" | "READY" | "ANALYZING" | "ERROR";

export interface UseMusicInsightReturn {
  status: InsightStatus;
  models: string[];
  results: Record<string, ModelRawOutput>;
  fileName: string | null;
  duration: number;
  error: string | null;
  analyzing: string | null;
  logs: string[];
  handleFileSelect: (file: File) => void;
  handleAnalyzeModel: (model: string) => void;
  handleAnalyzeGroup: (models: string[]) => void;
  handleReset: () => void;
}

export function useMusicInsight(): UseMusicInsightReturn {
  const [status, setStatus] = useState<InsightStatus>("IDLE");
  const [models, setModels] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, ModelRawOutput>>({});
  const [fileName, setFileName] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const workerRef = useRef<Worker | null>(null);

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const createWorker = useCallback((): Worker => {
    terminateWorker();
    console.log("[useMusicInsight] Creating worker...");
    try {
      const baseUrl = window.location.pathname.startsWith(
        "/Suno-Cover-Arranger",
      )
        ? "/Suno-Cover-Arranger/"
        : "/";
      const workerUrl = baseUrl + "inference.worker.js";
      console.log("[useMusicInsight] Worker URL:", workerUrl);
      const w = new Worker(workerUrl);
      workerRef.current = w;
      console.log("[useMusicInsight] Worker created successfully");
      w.onerror = (err) => {
        console.error("[useMusicInsight] Worker error:", err);
        setError(err.message);
        setStatus("ERROR");
      };
      w.onmessageerror = (err) => {
        console.error("[useMusicInsight] Worker message error:", err);
        setError("Worker message error");
        setStatus("ERROR");
      };
      return w;
    } catch (err) {
      console.error("[useMusicInsight] Failed to create worker:", err);
      throw err;
    }
  }, [terminateWorker]);

  const reset = useCallback(() => {
    terminateWorker();
    setStatus("IDLE");
    setModels([]);
    setResults({});
    setFileName(null);
    setDuration(0);
    setError(null);
    setAnalyzing(null);
    setLogs([]);
  }, [terminateWorker]);

  // ===== Phase 1: 上传 → 解码 → 降采样 → 特征提取 =====
  const handleFileSelect = useCallback(
    async (file: File) => {
      console.log(
        "[useMusicInsight] handleFileSelect started, file:",
        file.name,
        file.size,
      );
      reset();
      setFileName(file.name);
      setStatus("DECODING");

      try {
        console.log("[useMusicInsight] Decoding audio file...");
        const arrayBuffer = await file.arrayBuffer();
        console.log(
          "[useMusicInsight] ArrayBuffer obtained, size:",
          arrayBuffer.byteLength,
        );

        const audioCtx = new AudioContext();
        console.log("[useMusicInsight] AudioContext created");

        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        console.log(
          "[useMusicInsight] Audio decoded, sampleRate:",
          audioBuffer.sampleRate,
          "duration:",
          audioBuffer.duration,
        );

        await audioCtx.close();
        setDuration(audioBuffer.duration);

        const origData = audioBuffer.getChannelData(0);
        const ratio = 16000 / audioBuffer.sampleRate;
        const newLen = Math.floor(origData.length * ratio);
        const ds = new Float32Array(newLen);
        for (let i = 0; i < newLen; i++)
          ds[i] =
            origData[Math.min(Math.round(i / ratio), origData.length - 1)];

        console.log("[useMusicInsight] Downsampled to 16kHz, length:", newLen);

        setStatus("EXTRACTING");
        const w = createWorker();
        console.log(
          "[useMusicInsight] Worker created, posting EXTRACT message...",
        );

        await new Promise<void>((resolve, reject) => {
          w.onmessage = (e) => {
            console.log(
              "[useMusicInsight] Worker message received:",
              e.data.type,
            );
            if (e.data.type === "ready") {
              console.log(
                "[useMusicInsight] Worker ready, models:",
                e.data.models,
              );
              setModels(e.data.models);
              setStatus("READY");
              resolve();
            } else if (e.data.type === "error") {
              console.error("[useMusicInsight] Worker error:", e.data.message);
              reject(new Error(e.data.message));
            } else if (e.data.type === "log") {
              console.log("[useMusicInsight] Worker log:", e.data.msg);
              setLogs((prev) => [...prev, e.data.msg]);
            } else if (e.data.type === "progress") {
              console.log("[useMusicInsight] Worker progress:", e.data);
            }
          };
          const copy = ds.buffer.slice(0);
          console.log("[useMusicInsight] Posting message to worker...");
          w.postMessage({ type: "EXTRACT", audioData: copy }, [copy]);
          console.log("[useMusicInsight] Message posted successfully");
        });
      } catch (err) {
        console.error("[useMusicInsight] Error in handleFileSelect:", err);
        setError(err instanceof Error ? err.message : "未知错误");
        setStatus("ERROR");
      }
    },
    [reset, createWorker],
  );

  // ===== 单模型推理 =====
  const runOne = useCallback(
    (model: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        if (!workerRef.current) {
          resolve();
          return;
        }
        if (results[model]?.raw) {
          resolve();
          return;
        }

        setAnalyzing(model);
        const w = workerRef.current;
        w.onmessage = (e) => {
          if (e.data.type === "result" && e.data.model === model) {
            setResults((prev) => ({ ...prev, [model]: e.data.data }));
            resolve();
          } else if (e.data.type === "error") {
            setResults((prev) => ({
              ...prev,
              [model]: { error: e.data.message, raw: null },
            }));
            resolve();
          } else if (e.data.type === "log") {
            setLogs((prev) => [...prev, e.data.msg]);
          }
        };
        w.postMessage({ type: "ANALYZE_ONE", model });
      });
    },
    [results],
  );

  const handleAnalyzeModel = useCallback(
    (model: string) => {
      if (status !== "READY" && status !== "ANALYZING") return;
      setStatus("ANALYZING");
      runOne(model).then(() => {
        setAnalyzing(null);
        setStatus("READY");
      });
    },
    [status, runOne],
  );

  // ===== 分组串行分析 =====
  const handleAnalyzeGroup = useCallback(
    async (groupModels: string[]) => {
      if (status !== "READY" && status !== "ANALYZING") return;
      setStatus("ANALYZING");

      for (const model of groupModels) {
        await runOne(model);
      }

      setAnalyzing(null);
      setStatus("READY");
    },
    [status, runOne],
  );

  const handleReset = useCallback(() => reset(), [reset]);

  useEffect(() => {
    return () => terminateWorker();
  }, [terminateWorker]);

  return {
    status,
    models,
    results,
    fileName,
    duration,
    error,
    analyzing,
    logs,
    handleFileSelect,
    handleAnalyzeModel,
    handleAnalyzeGroup,
    handleReset,
  };
}
