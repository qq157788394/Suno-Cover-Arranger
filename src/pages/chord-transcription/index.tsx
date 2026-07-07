/**
 * 大师扒谱 — 页面主入口
 *
 * 形态：Tauri 薄壳远程加载本页（gh-pages）→ 调用本机 Python 引擎（localhost）→ 展示和弦时间轴。
 * 与「大师看和弦」并列、互不影响：大师看和弦走浏览器内 essentia，本页走本地引擎。
 *
 * 本页交互要求（对齐用户反馈）：
 * 1. 音频上传前就展示「依赖安装情况」清单（uv / 源码 / .venv / 服务）。
 * 2. 一键安装时，用终端式实时日志展示进度与报错，让用户知道程序在跑。
 * 3. 引擎完全就绪后才能上传；上传后若服务抛错，把异常原文直接显示在界面上。
 */

import { ReloadOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { Alert, Button, message, Space, Spin, Tag, Typography } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranscription } from '@/hooks/useTranscription';
import FileDropZone from '@/pages/chord-analysis/components/FileDropZone';
import { LOCAL_ENGINE_BASE } from '@/services/transcription/client';
import BeatGrid from './components/BeatGrid';

const { Paragraph, Text } = Typography;

// 客户端环境切换（dev 工具）：仅在 Tauri 壳内显示。
const GH_PAGES_ORIGIN = 'https://qq157788394.github.io';
const GH_PAGES_REPO = 'Suno-Cover-Arranger';
const LOCAL_ORIGIN = 'http://localhost:8000';

const ENV_SWITCH_PARAM = '__env';
type EnvKind = 'local' | 'ghpages';

function isRunningInTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}

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

/** 引擎依赖清单状态（来自 Rust get_engine_status；浏览器模式下 uv/源码/.venv 为 null） */
type EngineStatusDetail = {
  uv_present: boolean | null;
  source_present: boolean | null;
  venv_present: boolean | null;
  running: boolean;
  port: number | null;
};

/** 单行依赖状态展示 */
function StatusRow({
  label,
  ok,
  port,
  hint,
}: {
  label: string;
  ok: boolean | null;
  port?: number | null;
  hint?: string;
}) {
  const mark = ok === null ? '—' : ok ? '✅' : '❌';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      <span style={{ fontSize: 14 }}>
        {label}
        {hint && (
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
            {hint}
          </Text>
        )}
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: 13 }}>
        {mark}
        {ok && port ? ` (localhost:${port})` : ''}
      </span>
    </div>
  );
}

/** 把安装日志渲染成终端式面板，报错行标红 */
function TerminalLog({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);
  return (
    <pre
      ref={ref}
      style={{
        marginTop: 16,
        maxHeight: 280,
        overflow: 'auto',
        background: '#0F1419',
        color: '#E5E7EB',
        padding: 16,
        borderRadius: 12,
        fontFamily: 'monospace',
        fontSize: 12,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
    >
      {lines.map((l) => {
        const isErr = /失败|error|Error|✗|traceback|Exception/i.test(l);
        return (
          <div key={l} style={isErr ? { color: '#F87171' } : undefined}>
            {l}
          </div>
        );
      })}
    </pre>
  );
}

/** 浏览器模式面板：本功能需桌面客户端，引导下载后永远结束（不再进入引擎逻辑） */
function ClientRequiredPanel() {
  return (
    <ProCard>
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          textAlign: 'center',
          padding: '40px 0',
        }}
      >
        <Alert
          type="info"
          showIcon
          message="本功能需要「大师来了」桌面客户端"
          description="大师扒谱调用本机 Python 引擎做离线高精度识别，音频不出本机；浏览器无法运行该引擎。请在桌面客户端中打开本功能。"
        />
        <Paragraph style={{ marginTop: 16 }}>
          客户端随安装包分发 Python 引擎与 uv 运行时，首次安装后即可离线使用。
        </Paragraph>
        <Paragraph>
          <a
            href="https://github.com/qq157788394/Suno-Cover-Arranger"
            target="_blank"
            rel="noreferrer"
          >
            前往项目主页下载客户端 →
          </a>
        </Paragraph>
      </div>
    </ProCard>
  );
}

