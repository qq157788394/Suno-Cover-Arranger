#!/usr/bin/env bash
# 把本地引擎（源码 + 自包含 runtime）打进 Tauri 资源目录（src-tauri/Resources/local-engine），
# 这样 dmg 分发的 .app 自带完整引擎（含 python-build-standalone 解释器 + 依赖 + 模型权重），
# 用户无需联网安装即可离线使用；新版本经热更新（update_engine）原子替换。
#
# 排除项：__pycache__ / .venv / .git / .deps_hash / .local-engine.port / default.profraw 等无需或敏感产物。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_ENGINE="$ROOT/local-engine"
RES="$ROOT/src-tauri/Resources"
ENGINE_RES="$RES/local-engine"

# 先清空旧副本，避免残留已删除的文件（保证「打上最新的、不遗漏」）
rm -rf "$ENGINE_RES"
mkdir -p "$ENGINE_RES"

echo "==> 复制引擎（源码 + 自包含 runtime，排除 __pycache__/.venv/.git/.deps_hash）"
# 用 tar 管道做带排除的整体拷贝，跨平台且避免 rsync 依赖。
( cd "$SRC_ENGINE" && tar cf - \
    --exclude='__pycache__' \
    --exclude='.venv' \
    --exclude='.git' \
    --exclude='.deps_hash' \
    --exclude='.local-engine.port' \
    --exclude='default.profraw' \
    --exclude='.pytest_cache' \
    --exclude='.mypy_cache' \
    . ) | ( cd "$ENGINE_RES" && tar xf - )

# 解除 macOS 下载隔离，避免打包/首次运行被拦截
xattr -dr com.apple.quarantine "$ENGINE_RES" 2>/dev/null || true

echo "==> 完成。Resources/local-engine 顶层："
ls -la "$ENGINE_RES"
echo "    runtime 解释器："
ls "$ENGINE_RES/runtime/bin" 2>/dev/null | head || echo "    [警告] runtime/bin 缺失，引擎未构建"
