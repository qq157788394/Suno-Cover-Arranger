/**
 * 大师扒谱 — 页面主入口（Phase A2）
 *
 * 形态：上传音频 → 调用本机 Python 引擎（localhost）→ 展示和弦时间轴。
 * 与「大师看和弦」并列、互不影响：大师看和弦走浏览器内 essentia，本页走本地引擎。
 *
 * 本阶段范围（对齐 spec Phase A2）：
 * - 上传 / 分析 / 结果展示；不做进度条与引擎切换（留 Phase B）。
 * - 引擎未启动 → 明确引导安装，不静默降级浏览器。
 * - 复用 FileDropZone；不触碰 WaveformCanvas（卡顿、未使用）。
 */

import { ReloadOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, message, Space, Spin, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranscription } from '@/hooks/useTranscription';
import FileDropZone from '@/pages/chord-analysis/components/FileDropZone';
import BeatGrid from './components/BeatGrid';

const { Paragraph, Text } = Typography;

const INSTALL_COMMANDS = `cd local-engine
uv sync                 # 按 pyproject.toml 装全部依赖（含 madmom / chord-romanizer）
uv run python main.py   # 启动服务（默认 http://127.0.0.1:18741）`;

// 客户端环境切换（dev 工具）：仅在 Tauri 壳内显示。
// 检测到 Tauri v2 注入的全局对象即视为客户端（纯浏览器无此全局，按钮不渲染）。
// 作用：在「线上（GitHub Pages）」与「本地开发（localhost:8000）」之间一键切换；
// 切换后通过 URL 参数回传，页面重载后弹出提示告知当前所处环境。
//
// —— 以下两处按你的实际部署填写 / 调整 ——
const GH_PAGES_ORIGIN = 'https://qq157788394.github.io';
const GH_PAGES_REPO = 'Suno-Cover-Arranger'; // gh-pages 仓库子路径前缀（PUBLIC_PATH 未设置时为仓库名）
const LOCAL_ORIGIN = 'http://localhost:8000';

// 跨域导航后用 URL 参数回传切换结果（sessionStorage 按 origin 隔离，跨域会丢失，故用 URL 参数）
const ENV_SWITCH_PARAM = '__env';

type EnvKind = 'local' | 'ghpages';

function isRunningInTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}

// 依据当前加载的 origin 判断环境：localhost / 127.0.0.1 → 本地；*.github.io → 线上
function currentEnv(): EnvKind {
  const { origin } = window.location;
  if (
    origin.startsWith('http://localhost') ||
    origin.startsWith('http://127.0.0.1')
  ) {
    return 'local';
  }
  return 'ghpages';
}

// 计算切换到目标环境后的完整 URL，保留当前路径（兼容 gh-pages 的 /Suno-Cover-Arranger 前缀）
function buildEnvUrl(target: EnvKind): string {
  const path = window.location.pathname;
  if (target === 'local') {
    const stripped = path.replace(new RegExp(`^/${GH_PAGES_REPO}`), '');
    return LOCAL_ORIGIN + (stripped || '/');
  }
  const withPrefix = path.startsWith(`/${GH_PAGES_REPO}`)
    ? path
    : `/${GH_PAGES_REPO}${path}`;
  return GH_PAGES_ORIGIN + withPrefix;
}

