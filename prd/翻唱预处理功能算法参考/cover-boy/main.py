#!/usr/bin/env python3
"""🎤 AI翻唱预处理流水线

核心流程:
  Stage 2: 频谱指纹混淆（过Suno版权检测）
  Stage 3: [可选] 0.4x保音调变速
  Stage 4: 去AI标记（翻唱回来后）
  Stage 5: MIDI转录

用法:
  python main.py 歌曲.mp3 -o ./output                  # 完整流程
  python main.py 歌曲.mp3 -o ./output --skip-tempo      # 跳过变速
  python main.py 歌曲.mp3 -o ./output --preset heavy    # 强混淆
  python main.py ./input_dir/ -o ./output/ --batch      # 批量
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
import zipfile
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ── 常量 ──
FFMPEG = "ffmpeg"
FFPROBE = "ffprobe"
PYTHON = sys.executable  # Windows兼容: python3 → python

# 脚本路径 — 使用本地目录（Windows兼容）
_BASE = Path(__file__).parent
SCRIPTS_DIR = _BASE / "scripts"

OBF_SCRIPT = SCRIPTS_DIR / "ffmpeg_spectral_obfuscator.py"
STAGE45_SCRIPT = SCRIPTS_DIR / "stage45_combined.py"
STRIP_SCRIPT = SCRIPTS_DIR / "stage4_strip_ai_tags.py"


class CoverBoy:
    """🎤 翻唱仔 — AI翻唱预处理流水线"""
    
    def __init__(self):
        self._check_deps()
    
    def _check_deps(self):
        """检查依赖"""
        for name, path in [("FFmpeg", FFMPEG), ("频谱混淆脚本", OBF_SCRIPT),
                           ("Stage4+5脚本", STAGE45_SCRIPT), ("ffprobe", FFPROBE)]:
            if name == "FFmpeg" or name == "ffprobe":
                try:
                    subprocess.run([path, "-version"], capture_output=True, check=True, timeout=5)
                except:
                    print(f"  ⚠️ {name} 不可用")
            elif not path.exists():
                print(f"  ⚠️ {name} 未找到: {path}")
    
    def get_audio_info(self, filepath: str) -> Dict:
        """获取音频信息"""
        cmd = [FFPROBE, "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", filepath]
        try:
            r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=15)
            data = json.loads(r.stdout)
            stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "audio"), {})
            return {
                "sample_rate": int(stream.get("sample_rate", 0)),
                "channels": int(stream.get("channels", 0)),
                "duration": float(data.get("format", {}).get("duration", 0)),
                "size": int(data.get("format", {}).get("size", 0)),
                "codec": stream.get("codec_name", "?"),
            }
        except:
            return {}
    
    def stage2_obfuscate(self, input_path: str, output_path: str, preset: str = "medium") -> Dict:
        """
        Stage 2: 频谱指纹混淆（CUDA 加速优先，回退 ffmpeg）
        
        优先使用 PyTorch CUDA 版混淆器（~5秒），
        如不可用则回退 ffmpeg 版（~3分钟）。
        """
        t0 = time.time()
        
        # 尝试 CUDA 版
        cuda_script = SCRIPTS_DIR / "cuda_obfuscator.py"
        if cuda_script.exists():
            try:
                import torch
                if torch.cuda.is_available():
                    cmd = [PYTHON, str(cuda_script), input_path, "-o", output_path, "-p", preset,
                           "--device", "cuda"]
                    r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=120)
                    if r.returncode == 0 and os.path.exists(output_path):
                        elapsed = time.time() - t0
                        return {"status": "ok", "output": output_path, "size": os.path.getsize(output_path),
                                "elapsed": round(elapsed, 1), "preset": preset, "engine": "cuda"}
            except:
                pass
            # fallback: CPU版
            try:
                cmd = [PYTHON, str(cuda_script), input_path, "-o", output_path, "-p", preset, "--device", "cpu"]
                r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=180)
                if r.returncode == 0 and os.path.exists(output_path):
                    elapsed = time.time() - t0
                    return {"status": "ok", "output": output_path, "size": os.path.getsize(output_path),
                            "elapsed": round(elapsed, 1), "preset": preset, "engine": "cpu"}
            except:
                pass
        
        # 回退 ffmpeg 版
        cmd = [PYTHON, str(OBF_SCRIPT), input_path, "-o", output_path, "-p", preset]
        if verbose:
            print(f"  ⚠️ CUDA不可用，回退到ffmpeg...")
        r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=300)
        elapsed = time.time() - t0
        
        if r.returncode != 0:
            return {"status": "error", "error": r.stderr[-500:] if r.stderr else "未知错误", "elapsed": elapsed}
        
        return {
            "status": "ok",
            "output": output_path,
            "size": os.path.getsize(output_path),
            "elapsed": round(elapsed, 1),
            "preset": preset,
        }
    
    def stage3_tempo(self, input_path: str, output_path: str, tempo: float = 0.4) -> Dict:
        """
        Stage 3: 保音调变速 (可跳过)
        
        用 rubberband 改变速度但不改变音高，混淆时间域指纹。
        """
        t0 = time.time()
        cmd = [
            FFMPEG, "-y", "-i", input_path,
            "-af", f"rubberband=tempo={tempo}",
            "-c:a", "libmp3lame", "-b:a", "320k",
            output_path,
        ]
        r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=300)
        elapsed = time.time() - t0
        
        if r.returncode != 0:
            # 降级到 atempo
            cmd[cmd.index("-af") + 1] = f"atempo={tempo}"
            r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=300)
            elapsed = time.time() - t0
        
        if r.returncode != 0:
            return {"status": "error", "error": r.stderr[-300:], "elapsed": elapsed}
        
        return {
            "status": "ok",
            "output": output_path,
            "size": os.path.getsize(output_path),
            "elapsed": round(elapsed, 1),
            "tempo": tempo,
        }
    
    def stage45_combined(self, input_path: str, output_dir: str) -> Dict:
        """
        Stage 4+5: 去AI标记（翻唱回来后）
        
        先用 ffmpeg 剥离 Suno/Udio 嵌入的元数据标记。
        """
        t0 = time.time()
        os.makedirs(output_dir, exist_ok=True)
        
        stem = Path(input_path).stem
        clean_out = Path(output_dir) / f"{stem}_clean.mp3"
        
        cmd = [
            FFMPEG, "-y", "-i", input_path,
            "-map_metadata", "-1", "-map", "0:a", "-codec", "copy",
            str(clean_out),
        ]
        r = subprocess.run(cmd, capture_output=True, encoding='utf-8', errors='replace', timeout=300)
        elapsed = time.time() - t0
        
        # 收集输出文件
        out_files = list(Path(output_dir).glob("*"))
        clean_mp3 = [str(f) for f in out_files if "_clean" in f.stem and f.suffix == ".mp3"]
        
        return {
            "status": "ok" if clean_mp3 else "warning",
            "output_dir": output_dir,
            "files": [str(f) for f in out_files],
            "clean_mp3": clean_mp3,
            "elapsed": round(elapsed, 1),
        }
    
    def run_pipeline(
        self,
        input_path: str,
        output_dir: str,
        preset: str = "medium",
        skip_tempo: bool = False,
        verbose: bool = True,
    ) -> Dict:
        """
        完整翻唱流水线
        
        Args:
            input_path: 输入音频路径（原始歌曲）
            output_dir: 输出目录
            preset: 混淆强度 (light/medium/heavy)
            skip_tempo: 是否跳过0.4x变速
            verbose: 是否打印进度
        
        Returns:
            流水线结果字典
        """
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"输入文件不存在: {input_path}")
        
        stem = Path(input_path).stem
        session_dir = Path(output_dir) / f"{stem}_{int(time.time())}"
        session_dir.mkdir(parents=True, exist_ok=True)
        
        pipeline_result = {
            "input": input_path,
            "session_dir": str(session_dir),
            "stages": {},
            "elapsed_total": 0,
        }
        
        t_total = time.time()
        
        if verbose:
            info = self.get_audio_info(input_path)
            print(f"\n🎤 翻唱仔 — {stem}")
            print(f"   📏 {info.get('size',0)/1024/1024:.1f}MB / {info.get('duration',0):.0f}s")
            print(f"   🎛 混淆: {preset}  |  {'⏭️ 跳过变速' if skip_tempo else '⚡ 0.4x变速'}")
        
        try:
            # ── Stage 2: 频谱指纹混淆 ──
            if verbose:
                print(f"\n{'='*45}")
                print(f"  Stage 2: 频谱指纹混淆 ({preset})")
                print(f"{'='*45}")
            
            obf_out = str(session_dir / f"{stem}_{preset}_obf.mp3")
            result = self.stage2_obfuscate(input_path, obf_out, preset)
            pipeline_result["stages"]["stage2_obfuscate"] = result
            
            if result["status"] != "ok":
                raise RuntimeError(f"Stage 2 失败: {result.get('error')}")
            
            if verbose:
                print(f"  ✅ 完成 ({result['elapsed']}s) → {Path(obf_out).name}")
            
            current = obf_out
            
            # ── Stage 3: 0.4x 变速（可选） ──
            if not skip_tempo:
                if verbose:
                    print(f"\n{'='*45}")
                    print(f"  Stage 3: 0.4x 保音调变速")
                    print(f"{'='*45}")
                
                tempo_out = str(session_dir / f"{stem}_0.4x.mp3")
                result = self.stage3_tempo(current, tempo_out)
                pipeline_result["stages"]["stage3_tempo"] = result
                
                if result["status"] == "ok":
                    current = tempo_out
                    if verbose:
                        print(f"  ✅ 完成 ({result['elapsed']}s) → {Path(tempo_out).name}")
                else:
                    if verbose:
                        print(f"  ⚠️ 变速失败，使用混淆后音频继续: {result.get('error','')}")
                    pipeline_result["stages"]["stage3_tempo"]["status"] = "skipped"
            else:
                pipeline_result["stages"]["stage3_tempo"] = {"status": "skipped", "reason": "用户跳过"}
                if verbose:
                    print(f"\n  ⏭️ Stage 3: 已跳过")
            
            # ── Stage 4+5: 去AI标记 + MIDI ──
            if verbose:
                print(f"\n{'='*45}")
                print(f"  Stage 4+5: 去AI标记 + MIDI转录")
                print(f"{'='*45}")
            
            midi_dir = session_dir / "midi_output"
            result = self.stage45_combined(current, str(midi_dir))
            pipeline_result["stages"]["stage45_combined"] = result
            
            if verbose:
                status_icon = "✅" if result["status"] == "ok" else "⚠️"
                print(f"  {status_icon} 完成 ({result['elapsed']}s)")
                if result.get("midi"):
                    print(f"     🎹 MIDI: {', '.join(Path(m).name for m in result['midi'])}")
                if result.get("clean_mp3"):
                    print(f"     🎵 Clean: {', '.join(Path(m).name for m in result['clean_mp3'])}")
            
            # ── 汇总 ──
            total_elapsed = time.time() - t_total
            pipeline_result["elapsed_total"] = round(total_elapsed, 1)
            pipeline_result["status"] = "ok"
            pipeline_result["output_dir"] = str(session_dir)
            
            # 列出所有输出文件
            all_files = sorted(session_dir.rglob("*"))
            pipeline_result["output_files"] = [
                {"name": f.relative_to(session_dir).as_posix(), "size": f.stat().st_size}
                for f in all_files if f.is_file()
            ]
            
            if verbose:
                print(f"\n{'='*45}")
                print(f"  🏆 翻唱预处理完成！总用时 {total_elapsed:.1f}s")
                print(f"  📁 输出目录: {session_dir}")
                print(f"{'='*45}")
                for f in pipeline_result["output_files"]:
                    print(f"     📄 {f['name']} ({f['size']/1024:.0f}KB)")
                print(f"\n  💡 下一步:")
                print(f"     → {Path(obf_out).name} 上传 Suno 翻唱")
                print(f"     → 翻唱完的MP3丢回翻唱仔跑 Stage 4+5")
            
            return pipeline_result
        
        except Exception as e:
            total_elapsed = time.time() - t_total
            pipeline_result["elapsed_total"] = round(total_elapsed, 1)
            pipeline_result["status"] = "error"
            pipeline_result["error"] = str(e)
            if verbose:
                print(f"\n❌ 流水线失败: {e}")
            return pipeline_result
    
    def process_cover_result(self, suno_mp3: str, output_dir: str, verbose: bool = True) -> Dict:
        """
        处理 Suno 翻唱结果（单独跑 Stage 4+5）
        
        用户从 Suno 下载翻唱好的 MP3 后，用这个函数：
        去AI标记 → MIDI转录
        
        Args:
            suno_mp3: Suno生成的翻唱MP3路径
            output_dir: 输出目录
        """
        if verbose:
            print(f"\n🎤 处理 Suno 翻唱结果:")
            print(f"   输入: {suno_mp3}")
            print(f"   输出: {output_dir}")
        
        return self.stage45_combined(suno_mp3, output_dir)


# ── CLI 入口 ──

def main():
    parser = argparse.ArgumentParser(
        description="🎤 翻唱仔 — AI翻唱预处理流水线",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  %(prog)s 歌曲.mp3 -o ./output                  # 完整流程
  %(prog)s 歌曲.mp3 -o ./output --skip-tempo     # 跳过变速
  %(prog)s 歌曲.mp3 -o ./output --preset heavy   # 强混淆
  %(prog)s ./input_dir/ -o ./output/ --batch     # 批量
  
  # 处理 Suno 翻唱结果（单跑 Stage 4+5）
  %(prog)s --suno-mp3 suno_output.mp3 -o ./output
        """
    )
    parser.add_argument("input", nargs="?", help="输入音频文件或目录")
    parser.add_argument("-o", "--output", required=True, help="输出目录")
    parser.add_argument("-p", "--preset", choices=["light", "medium", "heavy"],
                       default="medium", help="混淆强度 (默认: medium)")
    parser.add_argument("--skip-tempo", action="store_true", help="跳过0.4x变速")
    parser.add_argument("--suno-mp3", help="处理Suno翻唱结果（单跑Stage4+5）")
    parser.add_argument("--batch", action="store_true", help="批量处理模式")
    parser.add_argument("-q", "--quiet", action="store_true", help="安静模式")
    
    args = parser.parse_args()
    
    cover = CoverBoy()
    verbose = not args.quiet
    
    # 处理 Suno 翻唱结果
    if args.suno_mp3:
        if not os.path.isfile(args.suno_mp3):
            print(f"❌ Suno翻唱文件不存在: {args.suno_mp3}")
            sys.exit(1)
        result = cover.process_cover_result(args.suno_mp3, args.output, verbose=verbose)
        if result["status"] == "error":
            print(f"❌ 处理失败: {result.get('error')}")
            sys.exit(1)
        return
    
    # 必须有输入
    if not args.input:
        parser.print_help()
        sys.exit(1)
    
    # 批量模式
    if args.batch or os.path.isdir(args.input):
        input_dir = args.input if os.path.isdir(args.input) else os.path.dirname(args.input)
        files = sorted([
            os.path.join(input_dir, f) for f in os.listdir(input_dir)
            if f.lower().endswith((".mp3", ".wav", ".flac", ".m4a", ".ogg"))
            and not f.startswith(".")
        ])
        if not files:
            print(f"❌ 目录中没有音频文件: {input_dir}")
            sys.exit(1)
        if verbose:
            print(f"📦 批量处理 {len(files)} 个文件...")
        for i, f in enumerate(files):
            print(f"\n{'='*50}")
            print(f"[{i+1}/{len(files)}] {Path(f).name}")
            cover.run_pipeline(f, args.output, args.preset, args.skip_tempo, verbose=verbose)
    else:
        # 单文件
        if not os.path.isfile(args.input):
            print(f"❌ 文件不存在: {args.input}")
            sys.exit(1)
        result = cover.run_pipeline(args.input, args.output, args.preset, args.skip_tempo, verbose=verbose)
        if result["status"] == "error":
            sys.exit(1)


if __name__ == "__main__":
    main()
