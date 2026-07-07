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


def _to_wav_for_madmom(audio_path: str) -> tuple[str, bool]:
    """madmom 的 audioread 后端在缺 ffmpeg 时解不出 mp3。

    用已装的 librosa 预解码成 wav（soundfile 原生可读，无需 ffmpeg），再喂给 madmom。
    返回 (实际传给 madmom 的路径, 是否为本函数新建的临时文件)。
    """
    if audio_path.lower().endswith(".wav"):
        return audio_path, False
    try:
        import librosa
        import soundfile as sf

        y, sr = librosa.load(audio_path, sr=44100, mono=True)
        wav_path = tempfile.mktemp(suffix=".wav")
        sf.write(wav_path, y, sr)
        return wav_path, True
    except Exception as e:
        logger.warning(
            "mp3->wav 预解码失败，回退原路径（madmom 可能仍报错）：%s", e
        )
        return audio_path, False


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

    # mp3 需先经 librosa 预解码成 wav（madmom 的 audioread 后端缺 ffmpeg 时解不出 mp3）
    audio_for_madmom, _is_tmp = _to_wav_for_madmom(audio_path)
    try:
        # --- key（返回 "C major" / "A minor" 之类标签）---
        key_pred = CNNKeyRecognitionProcessor()(audio_for_madmom)
        key_label = key_prediction_to_label(key_pred)

        # --- beat activation（tempo 与 beats 复用同一份）---
        beat_act = RNNBeatProcessor()(audio_for_madmom)

        # --- tempo ---
        tempi = TempoEstimationProcessor(fps=100)(beat_act)  # (N,2): (bpm, strength)
        bpm = float(tempi[0][0]) if len(tempi) else None

        # --- beats（秒）---
        beats = [float(t) for t in BeatTrackingProcessor(fps=100)(beat_act)]

        # --- downbeats / 小节 ---
        db_act = RNNDownBeatProcessor()(audio_for_madmom)
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
    finally:
        if _is_tmp and os.path.exists(audio_for_madmom):
            try:
                os.remove(audio_for_madmom)
            except OSError:
                pass


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
    """端到端离线分析，返回 spec 定义的 result JSON。"""
    warnings: list[str] = []
    chords = analyze_chords(audio_path, chord_dict_name)
    key, bpm, rhythm = analyze_key_bpm_rhythm(audio_path)
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
