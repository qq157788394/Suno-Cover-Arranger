/**
 * 音乐理解 — 分组结果卡片（情绪/能量分析）
 * 使用与 StructuredResultCard 一致的 Descriptions + Progress 格式
 */
import { ProCard } from "@ant-design/pro-components";
import { Descriptions, Progress } from "antd";
import React from "react";
import type { ModelRawOutput } from "@/shared/types/types";

interface Props {
  title: string;
  items: { label: string; data: ModelRawOutput }[];
}

const GroupResultCard: React.FC<Props> = ({ title, items }) => {
  const validItems = items
    .map((item) => {
      const raw = item.data?.raw;
      if (!raw || !Array.isArray(raw) || raw.length < 2) return null;
      const pct = Math.round(raw[1] * 100);
      return {
        key: item.label,
        label: item.label,
        pct,
      };
    })
    .filter(
      (item): item is { key: string; label: string; pct: number } =>
        item !== null,
    );

  if (validItems.length === 0) return null;

  return (
    <ProCard size="small" title={title} bordered>
      <Descriptions column={1} bordered>
        {validItems.map((item) => (
          <Descriptions.Item
            key={item.key}
            label={item.label}
            styles={{ label: { width: 240 } }}
          >
            <Progress
              percent={item.pct}
              strokeColor={
                item.pct >= 50 ? "orange" : item.pct >= 30 ? "gold" : "pink"
              }
              size="medium"
            />
          </Descriptions.Item>
        ))}
      </Descriptions>
    </ProCard>
  );
};

export default GroupResultCard;
