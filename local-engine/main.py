"""大师扒谱本地 Python 引擎 - FastAPI 服务。

绑定 127.0.0.1（仅本机可访问），固定端口（由 Tauri 壳通过 LOCAL_ENGINE_PORT 环境变量传入）。
仅轻量 Origin 检查。
"""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from analyze import analyze_all, FFMPEG_AVAILABLE

HOST = "127.0.0.1"
DEFAULT_PORT = int(os.getenv("LOCAL_ENGINE_PORT", "18741"))

# 唯一放行的外部源：本项目 gh-pages 固定子域。本地开发仅放行 dev server 端口（localhost:8000）。
# 收紧自原先过宽的 `*.github.io` 通配 + 任意 localhost 端口（审查 #4）。
ALLOWED_ORIGIN = "https://qq157788394.github.io"
ALLOWED_DEV_ORIGINS = {"http://localhost:8000", "http://127.0.0.1:8000"}

app = FastAPI(title="Suno Local Engine")

# 跨域：仅放行上述具体源。既是 CORS 头（让浏览器跨端口/跨域调用可读到响应），
# 也是安全边界（其他源不回 CORS 头）。方法/头收窄，避免 `*` 过度暴露。
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=(
        r"^https://qq157788394\.github\.io$|^http://(localhost|127\.0\.0\.1):8000$"
    ),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Origin"],
    expose_headers=["Content-Type"],
)


def _origin_ok(origin: str | None) -> bool:
    # 非浏览器调用（无 Origin）放行：Rust curl 代理、本地自检等本机调用。
    if not origin:
        return True
    if origin == ALLOWED_ORIGIN:
        return True
    return origin in ALLOWED_DEV_ORIGINS


def _probe_import(module: str) -> bool:
    """轻量 import 探针：确认某依赖包可导入（用于就绪检测，不加载权重，毫秒级）。

    覆盖三层：lv-chordia（核心和弦）/ madmom（调性·BPM·节奏）/ chord-romanizer（罗马级数）。
    任一层缺失即视为模型未就绪——与前端「缺一不可」口径一致。
    """
    try:
        __import__(module)
        return True
    except Exception:
        return False


@app.get("/api/health")
def health() -> dict:
    # 三层依赖就绪探测：import 级，轻量；不触发权重下载/加载。
    layers = {
        "lv_chordia": _probe_import("lv_chordia"),
        "madmom": _probe_import("madmom"),
        "chord_romanizer": _probe_import("chord_romanizer"),
    }
    return {
        "status": "ok",
        "model_ready": all(layers.values()),
        "layers": layers,
    }


def _resolve_lv_cache_data() -> str | None:
    """复刻 lv_chordia.mir.common 的 CACHE_DATA_PATH 解析（避免 import 整个包拉起 torch）。

    优先级：<sys.prefix>/share/lv-chordia/cache_data（pip 安装落点）> <site-packages>/lv_chordia/cache_data。
    """
    try:
        import importlib.util
        import sys

        spec = importlib.util.find_spec("lv_chordia")
        if not spec or not spec.origin:
            return None
        pkg_dir = os.path.dirname(spec.origin)
        working = os.path.dirname(pkg_dir)  # .../site-packages
        share = os.path.join(sys.prefix, "share", "lv-chordia", "cache_data")
        local = os.path.join(working, "cache_data")
        return share if os.path.isdir(share) else local
    except Exception:
        return None


# 与 lv_chordia.chord_recognition.MODEL_NAMES 保持一致（权重文件名，5 个集成模型）
LV_MODEL_NAMES = [
    "joint_chord_net_ismir_naive_v1.0_reweight(0.0,10.0)_s%d.best" % i for i in range(5)
]