const ChordTranscriptionPage: React.FC = () => {
  const {
    status,
    result,
    error,
    fileName,
    handleFileSelect,
    recheckEngine,
    reset,
  } = useTranscription();

  // 隐藏文件选择器用于重新上传
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 音频 blob URL：从上传的 File 创建，用于内置播放器
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // 当文件被选中时保存引用（在分析前）
  const handleFileSelectWithRef = useCallback(
    (file: File) => {
      fileRef.current = file;
      handleFileSelect(file);
    },
    [handleFileSelect],
  );

  // 分析完成后创建 blob URL
  useEffect(() => {
    if (status === 'READY' && fileRef.current) {
      const url = URL.createObjectURL(fileRef.current);
      setAudioUrl(url);
      audioUrlRef.current = url;
    }
    return () => {};
  }, [status]);

  // 重置或卸载时清理 blob URL
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  // 客户端探测（壳内为 true，浏览器为 false）；Tauri 注入全局在 React 挂载前已就绪
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(isRunningInTauri());
  }, []);

  // 当前环境（线上 / 本地），随页面实际加载的 origin 变化
  const [env, setEnv] = useState<EnvKind>(() =>
    typeof window !== 'undefined' ? currentEnv() : 'ghpages',
  );
  useEffect(() => {
    setEnv(currentEnv());
  }, []);

  // 切换环境：在目标 URL 上带 __env 参数跳转，重载后由下方 effect 弹提示并清理参数
  const handleEnvSwitch = useCallback(() => {
    if (!isClient) return;
    const target: EnvKind = env === 'local' ? 'ghpages' : 'local';
    const url = buildEnvUrl(target);
    const sep = url.includes('?') ? '&' : '?';
    window.location.href = `${url}${sep}${ENV_SWITCH_PARAM}=${target}`;
  }, [isClient, env]);

  // 重载后：若带有 __env 参数，说明刚完成切换，弹提示告知当前环境并清理 URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const switched = params.get(ENV_SWITCH_PARAM) as EnvKind | null;
    if (!switched) return;
    const label =
      switched === 'local'
        ? '已切换至本地开发环境 (localhost:8000)'
        : '已切换至线上环境 (GitHub Pages)';
    message.info(label);
    params.delete(ENV_SWITCH_PARAM);
    const clean =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : '') +
      window.location.hash;
    window.history.replaceState({}, '', clean);
  }, []);

  const handleReset = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
    fileRef.current = null;
    reset();
  }, [reset]);

  const isIdle = status === 'IDLE';
  const isAnalyzing = status === 'ANALYZING';
  const isReady = status === 'READY';
  const isError = status === 'ERROR';
  const isOffline = status === 'ENGINE_OFFLINE';

  const handleReupload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleReuploadFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      e.target.value = '';
    },
    [handleFileSelect],
  );

  const hasFullEngine =
    result?.key != null || result?.bpm != null || result?.rhythm != null;

  return (
    <PageContainer
      header={{
        title: '大师扒谱',
        subTitle:
          '调用本机 Python 引擎，离线识别 SOTA 级和弦 / 调性 / BPM / 节奏',
        ghost: true,
      }}
    >
      <ProCard>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleReuploadFileChange}
        />

        {/* ========== 状态：未上传 ========== */}
        {isIdle && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <FileDropZone
              disabled={false}
              onFileSelect={handleFileSelectWithRef}
            />
          </div>
        )}

        {/* ========== 状态：分析中 ========== */}
        {isAnalyzing && (
          <div
            style={{
              maxWidth: 640,
              margin: '0 auto',
              padding: '48px 0',
              textAlign: 'center',
            }}
          >
            <Spin tip="正在调用本地高精度引擎分析…" size="large">
              <div style={{ height: 1 }} />
            </Spin>
            {fileName && (
              <div style={{ marginTop: 16, color: '#6B7280', fontSize: 13 }}>
                {fileName}
              </div>
            )}
          </div>
        )}

        {/* ========== 状态：引擎未启动 ========== */}
        {isOffline && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <Alert
              type="warning"
              showIcon
              message="未检测到本地引擎"
              description="大师扒谱依赖你本机运行的 Python 引擎（音频不出本机）。请在本机按以下步骤安装并启动："
            />
            <Paragraph
              style={{
                marginTop: 16,
                background: '#0F1419',
                color: '#E5E7EB',
                padding: 16,
                borderRadius: 12,
                fontFamily: 'monospace',
                fontSize: 13,
                whiteSpace: 'pre-wrap',
              }}
            >
              {INSTALL_COMMANDS}
            </Paragraph>
            <Text type="secondary" style={{ fontSize: 12 }}>
              需 Python ≥ 3.10 与 uv；Windows 用户还需自行安装 ffmpeg 并加入
              PATH。仅绑定 127.0.0.1，仅本机可调用。
            </Text>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <Button
                type="primary"
                loading={isAnalyzing}
                onClick={recheckEngine}
                style={{ borderRadius: 8 }}
              >
                重试检测引擎
              </Button>
              <Button onClick={handleReset} style={{ borderRadius: 8 }}>
                返回上传
              </Button>
            </div>
          </div>
        )}

        {/* ========== 状态：错误 ========== */}
        {isError && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <Alert
              type="error"
              showIcon
              message="分析失败"
              description={error}
            />
            <div style={{ marginTop: 16 }}>
              <Button onClick={handleReset} style={{ borderRadius: 8 }}>
                重新上传
              </Button>
            </div>
          </div>
        )}

        {/* ========== 状态：完成 ========== */}
        {isReady && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 精简模式提示 */}
            {!hasFullEngine && (
              <Alert
                type="info"
                showIcon
                message="当前为精简模式（仅和弦）"
                description="安装完整引擎（含 madmom / chord-romanizer）可获取调性、BPM、节奏网格与功能级数。"
              />
            )}

            {/* 文件信息 + 调性/BPM */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Text strong style={{ fontSize: 15 }}>
                {result.fileName || fileName}
              </Text>
              {result.key != null && (
                <Tag color="orange" style={{ borderRadius: 8 }}>
                  Key: {result.key}
                </Tag>
              )}
              {result.bpm != null && (
                <Tag color="green" style={{ borderRadius: 8 }}>
                  {result.bpm} BPM
                </Tag>
              )}
              {result.rhythm && (
                <Tag style={{ borderRadius: 8 }}>
                  {result.rhythm.bars} 小节 /{' '}
                  {result.rhythm.beats_per_bar ?? '?'} 拍每小节
                </Tag>
              )}
            </div>

            {/* 操作栏 */}
            <Space size={12}>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={handleReupload}
                style={{ borderRadius: 8, color: '#6B7280' }}
              >
                重新上传
              </Button>
            </Space>

            {/* 拍级和弦网格（弹唱视图） */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #F3F4F6',
                padding: '20px 16px',
              }}
            >
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                和弦网格
              </Text>
              <BeatGrid
                chords={result.chords}
                rhythm={result.rhythm}
                roman={result.roman}
                audioUrl={audioUrl}
              />
            </div>

            {/* 降级提示 */}
            {result.warnings.length > 0 && (
              <Alert
                type="info"
                showIcon
                message="分析提示"
                description={
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.warnings.map((w) => (
                      <li key={w} style={{ fontSize: 13 }}>
                        {w}
                      </li>
                    ))}
                  </ul>
                }
              />
            )}
          </div>
        )}
      </ProCard>

      {/* 客户端环境切换：线上 / 本地 一键切换，仅壳内可见；切换后弹出环境提示 */}
      {isClient && (
        <button
          type="button"
          onClick={handleEnvSwitch}
          title={
            env === 'local'
              ? '当前：本地开发 (localhost:8000)\n点击切换到线上 (GitHub Pages)'
              : '当前：线上 (GitHub Pages)\n点击切换到本地开发 (localhost:8000)'
          }
          style={{
            position: 'fixed',
            bottom: 12,
            right: 12,
            height: 24,
            padding: '0 10px',
            border: 'none',
            borderRadius: 12,
            background: env === 'local' ? '#FF9000' : '#374151',
            color: '#fff',
            fontSize: 12,
            lineHeight: '24px',
            cursor: 'pointer',
            zIndex: 9999,
            opacity: 0.4,
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
        >
          {env === 'local' ? '🖥 本地' : '🌐 线上'}
        </button>
      )}
    </PageContainer>
  );
};

export default ChordTranscriptionPage;
