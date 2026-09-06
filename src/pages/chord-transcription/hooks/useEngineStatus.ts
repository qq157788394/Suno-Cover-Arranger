/**
 * useEngineStatus — 大师扒谱「本地引擎」检测 / 热更新状态机
 *
 * 把原 index.tsx 中散落的引擎相关全部状态与 Rust 调用集中到此处：
 * - 检测：get_engine_status → 自包含 runtime / 源码 / 服务 / 三层依赖 就绪闸门
 * - 热更新：update_engine（下载签名引擎包原子替换）+ check_engine_update（比对清单）
 * 浏览器模式（非 Tauri）下所有动作 no-op，仅返回 isClient=false。
 */

import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { message, notification } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // 热更新流程状态
  const [updating, setUpdating] = useState(false);
  const [updateLog, setUpdateLog] = useState<string[]>([]);
  const [updateError, setUpdateError] = useState<string | null>(null);

  /**
   * 引擎状态检测 — 仅客户端路径。调用 Rust get_engine_status 获取自包含 runtime /
   * 源码 / 服务 / 三层依赖状态；闸门 = runtime 已打包 + 服务在跑 + 模型就绪 + 端到端通过。
   */
  const detectEngine = useCallback(async () => {
    if (!isClient) return;
    setChecking(true);
    setDetectError(null);
    try {
      const detail = (await invoke("get_engine_status")) as EngineStatusDetail;
      setEngineDetail(detail);
      setUpdateAvailable(!!detail.update_available);
      setEngineReady(
        !!detail.bundled_ok &&
          !!detail.source_present &&
          !!detail.running &&
          !!detail.model_ready &&
          !!detail.analysis_ok,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setDetectError(`查询引擎状态失败: ${msg}`);
      setEngineDetail(null);
      setEngineReady(false);
    } finally {
      setChecking(false);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) detectEngine();
  }, [isClient, detectEngine]);

  // 监听引擎就绪 / 已更新事件（由 Rust 壳层上报）
  useEffect(() => {
    if (!isClient) return;
    let active = true;
    const unlisten: UnlistenFn[] = [];
    (async () => {
      const offReady = await listen<{ port: number; msg: string }>(
        "engine-ready",
        () => {
          if (!active) return;
          setUpdateError(null);
          detectEngine();
        },
      );
      const offUpdated = await listen<{ port: number; msg: string }>(
        "engine-updated",
        () => {
          if (!active) return;
          setUpdateError(null);
          detectEngine();
        },
      );
      unlisten.push(offReady, offUpdated);
    })();
    return () => {
      active = false;
      unlisten.forEach((u) => {
        u();
      });
    };
  }, [isClient, detectEngine]);

  /** 检查是否有可用热更新：拉取清单并比对内置版本（结果反映到 updateAvailable）。 */
  const checkUpdate = useCallback(async () => {
    if (!isClient) return;
    try {
      const res = (await invoke("check_engine_update")) as {
        update_available: boolean;
      };
      setUpdateAvailable(!!res.update_available);
    } catch (err) {
      // 清单不可达（离线/未配置）属常态，不弹错误，仅保留当前状态。
      const msg = err instanceof Error ? err.message : String(err);
      setDetectError(`检查更新失败: ${msg}`);
    }
  }, [isClient]);

  /**
   * 执行热更新：下载签名引擎包 → sha256 校验 → 原子替换 → 重启。
   * 已是最新则命令返回失败原因（前端提示），功能不降级；失败同样保留内置基线。
   */
  const updateEngine = useCallback(async () => {
    if (!isClient) return;
    setUpdating(true);
    setUpdateLog([]);
    setUpdateError(null);
    try {
      const res = (await invoke("update_engine")) as {
        updated: boolean;
        version: string;
      };
      if (res.updated) {
        message.success(`引擎已更新至 ${res.version}`);
      }
      setUpdateAvailable(false);
      detectEngine();
    } catch (err) {
      const reason = String(err);
      setUpdateError(reason);
      message.error(`更新失败：${reason}`);
    } finally {
      setUpdating(false);
    }
  }, [isClient, detectEngine]);

  useEffect(() => {
    if (updateError) {
      notification.error({
        message: "引擎更新失败",
        description: updateError,
      });
    }
  }, [updateError]);

  return {
    isClient,
    checking,
    detectError,
    engineReady,
    detail: engineDetail,
    updateAvailable,
    updating,
    updateLog,
    updateError,
    detectEngine,
    updateEngine,
    checkUpdate,
  };
}

export default useEngineStatus;
