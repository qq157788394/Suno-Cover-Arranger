/**
 * ChordDisplay — 当前和弦大字展示组件
 * Hero 层：和弦名 64px code 字体，colorPrimary (#ff9000)
 * Meta 层：级数 18px secondary 文字
 */

import { Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

export interface ChordDisplayProps {
  /** 和弦名，如 "Dm7" */
  chord: string;
  /** 级数，如 "IIm7" */
  degree: string;
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord, degree }) => {
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <Title
        level={1}
        code
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#ff9000',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {chord || '--'}
      </Title>
      <Text
        type="secondary"
        style={{
          fontSize: 18,
          fontWeight: 400,
          display: 'block',
          marginTop: 4,
        }}
      >
        {degree || '--'}
      </Text>
    </div>
  );
};

export default ChordDisplay;
