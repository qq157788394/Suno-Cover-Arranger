/**
 * ChordGrid — 拍级和弦网格
 *
 * 每行 16 拍（4 小节 × 4 拍），每拍一个方格。
 * - 小节间距 16px，拍间距 4px
 * - 小节第一拍（downbeat）必显示和弦文字
 * - 后续拍若与前拍同和弦则只显示方格占位
 * - 和弦变更点也会显示文字
 * - 当前播放拍高亮
 * - displayMode='chord'|'degree' 控制展示内容
 */

import { Typography } from "antd";
import React, { useMemo } from "react";
import type { BeatChord } from "@/shared/types/types";

const { Text } = Typography;

export interface ChordGridProps {
  /** 拍级和弦列表 */
  beatChords: BeatChord[];
  /** BPM */
  bpm: number;
  /** 当前播放时间（秒） */
  currentTime: number;
  /** 展示模式 */
  displayMode: "chord" | "degree";
}

const BEATS_PER_ROW = 16;
const BEATS_PER_MEASURE = 4;

// 方格的尺寸
const CELL_SIZE = 64;
// 拍间距
const BEAT_GAP = 4;
// 小节间距（前端的 space）
const MEASURE_GAP = 16;

/** 拍级单元格渲染数据 */
interface Cell {
  /** 拍号 (0-based) */
  beatIndex: number;
  /** 和弦名 */
  chord: string;
  /** 级数 */
  degree: string;
  /** 是否当前播放拍 */
  isCurrent: boolean;
  /** 是否已播放 */
  isPast: boolean;
  /** 是否小节第一拍（必显示文字） */
  isDownbeat: boolean;
  /** 是否和弦变更点（也显示文字） */
  isChordChange: boolean;
}

/** 单格样式 */
function cellStyle(cell: Cell): React.CSSProperties {
  const base: React.CSSProperties = {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    cursor: "default",
    transition: "background 0.2s, box-shadow 0.2s",
  };

  if (!cell.chord) {
    return { ...base, background: "#F9F9FB", border: "1px dashed #E5E7EB" };
  }
  if (cell.isCurrent) {
    return {
      ...base,
      background: "#374151",
      color: "#FFFFFF",
      boxShadow: "0 2px 8px rgba(55,65,81,0.35)",
    };
  }
  if (cell.isPast) {
    return { ...base, background: "#F3F4F6", opacity: 0.45 };
  }
  return { ...base, background: "#FFFFFF", border: "1px solid #D1D5DB" };
}

const ChordGrid: React.FC<ChordGridProps> = ({
  beatChords,
  bpm,
  currentTime,
  displayMode,
}) => {
  const cells = useMemo<Cell[]>(() => {
    const beatInterval = 60 / bpm;
    return beatChords.map((bc, i) => {
      const beatTime = i * beatInterval;
      const isDownbeat = i % BEATS_PER_MEASURE === 0;
      const isChordChange = !!(
        !isDownbeat &&
        i > 0 &&
        bc.chord &&
        bc.chord !== beatChords[i - 1].chord
      );

      return {
        beatIndex: i,
        chord: bc.chord,
        degree: bc.degree,
        isCurrent:
          currentTime >= beatTime && currentTime < beatTime + beatInterval,
        isPast: beatTime + beatInterval <= currentTime,
        isDownbeat,
        isChordChange,
      };
    });
  }, [beatChords, bpm, currentTime]);

  // 按行分组
  const rows = useMemo<Cell[][]>(() => {
    const result: Cell[][] = [];
    for (let i = 0; i < cells.length; i += BEATS_PER_ROW) {
      result.push(cells.slice(i, i + BEATS_PER_ROW));
    }
    return result;
  }, [cells]);

  if (beatChords.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 0",
        }}
      >
        <Text type="secondary">暂无可显示的和弦数据</Text>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 表头：前奏 label + 小节标签 */}
      <div style={{ display: "flex", paddingLeft: 0 }}>
        <div style={{ width: 64, flexShrink: 0 }} />
        {(["section-0", "section-1", "section-2", "section-3"] as const).map(
          (key, m) => (
            <div
              key={key}
              style={{
                width: BEATS_PER_MEASURE * (CELL_SIZE + BEAT_GAP) - BEAT_GAP,
                textAlign: "center",
                marginLeft: m > 0 ? MEASURE_GAP : 0,
              }}
            >
              <Text type="secondary">第{m + 1}小节</Text>
            </div>
          ),
        )}
      </div>

      {/* 内容行 */}
      {rows.map((row, rowIndex) => (
        <div
          key={row[0]?.beatIndex ?? rowIndex}
          style={{ display: "flex", alignItems: "center" }}
        >
          {/* 行标签 */}
          <div
            style={{
              width: 64,
              height: CELL_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 8,
              flexShrink: 0,
            }}
          >
            <Text type="secondary">{rowIndex + 1}</Text>
          </div>

          {/* 方格 */}
          {row.map((cell, colIndex) => {
            const isShowText = cell.isDownbeat || cell.isChordChange;
            const textColor = cell.isCurrent ? "#FFFFFF" : "#1F2937";

            // 小节间距
            const marginLeft =
              colIndex > 0 && colIndex % BEATS_PER_MEASURE === 0
                ? MEASURE_GAP
                : colIndex === 0
                  ? 0
                  : BEAT_GAP;

            return (
              <div
                key={cell.beatIndex}
                style={{
                  ...cellStyle(cell),
                  marginLeft,
                  flexShrink: 0,
                }}
                title={`${cell.chord || "—"} ${cell.degree || ""} (${displayMode})`}
              >
                {cell.chord && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: cell.isCurrent ? 700 : 600,
                      color: textColor,
                      maxWidth: CELL_SIZE - 8,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {isShowText
                      ? displayMode === "degree" && cell.degree
                        ? cell.degree
                        : cell.chord
                      : ""}
                  </span>
                )}
                {!cell.chord && (
                  <span style={{ fontSize: 10, color: "#D1D5DB" }}>—</span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* 底部说明 */}
      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#9CA3AF",
          paddingTop: 4,
        }}
      >
        每行 4 小节，每小节 4 拍 · 跟随播放实时高亮当前拍 ·{" "}
        {displayMode === "degree" ? "展示功能级数" : "展示和弦名称"}
      </div>
    </div>
  );
};

export default ChordGrid;
