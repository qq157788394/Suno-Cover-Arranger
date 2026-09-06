#!/usr/bin/env bash
# dev 本地生成引擎 runtime（幂等 + stale-aware）。
# 仅当依赖清单（requirements/constraints/pyproject）哈希变化时才重建，否则跳过。
# 挂到 tauri:dev 的 beforeDevCommand，使 dev 改源码即见效、无 uv、无网（runtime 就绪后）。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENGINE_DIR="$PROJECT_ROOT/local-engine"
RUNTIME_DIR="$ENGINE_DIR/runtime"
HASH_FILE="$RUNTIME_DIR/.deps_hash"

# v1 dev 仅支持 macOS aarch64
PLATFORM="macos-aarch64"

NEW_HASH="$(cat "$ENGINE_DIR/requirements.txt" "$ENGINE_DIR/constraints.txt" "$ENGINE_DIR/pyproject.toml" 2>/dev/null | shasum -a 256 | awk '{print $1}')"

if [ -x "$RUNTIME_DIR/bin/python3" ] && [ -f "$HASH_FILE" ] && [ "$(cat "$HASH_FILE")" = "$NEW_HASH" ]; then
  echo "==> 引擎 runtime 已是最新（依赖未变动），跳过重建"
  exit 0
fi

echo "==> 引擎依赖有变动或 runtime 缺失，重建 runtime ($PLATFORM) ..."
"$SCRIPT_DIR/build-engine.sh" "$PLATFORM"
echo "$NEW_HASH" > "$HASH_FILE"
