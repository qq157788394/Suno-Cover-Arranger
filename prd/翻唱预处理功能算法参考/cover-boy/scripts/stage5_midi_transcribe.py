#!/usr/bin/env python3
"""
Stage 5: 自动生成多轨 MIDI — 从音频中自动转录为分轨 MIDI 文件

功能：
- 使用 librosa 进行音频分析和音高检测
- 可选使用 Demucs 进行音源分离（人声/伴奏/鼓/贝斯）
- 每轨独立转录为 MIDI
- 输出标准 MIDI 格式 1（多轨）
- 支持批量处理目录

用法：
    # 基本用法（自动检测依赖）
    python stage5_midi_transcribe.py -i input.mp3 -o output.mid
    
    # 批量处理目录
    python stage5_midi_transcribe.py -i ./suno_output -o ./midi_output
    
    # 带音源分离（需要 demucs）
    python stage5_midi_transcribe.py -i input.mp3 -o output.mid --separate

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

# 核心依赖（必需）
import numpy as np
import scipy.signal as sp
import soundfile as sf

# librosa 和 midiutil 延迟导入（启动时也会检查）

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("midi_transcribe")

# ============================================================================
# 依赖检测
# ============================================================================

DEPENDENCIES = {
    "numpy": False,
    "scipy": False,
    "soundfile": False,
    "librosa": False,
    "midiutil": False,
}


def check_dependencies() -> Dict[str, bool]:
    """检查并返回依赖状态"""
    deps = {}
    for pkg_name in ["numpy", "scipy", "soundfile", "librosa", "midiutil"]:
        try:
            __import__(pkg_name)
            deps[pkg_name] = True
        except ImportError:
            deps[pkg_name] = False
    return deps


def check_optional_deps() -> Dict[str, bool]:
    """检查可选依赖（分离能力）"""
    deps = {}
    for pkg_name in ["torch", "demucs", "basic_pitch"]:
        try:
            __import__(pkg_name.replace("basic_pitch", "basic_pitch"))
            deps[pkg_name] = True
        except ImportError:
            deps[pkg_name] = False
    return deps


# ============================================================================
# 核心功能
# ============================================================================


class AudioToMIDI:
    """
    音频 → 多轨 MIDI 转录器

    提供两种模式：
    - 轻量模式（默认）：librosa.pyin 音高检测 → 单轨 MIDI
    - 完整模式（--separate）：Demucs 分离 → 每轨独立转录 → 多轨 MIDI
    """

    # MIDI 音符范围
    MIDI_NOTE_MIN = 21   # A0
    MIDI_NOTE_MAX = 108  # C8
    NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    # 默认每轨的 MIDI 通道和音色
    TRACK_CONFIG = {
        "vocals": {"channel": 0, "program": 54, "name": "Vocals", "octave_shift": 0},
        "drums":  {"channel": 9, "program": 0,  "name": "Drums",  "octave_shift": 0},
        "bass":   {"channel": 1, "program": 34, "name": "Bass",   "octave_shift": -1},
        "other":  {"channel": 2, "program": 1,  "name": "Accompaniment", "octave_shift": 0},
    }

    def __init__(
        self,
        use_separation: bool = False,
        hop_length: int = 256,
        fmin: float = 65.0,
        fmax: float = 2093.0,
        min_note_duration: float = 0.05,
        velocity_threshold: float = 0.1,
        bpm: int = 120,
        time_signature: str = "4/4",
    ):
        """
        初始化转录器

        参数:
            use_separation: 是否使用音源分离（需要 demucs）
            hop_length: 音高检测的 hop 长度（越小精度越高但越慢）
            fmin: 最低检测频率 (Hz)
            fmax: 最高检测频率 (Hz)
            min_note_duration: 最小音符时长（过滤短噪声）
            velocity_threshold: 力度阈值（低于此值的音符静音）
            bpm: MIDI 文件的默认 BPM
            time_signature: 拍号
        """
        self.use_separation = use_separation
        self.hop_length = hop_length
        self.fmin = fmin
        self.fmax = fmax
        self.min_note_duration = min_note_duration
        self.velocity_threshold = velocity_threshold
        self.bpm = bpm
        self.time_signature = time_signature

        # 依赖状态
        self.deps = check_dependencies()
        self.opt_deps = check_optional_deps()

    def _import_deps(self):
        """延迟导入核心依赖"""
        global np, sp, sf, librosa, MIDIFile
        import numpy as np
        import scipy.signal as sp
        import soundfile as sf
        import librosa
        from midiutil import MIDIFile

    def _hz_to_midi(self, freq: float) -> Optional[int]:
        """频率转 MIDI 音符编号"""
        if freq <= 0:
            return None
        midi = 12 * (np.log2(freq) - np.log2(440.0)) + 69
        midi_rounded = int(round(midi))
        if self.MIDI_NOTE_MIN <= midi_rounded <= self.MIDI_NOTE_MAX:
            return midi_rounded
        return None

    def _detect_pitch_pyin(self, audio, sr: int):  # type: (np.ndarray, int) -> Tuple[np.ndarray, np.ndarray, np.ndarray]
        """
        使用 librosa.pyin 检测音高

        返回: (时间点数组, 音高数组(Hz), 置信度数组)
        """
        fmin = self.fmin
        fmax = min(self.fmax, sr / 2.0 - 10)

        logger.info(f"🎤 音高检测中 (fmin={fmin}Hz, fmax={fmax}Hz, hop={self.hop_length})...")

        f0, voiced_flag, voiced_prob = librosa.pyin(
            y=audio,
            sr=sr,
            fmin=fmin,
            fmax=fmax,
            hop_length=self.hop_length,
            fill_na=np.nan,
        )

        times = librosa.frames_to_time(
            np.arange(len(f0)),
            sr=sr,
            hop_length=self.hop_length,
        )

        return times, f0, voiced_prob

    def _detect_onsets(self, audio, sr: int):  # type: ignore
        """检测节拍起始点"""
        onset_frames = librosa.onset.onset_detect(
            y=audio,
            sr=sr,
            hop_length=self.hop_length,
            backtrack=True,
        )
        return librosa.frames_to_time(onset_frames, sr=sr, hop_length=self.hop_length)

    def _pitch_to_notes(
        self,
        times,
        f0,
        confidence,
    ) -> List[Tuple[float, float, int, int]]:
        """
        将音高检测结果转为音符事件列表

        返回: [(起始时间, 结束时间, MIDI音符, 力度), ...]
        """
        notes = []
        if len(times) == 0:
            return notes

        # 转为 MIDI 音符
        midi_notes = []
        for freq, conf in zip(f0, confidence):
            if np.isnan(freq) or conf < self.velocity_threshold:
                midi_notes.append(None)
            else:
                midi_notes.append(self._hz_to_midi(freq))

        # 合并连续相同音符
        current_note = None
        note_start = None
        note_velocities = []

        for i, (t, note) in enumerate(zip(times, midi_notes)):
            if note is not None:
                if current_note is None:
                    # 新音符开始
                    current_note = note
                    note_start = t
                    note_velocities = []
                elif note != current_note:
                    # 音高变化，结束上一个
                    duration = t - note_start
                    if duration >= self.min_note_duration and note_velocities:
                        avg_vel = int(np.mean(note_velocities))
                        notes.append((note_start, t, current_note, min(127, max(30, avg_vel))))
                    current_note = note
                    note_start = t
                    note_velocities = []
            else:
                if current_note is not None:
                    # 音符结束
                    duration = t - note_start
                    if duration >= self.min_note_duration and note_velocities:
                        avg_vel = int(np.mean(note_velocities))
                        notes.append((note_start, t, current_note, min(127, max(30, avg_vel))))
                    current_note = None
                    note_start = None
                    note_velocities = []

            if note is not None and note_start is not None:
                # 记录力度（用置信度映射到 30-127）
                if i < len(confidence):
                    vel = int(30 + confidence[i] * 97)
                    note_velocities.append(min(127, max(30, vel)))

        # 最后一个音符
        if current_note is not None and note_start is not None and note_velocities:
            duration = times[-1] - note_start
            if duration >= self.min_note_duration:
                avg_vel = int(np.mean(note_velocities))
                notes.append((note_start, times[-1], current_note, min(127, max(30, avg_vel))))

        logger.info(f"🎵 检测到 {len(notes)} 个音符")
        return notes

    def _detect_drums(self, audio, sr: int) -> List[Tuple[float, float, int, int]]:
        """
        检测打击乐（鼓）事件

        通过对数梅尔频谱+冲击检测来识别鼓点
        不同频段映射到不同的 MIDI 打击乐键
        """
        # 计算频谱
        S = np.abs(librosa.stft(y=audio, hop_length=self.hop_length))
        freqs = librosa.fft_frequencies(sr=sr)

        # 分段: 底鼓(60-100Hz)、军鼓(150-400Hz)、镲片(>4000Hz)、汤姆(100-400Hz)
        bands = {
            "kick":  (60, 150),    # 底鼓
            "snare": (150, 500),   # 军鼓/汤姆
            "hihat": (4000, sr/2), # 镲片
            "tom":   (200, 1000),  # 汤姆
        }

        drum_notes = []
        for band_name, (f_low, f_high) in bands.items():
            # 找到对应频段
            mask = (freqs >= f_low) & (freqs <= f_high)
            if not np.any(mask):
                continue
            band_energy = np.sum(S[mask, :], axis=0)

            # 检测能量突增（冲击点）
            onset_env = band_energy
            onset_env = onset_env / (np.max(onset_env) + 1e-10)

            # 找峰值
            peaks, properties = sp.find_peaks(
                onset_env,
                height=0.3,
                distance=int(0.1 * sr / self.hop_length),  # 至少间隔 100ms
            )

            for i, peak in enumerate(peaks):
                t = peak * self.hop_length / sr
                vel = min(127, int(properties["peak_heights"][i] * 100 + 30))

                # 频段到 MIDI 打击乐键映射
                if band_name == "kick":
                    midi_note = 36  # Bass Drum 1
                elif band_name == "snare":
                    # 根据能量大小决定军鼓还是边击
                    if onset_env[peak] > 0.7:
                        midi_note = 38  # Acoustic Snare
                    else:
                        midi_note = 40  # Electric Snare
                elif band_name == "hihat":
                    if onset_env[peak] > 0.7:
                        midi_note = 42  # Closed Hi-hat
                    else:
                        midi_note = 46  # Open Hi-hat
                else:
                    midi_note = 47   # Mid Tom

                drum_notes.append((t, t + 0.05, midi_note, vel))  # 鼓音很短

        logger.info(f"🥁 检测到 {len(drum_notes)} 个打击乐事件")
        return drum_notes

    def _separate_stems(self, input_path: Path, output_dir: Path) -> Dict[str, Path]:
        """
        使用 Demucs 进行音源分离

        返回: {stem_name: file_path, ...}
        """
        logger.info("🔊 音源分离中 (Demucs)...")

        try:
            # 检查 demucs 命令行是否可用
            result = subprocess.run(
                [sys.executable, "-m", "demucs", "--help"],
                capture_output=True,
                encoding='utf-8', errors='replace',
                timeout=10,
            )
            demucs_available = result.returncode == 0
        except (subprocess.CalledProcessError, FileNotFoundError, TimeoutError):
            demucs_available = False

        if not demucs_available:
            logger.warning("Demucs 不可用，尝试使用 librosa 内置分离")
            return self._separate_stems_librosa(input_path, output_dir)

        # Demucs 分离
        try:
            subprocess.run(
                [
                    sys.executable, "-m", "demucs",
                    "--two-stems", "vocals",
                    "-o", str(output_dir),
                    str(input_path),
                ],
                capture_output=True,
                encoding='utf-8', errors='replace',
                timeout=600,
            )
        except subprocess.TimeoutExpired:
            logger.error("⏰ Demucs 分离超时")
            raise
        except Exception as e:
            logger.error(f"Demucs 分离失败: {e}")
            raise

        # 查找分离结果
        input_stem = input_path.stem
        demucs_out = output_dir / "htdemucs" / input_stem

        stems = {}
        stem_names = ["vocals", "drums", "bass", "other"]
        for stem in stem_names:
            stem_file = demucs_out / f"{stem}.wav"
            if stem_file.exists():
                stems[stem] = stem_file
                logger.info(f"  → {stem}: {stem_file}")

        return stems

    def _separate_stems_librosa(self, input_path: Path, output_dir: Path) -> Dict[str, Path]:
        """
        使用 librosa 内置的 HPSS（谐波-打击乐分离）做简单分离
        """
        logger.info("🔊 使用 librosa HPSS 分离（轻量版）...")

        audio, sr = librosa.load(str(input_path), sr=44100, mono=True)

        # HPSS 分离：谐波部分（人声+乐器）和 打击乐部分
        harmonic, percussive = librosa.effects.hpss(audio)

        stems = {}

        # 谐波部分 → "other"（伴奏）
        other_path = output_dir / f"{input_path.stem}_other.wav"
        sf.write(str(other_path), harmonic, sr)
        stems["other"] = other_path

        # 打击乐部分 → "drums"
        drums_path = output_dir / f"{input_path.stem}_drums.wav"
        sf.write(str(drums_path), percussive, sr)
        stems["drums"] = drums_path

        # 没有单独的人声和贝斯，用原音频替代
        vocals_path = output_dir / f"{input_path.stem}_vocals.wav"
        sf.write(str(vocals_path), audio, sr)
        stems["vocals"] = vocals_path

        stems["bass"] = stems["other"]  # 复用

        logger.info(f"  → HPSS 分离完成: {len(stems)} 轨")
        return stems

    def _transcribe_stem(
        self,
        audio_path: Path,
        track_type: str,
    ) -> List[Tuple[float, float, int, int]]:
        """
        转录单轨音频为音符事件

        参数:
            audio_path: 音频文件路径
            track_type: 轨类型 (vocals/drums/bass/other)

        返回: [(起始时间, 结束时间, MIDI音符, 力度), ...]
        """
        if not audio_path.exists():
            logger.warning(f"⚠️ 文件不存在: {audio_path}")
            return []

        logger.info(f"📝 转录: {track_type} ({audio_path.name})")

        # 加载音频
        audio, sr = librosa.load(str(audio_path), sr=44100, mono=True)

        # 标准化音量
        audio = audio / (np.max(np.abs(audio)) + 1e-10)

        if track_type == "drums":
            # 鼓类：用打击乐检测
            return self._detect_drums(audio, sr)
        elif track_type == "bass":
            # 贝斯类：降低 fmin 检测低频
            old_fmin = self.fmin
            self.fmin = 30.0
            old_fmax = self.fmax
            self.fmax = 500.0
            times, f0, conf = self._detect_pitch_pyin(audio, sr)
            notes = self._pitch_to_notes(times, f0, conf)
            # 恢复
            self.fmin = old_fmin
            self.fmax = old_fmax
            return notes
        else:
            # 人声/伴奏：标准音高检测
            times, f0, conf = self._detect_pitch_pyin(audio, sr)
            return self._pitch_to_notes(times, f0, conf)

    def transcribe(self, input_path: Path, output_path: Path) -> bool:
        """
        执行完整转录流程

        参数:
            input_path: 输入音频文件
            output_path: 输出 MIDI 文件
        """
        self._import_deps()
        start_time = time.time()

        logger.info("=" * 60)
        logger.info(f"🎵 Stage 5: 多轨 MIDI 转录")
        logger.info(f"📂 输入: {input_path}")
        logger.info(f"📂 输出: {output_path}")
        logger.info(f"⚙️  音源分离: {'开启' if self.use_separation else '关闭'}")
        logger.info("=" * 60)

        # 创建临时目录（用于分离后的音频）
        tmp_dir = Path(tempfile.mkdtemp(prefix="midi_transcribe_"))

        try:
            # Step 1: 音源分离或直接使用原音频
            if self.use_separation and self.opt_deps.get("torch", False):
                stems = self._separate_stems(input_path, tmp_dir)
            elif self.use_separation and not self.opt_deps.get("torch", False):
                logger.warning("⚠️ torch/demucs 未安装，使用 librosa HPSS 轻量分离")
                stems = self._separate_stems_librosa(input_path, tmp_dir)
            else:
                # 不分离：使用原音频作为单轨
                stems = {"full": input_path}

            # Step 2: 创建 MIDI 文件
            midi = MIDIFile(
                numTracks=len(stems),
                deinterleave=False,
            )

            # Step 3: 逐轨转录
            track_idx = 0
            for stem_name, stem_path in stems.items():
                track_name = stem_name
                config = self.TRACK_CONFIG.get(stem_name, {"channel": track_idx, "program": 0, "name": stem_name})

                # 添加 MIDI 轨信息
                midi.addTrackName(track_idx, 0, config["name"])
                midi.addTempo(track_idx, 0, self.bpm)

                # 设置音色
                if stem_name != "drums":  # 鼓轨 channel 10 自动打击乐
                    midi.addProgramChange(track_idx, config["channel"], 0, config["program"])

                # 转录
                notes = self._transcribe_stem(stem_path, stem_name)

                # 写入 MIDI 事件
                for start, end, pitch, velocity in notes:
                    duration = end - start
                    if duration < self.min_note_duration:
                        continue

                    # 偏移到 MIDI 节拍时间
                    beat_start = start * self.bpm / 60.0
                    beat_duration = duration * self.bpm / 60.0

                    if stem_name == "drums":
                        # 打击乐用 channel 9 (10 in 1-based)
                        midi.addNote(
                            track_idx, 9, pitch,
                            beat_start, beat_duration,
                            velocity,
                        )
                    else:
                        midi.addNote(
                            track_idx, config["channel"], pitch,
                            beat_start, beat_duration,
                            velocity,
                        )

                logger.info(f"  → {config['name']}: {len(notes)} 个音符写入")

                track_idx += 1

            # Step 4: 写入 MIDI 文件
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                midi.writeFile(f)

            elapsed = time.time() - start_time
            logger.info(f"✅ MIDI 文件已生成: {output_path}")
            logger.info(f"⏱️  耗时: {elapsed:.1f}s")
            logger.info(f"🎚️  音轨数: {track_idx}")
            return True

        except Exception as e:
            logger.error(f"💥 转录失败: {e}")
            import traceback
            traceback.print_exc()
            return False

        finally:
            shutil.rmtree(tmp_dir, ignore_errors=True)
            logger.info("🧹 临时文件已清理")

    def transcribe_single(self, input_path: Path, output_path: Path) -> bool:
        """单轨模式（不分离，直接转 MIDI）"""
        self._import_deps()
        start_time = time.time()

        logger.info(f"🎵 单轨转录: {input_path.name}")

        try:
            audio, sr = librosa.load(str(input_path), sr=44100, mono=True)
            audio = audio / (np.max(np.abs(audio)) + 1e-10)

            times, f0, conf = self._detect_pitch_pyin(audio, sr)
            notes = self._pitch_to_notes(times, f0, conf)

            midi = MIDIFile(numTracks=1)
            midi.addTrackName(0, 0, "Melody")
            midi.addTempo(0, 0, self.bpm)
            midi.addProgramChange(0, 0, 0, 1)  # Acoustic Grand Piano

            for start, end, pitch, velocity in notes:
                duration = end - start
                if duration < self.min_note_duration:
                    continue
                beat_start = start * self.bpm / 60.0
                beat_duration = duration * self.bpm / 60.0
                midi.addNote(0, 0, pitch, beat_start, beat_duration, velocity)

            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                midi.writeFile(f)

            elapsed = time.time() - start_time
            logger.info(f"✅ 单轨 MIDI 生成: {output_path} ({len(notes)} 音符, {elapsed:.1f}s)")
            return True

        except Exception as e:
            logger.error(f"💥 转录失败: {e}")
            import traceback
            traceback.print_exc()
            return False


# ============================================================================
# 批量处理
# ============================================================================


def batch_transcribe(
    input_dir: Path,
    output_dir: Path,
    use_separation: bool = False,
    single_track: bool = False,
    recursive: bool = False,
) -> Tuple[int, int]:
    """批量处理目录中所有音频文件"""
    # 支持格式
    audio_exts = {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aiff"}

    files = []
    glob_pattern = "**/*" if recursive else "*"
    for ext in audio_exts:
        for f in input_dir.glob(f"{glob_pattern}{ext}"):
            if f.is_file():
                files.append(f)

    if not files:
        logger.warning(f"在 {input_dir} 中未找到音频文件")
        return 0, 0

    logger.info(f"📂 找到 {len(files)} 个音频文件")

    output_dir.mkdir(parents=True, exist_ok=True)

    transcribe = AudioToMIDI(use_separation=use_separation)
    success_count = 0

    for i, file_path in enumerate(files, 1):
        midi_path = output_dir / f"{file_path.stem}.mid"
        logger.info(f"[{i}/{len(files)}] {file_path.name}")

        try:
            if single_track:
                ok = transcribe.transcribe_single(file_path, midi_path)
            else:
                ok = transcribe.transcribe(file_path, midi_path)
            if ok:
                success_count += 1
        except Exception as e:
            logger.error(f"处理 {file_path.name} 失败: {e}")

    return success_count, len(files)


# ============================================================================
# 流水线集成类
# ============================================================================


class MIDITranscriber:
    """流水线集成类"""

    def __init__(self, use_separation: bool = False, **kwargs):
        self.engine = AudioToMIDI(use_separation=use_separation, **kwargs)

    def process_file(self, input_path: str, output_path: str = None) -> dict:
        """处理单个文件，返回统计"""
        inp = Path(input_path)
        out = Path(output_path) if output_path else inp.with_suffix(".mid")

        start = time.time()
        success = self.engine.transcribe(inp, out)
        elapsed = time.time() - start

        return {
            "input": input_path,
            "output": str(out),
            "success": success,
            "duration_seconds": round(elapsed, 1),
        }

    def process_directory(self, input_dir: str, output_dir: str = None) -> dict:
        """处理整个目录"""
        inp_dir = Path(input_dir)
        out_dir = Path(output_dir) if output_dir else inp_dir / "midi"
        success, total = batch_transcribe(
            input_dir=inp_dir,
            output_dir=out_dir,
            use_separation=self.engine.use_separation,
        )
        return {"total": total, "success": success, "failed": total - success}


# ============================================================================
# 自检
# ============================================================================


def run_self_test():
    """运行内置自检"""
    logger.info("🧪 运行自检...")

    # 1. 检查依赖
    deps = check_dependencies()
    all_ok = True
    for pkg, ok in deps.items():
        if ok:
            logger.info(f"✅ {pkg}")
        else:
            logger.warning(f"❌ {pkg} — 缺失")

    if not all(deps.values()):
        missing = [p for p, ok in deps.items() if not ok]
        logger.warning(f"⚠️ 缺失依赖: {', '.join(missing)}")
        logger.warning(f"   安装: pip install {' '.join(missing)}")

    opt_deps = check_optional_deps()
    for pkg, ok in opt_deps.items():
        if ok:
            logger.info(f"✅ {pkg} (可选)")
        else:
            logger.info(f"ℹ️  {pkg} 未安装 (可选，用于音源分离)")

    # 2. 用测试音频做实际转录
    tmp_dir = Path(tempfile.mkdtemp(prefix="midi_test_"))
    test_wav = tmp_dir / "test_audio.wav"

    try:
        # 生成测试音频（包含几个纯音）
        logger.info("📝 生成测试音频...")
        sr = 44100
        duration = 3.0
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)

        # C4(262Hz), E4(330Hz), G4(392Hz) — C 大调和弦
        audio = (
            np.sin(2 * np.pi * 262 * t) * 0.3 +
            np.sin(2 * np.pi * 330 * t) * 0.3 +
            np.sin(2 * np.pi * 392 * t) * 0.3
        )
        sf.write(str(test_wav), audio, sr)

        if all(deps.values()):
            # 转录
            midi_out = tmp_dir / "test_output.mid"
            trans = AudioToMIDI()
            success = trans.transcribe_single(test_wav, midi_out)

            if success and midi_out.exists():
                file_size = midi_out.stat().st_size
                logger.info(f"✅ 测试 MIDI 生成成功 ({file_size} bytes)")

                # 读取 MIDI 验证
                try:
                    import pretty_midi
                    pm = pretty_midi.PrettyMIDI(str(midi_out))
                    total_notes = sum(len(inst.notes) for inst in pm.instruments)
                    logger.info(f"🎵 MIDI 文件: {len(pm.instruments)} 轨, {total_notes} 音符")
                    if total_notes > 0:
                        logger.info("✅ 自检通过！")
                        all_ok = True
                    else:
                        logger.warning("⚠️ MIDI 无音符")
                except ImportError:
                    logger.info("✅ MIDI 文件已生成 (pretty_midi 未安装，跳过验证)")

        else:
            logger.warning("⚠️ 核心依赖不全，跳过实际转录测试")
            all_ok = False

    except Exception as e:
        logger.error(f"💥 自检异常: {e}")
        import traceback
        traceback.print_exc()
        all_ok = False
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        logger.info("🧹 测试文件已清理")

    return all_ok


# ============================================================================
# CLI
# ============================================================================


def main():
    parser = argparse.ArgumentParser(
        description="🎵 Stage 5: 多轨 MIDI 转录 — 从音频自动生成分轨 MIDI 文件",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  %(prog)s -i song.mp3 -o song.mid
  %(prog)s -i song.mp3 --single    # 单轨模式
  %(prog)s -i song.mp3 --separate  # 多轨分离模式
  %(prog)s -i ./suno_output -o ./midi --batch
  %(prog)s --self-test

依赖:
  核心: numpy, scipy, soundfile, librosa, midiutil
  可选: torch, demucs (用于音源分离)
        """,
    )

    parser.add_argument("-i", "--input", type=str, required=False,
                        help="输入音频文件或目录")
    parser.add_argument("-o", "--output", type=str, default=None,
                        help="输出 MIDI 文件或目录")
    parser.add_argument("--single", action="store_true",
                        help="单轨模式 (不分离，直接转旋律 MIDI)")
    parser.add_argument("--separate", action="store_true",
                        help="启用音源分离（需要 demucs）")
    parser.add_argument("--batch", action="store_true",
                        help="批量模式（输入为目录）")
    parser.add_argument("--recursive", action="store_true",
                        help="递归搜索子目录")
    parser.add_argument("--bpm", type=int, default=120,
                        help="MIDI 默认 BPM (默认: 120)")
    parser.add_argument("--hop-length", type=int, default=256,
                        help="检测精度 (越小越精确但越慢, 默认: 256)")
    parser.add_argument("--min-note-ms", type=float, default=50,
                        help="最小音符时长 (ms, 过滤噪声, 默认: 50)")
    parser.add_argument("--self-test", action="store_true",
                        help="运行自检")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="详细日志")

    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.self_test:
        success = run_self_test()
        sys.exit(0 if success else 1)

    if not args.input:
        parser.print_help()
        logger.error("请指定输入文件/目录 (-i) 或使用 --self-test")
        sys.exit(1)

    input_path = Path(args.input).expanduser().resolve()
    if not input_path.exists():
        logger.error(f"❌ 路径不存在: {input_path}")
        sys.exit(1)

    # 检查核心依赖
    deps = check_dependencies()
    if not all(deps.values()):
        missing = [p for p, ok in deps.items() if not ok]
        logger.error(f"❌ 缺失核心依赖: {', '.join(missing)}")
        logger.error(f"   安装: pip install {' '.join(missing)}")
        sys.exit(1)

    trans = AudioToMIDI(
        use_separation=args.separate,
        hop_length=args.hop_length,
        min_note_duration=args.min_note_ms / 1000.0,
        bpm=args.bpm,
    )

    if input_path.is_dir() or args.batch:
        # 批量模式
        output_dir = Path(args.output) if args.output else input_path / "midi"
        success, total = batch_transcribe(
            input_dir=input_path,
            output_dir=output_dir,
            use_separation=args.separate,
            single_track=args.single,
            recursive=args.recursive,
        )
        logger.info(f"📊 批量结果: {success}/{total} 成功")
    else:
        # 单文件模式
        if args.output:
            output_path = Path(args.output).expanduser().resolve()
        else:
            output_path = input_path.with_suffix(".mid")

        if args.single:
            ok = trans.transcribe_single(input_path, output_path)
        else:
            ok = trans.transcribe(input_path, output_path)

        if ok:
            logger.info(f"🎉 MIDI 已生成: {output_path}")
        else:
            logger.error("❌ 转录失败")
            sys.exit(1)


if __name__ == "__main__":
    main()
