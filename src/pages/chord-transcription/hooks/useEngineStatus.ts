/**
 * useEngineStatus — 大师扒谱「本地引擎」检测 / 安装 / 资产预拉取状态机
 *
 * 把原 index.tsx 中散落的引擎相关全部状态与 Rust 调用集中到此处：
 * - 检测：get_engine_status → uv / 源码 / .venv / 服务 / 资产 就绪闸门
 * - 安装：install_local_engine + engine-install-progress / engine-ready 事件流
 * - 预拉取：prefetch_asset 本地补依赖（ffmpeg / Python 包）
 * 浏览器模式（非 Tauri）下所有动作 no-op，仅返回 isClient=false。
 */

import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { message, notification } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isRunningInTauri } from "@/shared/utils/tauri";
import type { EngineStatusDetail } from "../types";

export function useEngineStatus() {
  const isClient = useMemo(() => isRunningInTauri(), []);

  // ───────── 引擎检测状态 ─────────
  const [detectError, setDetectError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [engineReady, setEngineReady] = useState(false);
  const [engineDetail, setEngineDetail] = useState<EngineStatusDetail | null>(
    null,
  );

  // 资产「下载/修复」状态
  const [prefetchingId, setPrefetchingId] = useState<string | null>(null);
  const [prefetchError, setPrefetchError] = useState<string | null>(null);
  // 仅自动触发一次 ffmpeg 预拉取（检测时备好，避免引擎启动时的运行时下载），防止与重检测死循环
  const autoFfmpegRef = useRef(false);

  // 安装流程状态
  const [installing, setInstalling] = useState(false);
  const [installLog, setInstallLog] = useState<string[]>([]);
  const [installError, setInstallError] = useState<string | null>(null);

  // 两个回调互相引用，用 ref 解耦，避免 useCallback 初始化器循环推导报错与闭包陈旧
  const detectEngineRef = useRef<() => Promise<void>>(async () => {});
  const prefetchAssetRef = useRef<(id: string) => void>(() => {});

  /**
   * 资产「下载/修复」按钮：触发 Rust prefetch_asset 在本地拉取缺失依赖。
   * 完成后重新检测。
   */
  const prefetchAsset = useCallback(
    async (assetId: string) => {
      if (!isClient) return;
      setPrefetchingId(assetId);
      setPrefetchError(null);
      try {
        const msg = await invoke<string>("prefetch_asset", { assetId });
        message.success(msg || "已下载并缓存");
      } catch (err) {
        const reason = String(err);
        setPrefetchError(reason);
        message.error(`下载失败：${reason}（若离线请联网后重试）`);
      } finally {
        setPrefetchingId(null);
        detectEngineRef.current();
      }
    },
    [isClient],
  );

  /**
   * 引擎状态检测 — 仅客户端路径。调用 Rust get_engine_status 获取 uv / 源码 / .venv /
   * 服务 / 逐条资产状态；闸门 = 全部通过（含每条资产 present）才允许上传。
   * 检测时若 ffmpeg 缺失，自动触发一次预拉取（消除引擎启动时的运行时下载）。
   */
  const detectEngine = useCallback(async () => {
    if (!isClient) return;
    setChecking(true);
    setDetectError(null);
    try {
      const detail = (await invoke("get_engine_status")) as EngineStatusDetail;
      setEngineDetail(detail);
      const assetsAll = detail.assets
        ? detail.assets.every((a) => a.present)
        : false;
      setEngineReady(
        !!detail.uv_present &&
          !!detail.source_present &&
          !!detail.venv_present &&
          !!detail.running &&
          !!detail.model_ready &&
          !!detail.analysis_ok &&
          assetsAll,
      );
      // 检测时就把 ffmpeg 备好；仅自动触发一次，避免重检测死循环。
      if (detail.running && detail.assets && !autoFfmpegRef.current) {
        const ff = detail.assets.find((a) => a.id === "ffmpeg");
        if (ff && !ff.present) {
          autoFfmpegRef.current = true;
          prefetchAssetRef.current("ffmpeg");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setDetectError(`查询引擎状态失败: ${msg}`);
      setEngineDetail(null);
      setEngineReady(false);
    } finally {
      setChecking(false);
    }
  }, [isClient]);

  // 解耦 detectEngine ↔ prefetchAsset 的互相引用：把最新回调写入 ref，供对方在异步闭包内调用
  useEffect(() => {
    detectEngineRef.current = detectEngine;
    prefetchAssetRef.current = prefetchAsset;
  });

  useEffect(() => {
    if (isClient) detectEngine();
  }, [isClient, detectEngine]);

  // 监听安装进度与引擎就绪事件（由 Rust 壳层上报）
  useEffect(() => {
    if (!isClient) return;
    let active = true;
    const unlisten: UnlistenFn[] = [];
    (async () => {
      const offProgress = await listen<string>(
        "engine-install-progress",
        (e) => {
          if (active) setInstallLog((prev) => [...prev, e.payload]);
        },
      );
      const offReady = await listen<{ port: number; msg: string }>(
        "engine-ready",
        () => {
          if (!active) return;
          setInstallError(null);
          detectEngine();
        },
      );
      unlisten.push(offProgress, offReady);
    })();
    return () => {
      active = false;
      unlisten.forEach((u) => {
        u();
      });
    };
  }, [isClient, detectEngine]);

  const installEngine = useCallback(async () => {
    if (!isClient) return;
    setInstalling(true);
    setInstallLog([]);
    setInstallError(null);
    try {
      // 命令会阻塞到后台真正干完才返回：ok 字符串=成功消息，reject=失败原因
      const msg = await invoke<string>("install_local_engine");
      setInstallError(null);
      message.success(msg || "本地引擎安装并启动成功");
      detectEngine();
    } catch (err) {
      const reason = String(err);
      setInstallError(reason);
      message.error(`安装失败：${reason}`);
    } finally {
      setInstalling(false);
    }
  }, [isClient, detectEngine]);

  useEffect(() => {
    if (installError) {
      notification.error({
        message: "安装失败",
        description: installError,
      });
    }
  }, [installError]);

  useEffect(() => {
    if (prefetchError) {
      notification.error({
        message: "依赖下载失败",
        description: prefetchError,
      });
    }
  }, [prefetchError]);

  return {
    isClient,
    checking,
    detectError,
    engineReady,
    detail: engineDetail,
    prefetchingId,
    prefetchError,
    installing,
    installLog,
    installError,
    detectEngine,
    installEngine,
    prefetchAsset,
  };
}

export default useEngineStatus;
