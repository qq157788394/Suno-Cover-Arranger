#!/usr/bin/env python3
"""
Stage 4+5 合并流水线：去AI标记MP3 + 多轨MIDI转录 — 一步到位

功能：
1. Stage 4: 剥离音频文件中 Suno/Udio/AI 元数据标记 → 输出 clean MP3
2. Stage 5: 自动转录为多轨 MIDI（支持细化乐器分类）
3. 多轨细化：人声/鼓/贝斯 由 Demucs 原生支持，其他乐器通过 Basic Pitch 进一步细分
   - 键盘/合成器/吉他 通过频谱分析 + 多音检测做最佳估计标记
4. 单条命令完成，不用分两次跑

用法：
    # 合并模式（去标签 + MIDI 一步到位）
    python stage45_combined.py -i song.mp3 -o ./output
     
    # 仅去标签（等效旧 Stage 4）
    python stage45_combined.py -i song.mp3 --strip-only
     
    # 仅 MIDI（等效旧 Stage 5）
    python stage45_combined.py -i song.mp3 --midi-only
     
    # 完整模式 + 多轨细化
    python stage45_combined.py -i song.mp3 -o ./output --refine

兼容：独立运行 ｜ 集成到流水线 ｜ 作为 Python 模块 import
"""

import argparse
import json
import logging
import os
import sys
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any

import numpy as np
import scipy.signal as sp
import soundfile as sf

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("cover_pipeline")


# ============================================================================
# 依赖检测
# ============================================================================

def check_deps() -> Dict[str, bool]:
    """检查核心依赖"""
    deps = {}
    for pkg in ["numpy", "scipy", "soundfile", "librosa", "midiutil"]:
        try:
            __import__(pkg)
            deps[pkg] = True
        except ImportError:
            deps[pkg] = False
    return deps


def check_optional_deps() -> Dict[str, bool]:
    """检查可选依赖"""
    deps = {}
    for pkg in ["torch", "basic_pitch", "music21"]:
        try:
            if pkg == "basic_pitch":
                import basic_pitch
                deps[pkg] = True
            else:
                __import__(pkg)
                deps[pkg] = True
        except ImportError:
            deps[pkg] = False

    # 检查 demucs CLI
    try:
        r = subprocess.run(
            [sys.executable, "-m", "demucs", "--help"],
            capture_output=True, encoding='utf-8', errors='replace', timeout=10,
        )
        deps["demucs"] = r.returncode == 0
    except Exception:
        deps["demucs"] = False

    # 检查 ffmpeg
    try:
        r = subprocess.run(["ffmpeg", "-version"], capture_output=True, timeout=5)
        deps["ffmpeg"] = r.returncode == 0
    except Exception:
        deps["ffmpeg"] = False

    return deps


# ============================================================================
# Stage 4: 去 AI 标记
# ============================================================================

def strip_ai_metadata_ffmpeg(input_path: Path, output_path: Path) -> bool:
    """使用 ffmpeg 剥离所有非音频元数据"""
    cmd = [
        "ffmpeg", "-y",
        "-i", str(input_path),
        "-map_metadata", "-1",
        "-map", "0:a",
        "-codec", "copy",
        str(output_path),
    ]
    try:
        r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=120)
        if r.returncode == 0 and output_path.exists() and output_path.stat().st_size > 0:
            logger.info(f"✅ AI 元数据已剥离: {output_path.name}")
            return True
        else:
            logger.error(f"❌ 剥离失败: {r.stderr[:200]}")
            return False
    except Exception as e:
        logger.error(f"💥 ffmpeg 异常: {e}")
        return False


def check_ffmpeg_metadata(input_path: Path) -> dict:
    """读取音频元数据"""
    try:
        r = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json",
             "-show_format", str(input_path)],
            capture_output=True, encoding='utf-8', errors='replace', timeout=30,
        )
        data = json.loads(r.stdout)
        return data.get("format", {}).get("tags", {})
    except Exception:
        return {}


