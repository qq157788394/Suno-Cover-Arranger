#!/usr/bin/env python3
"""Stage 6: 乐队总谱生成 — 五线谱谱面 + 和弦歌词谱

功能（BS-ROFO 6轨 + Whisper 版 🔥）:

# ===== Demucs torchaudio 补丁：用 soundfile 替代 torchaudio 保存音频 =====
# torchaudio 2.11+ 需要 torchcodec 才能保存，但 torchcodec 有 CUDA 兼容问题
import soundfile as _sf
import demucs.audio as _da
_original_save = _da.save_audio
def _patched_save(wav, path, samplerate, bitdepth=16, **kwargs):
    import numpy as np
    _sf.write(str(path), wav.cpu().numpy().T, samplerate, subtype='PCM_16')
_da.save_audio = _patched_save
1. 和弦歌词谱 — Whisper 自动转写歌词 / 交互输入，自动对齐和弦生成吉他谱格式
2. 多轨乐队总谱 — BS-ROFO-SW 6轨分离 (bass/drums/other/vocals/guitar/piano)
   每轨独立转 MIDI → music21 多声部五线谱 → Lilypond/MusicXML 渲染
3. 可选 Demucs 4轨备选
4. 可选仅分析和弦或仅生成总谱

用法：
    # 完整流水线（BS-ROFO 6轨 + Whisper 歌词）
    python stage6_score_gen.py -i song.wav -o ./output --whisper

    # 完整流水线（和弦谱 + 多轨总谱，传统模式）
    python stage6_score_gen.py -i song.wav -o ./output --lyrics lyrics.txt

    # 仅和弦歌词谱（交互式歌词输入）
    python stage6_score_gen.py -i song.wav --chords-only --lyrics lyrics.txt

    # 仅多轨总谱（BS-ROFO 6轨）
    python stage6_score_gen.py -i song.wav --score-only

    # 使用 Demucs 4轨备选
    python stage6_score_gen.py -i song.wav --score-only --demucs

    # 指定调性和 BPM
    python stage6_score_gen.py -i song.wav -o ./output --key Am --bpm 85

依赖:
    core: librosa, numpy, torch, demucs
    midi: basic-pitch, midiutil
    score: music21
    render: lilypond (可选, PNG 渲染)
"""

import argparse
import json
import logging
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import textwrap
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any

import numpy as np
import yaml

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("score_gen")


# ============================================================================
# 和弦理论知识库
# ============================================================================

CHORD_TEMPLATES = {
    "maj":    [0, 4, 7],        # 大三和弦  C-E-G
    "min":    [0, 3, 7],        # 小三和弦  C-Eb-G
    "dim":    [0, 3, 6],        # 减三和弦  C-Eb-Gb
    "aug":    [0, 4, 8],        # 增三和弦  C-E-G#
    "sus2":   [0, 2, 7],        # 挂留二
    "sus4":   [0, 5, 7],        # 挂留四
    "7":      [0, 4, 7, 10],    # 属七和弦  C-E-G-Bb
    "maj7":   [0, 4, 7, 11],    # 大七和弦  C-E-G-B
    "min7":   [0, 3, 7, 10],    # 小七和弦  C-Eb-G-Bb
    "dim7":   [0, 3, 6, 9],     # 减七和弦  C-Eb-Gb-Bbb
    "m7b5":   [0, 3, 6, 10],    # 半减七    C-Eb-Gb-Bb
    "aug7":   [0, 4, 8, 10],    # 增七和弦
    "maj9":   [0, 4, 7, 11, 14],# 大九和弦
    "min9":   [0, 3, 7, 10, 14],# 小九和弦
    "9":      [0, 4, 7, 10, 14],# 属九和弦
}

NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

ROMAN_MAJOR = {
    0: "I", 1: "#I", 2: "II", 3: "#II", 4: "III",
    5: "IV", 6: "#IV", 7: "V", 8: "#V", 9: "VI", 10: "#VI", 11: "VII",
}

ROMAN_MINOR = {
    0: "i", 1: "#i", 2: "ii", 3: "#ii", 4: "III",
    5: "iv", 6: "#iv", 7: "V", 8: "#V", 9: "VI", 10: "#VI", 11: "VII",
}

# 乐器 → 谱号映射
INSTRUMENT_CLEF_MAP = {
    "Vocals": "treble",
    "Drums": "percussion",
    "Bass": "bass",
    "Other": "treble",
    "Piano": "treble",
    "Guitar": "treble",
    "Synth": "treble",
    "Brass": "treble",
    "Strings": "treble",
}

# BS-ROFO 6轨分离的 YAML SafeLoader
class SafeLoaderWithTuple(yaml.SafeLoader):
    """YAML loader 兼容 !!python/tuple"""
    pass

def _tuple_constructor(loader, node):
    return loader.construct_sequence(node)

SafeLoaderWithTuple.add_constructor('tag:yaml.org,2002:python/tuple', _tuple_constructor)

# BS-ROFO 6轨名称
BSROFO_STEMS = ['bass', 'drums', 'other', 'vocals', 'guitar', 'piano']

# ============================================================================
# 核心功能
# ============================================================================

