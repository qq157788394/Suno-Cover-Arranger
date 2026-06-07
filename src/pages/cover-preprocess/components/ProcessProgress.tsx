import { Progress, Typography } from 'antd';

const { Text } = Typography;

import React from 'react';
import type { PipelineProgress } from '@/shared/types/types';

interface ProcessProgressProps {
  progress: PipelineProgress | null;
}

/** 阶段对应的颜色 */
const STAGE_COLORS: Record<string, string> = {
  decode: '#1890ff',
  stage2: '#722ed1',
  stage3: '#13c2c2',
  encode: '#fa8c16',
  done: '#52c41a',
};

/** 阶段对应的中文标签 */
const STAGE_LABELS: Record<string, string> = {
  decode: '解码中',
  stage2: '频谱混淆中',
  stage3: '变速处理中',
  encode: 'MP3 编码中',
  done: '处理完成',
};

/**
 * 处理进度组件（仪表盘式）
 * 在右侧处理结果卡片中展示，处理中显示仪表盘，完成后隐藏
 */
const ProcessProgress: React.FC<ProcessProgressProps> = ({ progress }) => {
  if (!progress) return null;

  const strokeColor = STAGE_COLORS[progress.stage] || '#1890ff';
  const stageLabel = STAGE_LABELS[progress.stage] || '处理中';
  const percent = Math.round(progress.progress);

  return (
    <div>
      <Progress percent={percent} strokeColor={strokeColor} />
      <Text>{stageLabel}</Text>
    </div>
  );
};

export default ProcessProgress;
