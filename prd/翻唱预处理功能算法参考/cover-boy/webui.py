#!/usr/bin/env python3
"""
🎤 翻唱仔 — Gradio WebUI
单文件/批量上传 → 翻唱预处理 → 下载混淆/变速/去标记/MIDI文件
"""

import os
import sys
import time
import zipfile
from pathlib import Path

import gradio as gr

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from main import CoverBoy

cover = CoverBoy()
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def run_cover(file_obj, preset, skip_tempo, progress=gr.Progress()):
    """单文件翻唱处理"""
    if file_obj is None:
        return "⚠️ 请上传音频文件", None, None, None, None, "", gr.update(visible=False), gr.update(visible=False)
    
    t0 = time.time()
    input_path = file_obj.name
    stem = Path(input_path).stem
    session_dir = OUTPUT_DIR / f"{stem}_{int(t0)}"
    
    progress(0.1, desc="🎯 开始翻唱预处理...")
    
    result = cover.run_pipeline(
        input_path, str(session_dir),
        preset=preset, skip_tempo=skip_tempo,
        verbose=False,
    )
    
    elapsed = time.time() - t0
    
    if result["status"] == "ok":
        # 组织报告
        stages = result.get("stages", {})
        report = f"🎤 翻唱预处理完成！总用时 {elapsed:.1f}s\n\n"
        report += f"📁 输出目录: {session_dir}\n\n"
        report += "📋 阶段:\n"
        for s_name, s_result in stages.items():
            s_label = {"stage2_obfuscate": "频谱混淆", "stage3_tempo": "0.4x变速",
                       "stage45_combined": "去标记+MIDI"}.get(s_name, s_name)
            s_status = s_result.get("status", "?")
            s_time = s_result.get("elapsed", "?")
            icon = {"ok": "✅", "skipped": "⏭️", "error": "❌"}.get(s_status, "❓")
            report += f"  {icon} {s_label}: {s_time}s\n"
        
        report += "\n📄 生成文件:\n"
        for f_info in result.get("output_files", []):
            report += f"  📄 {f_info['name']} ({f_info['size']/1024:.0f}KB)\n"
        
        # 查找输出文件
        obf_mp3 = None
        clean_mp3 = None
        midi_file = None
        tempo_mp3 = None
        
        for f_info in result.get("output_files", []):
            name = f_info["name"]
            full = os.path.join(session_dir, name)
            if "_obf.mp3" in name:
                obf_mp3 = full
            elif "_clean.mp3" in name:
                clean_mp3 = full
            elif "_0.4x.mp3" in name:
                tempo_mp3 = full
            elif name.endswith(".mid"):
                midi_file = full
        
        # 全部打包
        zip_path = str(session_dir / "全部翻唱文件.zip")
        with zipfile.ZipFile(zip_path, "w") as zf:
            for f_info in result.get("output_files", []):
                full = os.path.join(session_dir, f_info["name"])
                zf.write(full, f_info["name"])
        
        progress(1.0, desc="✅ 完成！")
        return (
            report,
            obf_mp3,      # 混淆后
            tempo_mp3,     # 变速后
            clean_mp3,     # 去标记
            midi_file,     # MIDI
            f"✅ {elapsed:.1f}s",
            gr.update(visible=True),
            zip_path,
        )
    else:
        return (
            f"❌ 失败: {result.get('error', '未知错误')}",
            None, None, None, None, "❌",
            gr.update(visible=False), gr.update(visible=False),
        )


# ═══════════════ Gradio UI ═══════════════

CSS = """
footer {display:none !important;}
.gr-progress {height: 6px !important; border-radius: 3px !important;}
"""