const ChordTranscriptionPage: React.FC = () => {
  const { status, result, error, fileName, handleFileSelect, reset } =
    useTranscription();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const handleFileSelectWithRef = useCallback(
    (file: File) => {
      fileRef.current = file;
      // 客户端已确认引擎在跑：直接打固定地址，跳过 discoverEngine 端口扫描
      handleFileSelect(
        file,
        isRunningInTauri() ? LOCAL_ENGINE_BASE : undefined,
      );
    },
    [handleFileSelect],
  );

  useEffect(() => {
    if (status === 'READY' && fileRef.current) {
      const url = URL.createObjectURL(fileRef.current);
      setAudioUrl(url);
      audioUrlRef.current = url;
    }
    return () => {};
  }, [status]);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  // 环境判定：只在最顶层判一次。浏览器 → 面板A（引导下载客户端，永远结束）；客户端 → 全部走本地引擎逻辑。
  const isClient = useMemo(() => isRunningInTauri(), []);

  // 环境（线上 / 本地）
  const [env, setEnv] = useState<EnvKind>(() =>
    typeof window !== 'undefined' ? currentEnv() : 'ghpages',
  );
  useEffect(() => {
    setEnv(currentEnv());
  }, []);

  const handleEnvSwitch = useCallback(() => {
    if (!isClient) return;
    const target: EnvKind = env === 'local' ? 'ghpages' : 'local';
    const url = buildEnvUrl(target);
    const sep = url.includes('?') ? '&' : '?';
    window.location.href = `${url}${sep}${ENV_SWITCH_PARAM}=${target}`;
  }, [isClient, env]);

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

  // ───────── 引擎检测与安装 ─────────

  /** 引擎检测错误信息（仅 Tauri 模式：invoke 调用失败时设置） */
  const [detectError, setDetectError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [engineReady, setEngineReady] = useState(false);
  const [engineDetail, setEngineDetail] = useState<EngineStatusDetail | null>(
    null,
  );

  /**
   * 引擎状态检测 — 仅客户端路径（浏览器在渲染层直接走面板A，永不调用本函数）。
   *
   * 调用 Rust get_engine_status 获取 uv / 源码 / .venv / 服务 四项布尔状态；
   * 网关 = 四项全部通过（用户决策）才允许上传。invoke 失败时设置 detectError，UI 明确报错。
   */
  const detectEngine = useCallback(async () => {
    if (!isClient) return;
    setChecking(true);
    setDetectError(null);
    try {
      const detail = (await invoke('get_engine_status')) as EngineStatusDetail;
      setEngineDetail(detail);
      setEngineReady(
        !!detail.uv_present &&
          !!detail.source_present &&
          !!detail.venv_present &&
          !!detail.running,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setDetectError(`查询引擎状态失败: ${msg}`);
      setEngineDetail(null);
      setEngineReady(false);
    } finally {
      setChecking(false);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) detectEngine();
  }, [isClient, detectEngine]);

  // 安装流程状态
  const [installing, setInstalling] = useState(false);
  const [installLog, setInstallLog] = useState<string[]>([]);
  const [installError, setInstallError] = useState<string | null>(null);

  useEffect(() => {
    if (!isClient) return;
    let active = true;
    const unlisten: UnlistenFn[] = [];
    (async () => {
      const offProgress = await listen<string>(
        'engine-install-progress',
        (e) => {
          if (active) setInstallLog((prev) => [...prev, e.payload]);
        },
      );
      const offDone = await listen<{ ok: boolean; msg: string }>(
        'engine-install-done',
        (e) => {
          if (!active) return;
          setInstalling(false);
          if (e.payload.ok) {
            setInstallError(null);
            message.success('本地引擎安装完成，正在检测…');
            detectEngine();
          } else {
            setInstallError(e.payload.msg);
            message.error(`安装失败：${e.payload.msg}`);
          }
        },
      );
      // 壳层上报引擎真实端口（自动启动或安装后）
      const offReady = await listen<{ port: number; msg: string }>(
        'engine-ready',
        () => {
          if (!active) return;
          setInstallError(null);
          detectEngine();
        },
      );
      unlisten.push(offProgress, offDone, offReady);
    })();
    return () => {
      active = false;
      unlisten.forEach((u) => {
        u();
      });
    };
  }, [isClient, detectEngine]);

  const handleInstallEngine = useCallback(async () => {
    if (!isClient) return;
    setInstalling(true);
    setInstallLog([]);
    setInstallError(null);
    try {
      await invoke('install_local_engine');
    } catch (err) {
      setInstalling(false);
      message.error(`调用安装命令失败：${String(err)}`);
    }
  }, [isClient]);

  const isIdle = status === 'IDLE';
  const isAnalyzing = status === 'ANALYZING';
  const isReady = status === 'READY';
  const isError = status === 'ERROR';
  const isEngineOffline = status === 'ENGINE_OFFLINE';

  const handleReupload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleReuploadFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // 客户端已确认引擎在跑：直接打固定地址，跳过 discoverEngine 端口扫描
      if (file)
        handleFileSelect(
          file,
          isRunningInTauri() ? LOCAL_ENGINE_BASE : undefined,
        );
      e.target.value = '';
    },
    [handleFileSelect],
  );

  const hasFullEngine =
    result?.key != null || result?.bpm != null || result?.rhythm != null;

  // ───────── 渲染：检测中 / 引擎未就绪 / 上传流程 ─────────
  return (
    <PageContainer
      header={{
        title: '大师扒谱',
        subTitle:
          '调用本机 Python 引擎，离线识别 SOTA 级和弦 / 调性 / BPM / 节奏',
        ghost: true,
      }}
    >
      {!isClient ? (
        <ClientRequiredPanel />
      ) : (
        <>
          <ProCard>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={handleReuploadFileChange}
            />

            {/* 1) 检测中 */}
            {checking && (
              <div style={{ padding: '64px 0', textAlign: 'center' }}>
                <Spin tip="正在检测本地引擎…" size="large">
                  <div style={{ height: 1 }} />
                </Spin>
              </div>
            )}

            {/* 2) 引擎未就绪：上传前即展示依赖清单 + 安装入口 + 终端日志 */}
            {!checking && !engineReady && (
              <div style={{ maxWidth: 680, margin: '0 auto' }}>
                <Alert
                  type="warning"
                  showIcon
                  message="本地高精度引擎未就绪"
                  description="大师扒谱依赖本机运行的 Python 引擎（音频不出本机）。请先安装并启动，或点击下方一键安装。"
                />

                {/* invoke 失败时的明确报错 */}
                {detectError && (
                  <Alert
                    type="error"
                    showIcon
                    style={{ marginTop: 12 }}
                    message="状态查询异常"
                    description={detectError}
                  />
                )}

                <div
                  style={{
                    marginTop: 16,
                    background: '#FFFFFF',
                    borderRadius: 12,
                    border: '1px solid #F3F4F6',
                    padding: '16px 20px',
                  }}
                >
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>
                    {'依赖安装情况（哪项通过一目了然）'}
                  </Text>

                  {engineDetail ? (
                    <>
                      <StatusRow
                        label="uv 运行时"
                        ok={engineDetail.uv_present}
                        hint="用于创建隔离 Python 环境"
                      />
                      <StatusRow
                        label="引擎源码（随安装包分发）"
                        ok={engineDetail.source_present}
                        hint="local-engine/main.py"
                      />
                      <StatusRow
                        label="依赖环境 (.venv)"
                        ok={engineDetail.venv_present}
                        hint="已建则无需重新下载"
                      />
                      <StatusRow
                        label="引擎服务"
                        ok={engineDetail.running}
                        port={engineDetail.port}
                        hint="127.0.0.1"
                      />
                    </>
                  ) : (
                    <div
                      style={{
                        padding: '12px 0',
                        color: '#6B7280',
                        fontSize: 13,
                      }}
                    >
                      状态查询失败，请点击「重试检测」。
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    type="primary"
                    loading={installing}
                    onClick={handleInstallEngine}
                    style={{ borderRadius: 8 }}
                  >
                    {installing ? '正在安装并启动…' : '一键安装 & 启动'}
                  </Button>
                  <Button
                    onClick={detectEngine}
                    disabled={installing}
                    style={{ borderRadius: 8 }}
                  >
                    重试检测
                  </Button>
                </div>
                <Text
                  type="secondary"
                  style={{ fontSize: 12, marginTop: 8, display: 'block' }}
                >
                  引擎将安装到软件目录（~/Library/Application
                  Support/大师来了），首次需联网下载依赖（约数十 MB）。
                </Text>
                {installError && (
                  <Alert
                    type="error"
                    showIcon
                    style={{ marginTop: 12 }}
                    message="安装失败"
                    description={installError}
                  />
                )}
                {(installing || installLog.length > 0) && (
                  <TerminalLog lines={installLog} />
                )}
              </div>
            )}

            {/* 3) 引擎就绪：上传 / 分析 / 结果 / 异常 */}
            {!checking && engineReady && (
              <div>
                <Alert
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                  message={`本地高精度引擎已连接 · localhost:${engineDetail?.port ?? 18741}`}
                  description="音频仅在本机处理，不离开你的电脑。"
                />

                {isIdle && (
                  <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <FileDropZone
                      disabled={false}
                      onFileSelect={handleFileSelectWithRef}
                    />
                  </div>
                )}

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
                      <div
                        style={{
                          marginTop: 16,
                          color: '#6B7280',
                          fontSize: 13,
                        }}
                      >
                        {fileName}
                      </div>
                    )}
                  </div>
                )}

                {isError && (
                  <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <Alert
                      type="error"
                      showIcon
                      message="分析失败（引擎返回异常）"
                      description={
                        <div>
                          <p style={{ margin: '0 0 8px' }}>{error}</p>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            若为引擎内部报错，可查看软件目录
                            <Text code>engine.log</Text>
                            获取完整堆栈。
                          </Text>
                        </div>
                      }
                    />
                    <div style={{ marginTop: 16 }}>
                      <Button onClick={handleReset} style={{ borderRadius: 8 }}>
                        重新上传
                      </Button>
                    </div>
                  </div>
                )}

                {isEngineOffline && (
                  <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <Alert
                      type="warning"
                      showIcon
                      message="引擎连接中断"
                      description={
                        <div>
                          <p style={{ margin: '0 0 8px' }}>
                            {error ||
                              '无法连接到本地引擎（127.0.0.1:18741）。引擎可能已停止运行。'}
                          </p>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            可点击"重新检测引擎"重新探测，或"一键安装 &
                            启动"重启。
                          </Text>
                        </div>
                      }
                    />
                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                      <Button
                        type="primary"
                        onClick={() => detectEngine().then(() => reset())}
                        style={{ borderRadius: 8 }}
                      >
                        重新检测引擎
                      </Button>
                      <Button onClick={handleReset} style={{ borderRadius: 8 }}>
                        重新上传
                      </Button>
                    </div>
                  </div>
                )}

                {isReady && result && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                    }}
                  >
                    {!hasFullEngine && (
                      <Alert
                        type="info"
                        showIcon
                        message="当前为精简模式（仅和弦）"
                        description="安装完整引擎（含 madmom / chord-romanizer）可获取调性、BPM、节奏网格与功能级数。"
                      />
                    )}

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

                    <div
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 12,
                        border: '1px solid #F3F4F6',
                        padding: '20px 16px',
                      }}
                    >
                      <Text
                        strong
                        style={{ display: 'block', marginBottom: 12 }}
                      >
                        和弦网格
                      </Text>
                      <BeatGrid
                        chords={result.chords}
                        rhythm={result.rhythm}
                        roman={result.roman}
                        audioUrl={audioUrl}
                      />
                    </div>

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
              </div>
            )}
          </ProCard>

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
        </>
      )}
    </PageContainer>
  );
};

export default ChordTranscriptionPage;