def _collect_assets() -> dict:
    """枚举扒谱所需的全部本地资产，逐条校验存在性。只读，不触发任何下载。

    资产分两类：
    - 随 PyPI wheel 安装（uv sync 落地）：lv-chordia 权重 / madmom 模型 / chord-romanizer
    - 首次用到才下载（运行时）：ffmpeg 静态二进制（imageio-ffmpeg）
    前端据此逐条展示，缺失项提供「下载/修复」按钮（经 Rust prefetch_asset 触发本地拉取）。
    """
    assets: list[dict] = []

    # ── lv-chordia 权重（5× .sdict，~28MB）──
    cache_data = _resolve_lv_cache_data()
    present_lv = 0
    total_lv = len(LV_MODEL_NAMES)
    lv_size = 0
    if cache_data:
        for name in LV_MODEL_NAMES:
            p = os.path.join(cache_data, name + ".sdict")
            if os.path.isfile(p):
                present_lv += 1
                lv_size += os.path.getsize(p)
    assets.append(
        {
            "id": "lv_weights",
            "name": "和弦转写模型 (lv-chordia)",
            "present": present_lv == total_lv,
            "detail": (
                f"{present_lv}/{total_lv} 权重文件就绪"
                + (f" (~{lv_size / 1024 / 1024:.1f} MB)" if lv_size else "")
            ),
            "action": "uv_sync",
        }
    )

    # ── madmom 模型（.pkl）──
    try:
        import importlib.util

        mspec = importlib.util.find_spec("madmom")
        mdir = (
            os.path.join(os.path.dirname(mspec.origin), "models")
            if mspec and mspec.origin
            else ""
        )
        mcount = 0
        if mdir and os.path.isdir(mdir):
            for _root, _dirs, _files in os.walk(mdir):
                mcount += sum(1 for f in _files if f.endswith(".pkl"))
        assets.append(
            {
                "id": "madmom_models",
                "name": "调性/BPM/节奏模型 (madmom)",
                "present": mcount > 0,
                "detail": f"{mcount} 个模型文件就绪" if mcount else "模型文件缺失",
                "action": "uv_sync",
            }
        )
    except Exception:
        assets.append(
            {
                "id": "madmom_models",
                "name": "调性/BPM/节奏模型 (madmom)",
                "present": False,
                "detail": "无法探测",
                "action": "uv_sync",
            }
        )

    # ── chord-romanizer（纯 Python）──
    cr = _probe_import("chord_romanizer")
    assets.append(
        {
            "id": "chord_romanizer",
            "name": "和弦级数 (chord-romanizer)",
            "present": cr,
            "detail": "已安装" if cr else "未安装",
            "action": "uv_sync",
        }
    )

    # ── ffmpeg（imageio-ffmpeg 静态二进制，唯一的运行时首次下载项）──
    assets.append(
        {
            "id": "ffmpeg",
            "name": "音频解码器 (ffmpeg)",
            "present": bool(FFMPEG_AVAILABLE),
            "detail": (
                "已缓存，MP3/FLAC/OGG/AAC 可解码"
                if FFMPEG_AVAILABLE
                else "未缓存，仅 WAV 可分析（需下载）"
            ),
            "action": "fetch_ffmpeg",
        }
    )

    return {
        "status": "ok",
        "assets": assets,
        "all_present": all(a["present"] for a in assets),
    }


@app.get("/api/assets")
def assets() -> dict:
    """只读枚举全部本地资产及其就绪状态，供检测面板逐条展示。"""
    return _collect_assets()


