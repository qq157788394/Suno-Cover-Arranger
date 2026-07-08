/**
 * BeatGrid — 拍级和弦网格（弹唱视图）
 *
 * 核心展示逻辑：
 * - 每格 = 一拍，每行 = 4 小节（16 拍，4/4 拍号）
 * - 小节间间隔 > 拍间间隔
 * - 不做格子合并：每个拍级格子独立显示和弦名（弹唱者需看到"第几拍换和弦"）
 * - 内置 HTML5 Audio 播放器，实时高亮当前播放位置
 *
 * 纯算法在 beatGridUtils.ts，本文件负责渲染 + 音频状态管理。
 */

import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { Button, Tooltip, Typography } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  TranscriptionChordSegment,
  TranscriptionRhythm,
  TranscriptionRomanSegment,
} from '@/shared/types/types';
import {
  BARS_PER_ROW,
  buildBeatCells,
  type ChordDisplayMode,
  findActiveBeatIndex,
  groupBarsIntoRows,
  resolveCellDisplay,
  splitIntoBars,
} from './beatGridUtils';

const { Text } = Typography;

// ── 布局常量 ───────────────────────────────────────────

const CELL_W = 52;
const CELL_H = 44;
const BEAT_GAP = 2; // 拍之间的小间隔
const BAR_GAP = 12; // 小节之间的较大间隔

// ── 样式常量 ───────────────────────────────────────────

/** 默认格样式 */
const STYLE_CELL: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F3F4F6',
  border: '1px solid #E8E8E8',
  borderRadius: 5,
  fontSize: 12,
  fontWeight: 600,
  color: '#374151',
  overflow: 'hidden',
  userSelect: 'none',
  width: CELL_W,
  height: CELL_H,
};

/** 当前播放位置的格样式 */
const STYLE_ACTIVE_CELL: React.CSSProperties = {
  ...STYLE_CELL,
  background: '#374151',
  color: '#FFFFFF',
  borderColor: '#374151',
};

// ── 组件 ────────────────────────────────────────────────

interface BeatGridProps {
  chords: TranscriptionChordSegment[];
  rhythm: TranscriptionRhythm | null;
  roman?: TranscriptionRomanSegment[] | null;
  /** 上传音频的 blob URL（用于内置播放器） */
  audioUrl?: string | null;
  /** 展示模式：和弦名称 / 功能级数（默认和弦名称，与网页版一致） */
  displayMode?: ChordDisplayMode;
}

