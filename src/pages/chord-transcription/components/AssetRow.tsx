import { Button, Typography } from "antd";

const { Text } = Typography;

import React from "react";
import type { AssetItem } from "../types";

/** 单条资产状态 + 缺失时「下载」按钮（触发 Rust prefetch_asset 本地拉取） */
export function AssetRow({
  asset,
  downloading,
  onDownload,
}: {
  asset: AssetItem;
  downloading: boolean;
  onDownload: (id: string) => void;
}) {
  const mark = asset.present ? "✅" : "❌";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <span style={{ fontSize: 14 }}>
        {asset.name}
        {asset.detail && (
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
            {asset.detail}
          </Text>
        )}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 13 }}>{mark}</span>
        {!asset.present && (
          <Button
            size="small"
            loading={downloading}
            onClick={() => onDownload(asset.id)}
            style={{ borderRadius: 6 }}
          >
            下载
          </Button>
        )}
      </span>
    </div>
  );
}

export default AssetRow;
