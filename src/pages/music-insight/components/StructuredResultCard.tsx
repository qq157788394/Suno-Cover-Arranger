/**
 * 音乐理解 — 多分类结构化结果卡片
 * genre → top 5, 其余 → top 3, 数值以 % 整数展示
 */
import { ProCard } from "@ant-design/pro-components";
import { Descriptions, Progress } from "antd";
import React from "react";
import { getLabels } from "@/services/ml/labels";
import type { ModelRawOutput } from "@/shared/types/types";

interface Props {
  modelName: string;
  title: string;
  data: ModelRawOutput;
}

const TOP_N: Record<string, number> = { genre: 5 };

const StructuredResultCard: React.FC<Props> = ({ modelName, title, data }) => {
  if (data.error) {
    return (
      <ProCard size="small" title={title} bordered>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="错误">{data.error}</Descriptions.Item>
        </Descriptions>
      </ProCard>
    );
  }

  const raw = data.raw;
  if (!raw || !Array.isArray(raw) || raw.length < 2) return null;

  const labels = getLabels(modelName, raw.length);
  const topN = TOP_N[modelName] || 3;

  const items = labels
    .map((label, i) => ({
      key: label,
      label,
      pct: Math.round((raw[i] || 0) * 100),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, topN);

  return (
    <ProCard size="small" title={title} bordered>
      <Descriptions column={1} bordered>
        {items.map((item) => (
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

export default StructuredResultCard;
