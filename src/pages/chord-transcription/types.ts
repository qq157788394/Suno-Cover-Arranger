/**
 * 大师扒谱页面级类型定义（仅本页业务使用，不进服务层 shared/types）。
 */

/** 单条本地资产就绪状态（来自 Rust get_engine_status.assets / 引擎 /api/assets） */
export type AssetItem = {
  id: string;
  name: string;
  present: boolean;
  detail?: string;
  /** 修复方式：uv_sync=重新 uv sync 对应包；fetch_ffmpeg=经 imageio 下载 ffmpeg */
  action?: string;
};

/** 引擎依赖清单状态（来自 Rust get_engine_status；浏览器模式下 uv/源码/.venv 为 null） */
export type EngineStatusDetail = {
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
