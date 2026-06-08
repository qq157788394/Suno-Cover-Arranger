import { Radio, Space, Typography } from 'antd';
import React from 'react';
import type { PresetLevel } from '@/shared/types/types';

const { Text } = Typography;

interface PresetSelectorProps {
  value: PresetLevel;
  onChange: (value: PresetLevel) => void;
  disabled?: boolean;
}

/** 预设选项配置 */
const PRESET_OPTIONS: {
  value: PresetLevel;
  label: string;
  description: string;
}[] = [
  {
    value: 'none',
    label: '不处理',
    description: '跳过频谱混淆，直接编码输出原始音频',
  },
  {
    value: 'light',
    label: 'Light',
    description: '轻度混淆，保持原始音质，推荐用于质量要求高的场景',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: '中度混淆，平衡音质与指纹混淆效果，适合大多数场景',
  },
  {
    value: 'heavy',
    label: 'Heavy',
    description: '重度混淆，最大程度改变频谱指纹，音质会有一定损失',
  },
];

/**
 * 预设强度选择器
 * Light / Medium / Heavy 三档选择
 */
const PresetSelector: React.FC<PresetSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <Space
      direction="vertical"
      style={{ marginTop: 16, marginBottom: 16, width: '100%' }}
    >
      <Text strong>预设强度</Text>
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value as PresetLevel)}
        disabled={disabled}
        optionType="button"
        buttonStyle="solid"
      >
        {PRESET_OPTIONS.map((option) => (
          <Radio.Button key={option.value} value={option.value}>
            {option.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {PRESET_OPTIONS.find((o) => o.value === value)?.description}
      </Text>
    </Space>
  );
};

export default PresetSelector;
