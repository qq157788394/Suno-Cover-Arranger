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

- 固定绑定生僻高位端口 `18741`（仅避撞，非安全手段），**不再做端口扫描**。
- 端口由 Tauri 壳通过 `LOCAL_ENGINE_PORT` 环境变量传入，Rust 侧（`ENGINE_PORT`）、
  前端（`LOCAL_ENGINE_PORT`）与本文档三处保持一致；改端口须同步这三处。
- **占用即失败**：`18741` 被占用时引擎直接起不来，不会自动上扫空闲端口，也不会写入 `.local-engine.port`。
  排查：先释放该端口（或统一改三处端口常量）再启动。

## 接口

- `GET /api/health` → `{"status":"ok","model_ready":true,"layers":{...}}`
- `POST /api/analyze`（multipart 文件字段 `file`，**请求体上限 50MB**，超限返回 413）→ result JSON：

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

## 安全边界

- 引擎仅绑定 `127.0.0.1`，音频不出本机。
- CORS / Origin 仅放行：本项目 gh-pages 固定子域 `https://qq157788394.github.io` 与本地开发端口
  `http://localhost:8000` / `http://127.0.0.1:8000`；其余源一律拒绝（403）。
- 真正的隔离边界是本机回环绑定；Rust 代理（curl）调用时固定带 gh-pages Origin 头。