with gr.Blocks(
    title="🎤 翻唱仔 — AI翻唱预处理",
    theme=gr.themes.Soft(),
    css=CSS,
) as demo:
    
    gr.HTML("""
    <div style="text-align:center;padding:24px 0 16px;">
        <h1 style="font-size:2.2em;background:linear-gradient(135deg,#FF6B6B,#FFA94D);
                   -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                   margin:0;">🎤 翻唱仔</h1>
        <p style="color:#888;margin:4px 0 0;font-size:0.95em;">
            AI翻唱预处理流水线 · 频谱混淆 → 0.4x变速 → 去AI标记 → MIDI
        </p>
    </div>
    """)
    
    with gr.Tabs():
        # ── Tab 1: 完整翻唱流程 ──
        with gr.TabItem("🎤 完整翻唱流程"):
            with gr.Row():
                with gr.Column(scale=2):
                    file_input = gr.File(
                        label="上传原始歌曲",
                        file_types=[".mp3", ".wav", ".flac", ".m4a", ".ogg"],
                        file_count="single",
                    )
                    with gr.Row():
                        preset_radio = gr.Radio(
                            ["light", "medium", "heavy"],
                            value="medium",
                            label="频谱混淆强度",
                            info="medium为推荐值",
                        )
                        skip_tempo = gr.Checkbox(
                            label="跳过0.4x变速",
                            value=False,
                            info="勾选则不做变速处理",
                        )
                    btn_run = gr.Button("🎤 开始翻唱预处理", variant="primary", size="lg")
                
                with gr.Column(scale=3):
                    status = gr.Textbox(label="处理报告", lines=14)
                    log = gr.Textbox(label="状态", lines=1, max_lines=2)
            
            gr.Markdown("### 📥 下载生成文件")
            with gr.Row():
                with gr.Column():
                    dl_obf = gr.File(label="🔊 混淆后 (喂Suno)", visible=False)
                    dl_tempo = gr.File(label="⚡ 变速后 (可选)", visible=False)
                with gr.Column():
                    dl_clean = gr.File(label="🎵 去AI标记", visible=False)
                    dl_midi = gr.File(label="🎹 MIDI文件", visible=False)
            
            dl_zip = gr.File(label="📦 打包下载全部", visible=False)
            
            btn_run.click(
                run_cover,
                inputs=[file_input, preset_radio, skip_tempo],
                outputs=[status, dl_obf, dl_tempo, dl_clean, dl_midi, log, dl_zip, dl_zip],
            )
        
        # ── Tab 2: 处理 Suno 翻唱结果 ──
        with gr.TabItem("🔄 处理 Suno 翻唱结果"):
            gr.Markdown("""
            ### 流程说明
            1. 把模糊后的音频传上 **Suno** 生成翻唱
            2. 从 **Suno 下载翻唱结果MP3**
            3. 在这里上传 → 自动去AI标记 + MIDI转录
            """)
            
            with gr.Row():
                with gr.Column(scale=2):
                    suno_file = gr.File(
                        label="上传 Suno 翻唱结果",
                        file_types=[".mp3", ".wav", ".flac"],
                        file_count="single",
                    )
                    btn_suno = gr.Button("🔄 处理翻唱结果", variant="primary")
                
                with gr.Column(scale=3):
                    suno_status = gr.Textbox(label="处理结果", lines=8)
                    suno_dl_clean = gr.File(label="🎵 去标记MP3", visible=False)
                    suno_dl_midi = gr.File(label="🎹 MIDI文件", visible=False)
            
            btn_suno.click(
                _process_suno,
                inputs=[suno_file],
                outputs=[suno_status, suno_dl_clean, suno_dl_midi],
            )


def _process_suno(file_obj, progress=gr.Progress()):
    """处理 Suno 翻唱结果"""
    if file_obj is None:
        return "⚠️ 请上传 Suno 翻唱结果", gr.update(visible=False), gr.update(visible=False)
    
    t0 = time.time()
    input_path = file_obj.name
    stem = Path(input_path).stem
    out_dir = OUTPUT_DIR / f"suno_result_{stem}_{int(t0)}"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    progress(0.1, desc="🎯 去AI标记...")
    result = cover.process_cover_result(input_path, str(out_dir), verbose=False)
    elapsed = time.time() - t0
    
    if result["status"] == "ok" or result["status"] == "partial" or result["status"] == "warning":
        report = f"✅ 处理完成！用时 {elapsed:.1f}s\n\n"
        if result.get("clean_mp3"):
            report += f"  🎵 去标记: {Path(result['clean_mp3'][0]).name}\n"
        if result.get("midi"):
            report += f"  🎹 MIDI: {Path(result['midi'][0]).name}\n"
        report += f"\n📁 输出: {out_dir}"
        
        clean_path = result["clean_mp3"][0] if result.get("clean_mp3") else None
        midi_path = result["midi"][0] if result.get("midi") else None
        
        progress(1.0, desc="✅ 完成！")
        return (
            report,
            gr.update(visible=bool(clean_path), value=clean_path) if clean_path else gr.update(visible=False),
            gr.update(visible=bool(midi_path), value=midi_path) if midi_path else gr.update(visible=False),
        )
    else:
        return f"❌ 失败: {result.get('error', '未知')}", gr.update(visible=False), gr.update(visible=False)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="🎤 翻唱仔 WebUI")
    parser.add_argument("--port", type=int, default=7860, help="端口 (默认: 7860)")
    parser.add_argument("--host", default="0.0.0.0", help="监听地址 (默认: 0.0.0.0)")
    parser.add_argument("--share", action="store_true", help="生成公网链接")
    args = parser.parse_args()
    
    print(f"🎤 翻唱仔 WebUI 启动: http://{args.host}:{args.port}")
    if args.share:
        print("🌐 公网链接将在启动后显示")
    
    demo.launch(
        server_name=args.host,
        server_port=args.port,
        share=args.share,
        show_error=True,
        allowed_paths=[str(OUTPUT_DIR.parent)],
    )
