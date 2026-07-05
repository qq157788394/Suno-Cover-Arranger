/**
 * WaveformCanvas — 音频波形可视化组件（Canvas 渲染）
 * 本模块中唯一不使用 antd 组件的部分（antd 无音频波形组件）
 * 外部用 ProCard 包裹保持一致性
 *
 * 视觉层次（从下到上）：
 * 1. 波形层 — 音频振幅波形，浅灰色填充
 * 2. 节拍线 — BPM 推算的拍点位置，垂直细线，强拍稍粗
 * 3. 小节线 — 4/4 拍每 4 拍一条，垂直粗线
 * 4. 和弦标签 — 每个和弦段起始位置的标签
 * 5. 播放头 — 当前播放位置，橙色竖线
 * 6. 和弦段背景 — 当前和弦段浅橙色半透明背景
 *
 * 滚动行为：播放时波形整体向左滚动，播放头固定在画面约 30% 位置
 * 使用 requestAnimationFrame 驱动重绘
 */

import React, { useCallback, useEffect, useRef } from 'react';
import type { ChordSegment } from '@/shared/types/types';

export interface WaveformCanvasProps {
  peaks: Float32Array | number[];
  duration: number;
  chordSegments: ChordSegment[];
  bpm: number;
  /** 真实节拍位置（含强/弱标记），有则替代 BPM 推算 */
  beats?: BeatInfo[];
  currentTime: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
}

/** 节拍类型 */
interface BeatInfo {
  time: number;
  isDownbeat: boolean;
}

const CANVAS_FILL_COLOR = '#e8e8e8';
const BEAT_LINE_COLOR = 'rgba(0, 0, 0, 0.15)';
const DOWNBEAT_LINE_COLOR = 'rgba(0, 0, 0, 0.3)';
const MEASURE_LINE_COLOR = 'rgba(0, 0, 0, 0.25)';
const PLAYHEAD_COLOR = '#ff9000';
const CHORD_BG_COLOR = 'rgba(255, 144, 0, 0.08)';
const CHORD_LABEL_COLOR = '#333';
const CHORD_BORDER_COLOR = 'rgba(255, 144, 0, 0.3)';