# ============================================================================
# Stage 5: 多轨 MIDI 转录（增强版）
# ============================================================================

# 细化乐器分类配置
# level="demucs": Demucs 4-stem 基础分轨
# level="refined": 在 demucs 基础上进一步细分 other→键盘/合成器/吉他
INSTRUMENT_CATEGORIES = {
    # {name: {midi_channel, midi_program, freq_range(min_hz, max_hz)}}
    "vocals":     {"channel": 0, "program": 54, "name": "Vocals",       "freq_range": (80, 1200)},
    "drums":      {"channel": 9, "program": 0,  "name": "Drums",        "freq_range": (30, 16000), "is_drums": True},
    "bass":       {"channel": 1, "program": 34, "name": "Bass",         "freq_range": (30, 500)},
    "keyboard":   {"channel": 2, "program": 1,  "name": "Keyboard",     "freq_range": (80, 4000)},
    "synth":      {"channel": 3, "program": 90, "name": "Synth Pad",    "freq_range": (50, 8000)},
    "guitar":     {"channel": 4, "program": 25, "name": "Guitar",       "freq_range": (80, 6000)},
    "other":      {"channel": 5, "program": 48, "name": "Other",        "freq_range": (20, 16000)},
}

# Demucs 4-stem → 我们的细化映射
DEMUCS_TO_REFINED = {
    "vocals": ["vocals"],
    "drums":  ["drums"],
    "bass":   ["bass"],
    "other":  ["other"],  # refined 模式会把 other 进一步拆分
}

# refined 模式下 other 的细分频段
OTHER_SUBBANDS = {
    "keyboard":  (200, 2000,  1.0),   # (min_hz, max_hz, weight)
    "synth":     (100, 4000,  0.7),
    "guitar":    (150, 3000,  0.8),
}


