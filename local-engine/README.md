# 大师扒谱 · 本地 Python 引擎

浏览器内「大师看和弦」的离线增强引擎。用户在本机一键拉起 Python 服务，
浏览器经 `localhost` 调用，音频**不出本机**，拿到 SOTA 级和弦 / 调性 / BPM / 节奏 / 级数。

## 组件

| 能力 | 库 | 依赖 |
|------|----|------|
| 和弦转写 | lv-chordia (PyTorch) | 必装 |
| 调性 / BPM / 节奏网格 | madmom (TensorFlow) | 可选（缺则降级只出和弦） |
| 罗马级数 | chord-romanizer | 可选（需 key） |
| HTTP 服务 | FastAPI + uvicorn | 必装 |

音频全程不出本机；仅绑定 `127.0.0.1`，仅允许本机 Origin 调用。

## 安装与启动（本机）

需 Python 3.10–3.12（**madmom 在 3.13 无法编译/无 TF wheel**，pyproject 已锁 `<3.13`），
推荐 [uv](https://docs.astral.sh/uv/)——它会自动配兼容解释器，别用系统 3.13 直接 `pip install`。

```bash
cd local-engine
uv sync                 # 按 pyproject.toml 装全部依赖（含 madmom / chord-romanizer）
uv run python main.py   # 启动服务
```

仅装核心（不含 madmom / chord-romanizer，只出和弦）：

```bash
uv venv && uv pip install lv-chordia fastapi "uvicorn[standard]" python-multipart
uv run python main.py
```

Windows 用户需额外安装 [ffmpeg](https://ffmpeg.org/) 并加入 PATH（librosa 解码 mp3 需要）。

## 端口

- 默认绑定生僻高位端口 `18741`（仅避撞，非安全手段）。
- 若被占用，自动向上扫描首个空闲端口，并写入 `.local-engine.port`。
- 前端启动前先读该文件，或直接探测默认端口 `/api/health`。

## 接口

- `GET /api/health` → `{"status":"ok"}`
- `POST /api/analyze`（multipart 文件字段 `file`）→ result JSON：

```json
{
  "chords": [{"start_time": 0.0, "end_time": 2.5, "chord": "C:maj"}],
  "key": "C",
  "bpm": 152,
  "rhythm": {"beats": [...], "downbeats": [...], "beats_per_bar": 4, "bars": 64},
  "roman": [{"start_time": 0.0, "end_time": 2.5, "roman": "I"}],
  "warnings": []
}
```

`chord` 为 JAMS 格式（如 `C:maj7`、`Am7`）；前端展示时做轻量规范化（去 `:`、`min`→`m`）。
