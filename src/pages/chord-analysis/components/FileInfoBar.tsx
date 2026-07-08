/**
 * FileInfoBar — 文件信息栏组件
 *
 * 展示已上传音频文件的基本信息和分析结果元数据：
 * - 左侧：文件名 + 时长 / 文件大小
 * - 右侧：Key Pill（橙色 #FF9000）+ BPM Pill（绿色 #10B981）
 */

import React from "react";
import KeyBpmDisplay from "./KeyBpmDisplay";

export interface FileInfoBarProps {
  /** 文件名 */
  fileName: string;
  /** 音频时长（秒） */
  duration: number;
  /** 文件大小（字节，可选） */
  fileSize?: number;
  /** 调式名，如 "E Major" */
  keyName: string;
  /** 调式置信度 0-1 */
  keyConfidence: number;
  /** BPM */
  bpm: number;
  /** BPM 置信度 0-1 */
  bpmConfidence: number;
}

/** 格式化秒为 mm:ss */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** 格式化文件大小 */
function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

const FileInfoBar: React.FC<FileInfoBarProps> = ({
  fileName,
  duration,
  fileSize,
  keyName,
  keyConfidence,
  bpm,
  bpmConfidence,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        padding: "14px 20px",
        background: "#FFFFFF",
        borderRadius: 12,
        border: "1px solid #F3F4F6",
      }}
    >
      {/* 左侧：文件信息 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#0F1419",
            lineHeight: "20px",
          }}
        >
          {fileName}
        </span>
        <span
          style={{
            fontSize: 12,
            color: "#6B7280",
            lineHeight: "16px",
          }}
        >
          {formatTime(duration)}
          {fileSize ? ` · ${formatSize(fileSize)}` : ""}
        </span>
      </div>

      {/* 右侧：Key + BPM Pill */}
      <KeyBpmDisplay
        keyName={keyName}
        keyConfidence={keyConfidence}
        bpm={bpm}
        bpmConfidence={bpmConfidence}
      />
    </div>
  );
};

export default FileInfoBar;
