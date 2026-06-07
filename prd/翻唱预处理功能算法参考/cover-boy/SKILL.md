---
name: cover-boy
description: "🎤 AI翻唱预处理流水线 — 频谱指纹混淆 + 0.4x变速 + 去AI标记 + MIDI转录。CUDA GPU加速（5秒/首），支持WebUI操作。"
version: 2.1.0
tags:
  - ai-cover
  - suno-bypass
  - spectral-obfuscation
  - audio-preprocessing
  - cuda-accelerated
  - ffmpeg
category: media/audio
author: 风灯 (Feng Deng)
license: MIT
platforms:
  - windows
  - linux
  - macos
runtime: python
entry: |
  CLI:   python main.py <input.mp3> -o <output_dir>
  WebUI: python webui.py --port 7860
dependencies:
  - python>=3.8
  - ffmpeg>=4.4
  - torch (optional, for CUDA acceleration)
  - gradio
  - numpy
  - scipy
  - soundfile
---

# 🎤 Cover Boy — AI翻唱预处理流水线

## 概述

Cover Boy 是一个 AI 翻唱预处理工具，专为绕过 Suno 等 AI 音乐生成平台的检测而设计。它通过对音频进行频谱指纹混淆处理，使得生成的翻唱作品在保持音质的同时，难以被 AI 检测器识别为 AI 生成。

## 核心流程

```
源音频 → [Stage 1: 格式标准化]
        → [Stage 2: 频谱指纹混淆]  ← 核心步骤
        → [Stage 3: 可选 0.4x 变速]
        → [上传 Suno 进行 AI 翻唱]
        → [Stage 4: 去 AI 标记]
        → [Stage 5: MIDI 转录]
```

## 引擎架构

### 引擎 1: CUDA GPU 加速（默认，推荐）
| 项目 | 说明 |
|------|------|
| 原理 | PyTorch + CUDA FFT 频域滤波 |
| 速度 | **~5 秒**（RTX 3080，192 秒歌曲） |
| 回退链 | CUDA → CPU PyTorch → FFmpeg |

### 引擎 2: FFmpeg CPU（回退）
| 项目 | 说明 |
|------|------|
| 原理 | superequalizer + acompressor + aphaser |
| 速度 | **~3 分钟**（纯 CPU 运算） |

## 快速开始

### 安装依赖
```bash
pip install torch torchaudio gradio numpy scipy soundfile
# 确保 FFmpeg 已安装 (ffmpeg -version)
```

### CLI 使用
```bash
# 完整流程（自动选择 CUDA）
python main.py 歌曲.mp3 -o ./output

# 跳过 0.4x 变速
python main.py 歌曲.mp3 -o ./output --skip-tempo

# 指定混淆强度
python main.py 歌曲.mp3 -o ./output --preset heavy

# 批量处理目录
python main.py ./input_dir/ -o ./output/ --batch

# 处理 Suno 翻唱结果（去标记 + MIDI）
python main.py --suno-mp3 suno_output.mp3 -o ./output
```

### WebUI
```bash
python webui.py --port 7860
# → 浏览器打开 http://localhost:7860
```

## 输出文件

| 文件 | 说明 |
|------|------|
| `*_obf.mp3` | 🔑 混淆后音频（上传 Suno 翻唱用） |
| `*_0.4x.mp3` | 变速后音频（可选） |
| `*_clean.mp3` | 去 AI 标记（翻唱处理结果） |
| `*.mid` | MIDI 文件 |

## 项目结构

```
cover-boy/
├── main.py                  # CLI 入口
├── webui.py                 # Gradio WebUI
├── requirements.txt         # 依赖清单
├── SKILL.md                 # 本文档
└── scripts/
    ├── cuda_obfuscator.py           # CUDA 加速版混淆器
    ├── ffmpeg_spectral_obfuscator.py # FFmpeg 版混淆器
    ├── stage45_combined.py          # 去标记 + MIDI 合并脚本
    ├── stage4_strip_ai_tags.py      # 去 AI 标记（独立）
    ├── stage5_midi_transcribe.py    # MIDI 转录（独立）
    └── stage6_score_gen.py          # 制谱生成
```

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 2.1.0 | 2026-05-31 | CUDA GPU 加速 + Windows 兼容 |
| 2.0.0 | 2026-05-31 | 独立项目代码打包 |
| 1.0.0 | 2026-05 | 初始版本 |
