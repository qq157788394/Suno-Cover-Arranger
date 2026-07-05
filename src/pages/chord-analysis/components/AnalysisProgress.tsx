/**
 * AnalysisProgress — 分析进度展示组件
 * 根据分析状态显示不同的进度提示
 */

import { Progress, Typography } from 'antd';
import React from 'react';
import type { AnalysisStatus, AnalysisStep } from '@/shared/types/types';

const { Text } = Typography;

/** 步骤名称映射 */
const STEP_LABELS: Record<AnalysisStep, string> = {
  hpcp: '提取音频特征…',
  key_bpm: '检测调性与速度…',
  chord_match: '匹配和弦模板…',
  viterbi: '优化和弦序列…',
  romanize: '映射功能级数…',
  done: '分析完成',
};

/** 步骤百分比映射 */
const STEP_PERCENT: Record<AnalysisStep, number> = {
  hpcp: 20,
  key_bpm: 40,
  chord_match: 60,
  viterbi: 80,
  romanize: 95,
  done: 100,
};

export interface AnalysisProgressProps {
  /** 当前分析状态 */
  status: AnalysisStatus;
  /** 当前分析步骤（仅在 ANALYZING 时有效） */
  currentStep?: AnalysisStep;
  /** 自定义进度百分比（覆盖默认映射） */
  percent?: number;
  /** 文件名（FILE_LOADING / DECODING 时显示） */
  fileName?: string;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  status,
  currentStep,
  percent: customPercent,
  fileName,
}) => {
  if (status === 'IDLE' || status === 'READY' || status === 'ERROR') {
    return null;
  }

  let label: string;
  let percent: number;

  switch (status) {
    case 'FILE_LOADING':
      label = '正在读取文件…';
      percent = 5;
      break;
    case 'WASM_LOADING':
      label = '加载音频分析引擎…';
      percent = 10;
      break;
    case 'DECODING':
      label = '解码音频文件…';
      percent = 15;
      break;
    case 'ANALYZING':
      if (currentStep && STEP_LABELS[currentStep]) {
        label = STEP_LABELS[currentStep];
        percent = customPercent ?? STEP_PERCENT[currentStep];
      } else {
        label = '正在分析…';
        percent = customPercent ?? 50;
      }
      break;
    default:
      label = '处理中…';
      percent = 0;
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <Progress
        percent={percent}
        status="active"
        strokeColor="#ff9000"
        style={{ marginBottom: 8 }}
      />
      <Text type="secondary" style={{ fontSize: 13 }}>
        {label}
        {fileName ? `（${fileName}）` : ''}
      </Text>
    </div>
  );
};

export default AnalysisProgress;
