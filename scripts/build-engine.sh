#!/usr/bin/env bash
# 构建大师扒谱本地引擎的「自包含 runtime」：
#   python-build-standalone（PBS）+ pip 安装依赖 + 预热模型权重 + 拷贝引擎代码 + 写 VERSION
# 产物 local-engine/runtime/ 完全自包含，不依赖 uv / 软链 / 用户机器编译。
set -euo pipefail

# ── 自动检测并应用 macOS 系统代理（解决国内 github.com 不可达的问题）──
# 仅在用户未手动设置 http_proxy/https_proxy 时，从 scutil 读取系统代理配置。
detect_macos_proxy() {
  [[ "$(uname -s)" != "Darwin" ]] && return 0
  # 若用户已显式设置代理环境变量，则尊重用户配置，不覆盖
  [[ -n "${http_proxy:-}" || -n "${https_proxy:-}" || -n "${HTTP_PROXY:-}" || -n "${HTTPS_PROXY:-}" ]] && return 0
  local proxy_cfg proxy_host proxy_port
  proxy_cfg="$(scutil --proxy 2>/dev/null)" || return 0
  # 优先 HTTPS 代理，回退 HTTP 代理
  if echo "$proxy_cfg" | grep -q "HTTPSEnable : 1"; then
    proxy_host="$(echo "$proxy_cfg" | awk '/HTTPSProxy / {print $3}')"
    proxy_port="$(echo "$proxy_cfg" | awk '/HTTPSPort / {print $3}')"
  elif echo "$proxy_cfg" | grep -q "HTTPEnable : 1"; then
    proxy_host="$(echo "$proxy_cfg" | awk '/HTTPProxy / {print $3}')"
    proxy_port="$(echo "$proxy_cfg" | awk '/HTTPPort / {print $3}')"
  else
    return 0
  fi
  [[ -z "$proxy_host" || -z "$proxy_port" ]] && return 0
  # 验证代理端口可达
  nc -z "$proxy_host" "$proxy_port" 2>/dev/null || return 0
  export http_proxy="http://${proxy_host}:${proxy_port}"
  export https_proxy="http://${proxy_host}:${proxy_port}"
  export HTTP_PROXY="$http_proxy"
  export HTTPS_PROXY="$https_proxy"
  echo "    检测到系统代理: ${proxy_host}:${proxy_port}（已应用到 curl/pip）"
}
detect_macos_proxy

PLATFORM="${1:-macos-aarch64}"

# 项目根 = scripts/ 的上一级
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENGINE_DIR="$PROJECT_ROOT/local-engine"
RUNTIME_DIR="$ENGINE_DIR/runtime"

# ── python-build-standalone 版本（钉死，保证可复现）──
# 经查询 python-build-standalone 最新 release 20260623 含 cpython-3.12.13 的 macOS aarch64 包。
PBS_REL="20260623"
PY_VER="3.12.13"
case "$PLATFORM" in
  macos-aarch64)
    PBS_TARBALL="cpython-${PY_VER}+${PBS_REL}-aarch64-apple-darwin-install_only.tar.gz"
    ;;
  windows-x86_64)
    PBS_TARBALL="cpython-${PY_VER}+${PBS_REL}-x86_64-pc-windows-msvc-install_only.tar.gz"
    ;;
  *)
    echo "不支持的平台: $PLATFORM（v1 仅支持 macos-aarch64）" >&2
    exit 1
    ;;
esac
PBS_URL="https://github.com/astral-sh/python-build-standalone/releases/download/${PBS_REL}/${PBS_TARBALL}"

echo "==> 构建引擎 runtime: $PLATFORM"
echo "    产物目录: $RUNTIME_DIR"

# 清空旧 runtime，保证「不遗漏、打上最新的」
rm -rf "$RUNTIME_DIR"
mkdir -p "$RUNTIME_DIR"

