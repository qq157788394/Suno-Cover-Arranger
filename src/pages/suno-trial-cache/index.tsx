/**
 * Suno 试听缓存页面
 *
 * 功能：粘贴 Suno 分享链接 → 点「解析」→ 桌面壳内走端到端流水线
 * （解析 → 取权 → 下载 → 解密 → ffmpeg 转 320kbps MP3），右栏实时展示阶段进度、
 * 错误信息；成功后给出播放预览（asset 协议直连）与「下载 MP3」按钮（另存到下载目录）。
 *
 * 布局对齐「参考音频预处理」：左右两栏，左=输入+解析，右=处理结果。
 * 环境校验对齐「大师扒谱·引擎版」：非客户端渲染引导面板，客户端才进入功能。
 * 定位为「试听缓存」而非「下载」，规避合规问题（详见 docs/试听下载技术方案.md）。
 */
import { DownloadOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProDescriptions,
  ProForm,
  ProFormText,
} from "@ant-design/pro-components";
import {
  Alert,
  Button,
  Col,
  Empty,
  message,
  Progress,
  Row,
  Space,
  Steps,
  Tag,
  Typography,
} from "antd";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useMemo, useState } from "react";
import { isRunningInTauri } from "@/shared/utils/tauri";
import ClientRequiredPanel from "./components/ClientRequiredPanel";

const { Text } = Typography;

/** 流水线步骤（与 Rust 端 on_stage 节点对应，用于 Steps 展示）。 */
const STEPS = ["下载", "取权", "解密", "转码"] as const;

/** Rust 端阶段事件 → 步骤下标与完成比例（阶段权重估算的整体百分比）。 */
function stageToInfo(stage: string): { step: number; percent: number } {
  switch (stage) {
    case "下载":
      return { step: 0, percent: 10 };
    case "取权":
      return { step: 1, percent: 30 };
    case "下载完成":
      return { step: 1, percent: 45 };
    case "解密":
      return { step: 2, percent: 55 };
    case "解密完成":
      return { step: 2, percent: 80 };
    case "转码":
      return { step: 3, percent: 90 };
    case "完成":
      return { step: 4, percent: 100 };
    default:
      return { step: 0, percent: 0 };
  }
}

/** 字节数格式化为可读单位。 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** 把秒数格式化为 mm:ss（保留一位小数秒可展示码率时长的场景）。 */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** run_trial_cache 返回结果的结构（Rust 端 suno_probe::run_trial_pipeline 的 JSON）。 */
interface TrialResult {
  content_id: string;
  title?: string | null;
  artist?: string | null;
  mp3_path: string;
  mp3_size: number;
  duration_sec?: number | null;
  bitrate_kbps?: number | null;
  channels?: number | null;
  sample_rate?: number | null;
  has_key32?: boolean;
}

/** 试听解析表单字段。 */
interface ParseFormData {
  link: string;
}

/**
 * Suno 试听缓存主页面（客户端环境：左右两栏）。
 * 左栏输入分享链接并点「解析」；右栏实时渲染进度 / 错误 / 结果（预览+下载）。
 */
