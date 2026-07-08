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

/** 单条本地资产就绪状态（来自 Rust get_engine_status.assets / 引擎 /api/assets） */
type AssetItem = {
  id: string;
  name: string;
  present: boolean;
  detail?: string;
  /** 修复方式：uv_sync=重新 uv sync 对应包；fetch_ffmpeg=经 imageio 下载 ffmpeg */
  action?: string;
};

/** 引擎依赖清单状态（来自 Rust get_engine_status；浏览器模式下 uv/源码/.venv 为 null） */
type EngineStatusDetail = {
  uv_present: boolean | null;
  source_present: boolean | null;
  venv_present: boolean | null;
  running: boolean;
  /** 三层依赖（lv-chordia / madmom / chord-romanizer）是否皆可用，缺一不可；null=未知（旧引擎无此字段） */
  model_ready: boolean | null;
  /** 端到端自检：真实跑一遍扒谱，确认和弦/调性/BPM 可产出（含权重下载）；null=未知（旧引擎无此端点） */
  analysis_ok: boolean | null;
  /** ffmpeg 是否可用（决定 MP3/FLAC/OGG/AAC 能否解码）；null=未知 */
  ffmpeg_available: boolean | null;
  /** 压缩格式（MP3）端到端是否验证通过；null=未验证（ffmpeg 不可用） */
  compress_ok: boolean | null;
  /** 逐条资产就绪状态（lv 权重 / madmom 模型 / chord-romanizer / ffmpeg）；null=旧引擎无此端点 */
  assets: AssetItem[] | null;
  layers: {
    lv_chordia: boolean | null;
    madmom: boolean | null;
    chord_romanizer: boolean | null;
  } | null;
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

/** 单条资产状态 + 缺失时「下载」按钮（触发 Rust prefetch_asset 本地拉取） */
function AssetRow({
  asset,
  downloading,
  onDownload,
}: {
  asset: AssetItem;
  downloading: boolean;
  onDownload: (id: string) => void;
}) {
  const mark = asset.present ? '✅' : '❌';
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
        {asset.name}
        {asset.detail && (
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
            {asset.detail}
          </Text>
        )}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{mark}</span>
        {!asset.present && (
          <Button
            size="small"
            loading={downloading}
            onClick={() => onDownload(asset.id)}
            style={{ borderRadius: 6 }}
          >
            下载
          </Button>
        )}
      </span>
    </div>
  );
}

