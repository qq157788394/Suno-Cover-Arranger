/**
 * KeyBpmDisplay — Key / BPM 信息展示组件
 * 使用 Tag 组件显示调性和速度信息
 */

import { Space, Tag, Typography } from "antd";
import React from "react";

const { Text } = Typography;

export interface KeyBpmDisplayProps {
  /** 调式，如 "C Major" */
  keyName: string;
  /** Key 置信度 0-1 */
  keyConfidence: number;
  /** BPM */
  bpm: number;
  /** BPM 置信度 0-1 */
  bpmConfidence: number;
}

const KeyBpmDisplay: React.FC<KeyBpmDisplayProps> = ({
  keyName,
  keyConfidence,
  bpm,
  bpmConfidence,
}) => {
  return (
    <Space size={12} style={{ marginTop: 16 }}>
      <Tag color="orange" style={{ fontSize: 14, padding: "4px 12px" }}>
        {keyName}
        <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
          ({(keyConfidence * 100).toFixed(0)}%)
        </Text>
      </Tag>
      <Tag color="blue" style={{ fontSize: 14, padding: "4px 12px" }}>
        {Math.round(bpm)} BPM
        <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
          ({(bpmConfidence * 100).toFixed(0)}%)
        </Text>
      </Tag>
    </Space>
  );
};

export default KeyBpmDisplay;
