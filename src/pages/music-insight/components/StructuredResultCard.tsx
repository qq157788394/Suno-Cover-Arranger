/**
 * 音乐理解 — 多分类结构化结果卡片
 * genre → top 5, 其余 → top 3, 数值以 % 整数展示
 */
import { ProCard } from '@ant-design/pro-components';
import { Progress, Table, Typography } from 'antd';
import React from 'react';
import { getLabels } from '@/services/ml/labels';
import type { ModelRawOutput } from '@/shared/types/types';

const { Text } = Typography;

interface Props {
  modelName: string;
  title: string;
  data: ModelRawOutput;
}

/** 各模型展示 Top N */
const TOP_N: Record<string, number> = { genre: 5 };

const StructuredResultCard: React.FC<Props> = ({ modelName, title, data }) => {
  if (data.error) {
    return (
      <ProCard size="small" title={title} bordered>
        <Text type="danger">{data.error}</Text>
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

  const columns = [
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
      width: 120,
      render: (v: string) => <Text>{v}</Text>,
    },
    {
      title: '',
      dataIndex: 'pct',
      key: 'pct',
      width: 56,
      align: 'right' as const,
      render: (v: number) => (
        <Text
          strong
          style={{ color: v >= 30 ? '#FF9000' : '#6B7280', fontSize: 15 }}
        >
          {v}%
        </Text>
      ),
    },
    {
      title: '',
      dataIndex: 'pct',
      key: 'bar',
      render: (v: number) => (
        <Progress
          percent={v}
          strokeColor={v >= 50 ? '#FF9000' : v >= 30 ? '#FAAA14' : '#D9D9D9'}
          strokeWidth={6}
          size="small"
          style={{ minWidth: 100 }}
        />
      ),
    },
  ];

  return (
    <ProCard size="small" title={title} bordered>
      <Table
        dataSource={items}
        columns={columns}
        rowKey="key"
        size="small"
        pagination={false}
        showHeader={false}
      />
    </ProCard>
  );
};

export default StructuredResultCard;