@app.get("/api/selfcheck")
def selfcheck() -> dict:
    """端到端自检：合成一段「有和弦变化」的测试音频，真实跑一遍整条管线。

    会触发 madmom / lv-chordia 等懒加载权重的下载（若有），从而验证「所有要下载的都已就绪」。
    这正是检测面板放行闸门需要的最后一道保障：只有 analysis_ok=True，才能确信「能通过就一定生成得出来」。

    与早期 2 秒纯单和弦音不同，这里用 8 秒、4 段和弦变化（Am→F→C→G）的复音片段，
    更贴近真实歌曲，能暴露「自检秒过、真歌炸」的隐患；并显式断言结果格式良好。
    当 ffmpeg 可用时，额外把同一段转码成 MP3 再分析一遍，验证用户实际会传的压缩格式同样能出和弦。
    """
    import subprocess
    import tempfile
    import traceback

    try:
        import numpy as np
        import soundfile as sf
        from analyze import analyze_all, FFMPEG_AVAILABLE

        sr = 44100

        def chord_block(root: float, dur: float) -> np.ndarray:
            t = np.linspace(0.0, dur, int(sr * dur), endpoint=False)
            sig = np.zeros_like(t)
            # 根音 + 大三度 + 五度 + 八度，加少量泛音，模拟真实和弦
            for semi in (0, 4, 7, 12):
                f = root * 2 ** (semi / 12)
                sig = sig + 0.18 * np.sin(2 * np.pi * f * t)
                sig = sig + 0.05 * np.sin(2 * np.pi * 2 * f * t)
            return sig

        # Am - F - C - G，每段 2 秒，共 8 秒；复音、有调性、有和弦变化
        sig = np.concatenate(
            [
                chord_block(220.00, 2.0),
                chord_block(174.61, 2.0),
                chord_block(261.63, 2.0),
                chord_block(196.00, 2.0),
            ]
        ).astype(np.float32)
        sig = (sig / np.max(np.abs(sig)) * 0.9).astype(np.float32)

        # 基准 wav（44100/16bit），WAV 与 MP3 两条路径共用
        base_wav = tempfile.mktemp(suffix=".wav")
        sf.write(base_wav, sig, sr)

        details: dict = {}

        # ── 路径 1：WAV（核心路径）──
        try:
            res = analyze_all(base_wav)
            chords = res.get("chords") or []
            # 格式良好性：每段和弦有非空标签且时间跨度合法（end >= start）
            malformed = [
                c
                for c in chords
                if not (c.get("chord") and c.get("end_time", 0) >= c.get("start_time", 0))
            ]
            wav_ok = (
                len(chords) > 0
                and res.get("key") is not None
                and not malformed
            )
            details["wav"] = {
                "ok": wav_ok,
                "key": res.get("key"),
                "bpm": res.get("bpm"),
                "chords": len(chords),
                "malformed": len(malformed),
                "warnings": res.get("warnings", []),
            }
        except Exception as e:  # noqa: BLE001
            wav_ok = False
            details["wav"] = {"ok": False, "error": f"{type(e).__name__}: {e}"}

        # ── 路径 2：压缩格式（MP3），仅在 ffmpeg 可用时验证 ──
        compress_ok: bool | None = None
        if FFMPEG_AVAILABLE:
            try:
                import imageio_ffmpeg

                exe = imageio_ffmpeg.get_ffmpeg_exe()
                mp3_path = tempfile.mktemp(suffix=".mp3")
                rr = subprocess.run(
                    [exe, "-y", "-i", base_wav, "-ar", "44100", "-ac", "1", mp3_path],
                    capture_output=True,
                    text=True,
                )
                if (
                    rr.returncode == 0
                    and os.path.exists(mp3_path)
                    and os.path.getsize(mp3_path) > 0
                ):
                    res2 = analyze_all(mp3_path)
                    c2 = res2.get("chords") or []
                    compress_ok = len(c2) > 0 and res2.get("key") is not None
                    details["compress"] = {
                        "ok": compress_ok,
                        "format": "mp3",
                        "key": res2.get("key"),
                        "chords": len(c2),
                    }
                else:
                    compress_ok = False
                    details["compress"] = {
                        "ok": False,
                        "error": rr.stderr.strip()[-200:],
                    }
                try:
                    os.unlink(mp3_path)
                except OSError:
                    pass
            except Exception as e:  # noqa: BLE001
                compress_ok = False
                details["compress"] = {"ok": False, "error": f"{type(e).__name__}: {e}"}
        else:
            details["compress"] = {
                "ok": None,
                "reason": "ffmpeg 不可用，跳过压缩格式验证（仅 WAV 可用）",
            }

        # 清理基准 wav
        try:
            os.unlink(base_wav)
        except OSError:
            pass

        # 闸门判据：WAV 必须通过；若 ffmpeg 可用，则压缩格式也必须通过
        # —— 这样「检测通过」即代表 WAV 与 MP3 等压缩格式都能出和弦。
        analysis_ok = bool(wav_ok) and (compress_ok is None or compress_ok)
        err = None
        if not analysis_ok:
            if not wav_ok:
                err = "WAV 端到端分析未通过（详见 detail.wav）"
            elif compress_ok is False:
                err = "压缩格式（MP3 等）端到端分析未通过，ffmpeg 可能未正确安装"

        return {
            "status": "ok",
            "imports_ok": True,
            "analysis_ok": analysis_ok,
            "ffmpeg_available": FFMPEG_AVAILABLE,
            "compress_ok": compress_ok,
            "error": err,
            "detail": details,
        }
    except Exception as e:  # noqa: BLE001
        return {
            "status": "error",
            "imports_ok": True,
            "analysis_ok": False,
            "ffmpeg_available": False,
            "compress_ok": None,
            "error": f"{type(e).__name__}: {e}",
            "trace": traceback.format_exc().splitlines()[-15:],
        }


@app.post("/api/analyze")
async def analyze(request: Request, file: UploadFile = File(...)) -> JSONResponse:
    if not _origin_ok(request.headers.get("origin")):
        return JSONResponse(status_code=403, content={"error": "origin not allowed"})

    # 限制请求体大小，避免超大文件全量读入内存触发 OOM（审查 #3）。
    # 与前端 50MB 上限一致；超限直接 413，不进入分析管线。
    MAX_UPLOAD_BYTES = 50 * 1024 * 1024
    content = b""
    async for chunk in file.stream():
        content += chunk
        if len(content) > MAX_UPLOAD_BYTES:
            return JSONResponse(
                status_code=413,
                content={"error": "文件过大，请上传 50MB 以内的音频"},
            )

    suffix = Path(file.filename or "audio.mp3").suffix or ".mp3"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        result = analyze_all(tmp_path)
        return JSONResponse(content=result)
    finally:
        os.unlink(tmp_path)


def run() -> None:
    import uvicorn

    # 固定端口，由 Rust 通过 LOCAL_ENGINE_PORT 环境变量传入（默认 18741）。
    # 不再做端口扫描——Rust 端同样只认此端口，漂移会导致状态检测矛盾。
    port = DEFAULT_PORT
    print(f"Local engine on http://{HOST}:{port}")
    uvicorn.run(app, host=HOST, port=port)


if __name__ == "__main__":
    run()
