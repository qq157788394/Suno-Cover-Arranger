"""本地引擎离线分析核心。

分层设计：
- lv-chordia（必装）：和弦转写，离线批处理。
- madmom（可选）：调性 / BPM / 节拍 / 强拍。madmom 自带 numpy/Cython 神经网络，无需 TensorFlow。
- chord-romanizer（可选）：和弦 -> 罗马级数。

任意可选层缺失或失败时降级，不阻断主流程（至少返回和弦）。
"""
from __future__ import annotations

import logging
import os
import re
import tempfile
from typing import Any

import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("local-engine")

# ── Python 3.10+ 兼容性补丁（madmom 等旧库用 collections.MutableSequence 等已迁移到 collections.abc）─
import collections as _collections
import collections.abc as _collections_abc
for _abc_name in (
    "MutableSequence",
    "MutableMapping",
    "Mapping",
    "Sequence",
    "Iterable",
    "Callable",
):
    if not hasattr(_collections, _abc_name):
        setattr(_collections, _abc_name, getattr(_collections_abc, _abc_name))

# ── NumPy 1.24+ 兼容性补丁（madmom 0.16 内部用了 np.float / np.int 等已删除的别名）─
#    仅补确认被引用的别名，避免给 np.bool/np.object/np.str/np.long 赋值触发 FutureWarning。
import numpy as _np
for _np_alias, _np_real in (
    ("float", float),
    ("int", int),
    ("complex", complex),
    ("unicode", str),
    ("float_", _np.float64),
    ("int_", _np.int64),
):
    if not hasattr(_np, _np_alias):
        setattr(_np, _np_alias, _np_real)

# ── NumPy>=1.24 ragged-array 问题 ──
#    madmom 0.16 内部（如 downbeats.py 的 `np.asarray(results)`）依赖"ragged 序列自动降级为
#    object 数组"的 NumPy 1.23 行为，1.24+ 直接抛 ValueError。
#    降低 numpy 到 <1.24 在 Python 3.12 上无解（1.23.5 无 3.12 wheel），故用运行时 shim 还原该行为。
#    必须在 import madmom 之前执行（madmom 是懒加载，本模块顶层执行即可）。
import numpy_ragged_shim  # noqa: F401  (side-effect: patches numpy.asarray/array/asanyarray)


# ── ffmpeg 可用性（imageio-ffmpeg 随包静态二进制，首次调用下载并缓存到用户 cache）──
#    madmom 与 lv_chordia 的音频加载最终都依赖 ffmpeg 才能解 mp3/flac/ogg/aac。
#    没有它，仅 wav 可用；有了它，检测面板声明的 MP3/FLAC/OGG/AAC 才真能生成和弦。
#    把 ffmpeg 所在目录加进 PATH，使 librosa/audioread/ffmpeg CLI 都能找到它。
FFMPEG_AVAILABLE = False


def _init_ffmpeg() -> None:
    global FFMPEG_AVAILABLE
    try:
        import imageio_ffmpeg

        exe = imageio_ffmpeg.get_ffmpeg_exe()  # 首次会下载静态二进制（需联网一次）
        if exe and os.path.exists(exe):
            d = os.path.dirname(exe)
            if d and d not in os.environ.get("PATH", ""):
                os.environ["PATH"] = d + os.pathsep + os.environ.get("PATH", "")
            FFMPEG_AVAILABLE = True
        else:
            FFMPEG_AVAILABLE = False
    except Exception as e:
        logger.info("ffmpeg 不可用（仅 wav 可分析）：%s", e)
        FFMPEG_AVAILABLE = False


_init_ffmpeg()


def normalize_chord_label(jams: str) -> str:
    """JAMS 和弦标签 -> 标准展示/解析标签，与前端 normalizeChordLabel 保持一致。

    - 去 `:`      Bb:maj7 -> Bbmaj7
    - 裸 maj 省略 F:maj   -> F   （maj 后跟数字则保留，如 maj7）
    - min -> m    A:min7  -> Am7
    - N 原样返回
    """
    if not jams or jams.upper() == "N":
        return "N"
    s = jams.replace(":", "")
    s = re.sub(r"maj(?![0-9])", "", s)
    s = s.replace("min", "m")
    return s


def _ffmpeg_exe() -> str | None:
    """返回可用的 ffmpeg 二进制路径（依赖 imageio-ffmpeg 已初始化）。"""
    if not FFMPEG_AVAILABLE:
        return None
    try:
        import imageio_ffmpeg

        exe = imageio_ffmpeg.get_ffmpeg_exe()
        return exe if exe and os.path.exists(exe) else None
    except Exception:
        return None


