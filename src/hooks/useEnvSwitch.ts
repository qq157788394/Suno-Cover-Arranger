/**
 * useEnvSwitch — 大师扒谱「环境切换」隐藏触发器
 *
 * 把原 index.tsx 里散落的 env 探测 / URL 重组 / 切换逻辑整体下沉到这里，
 * 并升级为「彩蛋式」交互：在客户端（Tauri 桌面壳）内对隐藏触发点
 * 连续点击 10 次，在 localhost:8000 与 GitHub Pages 之间切换；
 * 第 6 次起开始提示「即将切换」，每次点击都提示，直到第 10 次真正跳转。
 *
 * 浏览器模式（非 Tauri）下 onClick 直接 no-op，且不渲染触发点。
 */

import { message } from "antd";
import { useCallback, useEffect, useRef } from "react";
import {
  GH_PAGES_ORIGIN,
  LOCAL_DEV_ORIGIN,
} from "@/services/transcription/client";
import { isRunningInTauri } from "@/shared/utils/tauri";

/** 仅本仓库前缀（用于环境切换 URL 重组，与 GH_PAGES_ORIGIN 配套）。 */
const GH_PAGES_REPO = "Suno-Cover-Arranger";

/** 切换完成回传参数名（跳转后用于回显「已切换」并清掉 query）。 */
export const ENV_SWITCH_PARAM = "__env";

export type EnvKind = "local" | "ghpages";

/** 当前所在环境：localhost / 127.0.0.1 视为本地开发，其余视为线上。 */
export function currentEnv(): EnvKind {
  const { origin } = window.location;
  if (
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1")
  ) {
    return "local";
  }
  return "ghpages";
}

/** 根据目标环境重组完整 URL（保留当前 pathname，仅替换源）。 */
export function buildEnvUrl(target: EnvKind): string {
  const path = window.location.pathname;
  if (target === "local") {
    const stripped = path.replace(new RegExp(`^/${GH_PAGES_REPO}`), "");
    return LOCAL_DEV_ORIGIN + (stripped || "/");
  }
  const withPrefix = path.startsWith(`/${GH_PAGES_REPO}`)
    ? path
    : `/${GH_PAGES_REPO}${path}`;
  return GH_PAGES_ORIGIN + withPrefix;
}

// ─── 彩蛋触发参数 ───
/** 超过该间隔（ms）视为「非连续」，点击计数清零。 */
const CLICK_RESET_MS = 3000;
/** 第 6 次点击起开始提示「即将切换」。 */
const HINT_FROM = 6;
/** 累计点击达到该次数触发环境切换。 */
const SWITCH_AT = 10;

export function useEnvSwitchTrigger() {
  const isClient = isRunningInTauri();
  // 用 ref 计数，避免点击事件闭包读取到陈旧的 state。
  const clickCountRef = useRef(0);
  const lastClickRef = useRef(0);
  // 用 Hooks 式 message（需渲染 contextHolder），正确消费 ConfigProvider 主题，避免静态方法告警。
  const [messageApi, contextHolder] = message.useMessage();

  const triggerSwitch = useCallback(() => {
    const target: EnvKind = currentEnv() === "local" ? "ghpages" : "local";
    const url = buildEnvUrl(target);
    const sep = url.includes("?") ? "&" : "?";
    // 整页跳转（Tauri webview 会重新加载目标源），并带上回传参数。
    window.location.href = `${url}${sep}${ENV_SWITCH_PARAM}=${target}`;
  }, []);

  const onClick = useCallback(() => {
    if (!isClient) return;
    const now = Date.now();
    // 非连续（间隔过长）→ 计数清零，从头累计。
    if (
      lastClickRef.current > 0 &&
      now - lastClickRef.current > CLICK_RESET_MS
    ) {
      clickCountRef.current = 0;
    }
    lastClickRef.current = now;
    clickCountRef.current += 1;
    const count = clickCountRef.current;

    if (count >= SWITCH_AT) {
      triggerSwitch();
      return;
    }
    if (count >= HINT_FROM) {
      const remaining = SWITCH_AT - count;
      messageApi.info(`即将切换环境，再点击 ${remaining} 次生效`);
    }
  }, [isClient, triggerSwitch, messageApi]);

  // 切换完成回显：带 __env 参数进入时提示已切换，并清掉 query 避免刷新重复提示。
  useEffect(() => {
    if (!isClient) return;
    const params = new URLSearchParams(window.location.search);
    const switched = params.get(ENV_SWITCH_PARAM) as EnvKind | null;
    if (!switched) return;
    const label =
      switched === "local"
        ? "已切换至本地开发环境 (localhost:8000)"
        : "已切换至线上环境 (GitHub Pages)";
    messageApi.info(label);
    params.delete(ENV_SWITCH_PARAM);
    const clean =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "") +
      window.location.hash;
    window.history.replaceState({}, "", clean);
  }, [isClient, messageApi]);

  return { isClient, onClick, contextHolder };
}
