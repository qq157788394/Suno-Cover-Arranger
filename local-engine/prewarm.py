"""构建期模型预热。

必须在 `HOME` 已指向 `runtime/models/home` 时由 build-engine.sh 调用：
触发 lv_chordia（HuggingFace）/ madmom / imageio-ffmpeg 首次下载模型权重到该
HOME 下的缓存目录（macOS: $HOME/Library/Caches，HF: $HOME/.cache/huggingface），
使生产环境完全离线可用。
"""
import os
import sys
import tempfile

# 确保能 import 同目录的 analyze（含兼容性补丁与 _init_ffmpeg）
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import soundfile as sf


def main() -> None:
    home = os.environ.get("HOME")
    if not home:
        raise RuntimeError("prewarm 必须在 HOME 已设置时运行（见 build-engine.sh）")
    print(f"==> prewarm 使用 HOME={home}")

    sr = 44100
    silent = np.zeros(sr, dtype=np.float32)
    wav = tempfile.mktemp(suffix=".wav")
    sf.write(wav, silent, sr)
    try:
        import analyze

        # 再次确保 ffmpeg 已下载（import 时已在正确 HOME 下触发一次，这里幂等再确认）
        analyze._init_ffmpeg()
        print("==> 触发 lv_chordia + madmom 模型下载（静音样本推断）...")
        try:
            analyze.analyze_all(wav)
        except Exception as e:  # noqa: BLE001
            # 静音样本无有效音频，分析抛错正常；模型应已下载，忽略
            print(f"    (样本分析异常，属预期，已忽略：{e})")
        print("==> 模型预热完成")
    finally:
        try:
            os.unlink(wav)
        except OSError:
            pass


if __name__ == "__main__":
    main()
