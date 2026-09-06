import { Button, Flex, Result, Typography } from "antd";

const { Paragraph, Text } = Typography;

import React from "react";
import type { EngineStatusDetail } from "../types";
import EngineDependencyPanel from "./EngineDependencyPanel";
import TerminalLog from "./TerminalLog";

/**
 * 未就绪态容器：依赖清单 + 热更新入口 + 终端日志。
 * offline=true 表示「上传中途引擎断开」（合并自原 AnalysisWorkspace 的 ENGINE_OFFLINE 分支），
 * 文案切换为连接中断，但面板内容一致——统一走检测/更新/重装入口。
 */
export function EngineSetupPanel({
  detail,
  detectError,
  updating,
  updateLog,
  updateAvailable = false,
  offline = false,
  onDetect,
  onUpdate,
  onCheckUpdate,
}: {
  detail: EngineStatusDetail | null;
  detectError: string | null;
  updating: boolean;
  updateLog: string[];
  updateAvailable?: boolean;
  offline?: boolean;
  onDetect: () => void;
  onUpdate: () => void;
  onCheckUpdate: () => void;
}) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <Result
        status="404"
        title={offline ? "引擎连接中断" : "本地引擎未就绪"}
        subTitle={
          offline
            ? "上传时无法连接到本地引擎，可能已停止运行。可重新检测，或检查更新以重启/修复。"
            : "内置引擎未完全就绪，点击「检查并更新引擎」可下载签名引擎包原子替换（失败自动回退，不降级）。"
        }
        extra={[
          <Flex key="actions" gap="medium">
            <Button
              type="primary"
              loading={updating}
              onClick={onUpdate}
              style={{ borderRadius: 8 }}
            >
              {updating
                ? "正在更新引擎…"
                : updateAvailable
                  ? "立即更新引擎"
                  : "检查并更新引擎"}
            </Button>
            <Button
              onClick={onCheckUpdate}
              disabled={updating}
              style={{ borderRadius: 8 }}
            >
              检查更新
            </Button>
            <Button
              onClick={onDetect}
              disabled={updating}
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
            <Text strong>依赖安装情况（哪项通过一目了然）</Text>
          </Paragraph>
          {detail ? (
            <EngineDependencyPanel detail={detail} />
          ) : (
            <Text type="secondary">状态查询失败，请点击「重试检测」。</Text>
          )}
        </div>
      </Result>

      {(updating || updateLog.length > 0) && <TerminalLog lines={updateLog} />}
    </div>
  );
}

export default EngineSetupPanel;
