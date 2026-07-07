#!/usr/bin/env bash
# 将已构建好的 .app 直接打包成 dmg。
#
# 为什么不用 Tauri 自带的 create-dmg：create-dmg 末尾会用 osascript 让 Finder
# 美化 dmg 窗口（摆图标位置），这一步需要“控制 Finder”的自动化授权。
# 在沙箱 / CI / 未授权过的机器上会被 macOS TCC 拒绝（-10004），导致整个打包失败。
# 本脚本用 hdiutil 直接生成 dmg，等价功能、零 GUI 依赖。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SRC_APP=$(find src-tauri/target/release/bundle/macos -maxdepth 1 -name "*.app" -type d | head -1)
if [ -z "$SRC_APP" ]; then
  echo "未找到 .app，请先运行 pnpm tauri:build（app 目标）" >&2
  exit 1
fi
APP_NAME=$(basename "$SRC_APP" .app)

# 从 tauri.conf.json 读取版本（容忍注释/格式，用 grep 提取）
VERSION=$(grep -m1 '"version"' src-tauri/tauri.conf.json | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')
if [ -z "$VERSION" ]; then
  echo "无法从 tauri.conf.json 读取 version" >&2
  exit 1
fi

OUT_DIR="src-tauri/target/release/bundle/dmg"
mkdir -p "$OUT_DIR"
DMG="$OUT_DIR/${APP_NAME}_${VERSION}_aarch64.dmg"

echo "==> 打包 dmg: $DMG"
echo "    源 .app: $SRC_APP"

# 临时暂存区：放入 .app 和一个 /Applications 软链（便于用户拖拽安装）
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -a "$SRC_APP" "$STAGE/"
ln -s /Applications "$STAGE/Applications"

# 直接生成压缩 dmg（UDZO），无需挂载、无需 Finder 自动化
hdiutil create \
  -srcfolder "$STAGE" \
  -volname "$APP_NAME" \
  -fs HFS+ \
  -format UDZO \
  -imagekey zlib-level=9 \
  "$DMG"

echo "==> dmg 生成成功: $DMG"
ls -lh "$DMG"
