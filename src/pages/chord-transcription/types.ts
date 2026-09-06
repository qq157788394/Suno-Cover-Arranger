/**
 * 大师扒谱页面级类型定义（仅本页业务使用，不进服务层 shared/types）。
 */

/**
 * 引擎依赖清单状态（来自 Rust get_engine_status；方案 A 自包含 runtime）。
 * 不再含 uv / .venv / 逐条资产（assets）——引擎改为构建期整体打包，运行时不再逐项下载。
 */
export type EngineStatusDetail = {
  /** 引擎代码 main.py 是否存在 */
  source_present: boolean | null;
  /** 自包含 runtime（runtime/bin/python3）是否已随包分发 */
  bundled_ok: boolean | null;
  /** 内置引擎版本（runtime/VERSION），供热更新比对 */
  engine_version: string | null;
  /** 是否有可用热更新（check_engine_update 写入 ENGINE_UPDATE_CACHE） */
  update_available: boolean | null;
  /** 引擎服务是否在跑 */
  running: boolean;
  /** 三层依赖（lv-chordia / madmom / chord-romanizer）是否皆可用，缺一不可；null=未知 */
  model_ready: boolean | null;
  /** 端到端自检：真实跑一遍扒谱，确认和弦/调性/BPM 可产出（含权重下载）；null=未知 */
  analysis_ok: boolean | null;
  /** ffmpeg 是否可用（决定 MP3/FLAC/OGG/AAC 能否解码）；null=未知 */
  ffmpeg_available: boolean | null;
  /** 压缩格式（MP3）端到端是否验证通过；null=未验证（ffmpeg 不可用） */
  compress_ok: boolean | null;
  /** 三层依赖明细；null=旧引擎无此字段 */
  layers: {
    lv_chordia: boolean | null;
    madmom: boolean | null;
    chord_romanizer: boolean | null;
  } | null;
  port: number | null;
};
