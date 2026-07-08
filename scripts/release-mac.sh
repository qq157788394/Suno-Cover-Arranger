#!/usr/bin/env bash
#
# 大师来了 · macOS 发布脚本
# 用法: pnpm release:mac   (或 bash scripts/release-mac.sh)
#
# 行为:
#   1. 读取 src-tauri/tauri.conf.json 的 version 作为发布版本
#   2. 若未构建 universal dmg，则先 pnpm tauri build --target universal-apple-darwin
#   3. 发布到 GitHub Releases:
#      - 优先用 gh CLI (需 gh auth login)
#      - 否则回退到 GitHub REST API (需设置 GITHUB_TOKEN 环境变量, 含 repo 权限)
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# ── 解析仓库 owner/name ──────────────────────────────
REMOTE="$(git remote get-url origin)"
REPO="$(echo "$REMOTE" | sed -E 's#.*[:/]([^/]+/[^/]+)\.git$#\1#')"
if [[ -z "$REPO" || "$REPO" == "$REMOTE" ]]; then
  echo "✗ 无法从 git remote 解析仓库地址: $REMOTE" >&2
  exit 1
fi

# ── 读取版本 ─────────────────────────────────────────
VERSION="$(node -p "require('./src-tauri/tauri.conf.json').version")"
TAG="v$VERSION"

# ── 查找 / 构建 dmg ──────────────────────────────────
shopt -s nullglob
DMGS=(src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg)
shopt -u nullglob

if [[ ${#DMGS[@]} -eq 0 ]]; then
  echo "→ 未找到 universal dmg，先执行 pnpm tauri build --target universal-apple-darwin ..."
  pnpm tauri build --target universal-apple-darwin --bundles dmg
  shopt -s nullglob
  DMGS=(src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg)
  shopt -u nullglob
fi

if [[ ${#DMGS[@]} -eq 0 ]]; then
  echo "✗ 构建后仍未找到 dmg，请检查 tauri.conf.json bundle.targets 是否包含 dmg" >&2
  exit 1
fi

NOTES="未签名版本（渐进式客户端化 spike）。首次打开时若被 Gatekeeper 拦截：在 Finder 中右键应用 → 打开 → 仍要打开。本地引擎需在应用内自动启动（uv + Python）。"

echo "→ 准备发布 $REPO @ $TAG"
echo "  产物: ${DMGS[*]}"

# ── 发布后端 1: gh CLI ───────────────────────────────
if command -v gh >/dev/null 2>&1; then
  echo "→ 使用 gh CLI 发布"
  gh release create "$TAG" "${DMGS[@]}" --repo "$REPO" --title "大师来了 $VERSION" --notes "$NOTES"
  echo "✓ 已发布: https://github.com/$REPO/releases/tag/$TAG"
  exit 0
fi

# ── 发布后端 2: GitHub REST API (curl + GITHUB_TOKEN) ─
echo "→ gh 未安装，回退到 GitHub REST API"
: "${GITHUB_TOKEN:?未找到 gh 且 GITHUB_TOKEN 未设置。请二选一: (1) brew install gh && gh auth login  (2) 设置含 repo 权限的 GITHUB_TOKEN 环境变量}"

BODY="$(TAG="$TAG" VER="$VERSION" NOTES="$NOTES" node -e \
  "console.log(JSON.stringify({tag_name:process.env.TAG,name:'大师来了 '+process.env.VER,body:process.env.NOTES}))")"

UPLOAD_URL="$(curl -fsS -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d "$BODY" \
  "https://api.github.com/repos/$REPO/releases" \
  | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).upload_url")"

if [[ -z "$UPLOAD_URL" || "$UPLOAD_URL" == "undefined" ]]; then
  echo "✗ 创建 release 失败，请检查 GITHUB_TOKEN 权限与网络" >&2
  exit 1
fi

BASE="${UPLOAD_URL%%{?name,label\}}"
for f in "${DMGS[@]}"; do
  echo "→ 上传 $(basename "$f")"
  curl -fsS -X POST \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Content-Type: application/octet-stream" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    --data-binary "@$f" \
    "${BASE}?name=$(basename "$f")" >/dev/null
done

echo "✓ 已发布: https://github.com/$REPO/releases/tag/$TAG"
