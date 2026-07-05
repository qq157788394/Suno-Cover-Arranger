/**
 * ChordSequence — 和弦序列预览组件
 * Context 层：Space + Tag 展示完整和弦序列
 * 已播放 0.4 opacity，当前 opacity 1 + colorPrimary，未来 0.7 opacity
 */

import { Space, Tag, Typography } from 'antd';
import React, { useMemo } from 'react';
import type { ChordSegment } from '@/shared/types/types';

const { Text } = Typography;

export interface ChordSequenceProps {
  /** 和弦段落列表 */
  chordSegments: ChordSegment[];
  /** 当前播放时间（秒），-1 表示未播放 */
  currentTime: number;
}

const ChordSequence: React.FC<ChordSequenceProps> = ({
  chordSegments,
  currentTime,
}) => {
  const segments = useMemo(() => {
    return chordSegments.map((seg, index) => {
      const isPast = currentTime >= 0 && seg.endTime <= currentTime;
      const isCurrent =
        currentTime >= 0 &&
        currentTime >= seg.startTime &&
        currentTime < seg.endTime;
      const isFuture = !isPast && !isCurrent;

      return { ...seg, index, isPast, isCurrent, isFuture };
    });
  }, [chordSegments, currentTime]);

  if (chordSegments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <Text type="secondary">未检测到和弦</Text>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      <Space wrap size={[8, 8]}>
        {segments.map((seg) => {
          const tagStyle: React.CSSProperties = {
            fontSize: 14,
            fontWeight: 400,
            cursor: 'default',
            padding: '2px 10px',
          };

          if (seg.isPast) {
            tagStyle.opacity = 0.4;
          } else if (seg.isCurrent) {
            tagStyle.opacity = 1;
            tagStyle.fontWeight = 600;
            tagStyle.borderColor = '#ff9000';
            tagStyle.color = '#ff9000';
          } else {
            tagStyle.opacity = 0.7;
          }

          return (
            <Tag key={`${seg.index}-${seg.startTime}`} style={tagStyle}>
              {seg.chord}
              <Text
                type="secondary"
                style={{
                  fontSize: 11,
                  marginLeft: 4,
                  opacity: seg.isCurrent ? 1 : 0.7,
                }}
              >
                {seg.degree}
              </Text>
            </Tag>
          );
        })}
      </Space>
    </div>
  );
};

export default ChordSequence;
