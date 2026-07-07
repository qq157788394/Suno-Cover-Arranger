"""大师扒谱本地 Python 引擎 - FastAPI 服务。

绑定 127.0.0.1（仅本机可访问），默认生僻高位端口；仅轻量 Origin 检查。
"""
from __future__ import annotations

import os
import socket
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from analyze import analyze_all

HOST = "127.0.0.1"
DEFAULT_PORT = int(os.getenv("LOCAL_ENGINE_PORT", "18741"))
PORT_FILE = Path(".local-engine.port")

app = FastAPI(title="Suno Local Engine")

# 跨域：放行本机 Origin（localhost / 127.0.0.1，任意端口）与本项目 gh-pages（*.github.io）。
# 既是 CORS 头（让浏览器跨端口/跨域调用可读到响应），也是安全边界（其他源不回 CORS 头）。
# 注：生产应把 *.github.io 收紧为具体子域（如 your-user.github.io）。
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://((localhost|127\.0\.0\.1)(:\d+)?|[\w-]+\.github\.io)$",
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


def _origin_ok(origin: str | None) -> bool:
    # 非浏览器调用（无 Origin）放行；浏览器调用须来自本机或本项目 gh-pages
    if not origin:
        return True
    return (
        origin.startswith("http://localhost:")
        or origin.startswith("http://127.0.0.1:")
        or (origin.startswith("https://") and ".github.io" in origin)
    )


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze(request: Request, file: UploadFile = File(...)) -> JSONResponse:
    if not _origin_ok(request.headers.get("origin")):
        return JSONResponse(status_code=403, content={"error": "origin not allowed"})

    import tempfile

    suffix = Path(file.filename or "audio.mp3").suffix or ".mp3"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        result = analyze_all(tmp_path)
        return JSONResponse(content=result)
    finally:
        os.unlink(tmp_path)


def find_free_port(start: int) -> int:
    for port in range(start, start + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex((HOST, port)) != 0:
                return port
    raise RuntimeError("no free port found in range")


def run() -> None:
    import uvicorn

    port = find_free_port(DEFAULT_PORT)
    PORT_FILE.write_text(str(port))
    print(f"Local engine on http://{HOST}:{port}  (port written to {PORT_FILE})")
    uvicorn.run(app, host=HOST, port=port)


if __name__ == "__main__":
    run()
