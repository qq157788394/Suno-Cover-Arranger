// 大师来了 —— Tauri v2 薄壳
// 职责极薄：① 加载远程/本地页面（见 tauri.conf.json 的 url）
//            ② 启动时自动拉起本地 Python 引擎（uv run python main.py）
//            ③ 退出时回收引擎子进程
// 不打包前端、不打包引擎，二者均与壳二进制解耦。

use std::fs::OpenOptions;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Child, Command};
use std::sync::{Arc, Mutex};

/// 启动诊断日志：spawn 失败不再静默吞掉，写到 ~/.dashi_engine_spawn.log 便于排查。
fn log(msg: &str) {
    if let Ok(home) = std::env::var("HOME") {
        let path = Path::new(&home).join(".dashi_engine_spawn.log");
        if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(&path) {
            let ts = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);
            let _ = writeln!(f, "[{}] {}", ts, msg);
        }
    }
}

/// 定位 uv：先试 PATH，再回退常见安装位置。
/// Tauri 起的二进制不一定继承用户 shell 的 PATH（uv 在 ~/.local/bin），必须显式探测。
fn find_uv() -> Option<PathBuf> {
    if Command::new("uv").arg("--version").output().is_ok() {
        return Some(PathBuf::from("uv"));
    }
    let home = std::env::var("HOME").unwrap_or_default();
    let candidates = [
        format!("{}/.local/bin/uv", home),
        format!("{}/.cargo/bin/uv", home),
        "/usr/local/bin/uv".to_string(),
        "/opt/homebrew/bin/uv".to_string(),
    ];
    for c in candidates {
        if Path::new(&c).exists() {
            return Some(PathBuf::from(c));
        }
    }
    None
}

/// 解析 local-engine 目录（按优先级）：
/// 1. DASHI_ENGINE_DIR 环境变量（高级用户/启动器设置绝对路径）
/// 2. 当前工作目录下的 local-engine（tauri:dev 时 CWD=项目根）
/// 3. 从可执行文件位置向上查找 local-engine（dev 时二进制在 src-tauri/target/debug）
/// 4. .app 同级目录的 local-engine（生产分发：用户把 .app 和 local-engine 放同一文件夹）
/// 5. 常见用户目录下的项目副本（~/Documents, ~/Desktop）
fn resolve_engine_dir() -> PathBuf {
    if let Ok(dir) = std::env::var("DASHI_ENGINE_DIR") {
        let p = PathBuf::from(&dir);
        if p.exists() {
            return p;
        }
        log(&format!("DASHI_ENGINE_DIR={} 不存在，回退其他位置", dir));
    }
    // ── 策略 2：CWD ──
    if let Ok(cwd) = std::env::current_dir() {
        let cand = cwd.join("local-engine");
        if cand.exists() {
            return cand;
        }
    }
    // ── 策略 3：从 exe 向上遍历 ──
    if let Ok(exe) = std::env::current_exe() {
        let mut p = exe.parent();
        while let Some(dir) = p {
            let cand = dir.join("local-engine");
            if cand.exists() {
                return cand;
            }
            p = dir.parent();
        }
    }
    // ── 策略 4：.app 同级目录（生产分发场景）──
    // exe 通常在 XXX.app/Contents/MacOS/binary；取 .app 所在目录的父级
    if let Ok(exe) = std::env::current_exe() {
        if let Some(mac_os_dir) = exe.parent() {
            // Contents/MacOS → Contents → XXX.app → <app所在目录>
            if let Some(contents_dir) = mac_os_dir.parent() {
                if let Some(app_bundle) = contents_dir.parent() {
                    if let Some(app_location) = app_bundle.parent() {
                        let cand = app_location.join("local-engine");
                        if cand.exists() {
                            return cand;
                        }
                    }
                }
            }
        }
    }
    // ── 策略 5：常见用户目录 ──
    let home = std::env::var("HOME").unwrap_or_default();
    for suffix in &[
        "Documents/Suno-Cover-Arranger/local-engine",
        "Desktop/Suno-Cover-Arranger/local-engine",
    ] {
        let cand = PathBuf::from(&home).join(suffix);
        if cand.exists() {
            return cand;
        }
    }

    log("所有引擎目录探测策略均未命中，使用 fallback 路径（大概率不存在）");
    PathBuf::from("local-engine")
}

/// 启动本地引擎。返回子进程句柄（便于退出时回收）；uv 缺失或启动失败返回 None 并写日志。
fn spawn_engine() -> Option<Child> {
    let uv = match find_uv() {
        Some(u) => u,
        None => {
            log("未找到 uv（PATH 与常见路径均无），跳过引擎自动启动");
            return None;
        }
    };
    let dir = resolve_engine_dir();
    log(&format!("准备启动引擎：uv={:?} cwd={:?}", uv, dir));

    match Command::new(&uv)
        .args(["run", "python", "main.py"])
        .current_dir(&dir)
        .spawn()
    {
        Ok(child) => {
            log(&format!("引擎子进程已启动 pid={}", child.id()));
            Some(child)
        }
        Err(e) => {
            log(&format!("引擎启动失败：{:?}", e));
            None
        }
    }
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
