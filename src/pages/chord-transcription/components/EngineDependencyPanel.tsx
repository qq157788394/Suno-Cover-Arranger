import React from "react";
import type { EngineStatusDetail } from "../types";
import AssetRow from "./AssetRow";
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

/** 引擎依赖清单：uv / 源码 / .venv / 服务 + 逐条资产（或 model_ready 兜底）+ 端到端分析验证 */
export function EngineDependencyPanel({
  detail,
  prefetchingId,
  onPrefetch,
}: {
  detail: EngineStatusDetail;
  prefetchingId: string | null;
  onPrefetch: (id: string) => void;
}) {
  return (
    <>
      <StatusRow
        label="uv 运行时"
        ok={detail.uv_present}
        hint="用于创建隔离 Python 环境"
      />
      <StatusRow
        label="引擎源码（随安装包分发）"
        ok={detail.source_present}
        hint="local-engine/main.py"
      />
      <StatusRow
        label="依赖环境 (.venv)"
        ok={detail.venv_present}
        hint="已建则无需重新下载"
      />
      <StatusRow
        label="引擎服务"
        ok={detail.running}
        port={detail.port}
        hint="127.0.0.1"
      />
      {detail.assets && detail.assets.length > 0 ? (
        detail.assets.map((a) => (
          <AssetRow
            key={a.id}
            asset={a}
            downloading={prefetchingId === a.id}
            onDownload={onPrefetch}
          />
        ))
      ) : (
        <StatusRow
          label="模型与依赖就绪"
          ok={detail.model_ready}
          hint={modelReadyHint(detail.layers)}
        />
      )}
      <StatusRow
        label="端到端分析验证"
        ok={detail.analysis_ok}
        hint="真实跑一次扒谱，确认和弦/调性/BPM 可产出"
      />
    </>
  );
}

export default EngineDependencyPanel;