def to_standard_wav(audio_path: str) -> str:
    """把【任意】输入音频统一转成 madmom / lv_chordia 都能直接读的 44100Hz 16-bit PCM WAV。

    这是「检测通过就一定能生成和弦」的关键一环：无论用户上传 wav/mp3/flac/ogg/aac，
    本函数都产出一份标准 wav，使下游两个模型都不再依赖格式/采样率、也不再触发
    madmom 内部的 ffmpeg 重采样崩溃。

    - ffmpeg 可用时：直接用它转码到 44100/单声道/16-bit（覆盖所有 ffmpeg 支持的格式）。
    - 否则回退 soundfile 直接读（仅 wav / libsndfile 支持的少数格式）。

    返回新建的临时 wav 路径（调用方负责删除）。解码失败时抛出明确异常，
    让上层返回 500 + 清晰错误信息，而非静默产出空和弦。
    """
    import soundfile as sf

    wav_path = tempfile.mktemp(suffix=".wav")
    exe = _ffmpeg_exe()
    if exe:
        import subprocess

        r = subprocess.run(
            [
                exe,
                "-y",
                "-i",
                audio_path,
                "-ar",
                "44100",
                "-ac",
                "1",
                "-sample_fmt",
                "s16",
                "-f",
                "wav",
                wav_path,
            ],
            capture_output=True,
            text=True,
        )
        if r.returncode == 0 and os.path.exists(wav_path) and os.path.getsize(wav_path) > 0:
            return wav_path
        # ffmpeg 失败：清理并尝试 soundfile 兜底
        try:
            os.unlink(wav_path)
        except OSError:
            pass
        raise RuntimeError(
            f"ffmpeg 转码失败（音频可能损坏或格式不支持）：{r.stderr.strip()[-200:]}"
        )

    # 无 ffmpeg：仅能读 wav / libsndfile 支持的格式
    import librosa

    y, sr = sf.read(audio_path, dtype="float32")
    if sr != 44100:
        y = librosa.resample(y, orig_sr=sr, target_sr=44100)
    wav_path = tempfile.mktemp(suffix=".wav")
    sf.write(wav_path, (np.clip(y, -1.0, 1.0) * 32767).astype(np.int16), 44100)
    return wav_path


def analyze_chords(audio_path: str, chord_dict_name: str = "submission") -> list[dict]:
    """lv-chordia 离线转写，返回 [{start_time, end_time, chord}]。"""
    from lv_chordia.chord_recognition import chord_recognition

    segments = chord_recognition(audio_path=audio_path, chord_dict_name=chord_dict_name)
    out: list[dict] = []
    for seg in segments:
        out.append(
            {
                "start_time": float(seg["start_time"]),
                "end_time": float(seg["end_time"]),
                "chord": str(seg["chord"]),
            }
        )
    return out


def analyze_key_bpm_rhythm(
    audio_path: str,
) -> tuple[str | None, float | None, dict | None]:
    """madmom 出 调性 / BPM / 节奏网格。

    入参 audio_path 应为 44100Hz 16-bit PCM WAV（由 analyze_all 经 to_standard_wav 预处理），
    因此这里直接喂给 madmom，不再做格式/采样率相关转换。
    未安装或失败时返回 (None, None, None)。API 依据 madmom 0.16 官方文档源码校准。
    """
    try:
        from madmom.features.key import (
            CNNKeyRecognitionProcessor,
            key_prediction_to_label,
        )
        from madmom.features.tempo import TempoEstimationProcessor
        from madmom.features.beats import RNNBeatProcessor, BeatTrackingProcessor
        from madmom.features.downbeats import (
            RNNDownBeatProcessor,
            DBNDownBeatTrackingProcessor,
        )
    except Exception as e:
        logger.warning("madmom 不可用，跳过 key/bpm/rhythm：%s", e)
        return None, None, None

    try:
        # --- key（返回 "C major" / "A minor" 之类标签）---
        key_pred = CNNKeyRecognitionProcessor()(audio_path)
        key_label = key_prediction_to_label(key_pred)

        # --- beat activation（tempo 与 beats 复用同一份）---
        beat_act = RNNBeatProcessor()(audio_path)

        # --- tempo ---
        tempi = TempoEstimationProcessor(fps=100)(beat_act)  # (N,2): (bpm, strength)
        bpm = float(tempi[0][0]) if len(tempi) else None

        # --- beats（秒）---
        beats = [float(t) for t in BeatTrackingProcessor(fps=100)(beat_act)]

        # --- downbeats / 小节 ---
        db_act = RNNDownBeatProcessor()(audio_path)
        db_raw = DBNDownBeatTrackingProcessor(beats_per_bar=[3, 4], fps=100)(db_act)
        # db_raw: (n,2) 每行为 (时间秒, 小节内拍序 从1起)。整段返回的是【所有拍】，
        # 其中拍序==1 的才是强拍(downbeat)。
        downbeats = [float(t) for t, b in db_raw if int(b) == 1]
        beats_per_bar = int(max((int(b) for _, b in db_raw), default=0)) or None

        rhythm = {
            "beats": beats,
            "downbeats": downbeats,
            "beats_per_bar": beats_per_bar,
            "bars": len(downbeats),
        }
        return key_label, bpm, rhythm
    except Exception as e:
        logger.warning("madmom 分析失败：%s", e)
        return None, None, None