const BeatGrid: React.FC<BeatGridProps> = ({
  chords,
  rhythm,
  roman,
  audioUrl,
  displayMode = 'chord',
}) => {
  // ── 网格数据 ─────────────────────────────────────
  const gridData = useMemo(() => {
    if (!rhythm?.beats || rhythm.beats.length === 0) return null;

    const bpb = rhythm.beats_per_bar ?? 4;
    const beatCells = buildBeatCells(chords, rhythm.beats, roman ?? undefined);
    const bars = splitIntoBars(beatCells, bpb);
    const rows = groupBarsIntoRows(bars, BARS_PER_ROW);

    return { rows, bpb, totalBeats: rhythm.beats.length, bars };
  }, [chords, rhythm, roman]);

  // ── 音频播放状态 ─────────────────────────────────
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number>(0);

  // 监听音频事件。
  // 依赖 audioUrl：<audio> 元素是 {audioUrl && <audio/>} 条件渲染，
  // 挂载时 audioUrl 可能仍为 null（父组件在 status=READY 后才 createObjectURL），
  // 若用 [] 则监听器在 ref 为 null 时挂不上去，进度与高亮永远不动。
  // 改为依赖 audioUrl，元素真正就绪后一定挂上。
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(0);
    setPlaying(false);

    const onTimeUpdate = () => {
      if (rafRef.current) return; // 已有 pending 的 raf
      rafRef.current = requestAnimationFrame(() => {
        setCurrentTime(audio.currentTime);
        rafRef.current = 0;
      });
    };

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [audioUrl]);

  // 清理：卸载时停止播放
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // ── 播放控制 ─────────────────────────────────────
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused || audio.ended) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, []);

  // ── 当前活跃 beat 索引 ─────────────────────────────
  const activeBeatIdx = useMemo(() => {
    if (!gridData || !rhythm?.beats) return -1;
    return findActiveBeatIndex(currentTime, rhythm.beats);
  }, [currentTime, gridData, rhythm?.beats]);

  /** 判断某格是否为当前播放位置（置于提前 return 之前，遵守 hooks 规则） */
  const isActive = useCallback(
    (globalBeatIdx: number) => globalBeatIdx === activeBeatIdx,
    [activeBeatIdx],
  );

  /** 格式化时间 mm:ss */
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ── 无节奏数据降级 ─────────────────────────────────
  if (!gridData) {
    return (
      <Text type="secondary" style={{ fontSize: 13 }}>
        拍级网格需要节奏数据。安装完整引擎（含 madmom）后可获得精确的拍级网格。
      </Text>
    );
  }

  const { rows, bpb, totalBeats, bars } = gridData;

  // ── 渲染一行小节（4 个 bar 并排）───────────────────
  const renderRow = (row: (typeof rows)[0], rowIndex: number) => (
    <div key={`row-${rowIndex}`} style={{ marginBottom: BAR_GAP }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {/* 该行所有小节 */}
        {row.barRows.map((bar) => (
          <div key={bar.barNumber}>
            {/* 小节序号 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 10,
                color: '#BFBFBF',
                paddingLeft: 2,
                paddingBottom: 3,
              }}
            >
              {bar.barNumber}
            </div>

            {/* 一小节的格子 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${bpb}, ${CELL_W}px)`,
                gap: `${BEAT_GAP}px`,
                marginRight: BAR_GAP,
              }}
            >
              {bar.cells.map((cell, ci) => {
                // 全局拍索引 = (小节号-1) * 每小节拍数 + 格内序号
                const exactGlobalIdx = (bar.barNumber - 1) * bpb + ci;
                const active = isActive(exactGlobalIdx);
                // 按展示模式选主显示文本：功能级数优先，缺失回退和弦名
                const display = resolveCellDisplay(
                  cell.label,
                  cell.subLabel,
                  cell.isEmpty,
                  displayMode,
                );

                return (
                  <Tooltip
                    key={exactGlobalIdx}
                    title={
                      cell.subLabel && cell.label !== 'N'
                        ? `${cell.label} (${cell.subLabel})`
                        : cell.label !== 'N'
                          ? cell.label
                          : ''
                    }
                  >
                    <div style={active ? STYLE_ACTIVE_CELL : { ...STYLE_CELL }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: CELL_W - 6,
                          textAlign: 'center',
                        }}
                      >
                        {display}
                      </span>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── 主渲染 ─────────────────────────────────────────
  return (
    <div style={{ overflowX: 'auto' }}>
      {/* 隐藏的 Audio 元素 */}
      {audioUrl && (
        // biome-ignore lint/a11y/useMediaCaption: 音乐播放器无语音内容，无需字幕轨
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {/* 播放控制栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
        }}
      >
        <Button
          shape="circle"
          size="small"
          type={playing ? 'default' : 'primary'}
          icon={playing ? <PauseOutlined /> : <CaretRightOutlined />}
          onClick={togglePlay}
          disabled={!audioUrl}
          style={!audioUrl ? { opacity: 0.4 } : {}}
        />

        {/* 进度条 */}
        <div
          style={{
            flex: 1,
            height: 4,
            background: '#E5E7EB',
            borderRadius: 2,
            position: 'relative',
            cursor: audioUrl ? 'pointer' : 'default',
          }}
          onClick={(e) => {
            if (!audioUrl || !audioRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = Math.max(
              0,
              Math.min(duration, pct * duration),
            );
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : 0,
              background: '#FF9000',
              borderRadius: 2,
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* 时间显示 */}
        <Text style={{ fontSize: 11, color: '#9CA3AF', minWidth: 80 }}>
          {fmt(currentTime)} / {fmt(duration)}
        </Text>
      </div>

      {/* 表头：每拍的编号（重复 4 组对应 4 小节） */}
      <div
        style={{
          display: 'flex',
          marginBottom: 6,
        }}
      >
        {/* 左侧占位对齐小节序号列 */}
        <div style={{ width: 16 }} />

        {Array.from({ length: BARS_PER_ROW }, (_, bi) => {
          const headerRowKey = `header-${bi}`;
          const beatCells = Array.from({ length: bpb }, (_, i) => {
            const beatKey = `${bi}-${i}`;
            return (
              <div
                key={beatKey}
                style={{
                  textAlign: 'center',
                  fontSize: 9,
                  color: '#C4C4C4',
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </div>
            );
          });
          return (
            <div
              key={headerRowKey}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${bpb}, ${CELL_W}px)`,
                gap: `${BEAT_GAP}px`,
                marginRight: BAR_GAP,
              }}
            >
              {beatCells}
            </div>
          );
        })}
      </div>

      {/* 网格主体：逐行渲染 */}
      <div>{rows.map((row, ri) => renderRow(row, ri))}</div>

      {/* 底部统计 */}
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: '#BFBFBF',
          display: 'flex',
          gap: 14,
        }}
      >
        <span>{bars.length} 小节</span>
        <span>{totalBeats} 拍</span>
        <span>{bpb}/4</span>
        {activeBeatIdx >= 0 && <span>第 {activeBeatIdx + 1} 拍</span>}
      </div>
    </div>
  );
};

export default BeatGrid;
