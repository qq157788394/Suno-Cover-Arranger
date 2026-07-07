// 大师来了 —— Tauri v2 薄壳
// 职责极薄：① 加载远程/本地页面（见 tauri.conf.json 的 url）
//            ② 启动时自动拉起本地 Python 引擎（uv run python main.py）
//            ③ 退出时回收引擎子进程，避免孤儿占用 18741
// 不打包前端、不打包引擎，二者均与壳二进制解耦。

use std::process::{Child, Command};
use std::sync::{Arc, Mutex};

// 启动本地引擎。工作目录取 DASHI_ENGINE_DIR 环境变量，缺省为仓库根的 local-engine/。
// 返回子进程句柄（便于退出时回收）；uv 未安装或启动失败则返回 None。
fn spawn_engine() -> Option<Child> {
    let dir = std::env::var("DASHI_ENGINE_DIR")
        .unwrap_or_else(|_| "local-engine".to_string());
    Command::new("uv")
        .args(["run", "python", "main.py"])
        .current_dir(dir)
        .spawn()
        .ok()
}

fn main() {
    // 引擎子进程句柄，供事件循环在退出时回收
    let engine_child = Arc::new(Mutex::new(spawn_engine()));
    let engine_child_run = engine_child.clone();

    let app = tauri::Builder::default()
        .setup(|_app| Ok(()))
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    // Tauri v2：事件处理在 App::run 的闭包里（v1 的 .on_event() 已移除）
    app.run(move |_app_handle, event| {
        if let tauri::RunEvent::Exit = event {
            if let Some(mut child) = engine_child_run.lock().unwrap().take() {
                let _ = child.kill();
            }
        }
    });
}