# ── 1. 下载并解压 PBS（install_only 包顶层为 python/，strip 1 层）──
echo "==> [1/5] 下载 python-build-standalone ${PY_VER} ..."
TMP_TARBALL="$(mktemp -t pbs-XXXXXX.tar.gz)"
curl -fL "$PBS_URL" -o "$TMP_TARBALL"
tar xzf "$TMP_TARBALL" --strip-components=1 -C "$RUNTIME_DIR"
rm -f "$TMP_TARBALL"
# 清除 macOS 下载隔离属性（否则首次运行可能被拦截）
xattr -dr com.apple.quarantine "$RUNTIME_DIR" 2>/dev/null || true

# PBS 解释器路径随平台不同：Windows 位于根目录 python.exe，macOS/Linux 位于 bin/python3。
case "$PLATFORM" in
  windows-x86_64) PY="$RUNTIME_DIR/python.exe" ;;
  *) PY="$RUNTIME_DIR/bin/python3" ;;
esac
"$PY" -m pip install --upgrade pip >/dev/null 2>&1 || true
echo "    PBS python: $("$PY" --version 2>&1)"

# 动态获取 site-packages 路径（随 Python 小版本变，不写死）
SITE_PKG="$("$PY" -c "import sysconfig;print(sysconfig.get_path('purelib'))")"

# ── 2. 安装依赖（build 依赖 Cython/numpy/setuptools/wheel 先装，再 --no-build-isolation 编译 madmom）──
echo "==> [2/5] pip install 依赖（首次需联网编译 madmom）..."
# 注意：--no-build-isolation 下 pip 用目标环境的 setuptools/wheel 来构建 sdist（如 madmom），
# 故必须先把 setuptools + wheel 装进 target，否则报 BackendUnavailable: Cannot import 'setuptools.build_meta'。
"$PY" -m pip install --target "$SITE_PKG" "Cython>=3.0" "numpy>=1.26,<2" "setuptools>=61" "wheel"
PYTHONPATH="$SITE_PKG" "$PY" -m pip install \
  --target "$SITE_PKG" \
  --no-build-isolation \
  -c "$ENGINE_DIR/constraints.txt" \
  -r "$ENGINE_DIR/requirements.txt"
echo "    依赖装到: $SITE_PKG"

# ── 3. 预热模型权重（HOME 重定向到 runtime/models/home，使缓存随包分发、运行期离线）──
echo "==> [3/5] 预热模型权重（lv_chordia / madmom / ffmpeg）..."
FAKE_HOME="$RUNTIME_DIR/models/home"
rm -rf "$FAKE_HOME"
mkdir -p "$FAKE_HOME"
# export HOME 后运行 prewarm.py，触发各库按默认规则把权重下到 $FAKE_HOME 下
HOME="$FAKE_HOME" "$PY" "$ENGINE_DIR/prewarm.py"

# ── 4. 拷贝引擎代码到 runtime/code（prod 用冻结副本；测试文件不进包）──
echo "==> [4/5] 拷贝引擎代码到 runtime/code ..."
rm -rf "$RUNTIME_DIR/code"
mkdir -p "$RUNTIME_DIR/code"
for f in analyze.py main.py normalize_chord.py numpy_ragged_shim.py; do
  cp "$ENGINE_DIR/$f" "$RUNTIME_DIR/code/"
done

# ── 5. 写 VERSION ──
echo "==> [5/5] 写 runtime/VERSION ..."
# 格式 YYYY.MM.DD.N（N = git rev-list --count，单调整数），
# 使热更新 is_newer 可做四元组数值比较（不能用 git short hash，因其含 hex 后缀无法比较）。
VERSION="$(date +%Y.%m.%d).$(git -C "$PROJECT_ROOT" rev-list --count HEAD 2>/dev/null || echo 0)"
echo "$VERSION" > "$RUNTIME_DIR/VERSION"
echo "    引擎版本: $VERSION"

echo "==> 完成。runtime 大小: $(du -sh "$RUNTIME_DIR" | cut -f1)"
