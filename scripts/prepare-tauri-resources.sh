#!/usr/bin/env bash
# 把本地引擎（源码）与便携 uv 二进制打进 Tauri 资源目录，
# 这样 dmg 分发的 .app 自带引擎，用户点击"安装本地引擎"即可在软件目录内部署。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_ENGINE="$ROOT/local-engine"
RES="$ROOT/src-tauri/Resources"
ENGINE_RES="$RES/local-engine"
UV_RES="$RES/uv"

mkdir -p "$ENGINE_RES"

echo "==> 复制引擎源码（排除 .venv / __pycache__ / 运行时端口）"
# 平铺结构，逐文件拷更可控
for f in main.py analyze.py numpy_ragged_shim.py pyproject.toml uv.lock README.md; do
  if [ -f "$SRC_ENGINE/$f" ]; then
    cp "$SRC_ENGINE/$f" "$ENGINE_RES/$f"
    echo "    $f"
  else
    echo "    [跳过] 未找到 $f"
  fi
done

echo "==> 准备便携 uv 二进制"
if [ -x "$UV_RES" ]; then
  echo "    已存在，跳过: $UV_RES"
elif command -v uv >/dev/null 2>&1; then
  echo "    从本机 uv 拷贝: $(command -v uv)"
  cp "$(command -v uv)" "$UV_RES"
else
  # 兜底：按架构下载官方发布（arm64 优先，回退 x86_64）
  ARCH="$(uname -m)"
  if [ "$ARCH" = "arm64" ]; then
    UV_TRIPLE="aarch64-apple-darwin"
  else
    UV_TRIPLE="x86_64-apple-darwin"
  fi
  UV_VER="0.11.27"
  URL="https://github.com/astral-sh/uv/releases/download/${UV_VER}/uv-${UV_TRIPLE}.tar.gz"
  echo "    下载 $URL"
  tmp="$(mktemp -d)"
  curl -fsSL "$URL" -o "$tmp/uv.tar.gz"
  tar -xzf "$tmp/uv.tar.gz" -C "$tmp"
  find "$tmp" -name uv -type f -exec cp {} "$UV_RES" \;
  chmod +x "$UV_RES"
  rm -rf "$tmp"
fi

echo "==> 完成。Resources 内容："
ls -la "$ENGINE_RES"
ls -la "$UV_RES"
