/**
 * transcription/client — 大师扒谱本地引擎前端客户端
 *
 * 职责：
 * - 端口发现：在候选端口扫 /api/health 定位本机引擎（对齐 local-engine/main.py 端口策略）
 * - 调用：POST /api/analyze（multipart 文件字段 file）
 * - 规整：JAMS 和弦标签 -> 展示标签（去 `:`、`min`->`m`、裸 `maj` 省略）
 * - 离线：连不上引擎抛 TranscriptionEngineOfflineError，前端据此引导安装
 *
 * 安全：引擎仅绑定 127.0.0.1 且 CORS 仅放行本机 Origin，这里不做额外校验。
 *
 * 单一真相源：端口 / 大小上限 / 格式白名单 / gh-pages Origin 集中在此，
 * 避免在多处硬编码导致漂移（审查 #10）。
 */

import type {
  TranscriptionChordSegment,
  TranscriptionResult,
  TranscriptionRomanSegment,
} from '@/shared/types/types';

/** 默认生僻端口 + 小范围候选（起服务时若被占会上扫，前端同样小范围探测）。
 *  与 local-engine/main.py 的 DEFAULT_PORT、src-tauri/src/main.rs 的 ENGINE_PORT 三处对齐，
 *  改端口时务必同步这三处（或通过 LOCAL_ENGINE_PORT 环境变量统一注入）。 */
export const LOCAL_ENGINE_PORT = 18741;
const CANDIDATE_PORTS = [
  LOCAL_ENGINE_PORT,
  LOCAL_ENGINE_PORT + 1,
  LOCAL_ENGINE_PORT + 2,
  LOCAL_ENGINE_PORT + 3,
  LOCAL_ENGINE_PORT + 4,
];
const HEALTH_TIMEOUT_MS = 800;

/** 客户端（Tauri 壳）已通过 get_engine_status 确认引擎在跑时的固定地址。 */
export const LOCAL_ENGINE_BASE = `http://127.0.0.1:${LOCAL_ENGINE_PORT}`;

/** 项目 gh-pages 固定子域（CORS / Origin 唯一放行的外部源）。
 *  与 src-tauri/tauri.conf.json、src-tauri/src/main.rs 的 curl Origin 头保持一致。 */
export const GH_PAGES_ORIGIN = 'https://qq157788394.github.io';

/** 本地开发服务器地址（仅 DEV 模式用于环境切换）。 */
export const LOCAL_DEV_ORIGIN = 'http://localhost:8000';

/** 文件大小上限：50MB（与引擎 /api/analyze 服务端上限一致，审查 #3）。 */
export const MAX_AUDIO_FILE_SIZE = 50 * 1024 * 1024;

/** 支持的音频格式（扩展名 + MIME，二者取一即可）。 */
export const SUPPORTED_AUDIO_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.flac',
  '.ogg',
  '.aac',
  '.m4a',
];
export const SUPPORTED_AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/ogg',
  'audio/aac',
  'audio/x-m4a',
  'audio/mp4',
];

/** Rust 侧在「引擎连不上」时返回的错误前缀标记。
 *  前端据此（而非脆弱的字符串包含）把错误分流到 ENGINE_OFFLINE 引导面板（审查 #8）。 */
export const ENGINE_OFFLINE_MARKER = '[ENGINE_OFFLINE]';

/** 校验音频文件大小与格式，返回是否通过及原因。
 *  首次上传（FileDropZone）与重上传（隐藏 input）共用，杜绝重上传绕过校验（审查 #2）。 */
export function validateAudioFile(file: File): { ok: boolean; error?: string } {
  if (file.size > MAX_AUDIO_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(0);
    return {
      ok: false,
      error: `文件过大（${sizeMB}MB），请选择 50MB 以内的文件`,
    };
  }
  const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const isSupportedExt = SUPPORTED_AUDIO_EXTENSIONS.includes(ext);
  const isSupportedMime = SUPPORTED_AUDIO_MIME_TYPES.includes(file.type);
  if (!isSupportedExt && !isSupportedMime) {
    return {
      ok: false,
      error: '不支持的文件格式。支持：MP3、WAV、FLAC、OGG、AAC',
    };
  }
  return { ok: true };
}

