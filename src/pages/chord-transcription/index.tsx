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
import {
  Alert,
  Button,
  Card,
  Flex,
  message,
  notification,
  Result,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranscription } from '@/hooks/useTranscription';
import FileDropZone from '@/pages/chord-analysis/components/FileDropZone';
import {
  GH_PAGES_ORIGIN,
  LOCAL_DEV_ORIGIN,
  LOCAL_ENGINE_BASE,
  validateAudioFile,
} from '@/services/transcription/client';
import BeatGrid from './components/BeatGrid';

const { Paragraph, Text, Title } = Typography;

// 仅本仓库前缀（用于环境切换 URL 重组，与 GH_PAGES_ORIGIN 配套）。
const GH_PAGES_REPO = 'Suno-Cover-Arranger';

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
    return LOCAL_DEV_ORIGIN + (stripped || '/');
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
      {lines.map((l, i) => {
        const isErr = /失败|error|Error|✗|traceback|Exception/i.test(l);
        return (
          // 日志行 append-only 且内容会重复，无更稳定的 key；
          // 原用内容作 key 导致相同行渲染错配（审查 #18）。
          // biome-ignore lint/suspicious/noArrayIndexKey: 此处 index 是唯一稳定且正确的 key
          <div key={i} style={isErr ? { color: '#F87171' } : undefined}>
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
      <Result
        status="403"
        title="本功能需要「大师来了」桌面客户端"
        subTitle="大师扒谱功能需安装本地分析模型，浏览器无法运行，请下载安装后试用"
        extra={
          <Button
            type="primary"
            href="https://github.com/qq157788394/Suno-Cover-Arranger/releases/latest"
            target="_blank"
            rel="noreferrer"
          >
            下载客户端
          </Button>
        }
      ></Result>
    </ProCard>
  );
}

const ChordTranscriptionPage: React.FC = () => {
  const { status, result, fileName, handleFileSelect, reset } =
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
      // 重上传会再次进入 READY：先回收上一次的 object URL，避免 blob 逐步泄漏（审查 #9）。
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      const url = URL.createObjectURL(fileRef.current);
      audioUrlRef.current = url;
      setAudioUrl(url);
    }
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

  // 解耦 detectEngine ↔ prefetchAsset 的互相引用：把最新回调写入 ref，
  // 供对方在异步闭包内调用，避免 useCallback 初始化器循环推导报错与闭包陈旧（审查 #11）。
  useEffect(() => {
    detectEngineRef.current = detectEngine;
    prefetchAssetRef.current = prefetchAsset;
  });

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

  useEffect(() => {
    if (installError) {
      notification.error({
        message: '安装失败',
        description: installError,
      });
    }
  }, [installError]);

  useEffect(() => {
    if (prefetchError) {
      notification.error({
        message: '依赖下载失败',
        description: prefetchError,
      });
    }
  }, [prefetchError]);

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
      e.target.value = '';
      if (!file) return;
      // 复用与首次上传一致的校验（大小 / 格式），杜绝重上传绕过校验传入超大或非法文件（审查 #2）。
      const check = validateAudioFile(file);
      if (!check.ok) {
        message.error(check.error);
        return;
      }
      // 客户端已确认引擎在跑：直接打固定地址，跳过 discoverEngine 端口扫描
      handleFileSelect(
        file,
        isRunningInTauri() ? LOCAL_ENGINE_BASE : undefined,
      );
    },
    [handleFileSelect],
  );

  const _hasFullEngine =
    result?.key != null || result?.bpm != null || result?.rhythm != null;

  // ───────── 渲染：检测中 / 引擎未就绪 / 上传流程 ─────────
  return (
    <PageContainer
      header={{
        title: '大师扒谱',
        subTitle: '调用模型，识别歌曲和弦 / 调性 / BPM / 节奏',
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
              <Spin description="正在检测本地引擎…" size="large"></Spin>
            )}

            {/* 2) 引擎未就绪：上传前即展示依赖清单 + 安装入口 + 终端日志 */}
            {!checking && !engineReady && (
              <div style={{ maxWidth: 680, margin: '0 auto' }}>
                <Result
                  status="404"
                  title="本地引擎未就绪"
                  subTitle="需先安装并启动，击下方一键安装可自动完成"
                  extra={[
                    <Flex key="install" gap="medium">
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
                        {engineDetail.assets &&
                        engineDetail.assets.length > 0 ? (
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
                      <Text type="secondary">
                        状态查询失败，请点击「重试检测」。
                      </Text>
                    )}
                  </div>
                </Result>

                {(installing || installLog.length > 0) && (
                  <TerminalLog lines={installLog} />
                )}
              </div>
            )}

            {/* 3) 引擎就绪：上传 / 分析 / 结果 / 异常 */}
            {!checking && engineReady && (
              <div>
                {isIdle && (
                  <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <FileDropZone
                      disabled={false}
                      onFileSelect={handleFileSelectWithRef}
                    />
                  </div>
                )}

                {isAnalyzing && (
                  <Spin size="large" percent="auto" spinning={isAnalyzing}>
                    <Text strong>{fileName}</Text>
                  </Spin>
                )}

                {isError && (
                  <Result
                    status="500"
                    title="分析失败（引擎返回异常）"
                    subTitle="若为引擎内部报错，可查看软件目录engine.log获取完整堆栈。"
                    extra={[
                      <Button key="retry" onClick={handleReset}>
                        重新上传
                      </Button>,
                    ]}
                  />
                )}

                {isEngineOffline && (
                  <Result
                    status="500"
                    title="引擎连接中断"
                    subTitle="无法连接到本地引擎。引擎可能已停止运行。可点击重新检测引擎重新探测，或一键安装 &nbsp; 启动重启。"
                    extra={[
                      <Flex key="engine-offline" gap="medium">
                        <Button
                          type="primary"
                          onClick={() => detectEngine().then(() => reset())}
                          style={{ borderRadius: 8 }}
                        >
                          重新检测引擎
                        </Button>
                        <Button
                          onClick={handleReset}
                          style={{ borderRadius: 8 }}
                        >
                          重新上传
                        </Button>
                      </Flex>,
                    ]}
                  ></Result>
                )}

                {isReady && result && (
                  <Flex vertical gap="large">
                    <Flex wrap={false} align="center">
                      <Flex vertical flex="auto">
                        <Title level={5}>{result.fileName || fileName}</Title>
                        <Flex gap="small">
                          {result.key != null && (
                            <Tag color="magenta">Key: {result.key}</Tag>
                          )}
                          {result.bpm != null && (
                            <Tag color="orange">BPM：{result.bpm}</Tag>
                          )}
                          {result.rhythm && (
                            <Tag color="cyan">
                              {result.rhythm.bars} 小节 /{' '}
                              {result.rhythm.beats_per_bar ?? '?'} 拍每小节
                            </Tag>
                          )}
                        </Flex>
                      </Flex>
                      <Flex flex="none">
                        <Button
                          type="primary"
                          icon={<ReloadOutlined />}
                          onClick={handleReupload}
                        >
                          重新上传
                        </Button>
                      </Flex>
                    </Flex>
                    <Card title="和弦网格">
                      <BeatGrid
                        chords={result.chords}
                        rhythm={result.rhythm}
                        roman={result.roman}
                        audioUrl={audioUrl}
                      />
                    </Card>

                    {result.warnings.length > 0 && (
                      <Alert
                        type="info"
                        showIcon
                        title="分析提示"
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
                  </Flex>
                )}
              </div>
            )}
          </ProCard>

          {/* 环境切换按钮仅在本地开发源（localhost:8000）显示。
              生产 Tauri 壳加载的是 gh-pages 源，origin 非 localhost，按钮自动隐藏，
              避免误点跳到 localhost:8000（无 dev server）导致白屏（审查 #12）。 */}
          {env === 'local' && (
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
        </>
      )}
    </PageContainer>
  );
};

export default ChordTranscriptionPage;
