#!/usr/bin/env pwsh
#
# 大师来了 · Windows 发布脚本
# 用法 (PowerShell): pnpm release:win   (或 pwsh scripts/release-win.ps1)
#
# 行为:
#   1. 读取 src-tauri/tauri.conf.json 的 version 作为发布版本
#   2. 若未构建产物，则先 pnpm tauri build --bundles nsis
#      (nsis = 标准安装向导 setup.exe，兼容 x64)
#   3. 发布到 GitHub Releases:
#      - 优先用 gh CLI (需 gh auth login)
#      - 否则回退到 GitHub REST API (需设置 GITHUB_TOKEN 环境变量, 含 repo 权限)
#
# 注意: Windows 包无法在 macOS/Linux 上交叉编译，必须在 Windows 环境运行本脚本
#       (或交由 .github/workflows/release.yml 的 windows runner 自动构建)。

$ErrorActionPreference = 'Stop'

$ROOT = (Resolve-Path "$PSScriptRoot/..").Path
Set-Location $ROOT

# ── 解析仓库 owner/name ──────────────────────────────
$REMOTE = (git remote get-url origin)
if ($REMOTE -match '[:/]([^/]+/[^/]+?)(?:\.git)?$') {
  $REPO = $Matches[1]
} else {
  Write-Error "✗ 无法从 git remote 解析仓库地址: $REMOTE"
  exit 1
}

# ── 读取版本 ─────────────────────────────────────────
$VERSION = (node -p "require('./src-tauri/tauri.conf.json').version")
$TAG = "v$VERSION"

# ── 查找 / 构建产物 ──────────────────────────────────
$NSIS_DIR = "src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis"
$SETUPS = @(Get-ChildItem -Path $NSIS_DIR -Filter *.exe -ErrorAction SilentlyContinue)

if ($SETUPS.Count -eq 0) {
  Write-Host "→ 未找到产物，先执行 pnpm tauri build --bundles nsis ..."
  rustup target add x86_64-pc-windows-msvc 2>$null
  pnpm tauri build --bundles nsis
  $SETUPS = @(Get-ChildItem -Path $NSIS_DIR -Filter *.exe -ErrorAction SilentlyContinue)
}

if ($SETUPS.Count -eq 0) {
  Write-Error "✗ 构建后仍无产物，请检查 tauri.conf.json bundle.targets 是否包含 nsis"
  exit 1
}

$NOTES = "未签名 Windows 版本（渐进式客户端化 spike）。提供 NSIS 安装包 setup.exe（双击运行安装向导，需系统已装 WebView2 Runtime），安装后开始菜单出现快捷方式。本地引擎需在应用内自动启动（uv + Python）。"

$ASSETS = @()
$ASSETS += $SETUPS.FullName

Write-Host "→ 准备发布 $REPO @ $TAG"
foreach ($a in $ASSETS) { Write-Host "  产物: $a" }

# ── 发布后端 1: gh CLI ───────────────────────────────
if (Get-Command gh -ErrorAction SilentlyContinue) {
  Write-Host "→ 使用 gh CLI 发布"
  gh release create "$TAG" $ASSETS --repo "$REPO" --title "大师来了 $VERSION" --notes "$NOTES"
  Write-Host "✓ 已发布: https://github.com/$REPO/releases/tag/$TAG"
  exit 0
}

# ── 发布后端 2: GitHub REST API (curl + GITHUB_TOKEN) ─
Write-Host "→ gh 未安装，回退到 GitHub REST API"
if (-not $env:GITHUB_TOKEN) {
  Write-Error "未找到 gh 且 GITHUB_TOKEN 未设置。请二选一: (1) 安装 gh 并 gh auth login  (2) 设置含 repo 权限的 GITHUB_TOKEN 环境变量"
  exit 1
}

$BODY = @{ tag_name = $TAG; name = "大师来了 $VERSION"; body = $NOTES } | ConvertTo-Json -Compress

$RESP = curl.exe -fsS -X POST `
  -H "Authorization: Bearer $env:GITHUB_TOKEN" `
  -H "Accept: application/vnd.github+json" `
  -H "X-GitHub-Api-Version: 2022-11-28" `
  -d $BODY `
  "https://api.github.com/repos/$REPO/releases"

$UPLOAD_URL = ($RESP | ConvertFrom-Json).upload_url
# 去掉模板中的 {?name,label} 占位
$BASE = $UPLOAD_URL -replace '\{\?name,label\}$', ''

if (-not $BASE) {
  Write-Error "✗ 创建 release 失败，请检查 GITHUB_TOKEN 权限与网络"
  exit 1
}

foreach ($f in $ASSETS) {
  $NAME = Split-Path $f -Leaf
  Write-Host "→ 上传 $NAME"
  curl.exe -fsS -X POST `
    -H "Authorization: Bearer $env:GITHUB_TOKEN" `
    -H "Content-Type: application/octet-stream" `
    -H "X-GitHub-Api-Version: 2022-11-28" `
    --data-binary "@$f" `
    "${BASE}?name=$NAME" | Out-Null
}

Write-Host "✓ 已发布: https://github.com/$REPO/releases/tag/$TAG"
