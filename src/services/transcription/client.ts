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
 */

import type {
  TranscriptionChordSegment,
  TranscriptionResult,
  TranscriptionRomanSegment,
} from '@/shared/types/types';

/** 默认生僻端口 + 小范围候选（起服务时若被占会上扫，前端同样小范围探测） */
const CANDIDATE_PORTS = [18741, 18742, 18743, 18744, 18745];
const HEALTH_TIMEOUT_MS = 800;

/**
 * 客户端（Tauri 壳）已通过 get_engine_status 确认引擎在跑时的固定地址。
 * 与 local-engine/main.py 的 DEFAULT_PORT、src-tauri/src/main.rs 的 ENGINE_PORT 三处对齐，
 * 改端口时务必同步这三处。
 */
export const LOCAL_ENGINE_BASE = 'http://127.0.0.1:18741';

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
 */
export function normalizeChordLabel(jams: string): string {
  if (!jams || jams.toUpperCase() === 'N') return 'N';
  return jams
    .replace(/:/g, '')
    .replace(/maj(?![0-9])/g, '')
    .replace(/min/g, 'm');
}

/** 探测本机引擎：扫候选端口 /api/health，返回可用 base URL 或 null */
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

function normalizeRaw(raw: any, fileName?: string): TranscriptionResult {
  const chords: TranscriptionChordSegment[] = Array.isArray(raw?.chords)
    ? raw.chords.map((c: any) => {
        const rawChord = String(c?.chord ?? '');
        return {
          start_time: Number(c?.start_time),
          end_time: Number(c?.end_time),
          chord: rawChord,
          chordLabel: normalizeChordLabel(rawChord),
        };
      })
    : [];

  const roman: TranscriptionRomanSegment[] | null = Array.isArray(raw?.roman)
    ? raw.roman.map((r: any) => ({
        start_time: Number(r?.start_time),
        end_time: Number(r?.end_time),
        roman: String(r?.roman ?? ''),
      }))
    : null;

  return {
    chords,
    key: raw?.key ?? null,
    bpm: raw?.bpm ?? null,
    rhythm: raw?.rhythm ?? null,
    roman,
    warnings: Array.isArray(raw?.warnings) ? raw.warnings : [],
    fileName,
  };
}

/**
 * 调用本地引擎分析音频。
 *
 * - 传 baseUrl（客户端已确认引擎在跑）：直接用固定地址，跳过端口扫描，省去逐端口探测的耗时与抖动。
 * - 不传 baseUrl（浏览器模式 / 兜底）：扫描候选端口定位引擎。
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
