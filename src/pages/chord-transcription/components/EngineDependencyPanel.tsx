import React from "react";
import type { EngineStatusDetail } from "../types";
import StatusRow from "./StatusRow";

/** 根据三层依赖探测结果，生成「模型与依赖就绪」行的提示文案。 */
export function modelReadyHint(layers: EngineStatusDetail["layers"]): string {
  if (!layers) return "（未知）";
  const miss: string[] = [];
  if (!layers.lv_chordia) miss.push("lv-chordia");
  if (!layers.madmom) miss.push("madmom");
  if (!layers.chord_romanizer) miss.push("chord-romanizer");
  return miss.length
    ? `缺失：${miss.join(" / ")}`
    : "lv-chordia / madmom / chord-romanizer 均已就位";
}

/**
 * 引擎依赖清单（方案 A 自包含 runtime）：
 * 内置引擎包 (runtime) / 引擎代码 / 引擎服务 / 模型与依赖就绪 / 端到端分析验证。
 * 不再展示 uv / .venv / 逐条资产——引擎整体打包随 .app 分发，运行时不再逐项下载。
 */
export function EngineDependencyPanel({
  detail,
}: {
  detail: EngineStatusDetail;
}) {
  return (
    <>
      <StatusRow
        label="内置引擎包 (runtime)"
        ok={detail.bundled_ok}
        hint={
          detail.engine_version
            ? `python-build-standalone 自包含解释器 · v${detail.engine_version}`
            : "runtime/bin/python3 缺失，引擎未随包分发"
        }
      />
      <StatusRow
        label="引擎代码（随安装包分发）"
        ok={detail.source_present}
        hint="local-engine/main.py"
      />
      <StatusRow
        label="引擎服务"
        ok={detail.running}
        port={detail.port}
        hint="127.0.0.1"
      />
      <StatusRow
        label="模型与依赖就绪"
        ok={detail.model_ready}
        hint={modelReadyHint(detail.layers)}
      />
      <StatusRow
        label="端到端分析验证"
        ok={detail.analysis_ok}
        hint="真实跑一次扒谱，确认和弦/调性/BPM 可产出"
      />
    </>
  );
}

export default EngineDependencyPanel;