const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  peaks,
  duration,
  chordSegments,
  bpm,
  beats: realBeats,
  currentTime,
  isPlaying,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const scrollOffsetRef = useRef<number>(0);
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  /** 节拍位置：优先用真实检测结果，fallback BPM 推算 */
  const computeBeats = useCallback((): BeatInfo[] => {
    if (realBeats && realBeats.length > 0) return realBeats;
    if (bpm <= 0 || duration <= 0) return [];
    const beats: BeatInfo[] = [];
    const beatInterval = 60 / bpm;
    let t = 0,
      beatIndex = 0;
    while (t <= duration) {
      beats.push({ time: t, isDownbeat: beatIndex % 4 === 0 });
      t += beatInterval;
      beatIndex++;
    }
    return beats;
  }, [realBeats, bpm, duration]);

  /** 像素/秒 比例（缩放级别） */
  const PIXELS_PER_SECOND = 80;
  /** 播放头固定位置（占 canvas 宽度的比例） */
  const PLAYHEAD_RATIO = 0.3;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const containerWidth = container.clientWidth;
    const height = 160;

    canvas.width = containerWidth * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const _totalWidth = duration * PIXELS_PER_SECOND;
    const playheadX = containerWidth * PLAYHEAD_RATIO;

    // 计算滚动偏移：播放头固定在 playheadX，波形向左滚动
    let offset: number;
    if (isPlaying && currentTimeRef.current > 0) {
      offset = currentTimeRef.current * PIXELS_PER_SECOND - playheadX;
    } else {
      offset = scrollOffsetRef.current;
    }
    scrollOffsetRef.current = offset;

    // 清空画布
    ctx.clearRect(0, 0, containerWidth, height);

    const waveYTop = 20;
    const waveYBottom = 100;
    const waveHeight = waveYBottom - waveYTop;
    const waveMidY = (waveYTop + waveYBottom) / 2;

    // --- 1. 波形层 ---
    if (peaks.length > 0) {
      const _samplesPerPixel = (duration / peaks.length) * PIXELS_PER_SECOND;
      const startIndex = Math.max(
        0,
        Math.floor(((offset / PIXELS_PER_SECOND) * peaks.length) / duration),
      );
      const endIndex = Math.min(
        peaks.length - 1,
        Math.ceil(
          (((offset + containerWidth) / PIXELS_PER_SECOND) * peaks.length) /
            duration,
        ),
      );

      // 先用纯色填充波形区域
      ctx.fillStyle = CANVAS_FILL_COLOR;
      ctx.beginPath();

      let firstPoint = true;
      for (let i = startIndex; i <= endIndex; i++) {
        const t = (i / peaks.length) * duration;
        const x = t * PIXELS_PER_SECOND - offset;
        const peak = typeof peaks[i] === 'number' ? peaks[i] : 0;
        const y = waveMidY - peak * waveHeight * 0.5;

        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }

      // 绘制底部镜像（填充波形）
      for (let i = endIndex; i >= startIndex; i--) {
        const t = (i / peaks.length) * duration;
        const x = t * PIXELS_PER_SECOND - offset;
        const peak = typeof peaks[i] === 'number' ? peaks[i] : 0;
        const y = waveMidY + peak * waveHeight * 0.5;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();
    }

    // --- 2. 和弦段背景 ---
    chordSegments.forEach((seg) => {
      const segStartX = seg.startTime * PIXELS_PER_SECOND - offset;
      const segEndX = seg.endTime * PIXELS_PER_SECOND - offset;

      const isCurrent =
        currentTimeRef.current >= seg.startTime &&
        currentTimeRef.current < seg.endTime;

      if (segEndX >= 0 && segStartX <= containerWidth) {
        if (isCurrent) {
          ctx.fillStyle = CHORD_BG_COLOR;
          ctx.fillRect(
            Math.max(0, segStartX),
            0,
            Math.min(containerWidth, segEndX) - Math.max(0, segStartX),
            height,
          );
          // 边框
          ctx.strokeStyle = CHORD_BORDER_COLOR;
          ctx.lineWidth = 1;
          ctx.strokeRect(
            Math.max(0, segStartX),
            0,
            Math.min(containerWidth, segEndX) - Math.max(0, segStartX),
            height,
          );
        }
      }
    });

    // --- 3. 节拍线（视口裁剪 + 密度控制） ---
    const beats = computeBeats();
    // 二分找到可见范围
    const viewStartTime = offset / PIXELS_PER_SECOND;
    const viewEndTime = (offset + containerWidth) / PIXELS_PER_SECOND;
    let startIdx = 0,
      endIdx = beats.length;
    for (let lo = 0, hi = beats.length - 1; lo <= hi; ) {
      const mid = (lo + hi) >> 1;
      if (beats[mid].time < viewStartTime) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
        startIdx = mid;
      }
    }
    for (let lo = 0, hi = beats.length - 1; lo <= hi; ) {
      const mid = (lo + hi) >> 1;
      if (beats[mid].time <= viewEndTime) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
        endIdx = mid;
      }
    }
    const visibleCount = endIdx - startIdx;
    const showAll = visibleCount < 40; // <40 拍可见时全画，超过则只画强拍

    for (let i = startIdx; i < endIdx; i++) {
      const beat = beats[i];
      if (!showAll && !beat.isDownbeat) continue; // 高密度时只画强拍
      const x = beat.time * PIXELS_PER_SECOND - offset;
      ctx.strokeStyle = beat.isDownbeat ? DOWNBEAT_LINE_COLOR : BEAT_LINE_COLOR;
      ctx.lineWidth = beat.isDownbeat ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // --- 4. 小节线（只画可见强拍） ---
    for (let i = startIdx; i < endIdx; i++) {
      const beat = beats[i];
      if (!beat.isDownbeat) continue;
      const x = beat.time * PIXELS_PER_SECOND - offset;
      ctx.strokeStyle = MEASURE_LINE_COLOR;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // --- 5. 和弦标签 ---
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';

    chordSegments.forEach((seg) => {
      const segStartX = seg.startTime * PIXELS_PER_SECOND - offset;
      const segEndX = seg.endTime * PIXELS_PER_SECOND - offset;
      const segWidth = segEndX - segStartX;

      if (segEndX >= 0 && segStartX <= containerWidth) {
        const labelX =
          Math.max(0, segStartX) +
          Math.min(segWidth, containerWidth - Math.max(0, segStartX)) / 2;

        if (segWidth > 30) {
          // 足够宽才画标签
          const isCurrent =
            currentTimeRef.current >= seg.startTime &&
            currentTimeRef.current < seg.endTime;

          ctx.fillStyle = isCurrent ? '#ff9000' : CHORD_LABEL_COLOR;
          ctx.font = isCurrent
            ? 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif'
            : '12px -apple-system, BlinkMacSystemFont, sans-serif';

          const clampedX = Math.min(Math.max(labelX, 20), containerWidth - 20);
          ctx.fillText(seg.chord, clampedX, height - 8);
        }
      }
    });

    // --- 6. 播放头 ---
    const phX = currentTimeRef.current * PIXELS_PER_SECOND - offset;
    if (phX >= 0 && phX <= containerWidth) {
      ctx.strokeStyle = PLAYHEAD_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(phX, 0);
      ctx.lineTo(phX, height);
      ctx.stroke();

      // 播放头三角形指示器（Canvas 内可见）
      ctx.fillStyle = PLAYHEAD_COLOR;
      ctx.beginPath();
      ctx.moveTo(phX, 0);
      ctx.lineTo(phX - 5, 8);
      ctx.lineTo(phX + 5, 8);
      ctx.closePath();
      ctx.fill();
    }
  }, [peaks, duration, chordSegments, bpm, isPlaying, computeBeats]);

  // 播放时用 rAF 驱动重绘（30fps 节流）
  useEffect(() => {
    if (isPlaying) {
      let animating = true;
      let lastDraw = 0;
      const loop = (ts: number) => {
        if (!animating) return;
        if (ts - lastDraw >= 33) {
          // ~30fps
          draw();
          lastDraw = ts;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => {
        animating = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
    draw();
    return undefined;
  }, [isPlaying, draw]);

  // 尺寸变化时重绘
  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // 点击跳转
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const offset = scrollOffsetRef.current;
      const time = (clickX + offset) / PIXELS_PER_SECOND;

      if (time >= 0 && time <= duration) {
        onSeek(Math.max(0, Math.min(time, duration)));
      }
    },
    [duration, onSeek],
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 170,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 6,
        background: '#fafafa',
        cursor: 'pointer',
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          display: 'block',
          width: '100%',
          height: 160,
        }}
      />
      {/* 时间轴 */}
      <div
        style={{
          height: 10,
          width: '100%',
          position: 'relative',
          background: '#f5f5f5',
          borderTop: '1px solid #e8e8e8',
        }}
      />
    </div>
  );
};

export default WaveformCanvas;
