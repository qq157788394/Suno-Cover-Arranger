/**
 * 音乐理解 — 分析进度组件
 */
import { LoadingOutlined } from '@ant-design/icons';
import { Progress, Spin, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface Props {
  status: string;
  fileName?: string;
  percent: number;
}

const AnalysisProgress: React.FC<Props> = ({ status, fileName, percent }) => (
  <div style={{ textAlign: 'center', padding: '40px 0' }}>
    <Spin
      indicator={
        <LoadingOutlined style={{ fontSize: 40, color: '#FF9000' }} spin />
      }
    />
    <div style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 15, fontWeight: 600 }}>
        {status} {percent}%
      </Text>
    </div>
    {fileName && (
      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        {fileName}
      </Text>
    )}
    <Progress
      percent={percent}
      strokeColor="#FF9000"
      strokeWidth={4}
      style={{ width: 300, marginTop: 16 }}
    />
  </div>
);

export default AnalysisProgress;