def analyze_roman(chords: list[dict], key_label: str | None) -> list[dict] | None:
    """chord-romanizer：和弦 -> 罗马级数。需 key；缺 key 则跳过。

    API 依据 chord-romanizer 0.1.9 PyPI 文档校准。
    """
    if not key_label:
        logger.info("无 key，跳过 romanizer")
        return None
    try:
        from chord_romanizer import Romanizer, ChordParser
    except Exception as e:
        logger.warning("chord-romanizer 不可用：%s", e)
        return None

    try:
        # key_label 形如 "C major" -> 取 tonic 作为 default_tonic
        tonic = key_label.split()[0]
        romanizer = Romanizer(default_tonic=tonic)

        # 收集可解析的和弦（非 N、非异常、且 ChordParser.parse 非 None）。
        # 注意：annotate_progression 的上下文分析阶段不会跳过 None，必须把 None 排掉，
        # 否则会在 analyze_slash_chord 里对 None 取 .bass 抛 AttributeError。
        valid_idx: list[int] = []
        parsed: list[Any] = []
        for i, c in enumerate(chords):
            label = c.get("chord")
            if not label or label == "N":
                continue
            norm = normalize_chord_label(label)
            try:
                pc = ChordParser.parse(norm)
            except Exception:
                continue
            if pc is None:
                # 极生僻/无法解析的符号（如异常扩展），跳过，不留占位
                continue
            valid_idx.append(i)
            parsed.append(pc)

        if not parsed:
            return None

        results = romanizer.annotate_progression(parsed)
        # results 与 parsed 同序（annotate_progression 仅跳过 None，而 parsed 已无 None）
        roman_map = {valid_idx[k]: r.roman for k, r in enumerate(results)}

        out = []
        for i, c in enumerate(chords):
            out.append(
                {
                    "start_time": c["start_time"],
                    "end_time": c["end_time"],
                    "roman": roman_map.get(i, ""),
                }
            )
        return out
    except Exception as e:
        logger.warning("chord-romanizer 分析失败：%s", e)
        return None


def analyze_all(audio_path: str, chord_dict_name: str = "submission") -> dict:
    """端到端离线分析，返回 spec 定义的 result JSON。

    先把任意输入统一转成 44100Hz 16-bit PCM WAV（to_standard_wav），
    再交给 lv_chordia（和弦）与 madmom（调性/BPM/节奏）。
    这样无论 wav/mp3/flac/ogg/aac，下游模型都拿到标准 wav，避免格式/采样率导致的静默失败。
    """
    warnings: list[str] = []
    # 统一转码：解码失败（损坏/不支持格式）会抛 RuntimeError -> 端点返回 500 + 清晰错误，
    # 而不是静默返回空和弦。临时 wav 在 finally 清理。
    wav = to_standard_wav(audio_path)
    try:
        chords = analyze_chords(wav, chord_dict_name)
        key, bpm, rhythm = analyze_key_bpm_rhythm(wav)
        if key is None:
            warnings.append("madmom 未提供 key/bpm/rhythm（可能未安装或分析失败）")
        roman = analyze_roman(chords, key)
        if roman is None and key is not None:
            warnings.append("chord-romanizer 未提供级数")

        return {
            "chords": chords,
            "key": key,
            "bpm": bpm,
            "rhythm": rhythm,
            "roman": roman,
            "warnings": warnings,
        }
    finally:
        try:
            os.unlink(wav)
        except OSError:
            pass
