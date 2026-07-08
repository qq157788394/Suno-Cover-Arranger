/**
 * 运行环境判定 — 全局共享工具
 *
 * 判断是否运行在 Tauri 桌面壳内（而非纯浏览器）。
 * 之前该函数定义在页面级 useEngineStatus 里，导致全局 env 切换逻辑
 * 反向依赖页面级 hook；现提升为全局工具，依赖方向回归「页面级依赖全局」。
 */

/** 是否运行在 Tauri 桌面壳内（非浏览器）。 */
export function isRunningInTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}
