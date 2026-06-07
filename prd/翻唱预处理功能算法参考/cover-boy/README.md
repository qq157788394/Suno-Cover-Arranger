# 🎤 翻唱仔 — AI翻唱预处理流水线

## 核心流程

```
原始歌曲 → 频谱指纹混淆 → [可选0.4x变速] → 上传Suno翻唱
                                                    ↓
                     去AI标记 + MIDI转录 ← Suno翻唱结果
```

## 快速使用

```bash
# 安装依赖
pip install -r requirements.txt

# 完整翻唱预处理
python3 main.py 歌曲.mp3 -o ./output

# 跳过0.4x变速
python3 main.py 歌曲.mp3 -o ./output --skip-tempo

# 指定混淆强度
python3 main.py 歌曲.mp3 -o ./output --preset heavy

# 批量处理目录
python3 main.py ./input_dir/ -o ./output/ --batch

# 处理 Suno 翻唱结果（去标记+MIDI）
python3 main.py --suno-mp3 suno_output.mp3 -o ./output

# WebUI
python3 webui.py --port 7860
# → 访问 http://localhost:7860
```

## 流水线阶段

| 阶段 | 功能 | 必须 |
|:---|:---|---:|
| Stage 2 | 频谱指纹混淆 (过Suno版权检测) | ✅ |
| Stage 3 | 0.4x保音调变速 | `--skip-tempo` 可跳过 |
| Stage 4 | 去AI标记（剥离Suno元数据） | ✅ (处理翻唱结果时) |
| Stage 5 | multi-track MIDI转录 | ✅ (处理翻唱结果时) |

## 输出文件

| 文件 | 说明 |
|:---|:---|
| `*_obf.mp3` | 🔑 混淆后音频（上传Suno翻唱用） |
| `*_0.4x.mp3` | 变速后音频（可选） |
| `*_clean.mp3` | 去AI标记（翻唱处理结果） |
| `*.mid` | MIDI文件 |

## 依赖

```bash
pip install torch torchaudio librosa soundfile numpy scipy midiutil basic-pitch gradio
# 系统: sudo apt install ffmpeg
```

GPU推荐（Demucs/BS-ROFO分离用），非必须。

## 验证

频谱混淆 medium 预设 → Suno SRC检测通过 (2026-05-30 验证)