class ScoreGenerator:
    """乐谱生成器 — 和弦歌词谱 + 多轨乐队总谱"""

    def __init__(self, bpm: int = 120, key: str = "C"):
        self.bpm = bpm
        self.key = key
        self.key_index = NOTE_NAMES.index(key) if key in NOTE_NAMES else 0
        # 判断大小调
        self.is_minor = key.lower().endswith('m') or key.lower().endswith('min')

    # ------------------------------------------------------------------
    # 和弦分析 (librosa chromagram)
    # ------------------------------------------------------------------

    def _chroma_to_chord(self, chroma_vector: np.ndarray) -> Tuple[str, float]:
        """12维 chroma → 和弦名, 置信度"""
        max_score = 0
        best_chord = "N.C."

        for root in range(12):
            shifted = np.roll(chroma_vector, -root)
            for chord_type, template in CHORD_TEMPLATES.items():
                score = sum(shifted[i % 12] for i in template) / len(template)
                penalty = sum(shifted[i % 12] for i in range(12) if i % 12 not in template) * 0.2
                score -= penalty

                if score > max_score:
                    max_score = score
                    root_name = NOTE_NAMES[root]
                    suffix_map = {
                        "maj": "", "min": "m", "dim": "dim", "aug": "aug",
                        "sus2": "sus2", "sus4": "sus4",
                        "7": "7", "maj7": "maj7", "min7": "m7",
                        "dim7": "dim7", "m7b5": "m7b5", "aug7": "aug7",
                        "maj9": "maj9", "min9": "m9", "9": "9",
                    }
                    best_chord = f"{root_name}{suffix_map.get(chord_type, chord_type)}"

        return best_chord, max_score

    def _chord_to_roman(self, chord_name: str) -> str:
        """和弦名 → 罗马数字级数"""
        if chord_name == "N.C.":
            return "N.C."

        # 提取根音
        root = chord_name[0]
        if len(chord_name) > 1 and chord_name[1] == '#':
            root = chord_name[:2]
            chord_type = chord_name[2:]
        elif len(chord_name) > 1 and chord_name[1] == 'b':
            root = chord_name[:2]
            chord_type = chord_name[2:]
        else:
            root = chord_name[0]
            chord_type = chord_name[1:]

        if root not in NOTE_NAMES:
            return chord_name
        root_idx = NOTE_NAMES.index(root)
        degree = (root_idx - self.key_index) % 12

        roman_map = ROMAN_MINOR if self.is_minor else ROMAN_MAJOR
        roman = roman_map.get(degree, f"?{degree}")

        # 判断大小写
        is_major = chord_type in ("", "maj", "maj7", "7", "aug", "sus2", "sus4", "9", "maj9", "aug7")
        is_minor_type = chord_type.startswith("m") or chord_type.startswith("min")

        if self.is_minor:
            # 小调: i ii° III iv V VI VII
            if is_minor_type:
                roman = roman.lower()
        else:
            if is_minor_type:
                roman = roman.lower()

        # 附加标记
        suffix_map = {
            "7": "7", "maj7": "maj7", "m7": "m7", "m": "m",
            "dim": "°", "dim7": "°7", "aug": "+", "m7b5": "ø7",
            "sus2": "sus2", "sus4": "sus4",
            "maj9": "maj9", "m9": "m9", "9": "9",
            "aug7": "+7",
        }
        suffix = suffix_map.get(chord_type, "")
        if chord_type == "min":
            suffix = "m"

        # 避免小调 v 被错误大写
        if self.is_minor and is_major and degree == 7:  # V 始终大
            roman = "V"
            if suffix:
                roman += suffix
            return roman

        return roman + suffix

    def analyze_chords(
        self,
        audio_path: Path,
        hop_length: int = 512,
        frame_length: int = 2048,
        segment_beats: int = 4,
    ) -> List[Dict]:
        """
        分析音频中的和弦进行

        返回: [{"time": 0.0, "beat": 1, "chord": "C", "confidence": 0.85, "roman": "I"}, ...]
        """
        logger.info("🎸 和弦分析中...")

        try:
            import librosa
        except ImportError:
            logger.error("❌ 需要 librosa: pip install librosa")
            return []

        audio, sr = librosa.load(str(audio_path), sr=22050, mono=True)
        audio = audio / (np.max(np.abs(audio)) + 1e-10)

        chroma = librosa.feature.chroma_stft(
            y=audio, sr=sr, hop_length=hop_length, n_fft=frame_length,
        )

        tempo, beats = librosa.beat.beat_track(
            y=audio, sr=sr, hop_length=hop_length,
        )
        beat_frames = librosa.frames_to_time(beats, sr=sr, hop_length=hop_length)

        if len(beat_frames) < 2:
            logger.warning("⚠️ 节拍检测失败，使用固定间隔")
            beat_frames = np.arange(0, len(audio) / sr, 60.0 / self.bpm)

        # 更新 BPM
        if isinstance(tempo, (int, float)) and tempo > 0:
            self.bpm = int(round(tempo))
            logger.info(f"  检测 BPM: {self.bpm}")

        chords = []
        for i in range(0, len(beat_frames) - segment_beats, segment_beats):
            start_beat = beat_frames[i]
            end_beat = beat_frames[min(i + segment_beats, len(beat_frames) - 1)]

            start_frame = int(start_beat * sr / hop_length)
            end_frame = int(end_beat * sr / hop_length)

            if start_frame >= chroma.shape[1]:
                break

            segment_chroma = np.mean(chroma[:, start_frame:end_frame], axis=1)
            max_chroma = np.max(segment_chroma)
            if max_chroma > 0:
                segment_chroma = segment_chroma / max_chroma

            chord_name, confidence = self._chroma_to_chord(segment_chroma)
            roman = self._chord_to_roman(chord_name)

            chords.append({
                "time": round(start_beat, 2),
                "beat": i + 1,
                "chord": chord_name,
                "confidence": round(confidence, 3),
                "roman": roman,
            })

        # 合并相邻相同和弦
        merged = []
        for c in chords:
            if merged and merged[-1]["chord"] == c["chord"]:
                merged[-1]["end_time"] = c["time"]
            else:
                c["end_time"] = c["time"] + (60.0 / self.bpm * segment_beats)
                merged.append(c)

        logger.info(f"🎶 检测到 {len(merged)} 个和弦变化 (BPM={self.bpm})")
        return merged

    # ------------------------------------------------------------------
    # 和弦歌词谱 (Issue 1 修复)
    # ------------------------------------------------------------------

    def generate_chord_lyric_sheet(
        self,
        chords: List[Dict],
        lyrics_text: str = "",
        lyrics_lines: List[str] = None,
        song_title: str = "未知歌曲",
    ) -> str:
        """
        生成和弦歌词对照谱（吉他谱格式）

        输入:
            chords: 和弦分析结果 [{time, chord, roman, ...}]
            lyrics_text: 完整歌词文本
            lyrics_lines: 已分行的歌词列表
            song_title: 歌曲名

        输出:
            格式化和弦歌词谱文本
        """
        lines = []
        lines.append(f"{song_title} — 和弦歌词谱")
        lines.append(f"调性: {self.key}  BPM: {self.bpm}")
        lines.append("")

        if not chords:
            lines.append("（未检测到和弦）")
            return "\n".join(lines)

        # 处理歌词
        lyric_segments = self._parse_lyrics(lyrics_text, lyrics_lines)

        if not lyric_segments:
            # 没有歌词，输出纯和弦谱
            lines.append(self._format_chord_chart(chords))
            return "\n".join(lines)

        # 按小节对齐歌词和和弦
        # 策略：把和弦平均分配到歌词行上
        chords_per_line = max(1, len(chords) // max(1, len(lyric_segments)))

        seg_idx = 0
        for line_idx, line_words in enumerate(lyric_segments):
            if seg_idx >= len(chords):
                break

            # 该行对应的和弦
            line_chords = []
            if line_idx < len(lyric_segments) - 1:
                line_chords = chords[seg_idx:seg_idx + chords_per_line]
            else:
                line_chords = chords[seg_idx:]

            seg_idx += len(line_chords)

            if not line_chords:
                continue

            # 生成和弦行
            chord_line = ""
            lyric_line = ""

            # 将歌词平均分配到和弦上
            words_per_chord = max(1, len(line_words) // max(1, len(line_chords)))

            word_idx = 0
            for ci, ch in enumerate(line_chords):
                # 该和弦对应的歌词
                if ci < len(line_chords) - 1:
                    chunk_words = line_words[word_idx:word_idx + words_per_chord]
                else:
                    chunk_words = line_words[word_idx:]

                word_idx += len(chunk_words)

                chord_text = ch["roman"]
                lyric_text = "".join(chunk_words)

                # 对齐：和弦在上，歌词在下
                max_len = max(len(chord_text), len(lyric_text) + 1)
                # 用空格填充使和弦居中于歌词上方
                padding = max_len - len(chord_text)
                chord_line += " " * (padding // 2) + chord_text + " " * (padding - padding // 2)
                lyric_line += lyric_text + " " * (max_len - len(lyric_text))

            lines.append(f"    {chord_line}")
            lines.append(f"    {lyric_line}")
            lines.append("")

        # 如果没有歌词行被消耗完所有的和弦，加剩余和弦
        if seg_idx < len(chords):
            remaining = chords[seg_idx:]
            chord_line = ""
            roman_line = ""
            for c in remaining:
                chord_line += f"{c['chord']:^10}"
                roman_line += f"{c['roman']:^10}"
            lines.append(f"    {chord_line}")
            lines.append(f"    {roman_line}")

        return "\n".join(lines)

    def _parse_lyrics(self, lyrics_text: str, lyrics_lines: List[str] = None) -> List[List[str]]:
        """解析歌词文本为分段词列表"""
        if lyrics_lines:
            text = "\n".join(lyrics_lines)
        elif lyrics_text:
            text = lyrics_text
        else:
            return []

        # 按行分割，过滤空行和标记行
        raw_lines = text.strip().split("\n")
        segments = []
        for line in raw_lines:
            line = line.strip()
            if not line:
                continue
            # 过滤时间戳行 [00:12.34]
            if re.match(r'^\[?\d{1,3}:\d{2}\.\d{2,3}\]?', line):
                # 提取时间戳后的歌词
                line = re.sub(r'^\[?\d{1,3}:\d{2}\.\d{2,3}\]?\s*', '', line)
            if not line:
                continue
            # 过滤元数据标签
            if line.startswith('[') and line.endswith(']'):
                continue
            # 按空格或标点分词
            words = self._segment_lyric_line(line)
            if words:
                segments.append(words)

        return segments

    def _segment_lyric_line(self, line: str) -> List[str]:
        """将一行歌词分割成短语（按标点/空格切分）"""
        # 中文歌词：按标点或 2-4 字一组
        if re.search(r'[\u4e00-\u9fff]', line):
            # 中文：先按标点粗分，再按 3-4 字细分
            parts = re.split(r'([，。！？、；：""''（）【】\s,.!?;:\'"()\[\]])', line)
            result = []
            for part in parts:
                part = part.strip()
                if not part or re.match(r'^[，。！？、；：""''（）【】\s,.!?;:\'"()\[\]]$', part):
                    continue
                # 按 3-4 字一组细分长句
                if len(part) > 5:
                    for i in range(0, len(part), 4):
                        chunk = part[i:i+4]
                        if chunk:
                            result.append(chunk)
                else:
                    result.append(part)
            return result
        else:
            # 英文/其他：按单词切分
            words = line.split()
            return [w for w in words if w]

    # ------------------------------------------------------------------
    # 纯文字和弦谱 (旧格式保留作为 fallback)
    # ------------------------------------------------------------------

    def _format_chord_chart(self, chords: List[Dict]) -> str:
        """格式化和弦级数谱为纯文本"""
        if not chords:
            return "（未检测到和弦）"

        lines = []
        lines.append(f"🎸 和弦进行（Key: {self.key}）")
        lines.append("=" * 50)

        chord_row = ""
        roman_row = ""
        for c in chords:
            chord_row += f"{c['chord']:^10}"
            roman_row += f"{c['roman']:^10}"

        lines.append(f"和弦: {chord_row}")
        lines.append(f"级数: {roman_row}")
        lines.append(f"信心: " + "".join(f"{c['confidence']*100:>5.0f}%   " for c in chords))

        lines.append("")
        lines.append("详细:")
        for c in chords:
            lines.append(
                f"  第 {c['beat']:>3d} 拍 ({c['time']:>5.1f}s)  "
                f"{c['chord']:>6s}  →  {c['roman']:>6s}  "
                f"(置信度: {c['confidence']*100:.0f}%)"
            )

        return "\n".join(lines)

    # ------------------------------------------------------------------
    # Demucs 多轨分离 (Issue 2 修复)
    # ------------------------------------------------------------------

    def demucs_separate(self, audio_path: Path, output_dir: Path) -> Dict[str, Optional[Path]]:
        """
        使用 Demucs 分离 4 stems: vocals, drums, bass, other

        返回: {"vocals": Path, "drums": Path, "bass": Path, "other": Path}
        """
        logger.info("🔊 [Demucs] 4-stem 分离中...")
        stems = {"vocals": None, "drums": None, "bass": None, "other": None}

        try:
            import torch
            from demucs import separate
            from demucs.pretrained import get_model

            # 使用 htdemucs_ft 模型（效果好）
            logger.info(f"  加载模型: htdemucs_ft")

            # 创建临时输出目录
            demucs_out = output_dir / "demucs_temp"
            demucs_out.mkdir(parents=True, exist_ok=True)
            model_name = "htdemucs_ft"
            demucs_result_dir = demucs_out / model_name / audio_path.stem

            # 修护 Demucs pad1d assertion bug
            import demucs.hdemucs as _hd
            _orig_pad1d = _hd.pad1d
            def _safe_pad1d(x, paddings, mode='constant', value=0.):
                import torch.nn.functional as _F
                x0 = x; length = x.shape[-1]; pl, pr = paddings
                if mode == 'reflect':
                    max_pad = max(pl, pr)
                    if length <= max_pad:
                        ep = max_pad - length + 1; epr = min(pr, ep); epl = ep - epr
                        pl, pr = pl - epl, pr - epr
                        x = _F.pad(x, (epl, epr))
                return _F.pad(x, (pl, pr), mode, value)
            _hd.pad1d = _safe_pad1d

            import torch as _torch
            import soundfile as _sf
            import demucs.audio as _daudio
            from demucs.pretrained import get_model as _get_model
            from demucs.apply import apply_model as _apply_model

            model = _get_model('htdemucs_ft')
            device = 'cuda' if _torch.cuda.is_available() else 'cpu'
            model.to(device)
            model.eval()

            # 加载音频
            audio_file = _daudio.AudioFile(audio_path)
            wav = audio_file.read(seek_time=0, duration=None)
            sr = audio_file.samplerate()
            wav = wav.squeeze(0)  # [streams, ch, T] -> [ch, T]
            wav = wav.to(device)
            logger.info(f"  🎵 音频: {wav.shape[1]/sr:.0f}s, {wav.shape[0]}ch, {device}")

            # 分离
            with _torch.no_grad():
                sources = _apply_model(
                    model, wav[None],
                    shifts=1, split=True, overlap=0.25,
                    progress=True,
                )[0]

            # 保存各 stems
            src_names = model.sources  # ['drums', 'bass', 'other', 'vocals']
            for i, name in enumerate(src_names):
                out_path = demucs_result_dir / f"{name}.wav"
                out_path.parent.mkdir(parents=True, exist_ok=True)
                stem_wav = sources[i]
                _sf.write(str(out_path), stem_wav.cpu().numpy().T, sr,
                          subtype='PCM_16')
                if name in stems:
                    stems[name] = out_path
                    logger.info(f"  ✅ {name}: {stem_wav.shape[1]/sr:.0f}s, {stem_wav.shape[0]}ch")

            # no_vocals (drums+bass+other)
            no_voc = _torch.zeros_like(sources[0])
            for i, name in enumerate(src_names):
                if name != "vocals":
                    no_voc += sources[i]
            no_voc_path = demucs_result_dir / "no_vocals.wav"
            _sf.write(str(no_voc_path), no_voc.cpu().numpy().T, sr, subtype='PCM_16')
            logger.info(f"  ✅ no_vocals: {no_voc_path.name}")

            # 检查是否所有 stem 都找到了
            if all(v is not None for v in stems.values()):
                logger.info("  ✅ Demucs 4-stem 分离完成!")
            elif stems["vocals"] is not None and stems["other"] is not None:
                logger.info("  ⚠️ 只有 2-stem (vocals/no_vocals)，将 no_vocals 作为 other")
                # 对 no_vocals 做二次分离 drums/bass
                stems = self._separate_remaining(stems, demucs_result_dir, output_dir)
            else:
                logger.warning("  ❌ Demucs 分离失败")

        except ImportError as e:
            logger.warning(f"  ❌ Demucs 未安装: {e}")
        except Exception as e:
            logger.warning(f"  ❌ Demucs 分离异常: {e}")
            import traceback
            logger.debug(traceback.format_exc())

        return stems

    def _separate_remaining(
        self,
        stems: Dict,
        demucs_dir: Path,
        output_dir: Path,
    ) -> Dict[str, Optional[Path]]:
        """对 no_vocals 做二次分离得到 drums/bass"""
        no_vocals = demucs_dir / "no_vocals.wav"
        if not no_vocals.exists():
            return stems

        logger.info("  🔧 对 no_vocals 二次分离 drums/bass...")
        try:
            temp_out = output_dir / "demucs_temp2"
            temp_out.mkdir(parents=True, exist_ok=True)

            cmd = [
                sys.executable, "-m", "demucs",
                "--two-stems", "drums",
                "-n", "htdemucs_ft",
                "-o", str(temp_out),
                str(no_vocals),
            ]
            subprocess.run(cmd, capture_output=True, text=True, timeout=600)

            result_dir = temp_out / "htdemucs_ft" / "no_vocals"
            if result_dir.exists():
                drums_path = result_dir / "drums.wav"
                if drums_path.exists():
                    stems["drums"] = drums_path
                    logger.info(f"  ✅ drums: {drums_path}")
                # 剩下的是 bass + other
                no_drums = result_dir / "no_drums.wav"
                if no_drums.exists():
                    stems["bass"] = no_drums  # 先用 no_drums 当 bass
                    logger.info(f"  ⚠️ bass (from no_drums): {no_drums}")
        except Exception as e:
            logger.warning(f"  二次分离失败: {e}")

        return stems

    # ------------------------------------------------------------------
    # BS-ROFO-SW 6轨分离 🚀
    # ------------------------------------------------------------------

    def bsrofo_separate(self, audio_path: Path, output_dir: Path) -> Dict[str, Optional[Path]]:
        """
        使用 BS-ROFO-SW 模型进行6轨分离

        输出6轨: bass, drums, other, vocals, guitar, piano

        返回: {"bass": Path, "drums": Path, "other": Path, "vocals": Path, "guitar": Path, "piano": Path}
        """
        stems = {s: None for s in BSROFO_STEMS}
        logger.info("🔊 [BS-ROFO] 6轨分离中...")

        model_dir = Path.home() / ".cache" / "bs_roformer" / "BS-Rofo-SW-Fixed"
        config_path = model_dir / "BS-Rofo-SW-Fixed.yaml"
        ckpt_path = model_dir / "BS-Rofo-SW-Fixed.ckpt"

        if not config_path.exists():
            logger.error(f"❌ BS-ROFO 配置文件不存在: {config_path}")
            return stems
        if not ckpt_path.exists():
            logger.error(f"❌ BS-ROFO 权重文件不存在: {ckpt_path}")
            return stems

        try:
            from bs_roformer import get_model_from_config, demix_track as bs_demix
            from ml_collections import ConfigDict
            import torch
            import soundfile as sf
            import numpy as np

            device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
            logger.info(f"  设备: {device}")

            # 加载配置
            with open(config_path) as f:
                config = ConfigDict(yaml.load(f, Loader=SafeLoaderWithTuple))
            logger.info(f"  配置加载完成: {list(config.training.instruments)}")

            # 加载模型
            logger.info(f"  加载模型: {ckpt_path.name}")
            model = get_model_from_config('bs_roformer', config)
            state_dict = torch.load(ckpt_path, map_location=torch.device("cpu"))
            model.load_state_dict(state_dict)
            model = model.to(device)
            model.eval()
            logger.info(f"  ✅ BS-ROFO-SW 模型就绪 ({sum(p.numel() for p in model.parameters())/1e6:.1f}M 参数)")

            # 读取音频
            mix, sr = sf.read(str(audio_path))
            original_mono = False
            if len(mix.shape) == 1:
                original_mono = True
                mix = np.stack([mix, mix], axis=-1)
            logger.info(f"  🎵 音频: {mix.shape[0]/sr:.0f}s, {mix.shape[1]}ch, {sr}Hz")

            mixture = torch.tensor(mix.T, dtype=torch.float32)

            # 分离 — 直接调用 bs_roformer 的 demix_track
            logger.info(f"  开始分离 (chunk_size={config.audio.chunk_size}, overlap={config.inference.num_overlap})...")
            res, _ = bs_demix(config, model, mixture, device)

            # 保存各stem
            stems_dir = output_dir / "bsrofo_stems"
            stems_dir.mkdir(parents=True, exist_ok=True)

            for instr in BSROFO_STEMS:
                if instr in res:
                    stem_audio = res[instr].T  # [ch, T] -> [T, ch]
                    if original_mono:
                        stem_audio = stem_audio[:, 0:1]
                    out_path = stems_dir / f"{instr}.wav"
                    sf.write(str(out_path), stem_audio, sr, subtype='PCM_16')
                    stems[instr] = out_path
                    logger.info(f"  ✅ {instr}: {stem_audio.shape[0]/sr:.0f}s")

            logger.info("  ✅ BS-ROFO 6轨分离完成!")
            return stems

        except ImportError as e:
            logger.warning(f"  ❌ bs-roformer-infer 未安装: {e}")
            logger.warning("  💡 请运行: pip install bs-roformer-infer")
        except Exception as e:
            logger.warning(f"  ❌ BS-ROFO 分离异常: {e}")
            import traceback
            logger.debug(traceback.format_exc())

        return stems

    # ------------------------------------------------------------------
    # Whisper 歌词转写
    # ------------------------------------------------------------------

    def transcribe_lyrics(
        self,
        vocals_path: Path,
        language: str = "zh",
    ) -> List[Dict]:
        """
        使用 faster-whisper medium 模型从人声轨转写歌词

        返回: [{"start": 0.0, "end": 2.5, "text": "歌词片段"}, ...]
        """
        logger.info("🎤 [Whisper] 歌词转写中...")
        segments = []

        if not vocals_path or not vocals_path.exists():
            logger.warning("  ⚠️ 人声文件不存在，跳过歌词转写")
            return segments

        try:
            import os as _os
            # 设置 HuggingFace 镜像
            _os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

            from faster_whisper import WhisperModel

            # 检测可用设备
            import torch
            device = "cuda" if torch.cuda.is_available() else "cpu"
            compute_type = "float16" if device == "cuda" else "int8"
            logger.info(f"  加载 Whisper medium 模型 ({device}/{compute_type})...")

            model = WhisperModel(
                "medium",
                device=device,
                compute_type=compute_type,
                download_root=str(Path.home() / ".cache" / "whisper"),
            )

            logger.info(f"  转写中 (语言={language})...")
            whisper_segments, info = model.transcribe(
                str(vocals_path),
                language=language,
                beam_size=5,
                best_of=5,
                vad_filter=True,
                vad_parameters=dict(
                    min_silence_duration_ms=500,
                    threshold=0.5,
                ),
            )

            for seg in whisper_segments:
                segments.append({
                    "start": round(seg.start, 2),
                    "end": round(seg.end, 2),
                    "text": seg.text.strip(),
                })

            logger.info(f"  ✅ 转写完成: {len(segments)} 个片段")
            if segments:
                # 显示前几行
                for s in segments[:5]:
                    logger.info(f"    [{s['start']:.1f}s-{s['end']:.1f}s] {s['text']}")
                if len(segments) > 5:
                    logger.info(f"    ... 还有 {len(segments)-5} 个片段")

            return segments

        except ImportError as e:
            logger.warning(f"  ❌ faster-whisper 未安装: {e}")
        except Exception as e:
            logger.warning(f"  ❌ Whisper 转写异常: {e}")
            import traceback
            logger.debug(traceback.format_exc())

        return segments

    def _lyrics_segments_to_text(self, segments: List[Dict]) -> str:
        """将带时间戳的歌词片段转为纯文本歌词"""
        if not segments:
            return ""
        lines = []
        for seg in segments:
            text = seg.get("text", "").strip()
            if text:
                lines.append(text)
        return "\n".join(lines)

    # ------------------------------------------------------------------
    # 音频转 MIDI
    # ------------------------------------------------------------------

    def audio_to_midi(
        self,
        audio_path: Path,
        output_midi: Path,
        method: str = "auto",
        instrument_label: str = "Unknown",
    ) -> bool:
        """
        将音频转为 MIDI 文件

        方法优先级：
        1. basic-pitch (多音检测, 先)
        2. librosa.pyin (单音检测, 备选)

        返回: True 如果成功
        """
        logger.info(f"  🎹 转 MIDI: {instrument_label}")

        try:
            has_basic_pitch = False
            try:
                import basic_pitch
                has_basic_pitch = True
            except ImportError:
                pass

            # 优先用 basic-pitch
            if has_basic_pitch and method != "pyin":
                return self._basic_pitch_to_midi(audio_path, output_midi, instrument_label)

            # 备选: librosa pyin
            return self._pyin_to_midi(audio_path, output_midi, instrument_label)

        except Exception as e:
            logger.warning(f"    MIDI 转换失败: {e}")
            return False

    def _basic_pitch_to_midi(
        self, audio_path: Path, output_midi: Path, label: str
    ) -> bool:
        """使用 Basic Pitch 转 MIDI (多音检测, 适合非人声)"""
        try:
            import basic_pitch
            from basic_pitch import ICASSP_2022_MODEL_PATH
            import tensorflow as tf  # basic-pitch 底层需要

            # Basic Pitch 需要特定处理
            import librosa
            audio, sr = librosa.load(str(audio_path), sr=22050, mono=True)

            # 尝试用 basic_pitch 的命令行
            cmd = [
                "basic-pitch", "midi-save",
                str(output_midi),
                str(audio_path),
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

            if result.returncode == 0 and output_midi.exists() and output_midi.stat().st_size > 100:
                logger.info(f"    ✅ Basic Pitch MIDI: {output_midi}")
                return True

            logger.info(f"    Basic Pitch CLI 未生效，回退 pyin")
            return self._pyin_to_midi(audio_path, output_midi, label)

        except Exception as e:
            logger.warning(f"    Basic Pitch 失败: {e}")
            return self._pyin_to_midi(audio_path, output_midi, label)

    def _pyin_to_midi(
        self, audio_path: Path, output_midi: Path, label: str
    ) -> bool:
        """使用 librosa.pyin 转 MIDI (单音检测, 适合人声/贝斯)"""
        try:
            import librosa
            from midiutil import MIDIFile

            audio, sr = librosa.load(str(audio_path), sr=22050, mono=True)

            # pyin 音高检测
            f0, voiced_flag, voiced_probs = librosa.pyin(
                audio,
                fmin=librosa.note_to_hz('C2') if label == "Bass" else librosa.note_to_hz('C3'),
                fmax=librosa.note_to_hz('C7') if label == "Vocals" else librosa.note_to_hz('C6'),
                sr=sr,
            )

            # 创建 MIDI
            midi = MIDIFile(1)
            midi.addTempo(0, 0, self.bpm)

            # 将 f0 转为 MIDI 音符
            note_events = []
            hop_length = 256  # pyin 的默认 hop
            times = librosa.frames_to_time(range(len(f0)), sr=sr, hop_length=hop_length)

            in_note = False
            note_start = 0
            note_pitch = 0

            for i in range(len(f0)):
                if voiced_flag[i] and not np.isnan(f0[i]):
                    midi_pitch = int(round(librosa.hz_to_midi(f0[i])))
                    if not in_note:
                        in_note = True
                        note_start = times[i]
                        note_pitch = midi_pitch
                    elif abs(midi_pitch - note_pitch) > 2:
                        # 音高变化超过 2 semitones → 结束旧音符
                        duration = times[i] - note_start
                        if duration > 0.05:  # 最少 50ms
                            note_events.append((note_start, duration, note_pitch))
                        note_start = times[i]
                        note_pitch = midi_pitch
                else:
                    if in_note:
                        duration = times[i] - note_start
                        if duration > 0.05:
                            note_events.append((note_start, duration, note_pitch))
                        in_note = False

            # 最后的音符
            if in_note:
                duration = times[-1] - note_start
                if duration > 0.05:
                    note_events.append((note_start, duration, note_pitch))

            # 为打击乐特殊处理
            if label == "Drums":
                return self._percussion_to_midi(audio_path, output_midi)

            # 写入 MIDI
            for start_time, duration, pitch in note_events:
                # 限制 MIDI 范围
                pitch = max(0, min(127, pitch))
                # 转换时间为节拍
                beat_start = start_time * self.bpm / 60.0
                beat_dur = duration * self.bpm / 60.0
                # 音量根据 voiced_probs
                volume = min(100, int(60 + 40 * np.mean(voiced_probs[
                    max(0, int(start_time * sr / hop_length)):
                    min(len(voiced_probs), int((start_time + duration) * sr / hop_length))
                ])))
                midi.addNote(0, 0, pitch, beat_start, beat_dur, volume)

            with open(output_midi, "wb") as f:
                midi.writeFile(f)

            if output_midi.exists() and output_midi.stat().st_size > 50:
                logger.info(f"    ✅ pyin MIDI: {output_midi} ({len(note_events)} 音符)")
                return True
            else:
                logger.warning(f"    ⚠️ MIDI 文件过小 ({output_midi.stat().st_size} bytes)")
                return False

        except Exception as e:
            logger.warning(f"    pyin 转 MIDI 失败: {e}")
            return False

    def _percussion_to_midi(
        self, audio_path: Path, output_midi: Path
    ) -> bool:
        """鼓轨 → MIDI 打击乐（用 onset detection 检测鼓点）"""
        try:
            import librosa
            from midiutil import MIDIFile

            audio, sr = librosa.load(str(audio_path), sr=22050, mono=True)

            # onset detection
            onset_frames = librosa.onset.onset_detect(
                y=audio, sr=sr,
                hop_length=512,
                backtrack=True,
                energy=0.1,
            )
            onset_times = librosa.frames_to_time(onset_frames, sr=sr, hop_length=512)

            # 频谱特征粗略分类鼓乐器
            S = np.abs(librosa.stft(audio))
            freqs = librosa.fft_frequencies(sr=sr)

            midi = MIDIFile(1, adjust_origin=False)
            midi.addTempo(0, 0, self.bpm)

            # GM 打击乐映射 (相近类别)
            drum_map = {
                "kick": 36,    # Bass Drum 1
                "snare": 38,   # Snare 
                "hihat": 42,   # Closed Hi-hat
                "crash": 49,   # Crash Cymbal 1
                "tom": 45,     # Low Tom
                "ride": 51,    # Ride Cymbal 1
            }

            for t in onset_times:
                # 根据频谱能量分布粗略判断鼓类型
                beat_frame = int(t * sr / librosa.stft.__defaults__[1] if hasattr(librosa.stft, '__defaults__') else t * sr / 2048)
                if beat_frame >= S.shape[1]:
                    beat_frame = S.shape[1] - 1
                if beat_frame < 0:
                    continue

                spectrum = S[:, beat_frame]
                low_energy = np.sum(spectrum[freqs < 150])
                mid_energy = np.sum(spectrum[(freqs >= 150) & (freqs < 800)])
                high_energy = np.sum(spectrum[freqs >= 800])

                if low_energy > mid_energy and low_energy > high_energy:
                    pitch = drum_map["kick"]
                elif high_energy > mid_energy:
                    pitch = drum_map["hihat"]
                elif mid_energy > low_energy + high_energy:
                    pitch = drum_map["snare"]
                else:
                    pitch = drum_map["tom"]

                beat_pos = t * self.bpm / 60.0
                midi.addNote(0, 9, pitch, beat_pos, 0.25, 80)

            with open(output_midi, "wb") as f:
                midi.writeFile(f)

            if output_midi.exists() and output_midi.stat().st_size > 50:
                logger.info(f"    ✅ 鼓 MIDI: {output_midi} ({len(onset_times)} 打击事件)")
                return True

        except Exception as e:
            logger.warning(f"    鼓 MIDI 失败: {e}")
        return False

    # ------------------------------------------------------------------
    # 多轨五线谱生成 (Issue 2 修复)
    # ------------------------------------------------------------------

    def generate_band_score(
        self,
        stems: Dict[str, Optional[Path]],
        midi_files: Dict[str, Optional[Path]],
        chords: List[Dict],
        song_title: str = "未知歌曲",
    ) -> Dict[str, Any]:
        """
        从多轨 MIDI 生成乐队总谱 (MusicXML)

        参数:
            stems: {"vocals": Path, "drums": Path, "bass": Path, "other": Path}
            midi_files: {"vocals": Path, "drums": Path, "bass": Path, "other": Path}
            chords: 和弦分析结果
            song_title: 歌曲名

        返回: {"musicxml": Path, "midi_merged": Path, "ly_path": Path, "track_info": [...]}
        """
        result = {
            "musicxml": None,
            "midi_merged": None,
            "ly_path": None,
            "track_info": [],
            "score_text": "",
        }

        try:
            from music21 import stream, note, chord as m21_chord, instrument, tempo, meter, midi as m21_midi, clef, key, bar
            import music21
        except ImportError:
            logger.error("❌ 需要 music21: pip install music21")
            return result

        score = stream.Score()
        score.insert(0, tempo.MetronomeMark(number=self.bpm))

        # 设置调号
        try:
            k = key.Key(self.key)
            score.insert(0, k)
        except Exception:
            pass

        # 乐器定义 (乐器名, 谱号, midi程序号, MIDI文件)
        instrument_defs = [
            ("Vocals", "treble", 54, midi_files.get("vocals")),
            ("Drums", "percussion", 0, midi_files.get("drums")),
            ("Bass", "bass", 34, midi_files.get("bass")),
            ("Guitar", "treble", 25, midi_files.get("guitar")),
            ("Piano", "treble", 1, midi_files.get("piano")),
            ("Other", "treble", 1, midi_files.get("other")),
        ]

        # 过滤掉没有 MIDI 的乐器
        active_defs = [d for d in instrument_defs if d[3] is not None and d[3].exists()]

        if not active_defs:
            logger.warning("⚠️ 没有可用的 MIDI 文件，创建示例总谱")
            active_defs = instrument_defs  # 创建空谱

        for inst_name, clef_type, midi_prog, midi_path in active_defs:
            part = stream.Part()
            part.partName = inst_name
            part.partAbbreviation = inst_name[:4]

            # 设置乐器 - 手动映射避免 music21 不认识的乐器名
            inst_map = {
                "Vocals": (instrument.Vocalist, None),
                "Voice": (instrument.Vocalist, None),
                "Drums": (instrument.UnpitchedPercussion, None),
                "Bass": (instrument.ElectricBass, None),
                "Guitar": (instrument.Guitar, None),
                "Piano": (instrument.Piano, None),
                "Other": (instrument.Piano, None),
            }
            if inst_name in inst_map:
                cls_fn, _ = inst_map[inst_name]
                inst = cls_fn()
            else:
                inst = instrument.fromString(inst_name)
            if inst is None:
                inst = instrument.Instrument()
                inst.instrumentName = inst_name
                inst.midiProgram = midi_prog
            part.insert(0, inst)

            # 设置谱号
            if clef_type == "bass":
                part.insert(0, clef.BassClef())
            elif clef_type == "percussion":
                part.insert(0, clef.PercussionClef())
            else:
                part.insert(0, clef.TrebleClef())

            # 设置拍号
            part.insert(0, meter.TimeSignature("4/4"))

            # 加载 MIDI
            if midi_path and midi_path.exists() and midi_path.stat().st_size > 100:
                try:
                    mf = m21_midi.MidiFile()
                    mf.open(str(midi_path))
                    mf.read()
                    mf.close()

                    midi_stream = m21_midi.translate.midiFileToStream(mf)

                    # 提取音符
                    for el in midi_stream.flatten().notesAndRests:
                        part.insert(el.offset, el)

                    note_count = len(list(midi_stream.flatten().notes))
                    logger.info(f"  🎵 {inst_name}: {note_count} 音符")
                    result["track_info"].append({
                        "name": inst_name,
                        "notes": note_count,
                        "clef": clef_type,
                    })

                except Exception as e:
                    logger.warning(f"  ⚠️ {inst_name} MIDI 加载失败: {e}")
                    # 创建空白小节
                    for _ in range(4):
                        part.append(note.Rest(quarterLength=4))
            else:
                # 创建空白小节
                for _ in range(4):
                    part.append(note.Rest(quarterLength=4))

            score.append(part)

        # 添加和弦标记
        if chords and score.parts:
            try:
                top_part = score.parts[0]
                for c in chords:
                    beat_time = c["time"] * self.bpm / 60.0
                    if c["roman"]:
                        try:
                            from music21 import expressions
                            expr = expressions.TextExpression(c["roman"])
                            expr.style.absoluteY = 60
                            top_part.insert(beat_time, expr)
                        except Exception:
                            pass
            except Exception as e:
                logger.warning(f"和弦标记插入失败: {e}")

        # 导出 MusicXML
        try:
            mxml_path = tempfile.mktemp(suffix=".musicxml")
            score.write("musicxml", fp=mxml_path)
            if os.path.getsize(mxml_path) > 0:
                result["musicxml"] = mxml_path
                logger.info(f"📄 MusicXML 已生成: {mxml_path}")
        except Exception as e:
            logger.warning(f"MusicXML 导出失败: {e}")

        # 导出合并 MIDI
        try:
            midi_out = tempfile.mktemp(suffix=".mid")
            mf_out = m21_midi.translate.streamToMidiFile(score)
            mf_out.open(midi_out, "wb")
            mf_out.write()
            mf_out.close()
            result["midi_merged"] = midi_out
            logger.info(f"🎵 合并 MIDI: {midi_out}")
        except Exception as e:
            logger.warning(f"MIDI 导出失败: {e}")

        # 导出 LilyPond (.ly)
        try:
            ly_path = tempfile.mktemp(suffix=".ly")
            score.write("lilypond", fp=ly_path)
            if os.path.getsize(ly_path) > 0:
                result["ly_path"] = ly_path
                logger.info(f"🎼 LilyPond 源文件: {ly_path}")
        except Exception as e:
            logger.warning(f"LilyPond 导出失败: {e}")

        # ASCII 谱文本
        try:
            result["score_text"] = score.show("text")
        except Exception:
            result["score_text"] = "(ASCII 谱不可用)"

        logger.info(f"✅ 乐队总谱生成完成! ({len(score.parts)} 声部)")
        return result

    # ------------------------------------------------------------------
    # 渲染 PNG
    # ------------------------------------------------------------------

    def render_to_png(self, musicxml_path: Path, output_png: Path) -> bool:
        """使用 LilyPond 或 MuseScore 渲染为 PNG"""
        renderers = self._check_renderers()

        # 方法1: musicxml → ly → lilypond → png
        if renderers.get("lilypond", False):
            try:
                logger.info("🖼️  使用 LilyPond 渲染 PNG...")
                # musicxml2ly
                ly_path = musicxml_path.with_suffix(".ly")
                r1 = subprocess.run(
                    ["musicxml2ly", str(musicxml_path), "-o", str(ly_path)],
                    capture_output=True, text=True, timeout=30,
                )

                # 修改 .ly 文件，添加中文支持
                if ly_path.exists():
                    with open(ly_path, "r", encoding="utf-8") as f:
                        ly_content = f.read()
                    # 确保标题和排版
                    header_block = (
                        '\\header {\n'
                        f'  title = "{musicxml_path.stem}"\n'
                        '  tagline = "Generated by AI Cover Pipeline"\n'
                        '}\n\n'
                        '#(set-global-staff-size 18)\n'
                        '\\paper {\n'
                        '  indent = 25\\mm\n'
                        '  short-indent = 15\\mm\n'
                        '}\n'
                    )
                    # 如果 header 不存在则添加
                    if "\\header" not in ly_content:
                        ly_content = header_block + ly_content
                    with open(ly_path, "w", encoding="utf-8") as f:
                        f.write(ly_content)

                r2 = subprocess.run(
                    ["lilypond", "--png", "-o", str(output_png.with_suffix("")), str(ly_path)],
                    capture_output=True, text=True, timeout=120,
                )

                candidate = Path(f"{output_png.with_suffix('')}-1.png")
                if candidate.exists():
                    candidate.rename(output_png)
                    logger.info(f"✅ PNG: {output_png}")
                    return True

                logger.warning(f"  LilyPond 输出: {r2.stderr[-300:]}")
            except Exception as e:
                logger.warning(f"  LilyPond 渲染失败: {e}")

        # 方法2: MuseScore
        if renderers.get("musescore", False):
            try:
                logger.info("🖼️  使用 MuseScore 渲染 PNG...")
                musescore_cmd = "musescore3"
                if not shutil.which(musescore_cmd):
                    musescore_cmd = "musescore"
                subprocess.run(
                    [musescore_cmd, str(musicxml_path), "-o", str(output_png)],
                    capture_output=True, timeout=120,
                )
                if output_png.exists():
                    logger.info(f"✅ PNG: {output_png}")
                    return True
            except Exception as e:
                logger.warning(f"  MuseScore 渲染失败: {e}")

        logger.info("💡 MusicXML 已生成，可用 MuseScore/Sibelius 打开")
        return False

    def _check_renderers(self) -> Dict[str, bool]:
        """检查可用的渲染器"""
        renderers = {}
        for cmd in ["lilypond", "musicxml2ly", "musescore3", "musescore"]:
            try:
                renderers[cmd] = shutil.which(cmd) is not None
            except Exception:
                renderers[cmd] = False
        return renderers

    # ------------------------------------------------------------------
    # 完整流水线
    # ------------------------------------------------------------------

    def run_full_pipeline(
        self,
        audio_path: Path,
        output_dir: Path,
        lyrics_text: str = "",
        lyrics_file: Optional[Path] = None,
        song_title: str = "",
        render_png: bool = False,
        skip_demucs: bool = False,
        use_bsrofo: bool = True,
        use_whisper: bool = False,
    ) -> Dict[str, Any]:
        """
        运行完整流水线:
        1. 和弦分析
        2. BS-ROFO 6轨分离 (或 Demucs 4轨备选)
        3. 每轨转 MIDI
        4. Whisper 歌词转写 (可选)
        5. 和弦歌词谱生成
        6. 6声部乐队总谱
        7. 渲染 (可选)
        """
        results = {
            "chord_lyric_sheet": "",
            "chords": [],
            "lyrics_segments": [],
            "stems": {},
            "midi_files": {},
            "score": {},
            "output_files": [],
        }

        # 歌曲名
        if not song_title:
            song_title = audio_path.stem

        # ── Step 1: 和弦分析 ──
        logger.info("=" * 50)
        logger.info("🎼 AI 翻唱后处理流水线 — Stage 6 总谱生成")
        logger.info("=" * 50)
        logger.info(f"歌曲: {song_title}")
        logger.info(f"音频: {audio_path}")

        chords = self.analyze_chords(audio_path)
        results["chords"] = chords

        # ── Step 2: BS-ROFO 或 Demucs 多轨分离 ──
        if use_bsrofo:
            logger.info("\n🔊 BS-ROFO-SW 6轨分离...")
            stems = self.bsrofo_separate(audio_path, output_dir)
            # 检查实际分离出多少轨
            valid_stems = {k: v for k, v in stems.items() if v is not None}
            if len(valid_stems) < 3:
                logger.warning("  ⚠️ BS-ROFO 分离不完整，回退至 Demucs")
                stems = self.demucs_separate(audio_path, output_dir)
        else:
            logger.info("\n🔊 Demucs 4轨分离...")
            stems = self.demucs_separate(audio_path, output_dir)
            # 将 Demucs 的 4轨映射到6轨格式
            demucs_map = {"vocals": stems.get("vocals"), "drums": stems.get("drums"),
                          "bass": stems.get("bass"), "other": stems.get("other")}
            for s in BSROFO_STEMS:
                if s not in demucs_map:
                    stems[s] = None

        results["stems"] = stems

        # ── Step 3: Whisper 歌词转写 ──
        lyrics_segments = []
        if use_whisper:
            vocals_path = stems.get("vocals") or stems.get("vocals", None)
            if vocals_path and vocals_path.exists():
                lyrics_segments = self.transcribe_lyrics(vocals_path)
                results["lyrics_segments"] = lyrics_segments
                # 用 Whisper 结果填充 lyrics_text
                if not lyrics_text and lyrics_segments:
                    lyrics_text = self._lyrics_segments_to_text(lyrics_segments)
                    logger.info(f"📝 Whisper 歌词已自动填充 ({len(lyrics_segments)} 片段)")

        # ── Step 4: 和弦歌词谱 ──
        logger.info("\n📝 生成和弦歌词谱...")
        lyric_content = ""
        if lyrics_file and lyrics_file.exists():
            lyric_content = lyrics_file.read_text(encoding="utf-8")
        elif lyrics_text:
            lyric_content = lyrics_text

        chord_lyric = self.generate_chord_lyric_sheet(
            chords=chords,
            lyrics_text=lyric_content,
            song_title=song_title,
        )
        results["chord_lyric_sheet"] = chord_lyric
        print("\n" + chord_lyric)

        # 保存和弦歌词谱
        chord_path = output_dir / f"{audio_path.stem}_chord_lyric.txt"
        with open(chord_path, "w", encoding="utf-8") as f:
            f.write(chord_lyric)
        results["output_files"].append(str(chord_path))
        logger.info(f"📝 和弦歌词谱: {chord_path}")

        # 也保存纯和弦谱
        chord_txt = self._format_chord_chart(chords)
        chart_path = output_dir / f"{audio_path.stem}_chords.txt"
        with open(chart_path, "w", encoding="utf-8") as f:
            f.write(chord_txt)
        logger.info(f"📝 纯和弦谱: {chart_path}")

        # ── Step 5: 每轨转 MIDI ──
        logger.info("\n🎹 多轨 MIDI 转录...")
        midi_dir = output_dir / "midi"
        midi_dir.mkdir(parents=True, exist_ok=True)

        midi_files = {}
        for stem_name, stem_path in stems.items():
            if stem_path and stem_path.exists():
                out_midi = midi_dir / f"{stem_name}.mid"
                # 按轨类型选择方法
                sn = stem_name.lower()
                if sn == "vocals":
                    method = "pyin"
                elif sn == "drums":
                    method = "percussion"
                elif sn == "bass":
                    method = "pyin"
                elif sn in ("piano", "guitar", "other"):
                    method = "auto"
                else:
                    method = "auto"

                success = self.audio_to_midi(
                    stem_path, out_midi,
                    method=method, instrument_label=stem_name,
                )
                if success:
                    midi_files[stem_name] = out_midi
                else:
                    logger.warning(f"  ⚠️ {stem_name} MIDI 转录失败")
                    midi_files[stem_name] = None
            else:
                midi_files[stem_name] = None

        results["midi_files"] = midi_files

        # ── Step 6: 多轨五线谱 (6声部) ──
        logger.info("\n🎼 生成多轨乐队总谱（6声部）...")
        score_result = self.generate_band_score(
            stems=stems,
            midi_files=midi_files,
            chords=chords,
            song_title=song_title,
        )
        results["score"] = score_result

        # 保存输出文件
        if score_result.get("musicxml"):
            mxml_out = output_dir / f"{audio_path.stem}_band_score.musicxml"
            shutil.copy(score_result["musicxml"], mxml_out)
            results["output_files"].append(str(mxml_out))
            logger.info(f"📄 MusicXML 总谱: {mxml_out}")

        if score_result.get("midi_merged"):
            midi_out = output_dir / f"{audio_path.stem}_band_score.mid"
            shutil.copy(score_result["midi_merged"], midi_out)
            results["output_files"].append(str(midi_out))
            logger.info(f"🎵 合并 MIDI: {midi_out}")

        if score_result.get("ly_path"):
            ly_out = output_dir / f"{audio_path.stem}_band_score.ly"
            shutil.copy(score_result["ly_path"], ly_out)
            results["output_files"].append(str(ly_out))
            logger.info(f"🎼 LilyPond 源: {ly_out}")

        # ── Step 7: 渲染 PNG ──
        if render_png and score_result.get("musicxml"):
            png_path = output_dir / f"{audio_path.stem}_score.png"
            self.render_to_png(Path(score_result["musicxml"]), png_path)

        # 打印音轨摘要
        if score_result.get("track_info"):
            print("\n" + "=" * 50)
            print("🎚️  乐队总谱 — 声部摘要")
            print("=" * 50)
            for t in score_result["track_info"]:
                clef_symbol = {"treble": "𝄞", "bass": "𝄢", "percussion": "🥁"}
                sym = clef_symbol.get(t["clef"], "?")
                print(f"  {sym} {t['name']:>8s}  |  {t['notes']:>4d} 个音符")

        print("\n" + "=" * 50)
        print("📂 输出目录:", output_dir)
        for f in results["output_files"]:
            print(f"  • {f}")
        print("=" * 50)

        return results


# ============================================================================
# 歌词交互输入
# ============================================================================

def interactive_lyrics_input(prompt_text: str = "") -> str:
    """交互式歌词输入"""
    print("\n" + "=" * 50)
    print("📝 歌词输入模式")
    print("=" * 50)
    print("请逐行输入歌词（每行一个乐句），输入空行结束:")
    print("提示: 中文歌词会自动按4字一组对齐到和弦上")
    print("-" * 50)

    if prompt_text:
        print(f"提示: {prompt_text}")

    lines = []
    while True:
        try:
            line = input("  > ")
            if not line.strip():
                if lines:
                    break
                continue
            lines.append(line.strip())
        except (EOFError, KeyboardInterrupt):
            break

    return "\n".join(lines)


def load_lyrics_from_file(lyrics_path: Path) -> str:
    """从文件加载歌词"""
    if lyrics_path.exists():
        content = lyrics_path.read_text(encoding="utf-8")
        logger.info(f"📝 歌词已加载: {lyrics_path} ({len(content)} 字符)")
        return content
    else:
        logger.warning(f"⚠️ 歌词文件不存在: {lyrics_path}")
        return ""


# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="🎼 Stage 6: 乐队总谱生成 — 和弦歌词谱 + 多轨五线谱",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            使用示例:
              # 完整流水线（推荐）
              %(prog)s -i song.wav -o ./output --lyrics lyrics.txt

              # 交互输入歌词
              %(prog)s -i song.wav -o ./output --interactive-lyrics

              # 仅和弦歌词谱
              %(prog)s -i song.wav --chords-only --lyrics lyrics.txt

              # 仅多轨总谱（不需要歌词）
              %(prog)s -i song.wav --score-only

              # 指定调性
              %(prog)s -i song.wav -o ./output --key Am --bpm 85

              # 渲染 PNG
              %(prog)s -i song.wav -o ./output --render --lyrics lyrics.txt

              # 跳过 Demucs（如果已经分离好）
              %(prog)s -i song.wav -o ./output --skip-demucs

            依赖:
              core: librosa, numpy, torch, demucs
              midi: basic-pitch, midiutil
              score: music21
              png:  lilypond (可选)
        """),
    )

    parser.add_argument("-i", "--input", type=str, required=True,
                        help="输入音频文件 (WAV/MP3)")
    parser.add_argument("-o", "--output", type=str, default=None,
                        help="输出目录 (默认: 输入文件同目录下的 score_output)")
    parser.add_argument("--lyrics", type=str, default=None,
                        help="歌词文件路径 (用于和弦歌词对照谱)")
    parser.add_argument("--interactive-lyrics", action="store_true",
                        help="交互模式输入歌词")
    parser.add_argument("--chords-only", action="store_true",
                        help="仅生成和弦歌词谱")
    parser.add_argument("--score-only", action="store_true",
                        help="仅生成多轨总谱（跳过和弦歌词谱）")
    parser.add_argument("--render", action="store_true",
                        help="渲染为 PNG (需要 LilyPond)")
    parser.add_argument("--skip-demucs", action="store_true",
                        help="跳过 Demucs 分离（使用现有 MIDI）")
    parser.add_argument("--demucs", action="store_true",
                        help="使用 Demucs 4轨分离（默认: BS-ROFO 6轨）")
    parser.add_argument("--whisper", action="store_true",
                        help="使用 Whisper 自动转写歌词")
    parser.add_argument("--key", type=str, default="C",
                        help="调性 (默认: C)")
    parser.add_argument("--bpm", type=int, default=120,
                        help="默认 BPM (自动检测如果 librosa 可用)")
    parser.add_argument("--title", type=str, default="",
                        help="歌曲标题")
    parser.add_argument("--check-deps", action="store_true",
                        help="检查依赖")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="详细日志")

    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.check_deps:
        check_all_deps()
        return

    # 输入路径
    input_path = Path(args.input).expanduser().resolve()
    if not input_path.exists():
        logger.error(f"❌ 文件不存在: {input_path}")
        sys.exit(1)

    # 输出目录
    output_dir = (
        Path(args.output).expanduser().resolve()
        if args.output
        else input_path.parent / "score_output"
    )
    output_dir.mkdir(parents=True, exist_ok=True)

    # 加载歌词
    lyrics_text = ""
    if args.lyrics:
        lyrics_text = load_lyrics_from_file(Path(args.lyrics).expanduser().resolve())
    elif args.interactive_lyrics:
        lyrics_text = interactive_lyrics_input()

    # 创建生成器
    gen = ScoreGenerator(bpm=args.bpm, key=args.key)

    # 检测音频时长
    try:
        import librosa
        duration = librosa.get_duration(path=str(input_path))
        logger.info(f"⏱️  音频时长: {duration:.1f}s")
    except Exception:
        pass

    if args.chords_only:
        # 仅和弦歌词谱
        chords = gen.analyze_chords(input_path)
        chord_lyric = gen.generate_chord_lyric_sheet(
            chords=chords,
            lyrics_text=lyrics_text,
            song_title=args.title or input_path.stem,
        )

        out_path = output_dir / f"{input_path.stem}_chord_lyric.txt"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(chord_lyric)
        print("\n" + chord_lyric)
        logger.info(f"📝 和弦歌词谱: {out_path}")

    elif args.score_only:
        # 仅多轨总谱
        logger.info("🎼 仅生成多轨乐队总谱...")
        if not args.demucs:
            logger.info("  使用 BS-ROFO 6轨分离")
            stems = gen.bsrofo_separate(input_path, output_dir)
        else:
            logger.info("  使用 Demucs 4轨分离")
            stems = gen.demucs_separate(input_path, output_dir)

        midi_dir = output_dir / "midi"
        midi_dir.mkdir(parents=True, exist_ok=True)
        midi_files = {}
        for stem_name, stem_path in stems.items():
            if stem_path and stem_path.exists():
                out_midi = midi_dir / f"{stem_name}.mid"
                method = "pyin" if stem_name in ("Vocals", "vocals", "Bass", "bass") else "auto"
                if stem_name in ("Drums", "drums"):
                    method = "percussion"
                success = gen.audio_to_midi(stem_path, out_midi, method=method, instrument_label=stem_name)
                if success:
                    midi_files[stem_name] = out_midi

        chords = gen.analyze_chords(input_path)
        score_result = gen.generate_band_score(stems, midi_files, chords, args.title or input_path.stem)

        if score_result.get("musicxml"):
            mxml_out = output_dir / f"{input_path.stem}_band_score.musicxml"
            shutil.copy(score_result["musicxml"], mxml_out)
            logger.info(f"📄 MusicXML: {mxml_out}")

        if score_result.get("midi_merged"):
            midi_out = output_dir / f"{input_path.stem}_band_score.mid"
            shutil.copy(score_result["midi_merged"], midi_out)
            logger.info(f"🎵 MIDI: {midi_out}")

    else:
        # 完整流水线
        gen.run_full_pipeline(
            audio_path=input_path,
            output_dir=output_dir,
            lyrics_text=lyrics_text,
            song_title=args.title or input_path.stem,
            render_png=args.render,
            skip_demucs=args.skip_demucs,
            use_bsrofo=not args.demucs,
            use_whisper=args.whisper,
        )


def check_all_deps():
    """检查所有依赖"""
    print("\n📦 依赖检查:")
    core_pkgs = ["numpy", "librosa", "music21", "midiutil"]
    for pkg in core_pkgs:
        try:
            __import__(pkg)
            print(f"  ✅ {pkg}")
        except ImportError:
            print(f"  ❌ {pkg}")

    try:
        import torch
        print(f"  ✅ torch {torch.__version__} (CUDA: {torch.cuda.is_available()})")
    except ImportError:
        print(f"  ❌ torch")

    try:
        import demucs
        print(f"  ✅ demucs {demucs.__version__}")
    except ImportError:
        print(f"  ❌ demucs")

    try:
        import basic_pitch
        print(f"  ✅ basic-pitch")
    except ImportError:
        print(f"  ❌ basic-pitch")

    print("\n🖼️  渲染器:")
    for cmd in ["lilypond", "musicxml2ly", "musescore3", "musescore"]:
        try:
            print(f"  {'✅' if shutil.which(cmd) else '❌'} {cmd}")
        except Exception:
            print(f"  ❌ {cmd}")

    print()


if __name__ == "__main__":
    main()
