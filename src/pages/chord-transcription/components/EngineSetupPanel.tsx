import { Button, Flex, Result, Typography } from "antd";

const { Paragraph, Text } = Typography;

import React from "react";
import type { EngineStatusDetail } from "../types";
import EngineDependencyPanel from "./EngineDependencyPanel";
import TerminalLog from "./TerminalLog";

/**
 * 未就绪态容器：依赖清单 + 安装入口 + 终端日志。
 * offline=true 表示「上传中途引擎断开」（合并自原 AnalysisWorkspace 的 ENGINE_OFFLINE 分支），
 * 文案切换为连接中断，但面板内容一致——统一走检测/安装/重装入口。
 */
export function EngineSetupPanel({
  detail,
  detectError,
  installing,
  installLog,
  offline = false,
  prefetchingId,
  onDetect,
  onInstall,
  onPrefetch,
}: {
  detail: EngineStatusDetail | null;
  detectError: string | null;
  installing: boolean;
  installLog: string[];
  offline?: boolean;
  prefetchingId: string | null;
  onDetect: () => void;
  onInstall: () => void;
  onPrefetch: (id: string) => void;
}) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <Result
        status="404"
        title={offline ? "引擎连接中断" : "本地引擎未就绪"}
        subTitle={
          offline
            ? "上传时无法连接到本地引擎，可能已停止运行。可重新检测，或一键安装 & 启动以重启。"
            : "需先安装并启动，击下方一键安装可自动完成"
        }
        extra={[
          <Flex key="install" gap="medium">
            <Button
              type="primary"
              loading={installing}
              onClick={onInstall}
              style={{ borderRadius: 8 }}
            >
              {installing ? "正在安装并启动…" : "一键安装 & 启动"}
            </Button>
            <Button
              onClick={onDetect}
              disabled={installing}
              style={{ borderRadius: 8 }}
            >
              重试检测
            </Button>
          </Flex>,
        ]}
      >
        <div className="desc">
          {/* invoke 失败时的明确报错 */}
          {detectError && (
            <Paragraph>
              <Text>状态查询异常：{detectError}</Text>
            </Paragraph>
          )}
          <Paragraph>
            <Text strong>"依赖安装情况（哪项通过一目了然）"</Text>
          </Paragraph>
          {detail ? (
            <EngineDependencyPanel
              detail={detail}
              prefetchingId={prefetchingId}
              onPrefetch={onPrefetch}
            />
          ) : (
            <Text type="secondary">状态查询失败，请点击「重试检测」。</Text>
          )}
        </div>
      </Result>

      {(installing || installLog.length > 0) && (
        <TerminalLog lines={installLog} />
      )}
    </div>
  );
}

export default EngineSetupPanel;
