"""大师扒谱·引擎版 — 功能级数关系大调换算单测。

纯 assert 风格：可直接 `uv run python local-engine/test_analyze_roman.py` 跑，
也可被 pytest 收集运行。覆盖：
- transpose_semitones：音名上移半音（关系大调 +3）。
- resolve_roman_tonic：小调 -> 关系大调主音。
- analyze_roman：A minor 歌按关系大调 C 算级数（Am=VIm, Em=IIIm, Fmaj7=IVmaj7）。
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import analyze  # noqa: E402


def test_transpose_semitones():
    # 关系大调 = 小调上移小三度（+3 半音）
    assert analyze.transpose_semitones("A", 3) == "C"
    assert analyze.transpose_semitones("E", 3) == "G"
    assert analyze.transpose_semitones("B", 3) == "D"
    assert analyze.transpose_semitones("F#", 3) == "A"
    assert analyze.transpose_semitones("C", 3) == "Eb"  # 大调上移 3 半音（C->Eb），仅校验拼写
    assert analyze.transpose_semitones("C", 0) == "C"


def test_resolve_roman_tonic():
    # 小调 -> 关系大调主音
    assert analyze.resolve_roman_tonic("A minor") == "C"
    assert analyze.resolve_roman_tonic("E minor") == "G"
    # 大调不变
    assert analyze.resolve_roman_tonic("C major") == "C"
    assert analyze.resolve_roman_tonic("G major") == "G"


def test_analyze_roman_relative_major():
    # A minor 歌：以关系大调 C 为基准算级数
    chords = [
        {"start_time": 0.0, "end_time": 1.0, "chord": "Am"},
        {"start_time": 1.0, "end_time": 2.0, "chord": "Em"},
        {"start_time": 2.0, "end_time": 3.0, "chord": "Fmaj7"},
        {"start_time": 3.0, "end_time": 4.0, "chord": "G"},
    ]
    res = analyze.analyze_roman(chords, "A minor")
    romans = [r["roman"] for r in res]
    # Am=VIm, Em=IIIm, Fmaj7=IVmaj7（M7->maj7）, G=V
    assert romans == ["VIm", "IIIm", "IVmaj7", "V"], romans


def test_analyze_roman_major_unchanged():
    # C major 歌：基准不变，且 M7->maj7
    chords = [
        {"start_time": 0.0, "end_time": 1.0, "chord": "C"},
        {"start_time": 1.0, "end_time": 2.0, "chord": "Fmaj7"},
    ]
    res = analyze.analyze_roman(chords, "C major")
    romans = [r["roman"] for r in res]
    assert romans == ["I", "IVmaj7"], romans


if __name__ == "__main__":
    test_transpose_semitones()
    test_resolve_roman_tonic()
    test_analyze_roman_relative_major()
    test_analyze_roman_major_unchanged()
    print("ALL PYTHON TESTS PASSED")
