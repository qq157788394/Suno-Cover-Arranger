/**
 * 音乐理解 — 分析进度组件
 */
import { Flex, Progress, Spin, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface Props {
  status: string;
  fileName?: string;
  percent: number;
}

const AnalysisProgress: React.FC<Props> = ({ fileName, percent }) => (
  <Flex justify="center" align="center" vertical gap="medium">
    <Flex justify="center" align="center" vertical gap="medium">
      <Spin size="large" description="分析中，请耐心等待" />
      <Text strong>{fileName}</Text>
      <Progress
        percent={percent}
        strokeColor="#FF9000"
        size="medium"
        style={{ width: 300 }}
      />
    </Flex>
  </Flex>
);

export default AnalysisProgress;
