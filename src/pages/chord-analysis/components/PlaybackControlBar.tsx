/**
 * PlaybackControlBar — 播放控制栏组件
 *
 * 提供音频播放、暂停和重新上传控制：
 * - 播放按钮（橙色主按钮）+ 暂停按钮（灰色次按钮）
 * - 重新上传按钮（幽灵按钮，直接覆盖替换当前文件）
 */

import {
  CaretRightOutlined,
  PauseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';
import React from 'react';
import type { PlaybackState } from '@/shared/types/types';

export interface PlaybackControlBarProps {
  /** 当前播放状态 */
  playbackState: PlaybackState;
  /** 播放回调 */
  onPlay: () => void;
  /** 暂停回调 */
  onPause: () => void;
  /** 重新上传回调（直接弹文件选择框覆盖） */
  onReupload: () => void;
}

const PlaybackControlBar: React.FC<PlaybackControlBarProps> = ({
  playbackState,
  onPlay,
  onPause,
  onReupload,
}) => {
  const isPlaying = playbackState === 'PLAYING';

  return (
    <Space size={12}>
      {isPlaying ? (
        <Button
          type="default"
          icon={<PauseOutlined />}
          onClick={onPause}
          style={{ borderRadius: 8 }}
        >
          暂停
        </Button>
      ) : (
        <Button
          type="primary"
          icon={<CaretRightOutlined />}
          onClick={onPlay}
          style={{
            borderRadius: 8,
            background: '#FF9000',
            borderColor: '#FF9000',
          }}
        >
          播放
        </Button>
      )}
      <Button
        type="text"
        icon={<ReloadOutlined />}
        onClick={onReupload}
        style={{ borderRadius: 8, color: '#6B7280' }}
      >
        重新上传
      </Button>
    </Space>
  );
};

export default PlaybackControlBar;