class CoverPipeline:
    """
    翻唱后处理流水线核心类

    整合 Stage 4（去AI标记）+ Stage 5（多轨MIDI转录）
    """

    NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    def __init__(
        self,
        strip_metadata: bool = True,
        refine_instruments: bool = False,
        use_separation: bool = True,
        hop_length: int = 256,
        fmin: float = 65.0,
        fmax: float = 2093.0,
        min_note_duration: float = 0.05,
        velocity_threshold: float = 0.1,
        bpm: int = 120,
    ):
        self.strip_metadata = strip_metadata
        self.refine_instruments = refine_instruments
        self.use_separation = use_separation
        self.hop_length = hop_length
        self.fmin = fmin
        self.fmax = fmax
        self.min_note_duration = min_note_duration
        self.velocity_threshold = velocity_threshold
        self.bpm = bpm

        self.deps = check_deps()
        self.opt_deps = check_optional_deps()

    # ------------------------------------------------------------------
    # 工具函数
    # ------------------------------------------------------------------

    def _import_librosa(self):
        """延迟导入 librosa + midiutil"""
        global librosa, MIDIFile
        import librosa
        from midiutil import MIDIFile

    def _hz_to_midi(self, freq: float) -> Optional[int]:
        if freq <= 0:
            return None
        midi = 12 * (np.log2(freq) - np.log2(440.0)) + 69
        m = int(round(midi))
        if 21 <= m <= 108:
            return m
        return None

    def _detect_pitch(self, audio, sr):
        """librosa.pyin 音高检测"""
        fmin = self.fmin
        fmax = min(self.fmax, sr / 2.0 - 10)
        logger.info(f"🎤 音高检测中 (fmin={fmin}Hz, fmax={fmax}Hz, hop={self.hop_length})...")
        f0, voiced_flag, voiced_prob = librosa.pyin(
            y=audio, sr=sr,
            fmin=fmin, fmax=fmax,
            hop_length=self.hop_length, fill_na=np.nan,
        )
        times = librosa.frames_to_time(np.arange(len(f0)), sr=sr, hop_length=self.hop_length)
        return times, f0, voiced_prob

    def _pitch_to_notes(self, times, f0, confidence) -> List[Tuple[float, float, int, int]]:
        """音高 → 音符事件列表 [(start, end, pitch, velocity)]"""
        notes = []
        if len(times) == 0:
            return notes

        midi_notes = []
        for freq, conf in zip(f0, confidence):
            if np.isnan(freq) or conf < self.velocity_threshold:
                midi_notes.append(None)
            else:
                midi_notes.append(self._hz_to_midi(freq))

        current_note = None
        note_start = None
        note_velocities = []

        for i, (t, note) in enumerate(zip(times, midi_notes)):
            if note is not None:
                if current_note is None:
                    current_note = note
                    note_start = t
                    note_velocities = []
                elif note != current_note:
                    duration = t - note_start
                    if duration >= self.min_note_duration and note_velocities:
                        avg_vel = int(np.mean(note_velocities))
                        notes.append((note_start, t, current_note, min(127, max(30, avg_vel))))
                    current_note = note
                    note_start = t
                    note_velocities = []
            else:
                if current_note is not None:
                    duration = t - note_start
                    if duration >= self.min_note_duration and note_velocities:
                        avg_vel = int(np.mean(note_velocities))
                        notes.append((note_start, t, current_note, min(127, max(30, avg_vel))))
                    current_note = None
                    note_start = None
                    note_velocities = []

            if note is not None and note_start is not None and i < len(confidence):
                vel = int(30 + confidence[i] * 97)
                note_velocities.append(min(127, max(30, vel)))

        if current_note is not None and note_start is not None and note_velocities:
            duration = times[-1] - note_start
            if duration >= self.min_note_duration:
                avg_vel = int(np.mean(note_velocities))
                notes.append((note_start, times[-1], current_note, min(127, max(30, avg_vel))))

        logger.info(f"🎵 检测到 {len(notes)} 个音符")
        return notes

    def _detect_drums(self, audio, sr) -> List[Tuple[float, float, int, int]]:
        """打击乐检测"""
        S = np.abs(librosa.stft(y=audio, hop_length=self.hop_length))
        freqs = librosa.fft_frequencies(sr=sr)

        bands = {
            "kick":  (60, 150),
            "snare": (150, 500),
            "hihat": (4000, sr/2),
            "tom":   (200, 1000),
        }

        drum_notes = []
        for band_name, (f_low, f_high) in bands.items():
            mask = (freqs >= f_low) & (freqs <= f_high)
            if not np.any(mask):
                continue
            band_energy = np.sum(S[mask, :], axis=0)
            onset_env = band_energy / (np.max(band_energy) + 1e-10)
            peaks, properties = sp.find_peaks(
                onset_env, height=0.3,
                distance=int(0.1 * sr / self.hop_length),
            )

            for i, peak in enumerate(peaks):
                t = peak * self.hop_length / sr
                vel = min(127, int(properties["peak_heights"][i] * 100 + 30))
                if band_name == "kick":
                    midi_note = 36
                elif band_name == "snare":
                    midi_note = 38 if onset_env[peak] > 0.7 else 40
                elif band_name == "hihat":
                    midi_note = 42 if onset_env[peak] > 0.7 else 46
                else:
                    midi_note = 47
                drum_notes.append((t, t + 0.05, midi_note, vel))

        logger.info(f"🥁 检测到 {len(drum_notes)} 个打击乐事件")
        return drum_notes

    # ------------------------------------------------------------------
    # 音源分离 (Demucs / librosa HPSS)
    # ------------------------------------------------------------------

    def _separate_stems(self, input_path: Path, output_dir: Path) -> Dict[str, Path]:
        """使用 Demucs 进行 4-stem 分离"""
        logger.info("🔊 音源分离中 (Demucs)...")

        try:
            subprocess.run(
                [sys.executable, "-m", "demucs",
                 "-o", str(output_dir), str(input_path)],
                capture_output=True, encoding='utf-8', errors='replace', timeout=600,
            )
        except subprocess.TimeoutExpired:
            logger.error("⏰ Demucs 分离超时")
            raise
        except Exception as e:
            logger.error(f"Demucs 分离失败: {e}, 回退 HPSS")
            return self._separate_stems_librosa(input_path, output_dir)

        input_stem = input_path.stem
        demucs_out = output_dir / "htdemucs" / input_stem

        stems = {}
        for s in ["vocals", "drums", "bass", "other"]:
            f = demucs_out / f"{s}.wav"
            if f.exists():
                stems[s] = f
        return stems

    def _separate_stems_librosa(self, input_path: Path, output_dir: Path) -> Dict[str, Path]:
        """librosa HPSS 轻量分离"""
        logger.info("🔊 使用 librosa HPSS 分离（轻量版）...")
        audio, sr = librosa.load(str(input_path), sr=44100, mono=True)
        harmonic, percussive = librosa.effects.hpss(audio)

        stems = {}
        other_path = output_dir / f"{input_path.stem}_other.wav"
        sf.write(str(other_path), harmonic, sr)
        stems["other"] = other_path

        drums_path = output_dir / f"{input_path.stem}_drums.wav"
        sf.write(str(drums_path), percussive, sr)
        stems["drums"] = drums_path

        stems["vocals"] = other_path  # 复用
        stems["bass"] = other_path
        return stems

    # ------------------------------------------------------------------
    # 乐器细化分析（other → keyboard/synth/guitar）
    # ------------------------------------------------------------------

    def _analyze_instrument_profile(self, audio_path: Path) -> List[Dict]:
        """
        对单个音频文件做乐器分类分析

        返回: [{"instrument": "keyboard", "confidence": 0.7, "time_ranges": [...]}, ...]
        """
        audio, sr = librosa.load(str(audio_path), sr=44100, mono=True)
        audio = audio / (np.max(np.abs(audio)) + 1e-10)

        # 计算频谱
        S = np.abs(librosa.stft(y=audio, hop_length=self.hop_length))
        freqs = librosa.fft_frequencies(sr=sr)
        times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=self.hop_length)

        # 分段分析（每 2 秒一段）
        segment_len = int(2.0 * sr / self.hop_length)
        n_segments = max(1, S.shape[1] // segment_len)

        instruments = []

        for seg_idx in range(n_segments):
            start_frame = seg_idx * segment_len
            end_frame = min((seg_idx + 1) * segment_len, S.shape[1])
            seg_spectrum = np.mean(S[:, start_frame:end_frame], axis=1)
            seg_total_energy = np.sum(seg_spectrum) + 1e-10
            seg_time = times[start_frame]

            scores = {}

            # 键盘：中高频丰富，谐波间隔均匀
            keyboard_mask = (freqs >= 200) & (freqs <= 2000)
            keyboard_energy = np.sum(seg_spectrum[keyboard_mask]) / seg_total_energy
            scores["keyboard"] = min(1.0, keyboard_energy * 2.5)

            # 合成器：宽频带，高频有泛音
            synth_mask = (freqs >= 100) & (freqs <= 4000)
            synth_energy = np.sum(seg_spectrum[synth_mask]) / seg_total_energy
            # 检测频谱是否平坦（合成器特征）
            if np.sum(seg_spectrum) > 0:
                spectral_flatness = np.exp(np.mean(np.log(seg_spectrum + 1e-10))) / (np.mean(seg_spectrum) + 1e-10)
                scores["synth"] = min(1.0, synth_energy * 2.0 * (0.5 + spectral_flatness * 2))
            else:
                scores["synth"] = 0.0

            # 吉他：中频集中，有拨弦瞬态
            guitar_mask = (freqs >= 150) & (freqs <= 3000)
            guitar_energy = np.sum(seg_spectrum[guitar_mask]) / seg_total_energy
            # 检测中频是否有明显的共振峰（吉他特征）
            if S.shape[1] > end_frame:
                onset_strength = np.sum(librosa.onset.onset_strength(
                    y=audio[int(start_frame * self.hop_length):int(end_frame * self.hop_length)],
                    sr=sr)) / (end_frame - start_frame + 1)
                scores["guitar"] = min(1.0, guitar_energy * 2.0 * min(1.0, onset_strength * 5))
            else:
                scores["guitar"] = 0.0

            # 取最高分
            best_instrument = max(scores, key=scores.get)
            best_score = scores[best_instrument]

            if best_score > 0.3:
                instruments.append({
                    "instrument": best_instrument,
                    "confidence": round(best_score, 2),
                    "time": round(seg_time, 2),
                    "scores": {k: round(v, 2) for k, v in scores.items()},
                })

        # 去重合并连续同乐器段落
        merged = []
        for item in instruments:
            if merged and merged[-1]["instrument"] == item["instrument"]:
                # 合并时间段
                continue
            merged.append(item)

        return merged

    def _transcribe_stem(self, audio_path: Path, track_type: str) -> List[Tuple]:
        """转录单轨音频"""
        if not audio_path.exists():
            return []

        audio, sr = librosa.load(str(audio_path), sr=44100, mono=True)
        audio = audio / (np.max(np.abs(audio)) + 1e-10)

        if track_type == "drums":
            return self._detect_drums(audio, sr)
        elif track_type == "bass":
            old_fmin, old_fmax = self.fmin, self.fmax
            self.fmin, self.fmax = 30.0, 500.0
            times, f0, conf = self._detect_pitch(audio, sr)
            notes = self._pitch_to_notes(times, f0, conf)
            self.fmin, self.fmax = old_fmin, old_fmax
            return notes
        else:
            times, f0, conf = self._detect_pitch(audio, sr)
            return self._pitch_to_notes(times, f0, conf)

    def _transcribe_stem_basic_pitch(self, audio_path: Path) -> List[Tuple]:
        """使用 Basic Pitch（多音检测）转录"""
        global BP_MODEL
        try:
            from basic_pitch.inference import predict
            from basic_pitch import ICASSP_2022_MODEL_PATH

            model_output, midi_data, note_events = predict(
                str(audio_path),
                ICASSP_2022_MODEL_PATH,
            )
            notes = []
            for event in note_events:
                start, end, pitch, velocity = event
                if (end - start) >= self.min_note_duration:
                    notes.append((float(start), float(end), int(pitch), int(velocity)))
            return notes
        except Exception as e:
            logger.warning(f"Basic Pitch 失败: {e}，回退 pyin")
            return None  # 让调用方回退

    # ------------------------------------------------------------------
    # 主流程
    # ------------------------------------------------------------------

    def process(
        self,
        input_path: Path,
        output_dir: Path,
    ) -> Dict[str, Any]:
        """
        执行完整流水线

        返回: {
            "input": str,
            "clean_mp3": str or None,
            "midi": str or None,
            "instruments": [str, ...],
            "stats": {...},
            "duration_seconds": float,
        }
        """
        self._import_librosa()
        start_time = time.time()
        result = {
            "input": str(input_path),
            "clean_mp3": None,
            "midi": None,
            "instruments": [],
            "stats": {},
            "duration_seconds": 0,
        }

        output_dir.mkdir(parents=True, exist_ok=True)
        tmp_dir = Path(tempfile.mkdtemp(prefix="cover_pipeline_"))

        try:
            # ================================================================
            # Phase 1: Stage 4 — 去 AI 元数据
            # ================================================================
            clean_mp3 = None
            if self.strip_metadata and self.opt_deps.get("ffmpeg", False):
                clean_mp3 = output_dir / f"{input_path.stem}_clean.mp3"
                logger.info("=" * 50)
                logger.info("📋 Phase 1: 剥离 AI 元数据标记")
                logger.info("=" * 50)
                if strip_ai_metadata_ffmpeg(input_path, clean_mp3):
                    result["clean_mp3"] = str(clean_mp3)
                else:
                    clean_mp3 = None
                    logger.warning("⚠️ 元数据剥离失败，继续 MIDI 转录")

            # ================================================================
            # Phase 2: Stage 5 — 多轨 MIDI 转录
            # ================================================================
            logger.info("=" * 50)
            logger.info("🎵 Phase 2: 多轨 MIDI 转录")
            logger.info(f"⚙️  细化模式: {'开启' if self.refine_instruments else '关闭'}")
            logger.info(f"⚙️  音源分离: {'开启' if self.use_separation else '关闭'}")
            logger.info("=" * 50)

            # 确定转录源文件
            source_audio = clean_mp3 if clean_mp3 else input_path

            # 音源分离
            stems = {}
            if self.use_separation and self.opt_deps.get("demucs", False):
                stems = self._separate_stems(source_audio, tmp_dir)
            elif self.use_separation:
                logger.warning("⚠️ Demucs 未安装，使用 HPSS 轻量分离")
                stems = self._separate_stems_librosa(source_audio, tmp_dir)
            else:
                stems = {"full": source_audio}

            # 构建轨列表（根据 refine 模式）
            track_list = []
            if self.refine_instruments and "other" in stems:
                # 细化模式：对 other 轨做乐器分类
                logger.info("🔬 乐器细化分析中...")
                instrument_profile = self._analyze_instrument_profile(stems["other"])

                # 统计各乐器出现比例
                inst_counts = {}
                for p in instrument_profile:
                    inst_counts[p["instrument"]] = inst_counts.get(p["instrument"], 0) + 1
                total_segments = len(instrument_profile) or 1
                logger.info(f"  乐器分布: {', '.join(f'{k}: {v/total_segments*100:.0f}%' for k, v in inst_counts.items())}")

                # Demucs 原生轨
                for name in ["vocals", "drums", "bass"]:
                    if name in stems:
                        track_list.append((name, stems[name]))

                # 细化轨
                for inst_name in ["keyboard", "synth", "guitar"]:
                    if inst_name in inst_counts:
                        ratio = inst_counts[inst_name] / total_segments
                        if ratio > 0.15:  # 超过15%时间段才单独成轨
                            track_list.append((inst_name, stems["other"]))
                            logger.info(f"  ➕ 新增细化轨: {inst_name} (占比 {ratio*100:.0f}%)")

                # 如果细化后没有任何额外轨，保留 other
                if len(track_list) <= 3:  # 只有 vocals/drums/bass
                    track_list.append(("other", stems["other"]))

                # 记录检测到的乐器
                result["instruments"] = list(inst_counts.keys())
                result["instrument_profile"] = instrument_profile
            else:
                # 标准模式：Demucs 4-stem 直接映射
                stem_order = ["vocals", "drums", "bass", "other"]
                for name in stem_order:
                    if name in stems:
                        track_list.append((name, stems[name]))
                result["instruments"] = [name for name, _ in track_list]

            # 创建 MIDI 文件
            midi_path = output_dir / f"{input_path.stem}.mid"
            from midiutil import MIDIFile

            midi = MIDIFile(numTracks=len(track_list), deinterleave=False)

            track_stats = {}
            for track_idx, (stem_name, stem_path) in enumerate(track_list):
                config = INSTRUMENT_CATEGORIES.get(stem_name, {"channel": track_idx, "program": 0, "name": stem_name})
                track_label = config["name"]

                midi.addTrackName(track_idx, 0, track_label)
                midi.addTempo(track_idx, 0, self.bpm)

                if not config.get("is_drums", False):
                    midi.addProgramChange(track_idx, config["channel"], 0, config["program"])

                logger.info(f"📝 转录: {track_label}")

                # 先尝试 Basic Pitch（多音检测）
                notes = None
                if stem_name != "drums" and self.opt_deps.get("basic_pitch", False):
                    notes = self._transcribe_stem_basic_pitch(stem_path)
                    if notes is not None:
                        logger.info(f"  → 使用 Basic Pitch 多音检测")

                # 回退到 pyin
                if notes is None:
                    notes = self._transcribe_stem(stem_path, stem_name)

                # 写入 MIDI
                written = 0
                for start, end, pitch, velocity in notes:
                    duration = end - start
                    if duration < self.min_note_duration:
                        continue
                    beat_start = start * self.bpm / 60.0
                    beat_duration = duration * self.bpm / 60.0

                    ch = 9 if config.get("is_drums", False) else config["channel"]
                    midi.addNote(track_idx, ch, pitch, beat_start, beat_duration, velocity)
                    written += 1

                logger.info(f"  → {track_label}: {written} 个音符写入")
                track_stats[stem_name] = {"notes": written, "label": track_label}

            # 写 MIDI 文件
            midi_path.parent.mkdir(parents=True, exist_ok=True)
            with open(midi_path, "wb") as f:
                midi.writeFile(f)

            result["midi"] = str(midi_path)
            result["track_stats"] = track_stats

            elapsed = time.time() - start_time
            result["duration_seconds"] = round(elapsed, 1)

            logger.info("=" * 50)
            logger.info(f"✅ 流水线完成!")
            logger.info(f"📂 输入: {input_path}")
            if result["clean_mp3"]:
                logger.info(f"📂 去标记MP3: {result['clean_mp3']}")
            logger.info(f"🎵 MIDI: {result['midi']}")
            logger.info(f"🎚️  音轨数: {len(track_list)}")
            logger.info(f"🎸 乐器: {', '.join(result['instruments'])}")
            logger.info(f"⏱️  耗时: {elapsed:.1f}s")
            logger.info("=" * 50)

            return result

        except Exception as e:
            logger.error(f"💥 流水线执行失败: {e}")
            import traceback
            traceback.print_exc()
            raise

        finally:
            shutil.rmtree(tmp_dir, ignore_errors=True)
            logger.info("🧹 临时文件已清理")


# ============================================================================
# 流水线集成类（兼容旧接口）
# ============================================================================

class PipelineIntegrator:
    """流水线集成类 — 兼容旧 stage4/stage5 的接口"""

    def __init__(self, strip_metadata=True, refine=False, separate=True, **kwargs):
        self.engine = CoverPipeline(
            strip_metadata=strip_metadata,
            refine_instruments=refine,
            use_separation=separate,
            **kwargs,
        )

    def process_file(self, input_path: str, output_dir: str = None) -> dict:
        inp = Path(input_path)
        out = Path(output_dir) if output_dir else inp.parent / "cover_output"
        return self.engine.process(inp, out)


# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="🎵 Stage 4+5 合并流水线：去AI标记 + 多轨MIDI — 一步到位",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 完整流水线（去标记 + MIDI）
  %(prog)s -i song.mp3 -o ./output

  # 完整 + 乐器细化
  %(prog)s -i song.mp3 -o ./output --refine

  # 仅去标记（等效旧Stage 4）
  %(prog)s -i song.mp3 --strip-only

  # 仅MIDI（等效旧Stage 5）
  %(prog)s -i song.mp3 --midi-only

  # 批量处理目录
  %(prog)s -i ./suno_output -o ./output --batch

依赖:
  核心: numpy, scipy, soundfile, librosa, midiutil
  可选: demucs+torch (音源分离), basic-pitch (多音检测), music21 (乐谱)
        """,
    )

    parser.add_argument("-i", "--input", type=str, default=None,
                        help="输入音频文件或目录")
    parser.add_argument("-o", "--output", type=str, default=None,
                        help="输出目录（默认：输入文件所在目录的 cover_output/）")
    parser.add_argument("--strip-only", action="store_true",
                        help="仅去AI标记（不生成MIDI）")
    parser.add_argument("--midi-only", action="store_true",
                        help="仅生成MIDI（不去标记）")
    parser.add_argument("--refine", action="store_true",
                        help="启用乐器细化（分析other轨→键盘/合成器/吉他）")
    parser.add_argument("--no-separate", action="store_true",
                        help="禁用音源分离（单轨模式）")
    parser.add_argument("--batch", action="store_true",
                        help="批量模式（输入为目录）")
    parser.add_argument("--recursive", action="store_true",
                        help="递归搜索子目录")
    parser.add_argument("--check-deps", action="store_true",
                        help="检查依赖并退出")
    parser.add_argument("--bpm", type=int, default=120,
                        help="MIDI 默认 BPM")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="详细日志")

    # 解析参数
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    # 检查依赖
    deps = check_deps()
    opt_deps = check_optional_deps()

    if args.check_deps:
        print("\n📦 依赖状态:")
        for pkg, ok in deps.items():
            print(f"  {'✅' if ok else '❌'} {pkg} (核心)")
        for pkg, ok in opt_deps.items():
            print(f"  {'✅' if ok else '❌'} {pkg} (可选)")
        return

    if not args.input:
        parser.print_help()
        logger.error("请指定输入文件/目录 (-i)")
        sys.exit(1)

    if not all(deps.values()):
        missing = [p for p, ok in deps.items() if not ok]
        logger.error(f"❌ 缺失核心依赖: {', '.join(missing)}")
        logger.error(f"   安装: pip install {' '.join(missing)}")
        sys.exit(1)

    input_path = Path(args.input).expanduser().resolve()
    if not input_path.exists():
        logger.error(f"❌ 路径不存在: {input_path}")
        sys.exit(1)

    # 单文件模式
    if input_path.is_file():
        output_dir = Path(args.output) if args.output else input_path.parent / "cover_output"

        if args.strip_only:
            # 仅 Stage 4
            if not opt_deps.get("ffmpeg", False):
                logger.error("❌ ffmpeg 不可用，无法去标记")
                sys.exit(1)
            output_dir.mkdir(parents=True, exist_ok=True)
            clean_path = output_dir / f"{input_path.stem}_clean.mp3"
            ok = strip_ai_metadata_ffmpeg(input_path, clean_path)
            if ok:
                logger.info(f"✅ 去标记完成: {clean_path}")
            else:
                sys.exit(1)
        elif args.midi_only:
            # 仅 Stage 5
            engine = CoverPipeline(
                strip_metadata=False,
                refine_instruments=args.refine,
                use_separation=not args.no_separate,
                bpm=args.bpm,
            )
            result = engine.process(input_path, output_dir)
            if not result["midi"]:
                sys.exit(1)
        else:
            # 合并模式
            engine = CoverPipeline(
                strip_metadata=True,
                refine_instruments=args.refine,
                use_separation=not args.no_separate,
                bpm=args.bpm,
            )
            result = engine.process(input_path, output_dir)
            if not result["clean_mp3"] and not result["midi"]:
                sys.exit(1)

    # 目录/批量模式
    else:
        audio_exts = {".mp3", ".wav", ".flac", ".ogg", ".m4a"}
        glob_pat = "**/*" if args.recursive else "*"
        files = sorted([
            f for ext in audio_exts
            for f in input_path.glob(f"{glob_pat}{ext}")
            if f.is_file()
        ])

        if not files:
            logger.warning(f"在 {input_path} 中未找到音频文件")
            return

        out_dir = Path(args.output) if args.output else input_path / "cover_output"
        engine = CoverPipeline(
            strip_metadata=not args.midi_only,
            refine_instruments=args.refine,
            use_separation=not args.no_separate,
            bpm=args.bpm,
        )

        logger.info(f"📂 批量处理 {len(files)} 个文件")
        success = 0
        for i, f in enumerate(files, 1):
            logger.info(f"[{i}/{len(files)}] {f.name}")
            try:
                file_out = out_dir / f.stem
                engine.process(f, file_out)
                success += 1
            except Exception as e:
                logger.error(f"❌ {f.name}: {e}")

        logger.info(f"📊 批量结果: {success}/{len(files)} 成功")


if __name__ == "__main__":
    main()