const SunoTrialCachePanel: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrialResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  /** 解析提交：走端到端流水线，期间监听阶段进度，成功后读取 mp3 构建预览/下载。 */
  const handleParse = useCallback(async (values: ParseFormData) => {
    const link = values.link.trim();
    if (!link) {
      message.error("请先粘贴 Suno 分享链接");
      return;
    }
    setRunning(true);
    setStep(0);
    setPercent(0);
    setError(null);
    setResult(null);
    setPreviewUrl(null);
    setDownloaded(false);
    setSavedPath(null);

    // 阶段进度事件：Rust 侧 emit("suno-trial-progress", { stage })
    const unlisten = await listen<{ stage: string }>(
      "suno-trial-progress",
      (e) => {
        const info = stageToInfo(e.payload.stage);
        setStep(info.step);
        setPercent(info.percent);
      },
    );

    try {
      const res = await invoke<TrialResult>("run_trial_cache", { link });
      setResult(res);
      setStep(4);
      setPercent(100);
      // 预览：asset 协议直连本地 mp3（去 base64 中转，10MB+ 不再经 IPC 整包编码）。
      setPreviewUrl(convertFileSrc(res.mp3_path));
      message.success("解析成功，已生成 320kbps MP3");
    } catch (err) {
      setStep(-1);
      setPercent(0);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
      unlisten?.();
    }
  }, []);

  /** 在系统文件管理器中打开已保存 mp3 所在文件夹并选中该文件。 */
  const handleOpenFolder = useCallback(async () => {
    if (!savedPath) return;
    try {
      await invoke("reveal_in_folder", { path: savedPath });
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  }, [savedPath]);

  /** 下载 MP3：调用 Rust 把缓存 mp3 另存到系统「下载」目录（歌曲名命名），成功后提示「打开所在文件夹」。 */
  const handleDownload = useCallback(async () => {
    if (!result) return;
    try {
      const saved = await invoke<string>("save_trial_mp3", {
        mp3Path: result.mp3_path,
        filename: result.title || result.content_id,
      });
      setSavedPath(saved);
      setDownloaded(true);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  }, [result]);

  return (
    <Row gutter={[24, 0]}>
      {/* 左侧：链接输入 + 解析 */}
      <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
        <ProCard title="试听解析" style={{ height: "100%" }}>
          <ProForm<ParseFormData>
            layout="vertical"
            onFinish={handleParse}
            submitter={{
              render: () => (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={running}
                  size="large"
                  block
                >
                  {running ? "解析中…" : "解析"}
                </Button>
              ),
            }}
          >
            <ProFormText
              name="link"
              label="Suno 分享链接"
              placeholder="粘贴 Suno 分享链接，如 https://suno.com/s/xxxxxxx"
              rules={[{ required: true, message: "请输入分享链接" }]}
              fieldProps={{ size: "large" }}
              disabled={running}
            />
          </ProForm>
        </ProCard>
      </Col>

      {/* 右侧：处理结果（进度 / 错误 / 预览） */}
      <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
        <ProCard title="处理结果" style={{ height: "100%" }}>
          {running ? (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Progress percent={percent} status="active" />
              <Steps
                current={step >= 0 && step < 4 ? step : 0}
                items={STEPS.map((label, i) => ({
                  title: label,
                  status: step > i ? "finish" : step === i ? "process" : "wait",
                }))}
              />
            </Space>
          ) : error ? (
            <Alert
              type="error"
              showIcon
              message="解析失败"
              description={error}
            />
          ) : !result ? (
            <Empty
              description="粘贴分享链接并点击「解析」后，进度与结果将在此显示"
              style={{ marginTop: 40, marginBottom: 40 }}
            />
          ) : (
            <>
              <ProDescriptions column={1} size="small" bordered>
                <ProDescriptions.Item label="标题">
                  {result.title || "—"}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="分享者">
                  {result.artist || "—"}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="时长">
                  {result.duration_sec
                    ? formatDuration(result.duration_sec)
                    : "—"}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="码率">
                  <Tag color="orange">
                    {result.bitrate_kbps ? `${result.bitrate_kbps} kbps` : "—"}
                  </Tag>
                </ProDescriptions.Item>
                <ProDescriptions.Item label="文件大小">
                  <Tag>{formatBytes(result.mp3_size)}</Tag>
                </ProDescriptions.Item>
              </ProDescriptions>

              {previewUrl && (
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginTop: 16, marginBottom: 16 }}
                >
                  <Text strong>播放预览</Text>
                  {/* biome-ignore lint/a11y/useMediaCaption: 生成的试听预览无需字幕 */}
                  <audio controls style={{ width: "100%" }} src={previewUrl}>
                    您的浏览器不支持音频播放
                  </audio>
                </Space>
              )}

              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                disabled={!previewUrl}
                block
              >
                下载 MP3
              </Button>

              {downloaded && (
                <Alert
                  type="success"
                  showIcon
                  style={{ marginTop: 12 }}
                  message="MP3 已保存到「下载」文件夹"
                  description={
                    savedPath
                      ? `文件名：${savedPath.split(/[\\/]/).pop()}`
                      : undefined
                  }
                  action={
                    <Button size="small" onClick={handleOpenFolder}>
                      打开所在文件夹
                    </Button>
                  }
                />
              )}
            </>
          )}
        </ProCard>
      </Col>
    </Row>
  );
};

/**
 * 页面顶层（薄编排层，对齐「大师扒谱·引擎版」）：环境判定一次，
 * 浏览器 → 引导下载客户端；客户端 → 左右两栏实际功能。
 */
const SunoTrialCache: React.FC = () => {
  const isClient = useMemo(() => isRunningInTauri(), []);
  return (
    <PageContainer
      header={{
        title: "Suno 试听缓存",
        subTitle:
          "粘贴分享链接，桌面端即时解析并转码为 320kbps MP3，可试听与下载",
        ghost: true,
      }}
    >
      {!isClient ? (
        <ClientRequiredPanel />
      ) : (
        <ProCard>
          <SunoTrialCachePanel />
        </ProCard>
      )}
    </PageContainer>
  );
};

export default SunoTrialCache;