/** 本地引擎未启动/不可达 */
export class TranscriptionEngineOfflineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranscriptionEngineOfflineError';
  }
}

/**
 * 轻量 JAMS -> 展示标签：
 * - 去 `:`        Bb:min   -> Bbm
 * - 裸 maj 省略   F:maj     -> F      （maj7 之后有数字，保留 -> Fmaj7）
 * - min -> m      A:min7    -> Am7
 * - N 表示无和弦，原样返回
 *
 * 注意：与 local-engine/analyze.py 的 normalize_chord_label 保持逐字符一致（审查 #10）。
 */
export function normalizeChordLabel(jams: string): string {
  if (!jams || jams.toUpperCase() === 'N') return 'N';
  return jams
    .replace(/:/g, '')
    .replace(/maj(?![0-9])/g, '')
    .replace(/min/g, 'm');
}

export async function discoverEngine(): Promise<string | null> {
  for (const port of CANDIDATE_PORTS) {
    const base = `http://127.0.0.1:${port}`;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), HEALTH_TIMEOUT_MS);
      const res = await fetch(`${base}/api/health`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) return base;
    } catch {
      // 该端口无服务，试下一个
    }
  }
  return null;
}

export function normalizeRaw(raw: any, fileName?: string): TranscriptionResult {
  let dropped = 0;
  const chords: TranscriptionChordSegment[] = Array.isArray(raw?.chords)
    ? raw.chords
        .map((c: any) => {
          const rawChord = String(c?.chord ?? '');
          return {
            start_time: Number(c?.start_time),
            end_time: Number(c?.end_time),
            chord: rawChord,
            chordLabel: normalizeChordLabel(rawChord),
          };
        })
        // 丢弃时间非法（NaN / ±Infinity）的段：否则 buildBeatCells 中
        // c.start_time <= t 恒为 false，会导致所有拍沦为 N（审查 #15）。
        .filter((c: TranscriptionChordSegment) => {
          const finite =
            Number.isFinite(c.start_time) && Number.isFinite(c.end_time);
          if (!finite) dropped += 1;
          return finite;
        })
    : [];

  const roman: TranscriptionRomanSegment[] | null = Array.isArray(raw?.roman)
    ? raw.roman.map((r: any) => ({
        start_time: Number(r?.start_time),
        end_time: Number(r?.end_time),
        roman: String(r?.roman ?? ''),
      }))
    : null;

  const warnings: string[] = Array.isArray(raw?.warnings)
    ? [...raw.warnings]
    : [];
  if (dropped > 0) {
    warnings.push(`已忽略 ${dropped} 段时间戳非法的和弦`);
  }

  return {
    chords,
    key: raw?.key ?? null,
    bpm: raw?.bpm ?? null,
    rhythm: raw?.rhythm ?? null,
    roman,
    warnings,
    fileName,
  };
}

/**
 * 调用本地引擎分析音频。
 *
 * - 传 baseUrl（客户端已确认引擎在跑）：直接用固定地址，跳过端口扫描，省去逐端口探测的耗时与抖动。
 * - 不传 baseUrl（浏览器模式 / 兜底）：扫描候选端口定位引擎。
 * - signal：用于取消在途请求（审查 gap A），取消时抛出 AbortError，由调用方决定如何处置。
 */
export async function analyzeWithLocalEngine(
  file: File,
  signal?: AbortSignal,
  baseUrl?: string,
): Promise<TranscriptionResult> {
  const base = baseUrl ?? (await discoverEngine());
  if (!base) {
    throw new TranscriptionEngineOfflineError(
      '未检测到本地引擎。请先按 local-engine/README.md 安装并启动服务。',
    );
  }

  const form = new FormData();
  form.append('file', file);

  let res: Response;
  try {
    res = await fetch(`${base}/api/analyze`, {
      method: 'POST',
      body: form,
      signal,
    });
  } catch (e) {
    // 网络层失败（连接被拒 / 超时）= 引擎不可达，归为离线，让前端走 ENGINE_OFFLINE 引导面板
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new TranscriptionEngineOfflineError(
      '本地引擎无响应，可能已停止运行。请重新检测或重启引擎。',
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`本地引擎返回错误 (${res.status}): ${text}`);
  }

  const raw = await res.json();
  return normalizeRaw(raw, file.name);
}
