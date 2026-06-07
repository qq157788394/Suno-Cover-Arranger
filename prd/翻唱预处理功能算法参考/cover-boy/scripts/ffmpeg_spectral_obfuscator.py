#!/usr/bin/env python3
"""
🔊 频谱指纹混淆器 — 绕过 Suno 音频指纹匹配专用

原理：
  Suno 翻唱在上传参考音频时会做频谱指纹匹配（类似 Shazam），检测到与原曲
  匹配就拒绝。本脚本通过 EQ 塑形 + 动态压缩 + 相位偏移 来改变音频的频谱
  特征，让 Suno 无法再匹配到原曲，从而绕过检测。
  
  之前 anlmdn+loudnorm 方案失败就是因为太"干净"了——指纹基本没变，
  Suno 照认不误。关键不是"洗得干净"，是要"洗得认不出"。

处理链：
  highpass/lowpass → superequalizer (18段 EQ 塑形) → acompressor (压缩)
  → aphaser (相位偏移，混淆指纹) → loudnorm (响度归一化)
  → 可选 rubberband (重编码+谱涂抹)

用法:
  # 单文件处理
  python ffmpeg_spectral_obfuscator.py input.mp3 -o output.mp3 -p medium

  # 批量处理目录
  python ffmpeg_spectral_obfuscator.py /path/to/input_dir -o /path/to/output_dir

  # 显示所有预设参数
  python ffmpeg_spectral_obfuscator.py --show-presets

作者: 翻唱仔 🔥
版本: 1.0.0
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ============================================================
#  ⚙️  配置区 — 你可以在这里调整所有默认参数
# ============================================================

# 预设定义 (按强度从轻到重)
PRESETS: Dict[str, Dict] = {
    # ─── 轻度混淆 ───
    # 适合: 第一次测试，想看看最小改动能不能过
    # 效果: 轻微暖声化，动态平滑化
    "light": {
        "label": "轻度混淆 🌤️",
        "description": "最小改动，EQ轻微塑形 + 轻压缩",
        "highpass_freq": 50,       # 低切频率 (Hz)
        "lowpass_freq": 16000,     # 高切频率 (Hz)
        "eq": {                    # superequalizer 18段增益 (0-20, 1=原始)
            "1b": 1.0,   # 65Hz    - 略减
            "2b": 1.0,   # 92Hz
            "3b": 1.2,   # 131Hz   - 低频温暖感
            "4b": 1.3,   # 185Hz   - 暖声化
            "5b": 1.3,   # 262Hz   - 中低频提升
            "6b": 1.2,   # 370Hz
            "7b": 1.0,   # 523Hz
            "8b": 1.0,   # 740Hz
            "9b": 0.9,   # 1047Hz  - 轻微削减
            "10b": 0.9,  # 1480Hz
            "11b": 0.8,  # 2093Hz  - 削减刺耳区
            "12b": 0.8,  # 2960Hz
            "13b": 0.9,  # 4186Hz
            "14b": 0.9,  # 5920Hz
            "15b": 1.0,  # 8372Hz
            "16b": 0.9,  # 11840Hz - 高频柔化
            "17b": 0.8,  # 16744Hz
            "18b": 0.7,  # 20000Hz - 极高频衰减
        },
        "compressor": {
            "threshold": 0.125,    # -18dB
            "ratio": 3.0,          # 3:1
            "attack": 20,          # ms
            "release": 250,        # ms
            "makeup": 1.5,         # 补偿增益
            "knee": 2.83,          # 软拐点
            "detection": "rms",    # RMS 检测
        },
        "phaser": None,            # 不用相位器
        "rubberband_resample": False,  # 不用 rubberband
    },

    # ─── 中度混淆 ───
    # 适合: 大多数情况，推荐起始点
    # 效果: 明显的频谱重塑 + 动态压缩 + 轻微相位偏移
    "medium": {
        "label": "中度混淆 🌤️🌤️",
        "description": "推荐起始点 — EQ塑形 + 压缩 + 相位偏移",
        "highpass_freq": 40,
        "lowpass_freq": 15000,
        "eq": {
            "1b": 0.6,   # 65Hz    - 明显削减次低频
            "2b": 0.8,   # 92Hz
            "3b": 1.4,   # 131Hz   - 低频温暖感提升
            "4b": 1.5,   # 185Hz   - 暖声化 ★
            "5b": 1.4,   # 262Hz   - 中低频饱满
            "6b": 1.2,   # 370Hz
            "7b": 1.0,   # 523Hz
            "8b": 0.9,   # 740Hz
            "9b": 0.8,   # 1047Hz  - 削减中频 ★
            "10b": 0.7,  # 1480Hz  - 削减刺耳区
            "11b": 0.6,  # 2093Hz  - 削减齿音区 ★
            "12b": 0.7,  # 2960Hz
            "13b": 0.8,  # 4186Hz
            "14b": 0.9,  # 5920Hz
            "15b": 0.9,  # 8372Hz
            "16b": 0.8,  # 11840Hz - 高频柔化
            "17b": 0.7,  # 16744Hz
            "18b": 0.5,  # 20000Hz - 极高频衰减
        },
        "compressor": {
            "threshold": 0.1,      # -20dB
            "ratio": 4.0,          # 4:1
            "attack": 15,          # ms (更快)
            "release": 200,        # ms
            "makeup": 1.8,
            "knee": 3.0,
            "detection": "rms",
        },
        "phaser": {
            "in_gain": 0.5,
            "out_gain": 0.8,
            "delay": 2.0,          # ms
            "decay": 0.3,
            "speed": 0.3,          # 缓慢调制
            "type": "triangular",
        },
        "rubberband_resample": False,
    },

    # ─── 重度混淆 ───
    # 适合: 中度不过的时候; 或者对流行歌曲（Suno 最容易认出）
    # 效果: 强力频谱重塑 + 重压缩 + 相位漂移 + rubberband重采样
    "heavy": {
        "label": "重度混淆 🌪️",
        "description": "强力处理 — 大幅EQ + 重压缩 + 相位 + rubberband谱涂抹",
        "highpass_freq": 60,
        "lowpass_freq": 14000,
        "eq": {
            "1b": 0.3,   # 65Hz    - 大幅削减次低频
            "2b": 0.5,   # 92Hz
            "3b": 1.6,   # 131Hz   - 强力低频提升
            "4b": 1.8,   # 185Hz   - 强力暖声化 ★
            "5b": 1.6,   # 262Hz   - 中低频饱满
            "6b": 1.3,   # 370Hz
            "7b": 1.0,   # 523Hz
            "8b": 0.8,   # 740Hz
            "9b": 0.6,   # 1047Hz  - 削减中频
            "10b": 0.5,  # 1480Hz  - 削减刺耳区 ★
            "11b": 0.4,  # 2093Hz  - 大幅削减齿音 ★
            "12b": 0.6,  # 2960Hz
            "13b": 0.7,  # 4186Hz
            "14b": 0.8,  # 5920Hz
            "15b": 0.8,  # 8372Hz
            "16b": 0.6,  # 11840Hz - 高频柔化
            "17b": 0.5,  # 16744Hz
            "18b": 0.3,  # 20000Hz - 极高频衰减
        },
        "compressor": {
            "threshold": 0.063,    # -24dB (更敏感)
            "ratio": 6.0,          # 6:1 (更强压缩)
            "attack": 10,          # ms (快攻击)
            "release": 150,        # ms (快释放)
            "makeup": 2.0,
            "knee": 3.5,
            "detection": "rms",
        },
        "phaser": {
            "in_gain": 0.6,
            "out_gain": 0.85,
            "delay": 2.5,          # ms
            "decay": 0.4,
            "speed": 0.4,          # 略快调制
            "type": "triangular",
        },
        "rubberband_resample": True,   # 启用 rubberband 重编码混淆
    },
}

# ─── A/B 测试特殊预设 ───
# 这些是实验性参数组合，用于快速试错
AB_TEST_PRESETS: Dict[str, Dict] = {
    "ab-bright": {
        "label": "A/B-亮声",
        "description": "提亮高频，削减中低频 — 另一种频谱形状",
        "base": "medium",
        "override_eq": {
            "3b": 0.8, "4b": 0.7, "5b": 0.7,
            "11b": 1.0, "12b": 1.2, "13b": 1.3,
            "16b": 1.2, "17b": 1.0,
        }
    },
    "ab-bass-heavy": {
        "label": "A/B-重低音",
        "description": "大幅提升低频，中高频微调",
        "base": "medium",
        "override_eq": {
            "1b": 1.5, "2b": 1.8, "3b": 2.0, "4b": 1.8,
            "9b": 0.7, "10b": 0.6, "11b": 0.5,
        }
    },
    "ab-ultra-compress": {
        "label": "A/B-极限压缩",
        "description": "超强压缩，EQ适中 — 改变动态指纹",
        "base": "medium",
        "override_compressor": {
            "threshold": 0.04,  # -28dB
            "ratio": 10.0,
            "attack": 5,
            "release": 100,
            "makeup": 2.5,
        }
    },
}

# 默认输出目录（相对于输入目录）
DEFAULT_OUTPUT_SUBDIR = "_obfuscated"

# FFmpeg 二进制路径
FFMPEG = "ffmpeg"


# ============================================================
#  🔧  核心逻辑
# ============================================================

def build_eq_params(eq_config: Dict) -> str:
    """将 EQ 配置拼成 superequalizer filter 参数字符串"""
    params = []
    for key, val in eq_config.items():
        params.append(f"{key}={val:.1f}")
    return ":".join(params)


def build_compressor_params(comp_config: Dict) -> str:
    """将压缩器配置拼成 acompressor filter 参数字符串"""
    params = [f"threshold={comp_config['threshold']}",
              f"ratio={comp_config['ratio']}",
              f"attack={comp_config['attack']}",
              f"release={comp_config['release']}",
              f"makeup={comp_config['makeup']}",
              f"knee={comp_config['knee']}",
              f"detection={comp_config['detection']}"]
    return ":".join(params)


def build_phaser_params(phaser_config: Optional[Dict]) -> Optional[str]:
    """将相位器配置拼成 aphaser filter 参数字符串"""
    if phaser_config is None:
        return None
    params = [f"in_gain={phaser_config['in_gain']}",
              f"out_gain={phaser_config['out_gain']}",
              f"delay={phaser_config['delay']}",
              f"decay={phaser_config['decay']}",
              f"speed={phaser_config['speed']}",
              f"type={phaser_config['type']}"]
    return ":".join(params)


def build_filter_chain(preset_config: Dict, input_file: str = "") -> str:
    """
    构建 ffmpeg filter chain 字符串

    处理顺序:
    1. anlmdn (轻度降噪，可选)
    2. highpass (低切)
    3. lowpass (高切)
    4. superequalizer (18段 EQ 塑形) ★核心
    5. acompressor (动态压缩) ★核心
    6. aphaser (相位偏移，混淆指纹)
    7. rubberband (重编码混淆，可选)
    8. loudnorm (EBU R128 响度归一化)
    """
    filters = []

    # Step 1: Highpass (低切)
    hp_freq = preset_config["highpass_freq"]
    filters.append(f"highpass=f={hp_freq}")

    # Step 2: Lowpass (高切)
    lp_freq = preset_config["lowpass_freq"]
    filters.append(f"lowpass=f={lp_freq}")

    # Step 3: EQ 塑形 ★
    eq_str = build_eq_params(preset_config["eq"])
    filters.append(f"superequalizer={eq_str}")

    # Step 4: 动态压缩 ★
    comp_str = build_compressor_params(preset_config["compressor"])
    filters.append(f"acompressor={comp_str}")

    # Step 5: 相位偏移
    phaser_str = build_phaser_params(preset_config.get("phaser"))
    if phaser_str:
        filters.append(f"aphaser={phaser_str}")

    # Step 6: rubberband 重编码混淆
    if preset_config.get("rubberband_resample"):
        # tempo=1.0 表示不改速度，但 rubberband 的处理本身会引入谱涂抹
        # 这改变了频谱的精细结构，有助于混淆指纹
        filters.append("rubberband=tempo=1.0")

    # Step 7: 响度归一化
    filters.append("loudnorm=I=-16:LRA=11:TP=-1.5")

    return ",".join(filters)


def process_file(
    input_path: str,
    output_path: str,
    preset_name: str,
    preset_config: Dict,
    quiet: bool = False,
    keep_wav: bool = False,
) -> bool:
    """
    处理单个音频文件

    Args:
        input_path: 输入文件路径
        output_path: 输出文件路径
        preset_name: 预设名称 (用于日志)
        preset_config: 预设配置字典
        quiet: 静默模式
        keep_wav: 保留中间 WAV (调试用)

    Returns:
        bool: 是否成功
    """
    input_path = str(input_path)
    output_path = str(output_path)

    # 构建 filter chain
    filter_str = build_filter_chain(preset_config, input_path)

    if not quiet:
        print(f"  🔧 滤镜链: {filter_str[:120]}...")
        print(f"  🔧 滤镜链全长: {len(filter_str)} 字符")

    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    # 直接输出 MP3 320kbps
    cmd = [
        FFMPEG, "-y",
        "-i", input_path,
        "-af", filter_str,
        "-acodec", "libmp3lame",
        "-b:a", "320k",
        "-ar", "44100",      # 统一采样率（指纹混淆的一部分）
        "-ac", "2",          # 统一立体声
        "-id3v2_version", "3",
        "-write_id3v1", "1",
        output_path,
    ]

    if quiet:
        cmd.extend(["-loglevel", "error"])
    else:
        cmd.extend(["-loglevel", "warning"])

    try:
        start = time.time()
        result = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=600)
        elapsed = time.time() - start

        if result.returncode != 0:
            error_msg = result.stderr or result.stdout or "未知错误"
            print(f"  ❌ FFmpeg 失败 (rc={result.returncode}): {error_msg[:300]}")
            return False

        output_size = Path(output_path).stat().st_size
        size_mb = output_size / (1024 * 1024)

        if not quiet:
            print(f"  ✅ 完成 ({elapsed:.1f}s) → {output_path} ({size_mb:.1f} MB)")

        # 调试用: 如需保留 WAV 中间文件
        if keep_wav:
            wav_path = output_path.rsplit(".", 1)[0] + "_debug.wav"
            cmd_wav = [
                FFMPEG, "-y", "-i", input_path,
                "-af", filter_str,
                "-acodec", "pcm_s16le",
                "-ar", "44100",
                "-ac", "2",
                wav_path,
            ]
            subprocess.run(cmd_wav, capture_output=True, timeout=600)
            if not quiet:
                print(f"  🐛 调试 WAV 已保存: {wav_path}")

        return True

    except subprocess.TimeoutExpired:
        print(f"  ❌ 超时 (600s) — 文件可能太长")
        return False
    except FileNotFoundError:
        msg = " ❌ 找不到 ffmpeg — 请确认已安装: https://ffmpeg.org/download.html"
        if sys.platform == "linux":
            msg += "\n   Linux: sudo apt install ffmpeg"
        print(msg)
        return False
    except Exception as e:
        print(f"  ❌ 异常: {e}")
        return False


def apply_overrides(base_preset: Dict, overrides: Dict) -> Dict:
    """在基础预设上应用覆写"""
    result = dict(base_preset)

    if "override_eq" in overrides:
        result["eq"] = dict(base_preset["eq"])
        result["eq"].update(overrides["override_eq"])

    if "override_compressor" in overrides:
        result["compressor"] = dict(base_preset["compressor"])
        result["compressor"].update(overrides["override_compressor"])

    return result


def get_all_presets() -> Dict[str, Dict]:
    """获取所有可用预设（包括 A/B 测试）"""
    all_presets = {}

    # 基础预设
    for name, config in PRESETS.items():
        all_presets[name] = config

    # A/B 测试预设
    for name, config in AB_TEST_PRESETS.items():
        base_name = config.get("base", "medium")
        base_config = PRESETS.get(base_name, PRESETS["medium"])
        merged = apply_overrides(base_config, config)
        merged["label"] = config.get("label", name)
        merged["description"] = config.get("description", "")
        all_presets[name] = merged

    return all_presets


def print_presets():
    """打印所有预设参数详情"""
    all_presets = get_all_presets()

    print("=" * 72)
    print("🔊 FFmpeg 频谱指纹混淆器 — 预设方案一览")
    print("=" * 72)

    for name, config in all_presets.items():
        label = config.get("label", name)
        description = config.get("description", "")
        print(f"\n{'─' * 72}")
        print(f"  📛 {name:20s}  {label}")
        print(f"  📝 说明: {description}")
        print(f"  {'─' * 68}")

        # 频率滤波
        print(f"  📊 频率滤波:")
        print(f"      低切: {config['highpass_freq']}Hz")
        print(f"      高切: {config['lowpass_freq']}Hz")

        # EQ
        eq = config.get("eq", {})
        print(f"  🎛️  EQ 曲线 (superequalizer 18段):")
        eq_bands = [
            ("1b", "65Hz"), ("2b", "92Hz"), ("3b", "131Hz"),
            ("4b", "185Hz"), ("5b", "262Hz"), ("6b", "370Hz"),
            ("7b", "523Hz"), ("8b", "740Hz"), ("9b", "1047Hz"),
            ("10b", "1480Hz"), ("11b", "2093Hz"), ("12b", "2960Hz"),
            ("13b", "4186Hz"), ("14b", "5920Hz"), ("15b", "8372Hz"),
            ("16b", "11840Hz"), ("17b", "16744Hz"), ("18b", "20000Hz"),
        ]
        line = "      "
        for key, label_str in eq_bands:
            val = eq.get(key, 1.0)
            line += f"{label_str:>6s}:{val:.1f}  "
            if key in ("6b", "12b"):
                print(line)
                line = "      "
        if line.strip():
            print(line)

        # 压缩器
        comp = config.get("compressor", {})
        print(f"  📈 压缩器:")
        for k, v in comp.items():
            print(f"      {k}: {v}")

        # 相位器
        phaser = config.get("phaser")
        if phaser:
            print(f"  🌊 相位器: delay={phaser['delay']}ms  "
                  f"speed={phaser['speed']}  "
                  f"decay={phaser['decay']}")
        else:
            print(f"  🌊 相位器: 关闭")

        # Rubberband
        rb = config.get("rubberband_resample", False)
        print(f"  🔄 Rubberband 重编码混淆: {'✅ 开启' if rb else '❌ 关闭'}")

    print(f"\n{'=' * 72}")
    print(f"💡 建议: 先用 medium 预设测试，Suno 不过再试 heavy")
    print(f"    A/B 测试预设 (ab-*) 用于快速对比不同参数组合\n")


def discover_mp3_files(input_path: str) -> List[Path]:
    """发现指定路径下的所有 MP3 文件"""
    path = Path(input_path)

    if path.is_file():
        if path.suffix.lower() in (".mp3", ".wav", ".flac", ".m4a", ".ogg", ".wma"):
            return [path]
        else:
            print(f"⚠️  不支持的文件格式: {path.suffix}")
            return []

    elif path.is_dir():
        extensions = ("*.mp3", "*.wav", "*.flac", "*.m4a", "*.ogg")
        files = []
        for ext in extensions:
            files.extend(sorted(path.glob(ext)))
            files.extend(sorted(path.glob(ext.upper())))
        # 去重
        seen = set()
        unique = []
        for f in files:
            if f not in seen:
                seen.add(f)
                unique.append(f)
        return unique

    else:
        print(f"❌ 路径不存在: {input_path}")
        return []


def process_batch(
    input_path: str,
    output_dir: str = None,
    preset_name: str = "medium",
    all_presets_mode: bool = False,
    quiet: bool = False,
    keep_wav: bool = False,
) -> int:
    """
    批量处理文件

    Args:
        input_path: 输入文件或目录
        output_dir: 输出目录 (None = 自动)
        preset_name: 预设名称
        all_presets_mode: 对所有文件应用所有预设
        quiet: 静默模式
        keep_wav: 保留调试 WAV

    Returns:
        int: 成功处理的文件数
    """
    files = discover_mp3_files(input_path)
    if not files:
        print("❌ 没有找到可处理的音频文件")
        return 0

    # 确定输出目录
    input_path_obj = Path(input_path)
    single_file_output_path = None  # 当 -o 指定了具体文件路径时使用

    if output_dir is None:
        if input_path_obj.is_file():
            output_dir = str(input_path_obj.parent / DEFAULT_OUTPUT_SUBDIR)
        else:
            output_dir = str(input_path_obj / DEFAULT_OUTPUT_SUBDIR)
    elif len(files) == 1 and Path(output_dir).suffix.lower() in (".mp3", ".wav", ".flac", ".m4a"):
        # 用户 `-o output.mp3` 且输入是单文件 → 直接输出到该文件
        single_file_output_path = output_dir
        output_dir = str(Path(output_dir).parent)
    else:
        # -o 指定了目录
        pass

    os.makedirs(output_dir, exist_ok=True)

    # 准备预设列表
    if all_presets_mode:
        presets_to_run = get_all_presets()
        if single_file_output_path:
            # all模式下不能有单文件输出路径
            print("⚠️  --all 模式不支持单文件输出，将使用目录模式")
            single_file_output_path = None
    else:
        presets_to_run = {preset_name: get_all_presets().get(preset_name)}
        if presets_to_run[preset_name] is None:
            print(f"❌ 未知预设: {preset_name}")
            print(f"   可用预设: {', '.join(get_all_presets().keys())}")
            return 0

    total_operations = len(files) * len(presets_to_run)
    print(f"\n📂 找到 {len(files)} 个文件")
    print(f"🎯 预设: {', '.join(presets_to_run.keys())}")
    print(f"📦 总计操作: {total_operations}")
    out_display = single_file_output_path or output_dir
    print(f"📁 输出: {out_display}\n")

    success_count = 0
    operation_num = 0

    for file_path in files:
        stem = file_path.stem

        for pname, pconfig in presets_to_run.items():
            operation_num += 1

            if single_file_output_path and len(presets_to_run) == 1:
                # 单文件+单预设 → 使用用户指定的输出路径
                out_path = single_file_output_path
            else:
                # 输出文件名: 原文件名_预设名_obf.mp3
                out_filename = f"{stem}_{pname}_obf.mp3"
                out_path = os.path.join(output_dir, out_filename)

            if not quiet:
                print(f"[{operation_num}/{total_operations}] 🎵 {file_path.name}")
                label = pconfig.get("label", pname)
                print(f"   └─ 预设: {label}")

            ok = process_file(
                str(file_path),
                out_path,
                pname,
                pconfig,
                quiet=quiet,
                keep_wav=keep_wav,
            )

            if ok:
                success_count += 1

            # 文件之间留空行
            if not quiet:
                print()

    print(f"\n{'=' * 50}")
    print(f"📊 统计: {success_count}/{total_operations} 操作成功")
    print(f"📁 输出目录: {output_dir}")

    if success_count > 0 and not all_presets_mode:
        label = presets_to_run.get(preset_name, {}).get("label", preset_name)
        print(f"\n💡 下一步: 把输出文件丢进 Suno 测试!")
        print(f"   如果 '{label}' 不通过，试试:")
        print(f"   - heavy 预设 (更激进)")
        print(f"   - 用 --all 对所有文件用全部预设 (A/B 测试)")
        print(f"   - 用 python {__file__} --show-presets 查看参数后手动调\n")

    return success_count


def main():
    parser = argparse.ArgumentParser(
        description="🔊 FFmpeg 频谱指纹混淆器 — AudioCleaner Pro 替代方案",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 单文件处理 (medium 预设)
  python %(prog)s song.mp3 -o song_obf.mp3

  # 批量处理目录 (heavy 预设)
  python %(prog)s D:\songs\ -p heavy

  # A/B 测试: 对所有文件用全部预设
  python %(prog)s input.mp3 --all

  # 显示预设参数
  python %(prog)s --show-presets

  # 使用 A/B 测试专用预设
  python %(prog)s input.mp3 -p ab-bright
        """,
    )

    parser.add_argument("input", nargs="?", help="输入文件或目录")
    parser.add_argument("-o", "--output", help="输出文件或目录")
    parser.add_argument("-p", "--preset", default="medium",
                        choices=list(get_all_presets().keys()),
                        help=f"预设方案 (默认: medium)")
    parser.add_argument("--all", "--all-presets", dest="all_presets",
                        action="store_true",
                        help="对所有文件应用所有预设 (A/B 测试)")
    parser.add_argument("--show-presets", action="store_true",
                        help="显示所有预设的详细参数")
    parser.add_argument("--quiet", "-q", action="store_true",
                        help="静默模式")
    parser.add_argument("--keep-wav", action="store_true",
                        help="保留调试用 WAV 文件")
    parser.add_argument("--version", action="version",
                        version="FFmpeg 频谱指纹混淆器 v1.0.0")

    args = parser.parse_args()

    # 显示预设
    if args.show_presets:
        print_presets()
        return

    # 没有输入参数
    if not args.input:
        parser.print_help()
        print('\n💡 试试: python %s --show-presets' % sys.argv[0])
        return

    # 处理
    process_batch(
        input_path=args.input,
        output_dir=args.output,
        preset_name=args.preset,
        all_presets_mode=args.all_presets,
        quiet=args.quiet,
        keep_wav=args.keep_wav,
    )


if __name__ == "__main__":
    main()
