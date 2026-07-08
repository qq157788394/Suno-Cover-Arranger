import { Button, Flex, Result, Spin, Typography } from "antd";

const { Text } = Typography;

import React from "react";
import FileDropZone from "@/pages/chord-analysis/components/FileDropZone";
import type {
  TranscriptionResult,
  TranscriptionStatus,
} from "@/shared/types/types";
import AnalysisResultCard from "./AnalysisResultCard";

/**
 * 引擎就绪后的上传 / 分析 / 结果 / 异常工作区。
 * 注意：ENGINE_OFFLINE 已合并到 EngineSetupPanel（由容器层按 showSetup 统一渲染），此处不处理。
 */
export function AnalysisWorkspace({
  status,
  result,
  fileName,
  audioUrl,
  onFileSelect,
  onReset,
  onReupload,
}: {
  status: TranscriptionStatus;
  result: TranscriptionResult | null;
  fileName: string | null;
  audioUrl: string | null;
  onFileSelect: (file: File) => void;
  onReset: () => void;
  onReupload: () => void;
}) {
  const isIdle = status === "IDLE";
  const isAnalyzing = status === "ANALYZING";
  const isError = status === "ERROR";
  const isReady = status === "READY";

  if (isIdle) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <FileDropZone disabled={false} onFileSelect={onFileSelect} />
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <Flex justify="center" align="center" vertical gap="medium">
        <Spin size="large" description="分析中，请耐心等待" />
        <Text strong>{fileName}</Text>
      </Flex>
    );
  }

  if (isError) {
    return (
      <Result
        status="500"
        title="分析失败（引擎返回异常）"
        subTitle="若为引擎内部报错，可查看软件目录engine.log获取完整堆栈。"
        extra={[
          <Button key="retry" onClick={onReset}>
            重新上传
          </Button>,
        ]}
      />
    );
  }

  if (isReady && result) {
    return (
      <AnalysisResultCard
        result={result}
        fileName={fileName}
        audioUrl={audioUrl}
        onReupload={onReupload}
      />
    );
  }

  return null;
}

export default AnalysisWorkspace;
