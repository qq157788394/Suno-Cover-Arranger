/**
 * ChordTimeline — 和弦时间轴
 *
 * 把本地引擎返回的变长和弦段落渲染成可横向滚动的 chips：
 * - 每个 chip 显示规范化后的和弦标签 + 起始时间
 * - 无和弦段（"N"）灰显，与有声段落区分
 * 不依赖 beatChords / 节奏网格（那是 Phase B 的能力），仅基于 chords 段落，
 * 因此引擎只装 lv-chordia 时也能完整展示。
 */

import React from 'react';
import type { TranscriptionChordSegment } from '@/shared/types/types';

/** 格式化时间 mm:ss */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const ChordTimeline: React.FC<{ segments: TranscriptionChordSegment[] }> = ({
  segments,
}) => {
  if (segments.length === 0) {
    return <div style={{ color: '#9CA3AF', fontSize: 13 }}>暂无和弦数据</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        maxHeight: 360,
        overflowY: 'auto',
        padding: 4,
      }}
    >
      {segments.map((seg) => {
        const isNoChord = seg.chordLabel === 'N';
        // key 用 (start,end,label) 组合字符串：同数据跨渲染恒定唯一，
        // 避免使用浮点 start_time 作 key 导致的重渲染错配（审查 #16），且规避 noArrayIndexKey。
        const segKey = `${seg.start_time}-${seg.end_time}-${seg.chordLabel}`;
        return (
          <div
            key={segKey}
            title={`${formatTime(seg.start_time)} - ${formatTime(seg.end_time)}`}
            style={{
              minWidth: 76,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #F0F0F0',
              background: isNoChord ? '#F9FAFB' : '#FFF7ED',
              textAlign: 'center',
              flex: '0 0 auto',
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: isNoChord ? '#9CA3AF' : '#0F1419',
                whiteSpace: 'nowrap',
              }}
            >
              {isNoChord ? '—' : seg.chordLabel}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              {formatTime(seg.start_time)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChordTimeline;