/** 根据三层依赖探测结果，生成「模型与依赖就绪」行的提示文案。 */
function modelReadyHint(layers: EngineStatusDetail['layers']): string {
  if (!layers) return '（未知）';
  const miss: string[] = [];
  if (!layers.lv_chordia) miss.push('lv-chordia');
  if (!layers.madmom) miss.push('madmom');
  if (!layers.chord_romanizer) miss.push('chord-romanizer');
  return miss.length
    ? `缺失：${miss.join(' / ')}`
    : 'lv-chordia / madmom / chord-romanizer 均已就位';
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

  // 资产「下载/修复」状态
  const [prefetchingId, setPrefetchingId] = useState<string | null>(null);
  const [prefetchError, setPrefetchError] = useState<string | null>(null);
  // 仅自动触发一次 ffmpeg 预拉取（检测时备好，避免引擎启动时的运行时下载），防止与重检测死循环
  const autoFfmpegRef = useRef(false);

  // 两个回调互相引用，用 ref 解耦，避免 useCallback 初始化器循环推导导致 TS 报错
  const detectEngineRef = useRef<() => Promise<void>>(async () => {});
  const prefetchAssetRef = useRef<(id: string) => void>(() => {});

  /**
   * 资产「下载/修复」按钮：触发 Rust prefetch_asset 在本地拉取缺失依赖（ffmpeg→imageio；
   * Python 类→重新 uv sync）。按用户选择「自动拉取 + 失败给说明」实现。完成后重新检测。
   */
  const prefetchAsset = useCallback(
    async (assetId: string) => {
      if (!isClient) return;
      setPrefetchingId(assetId);
      setPrefetchError(null);
      try {
        const msg = await invoke<string>('prefetch_asset', { assetId });
        message.success(msg || '已下载并缓存');
      } catch (err) {
        const reason = String(err);
        setPrefetchError(reason);
        message.error(`下载失败：${reason}（若离线请联网后重试）`);
      } finally {
        setPrefetchingId(null);
        detectEngineRef.current();
      }
    },
    [isClient],
  );

  /**
   * 引擎状态检测 — 仅客户端路径（浏览器在渲染层直接走面板A，永不调用本函数）。
   *
   * 调用 Rust get_engine_status 获取 uv / 源码 / .venv / 服务 / 逐条资产 状态；
   * 网关 = 全部通过（含每条资产 present）才允许上传。invoke 失败时设置 detectError，UI 明确报错。
   * 检测时若 ffmpeg 缺失，自动触发一次预拉取（消除引擎启动时的运行时下载）。
   */
  const detectEngine = useCallback(async () => {
    if (!isClient) return;
    setChecking(true);
    setDetectError(null);
    try {
      const detail = (await invoke('get_engine_status')) as EngineStatusDetail;
      setEngineDetail(detail);
      const assetsAll = detail.assets
        ? detail.assets.every((a) => a.present)
        : false;
      setEngineReady(
        !!detail.uv_present &&
          !!detail.source_present &&
          !!detail.venv_present &&
          !!detail.running &&
          !!detail.model_ready &&
          !!detail.analysis_ok &&
          assetsAll,
      );
      // 检测时就把 ffmpeg 备好（消除引擎启动时的运行时下载）；仅自动触发一次，避免重检测死循环。
      if (detail.running && detail.assets && !autoFfmpegRef.current) {
        const ff = detail.assets.find((a) => a.id === 'ffmpeg');
        if (ff && !ff.present) {
          autoFfmpegRef.current = true;
          prefetchAssetRef.current('ffmpeg');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setDetectError(`查询引擎状态失败: ${msg}`);
      setEngineDetail(null);
      setEngineReady(false);
    } finally {
      setChecking(false);
    }
  }, [isClient]);

  // 解耦互相引用：把最新回调挂到 ref 上，供对方在闭包内调用
  detectEngineRef.current = detectEngine;
  prefetchAssetRef.current = prefetchAsset;

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
      // 壳层上报引擎真实端口（自动启动或安装后）
      const offReady = await listen<{ port: number; msg: string }>(
        'engine-ready',
        () => {
          if (!active) return;
          setInstallError(null);
          detectEngine();
        },
      );
      unlisten.push(offProgress, offReady);
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
      // 命令会阻塞到后台真正干完才返回：ok 字符串=成功消息，reject=失败原因
      const msg = await invoke<string>('install_local_engine');
      setInstallError(null);
      message.success(msg || '本地引擎安装并启动成功');
      detectEngine();
    } catch (err) {
      const reason = String(err);
      setInstallError(reason);
      message.error(`安装失败：${reason}`);
    } finally {
      setInstalling(false);
    }
  }, [isClient, detectEngine]);

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
                      {engineDetail.assets && engineDetail.assets.length > 0 ? (
                        engineDetail.assets.map((a) => (
                          <AssetRow
                            key={a.id}
                            asset={a}
                            downloading={prefetchingId === a.id}
                            onDownload={prefetchAsset}
                          />
                        ))
                      ) : (
                        <StatusRow
                          label="模型与依赖就绪"
                          ok={engineDetail.model_ready}
                          hint={modelReadyHint(engineDetail.layers)}
                        />
                      )}
                      <StatusRow
                        label="端到端分析验证"
                        ok={engineDetail.analysis_ok}
                        hint="真实跑一次扒谱，确认和弦/调性/BPM 可产出"
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
                {prefetchError && (
                  <Alert
                    type="error"
                    showIcon
                    style={{ marginTop: 12 }}
                    message="依赖下载失败"
                    description={prefetchError}
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
                {/* 引擎连接状态横幅：分析正常时显示绿色成功；分析异常（offline/error）时不显示，
                    避免与下方的错误/离线 Alert 产生矛盾信息 */}
                {(isIdle || isAnalyzing || isReady) && (
                  <Alert
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message={`本地高精度引擎已连接 · localhost:${engineDetail?.port ?? 18741}`}
                    description="音频仅在本机处理，不离开你的电脑。"
                  />
                )}

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
