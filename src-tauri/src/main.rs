// 大师来了 —— Tauri v2 薄壳
// 职责极薄：① 加载远程/本地页面（见 tauri.conf.json 的 url）
//            ② 启动时自动拉起本地 Python 引擎（uv run python main.py）
//            ③ 未安装时，用户点击"安装本地引擎"按钮，把随包附带的引擎源码
//               部署到软件目录（~/Library/Application Support/<id>/local-engine）并 uv sync
//            ④ 退出时回收引擎子进程
// 不打包前端；引擎以"源码 + 便携 uv"形式随 .app 分发（Resources 目录）。

use std::fs;
use std::io::{BufRead, Write};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};

use tauri::{Emitter, Manager};

/// 全局持有引擎子进程句柄，供退出时回收、安装线程回填。
struct EngineState(pub Arc<Mutex<Option<Child>>>);

/// 启动诊断日志：spawn 失败不再静默吞掉，写到 ~/.dashi_engine_spawn.log 便于排查。
fn log(msg: &str) {
    if let Ok(home) = std::env::var("HOME") {
        let path = Path::new(&home).join(".dashi_engine_spawn.log");
        if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(&path) {
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

/// 解析 local-engine 运行目录（按优先级）：
/// 1. DASHI_ENGINE_DIR 环境变量（高级用户/启动器设置绝对路径）
/// 2. 已安装的引擎：软件目录下的 local-engine（首次安装后落此处，最高优先）
/// 3. 当前工作目录下的 local-engine（tauri:dev 时 CWD=项目根）
/// 4. 从可执行文件位置向上查找 local-engine（dev 时二进制在 src-tauri/target/debug）
/// 5. .app 同级目录的 local-engine（分发时 .app 与引擎放同文件夹）
/// 6. 常见用户目录下的项目副本（~/Documents, ~/Desktop）
fn resolve_engine_dir(app: &tauri::AppHandle) -> PathBuf {
    if let Ok(dir) = std::env::var("DASHI_ENGINE_DIR") {
        let p = PathBuf::from(&dir);
        if p.exists() {
            return p;
        }
        log(&format!("DASHI_ENGINE_DIR={} 不存在，回退其他位置", dir));
    }
    // ── 策略 2：已安装的引擎（软件目录）──
    if let Ok(data) = app.path().app_data_dir() {
        let installed = data.join("local-engine");
        if installed.join(".venv").exists() || installed.join("main.py").exists() {
            return installed;
        }
    }
    // ── 策略 3：CWD ──
    if let Ok(cwd) = std::env::current_dir() {
        let cand = cwd.join("local-engine");
        if cand.exists() {
            return cand;
        }
    }
    // ── 策略 4：从 exe 向上遍历 ──
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
    // ── 策略 5：.app 同级目录 ──
    if let Ok(exe) = std::env::current_exe() {
        if let Some(mac_os_dir) = exe.parent() {
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
    // ── 策略 6：常见用户目录 ──
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
fn spawn_engine(app: &tauri::AppHandle) -> Option<Child> {
    let uv = match find_uv() {
        Some(u) => u,
        None => {
            log("未找到 uv（PATH 与常见路径均无），跳过引擎自动启动");
            return None;
        }
    };
    let dir = resolve_engine_dir(app);
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

/// 递归复制目录（用于把随包引擎源码部署到软件目录）。
fn copy_dir_all(src: &Path, dst: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        let target = dst.join(entry.file_name());
        if ty.is_dir() {
            copy_dir_all(&entry.path(), &target)?;
        } else {
            fs::copy(entry.path(), &target)?;
        }
    }
    Ok(())
}

/// 安装本地引擎：把 Resources 里的引擎源码复制到软件目录，uv sync 建 venv，再启动服务。
/// 在后台线程执行，通过事件向前端回报进度；命令本身立即返回。
#[tauri::command]
fn install_local_engine(app: tauri::AppHandle) {
    // 复制 Arc 供安装线程回填运行中的子进程
    let state = app.state::<EngineState>();
    let child_arc = state.0.clone();

    std::thread::spawn(move || {
        let emit_progress = |msg: String| {
            let _ = app.emit("engine-install-progress", msg);
        };
        let emit_done = |ok: bool, msg: String| {
            let _ = app.emit(
                "engine-install-done",
                serde_json::json!({ "ok": ok, "msg": msg }),
            );
        };

        let resource_dir = match app.path().resource_dir() {
            Ok(d) => d,
            Err(e) => {
                emit_progress(format!("无法定位资源目录: {e}"));
                emit_done(false, "资源目录缺失".into());
                return;
            }
        };
        let engine_src = resource_dir.join("local-engine");
        let uv_bin = resource_dir.join("uv");

        if !engine_src.exists() {
            emit_progress("安装包内未找到引擎源码（Resources/local-engine）".into());
            emit_done(false, "引擎源码缺失".into());
            return;
        }
        let uv = if uv_bin.exists() {
            uv_bin
        } else {
            // 回退到 PATH 中的 uv
            match find_uv() {
                Some(u) => u,
                None => {
                    emit_progress("未找到 uv，无法安装依赖".into());
                    emit_done(false, "uv 缺失".into());
                    return;
                }
            }
        };

        let data_dir = match app.path().app_data_dir() {
            Ok(d) => d,
            Err(e) => {
                emit_progress(format!("无法定位软件目录: {e}"));
                emit_done(false, "软件目录缺失".into());
                return;
            }
        };
        let dest = data_dir.join("local-engine");

        emit_progress(format!("部署引擎到: {}", dest.display()));
        if let Err(e) = copy_dir_all(&engine_src, &dest) {
            emit_progress(format!("复制源码失败: {e}"));
            emit_done(false, "复制失败".into());
            return;
        }
        emit_progress("源码已复制，开始安装依赖（首次需联网下载，请稍候）…".into());

        // uv sync：建 venv + 安装依赖，流式回报 stdout
        let mut sync = match Command::new(&uv)
            .arg("sync")
            .current_dir(&dest)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
        {
            Ok(c) => c,
            Err(e) => {
                emit_progress(format!("uv sync 启动失败: {e}"));
                emit_done(false, "uv sync 失败".into());
                return;
            }
        };
        if let Some(out) = sync.stdout.take() {
            for line in std::io::BufReader::new(out).lines().map_while(Result::ok) {
                emit_progress(line);
            }
        }
        let sync_status = match sync.wait() {
            Ok(s) => s,
            Err(e) => {
                emit_progress(format!("uv sync 等待失败: {e}"));
                emit_done(false, "uv sync 失败".into());
                return;
            }
        };
        if !sync_status.success() {
            emit_progress("uv sync 未成功完成".into());
            emit_done(false, "依赖安装失败".into());
            return;
        }
        emit_progress("依赖安装完成，正在启动本地引擎…".into());

        // 启动引擎服务（uv run python main.py）
        match Command::new(&uv)
            .args(["run", "python", "main.py"])
            .current_dir(&dest)
            .spawn()
        {
            Ok(child) => {
                emit_progress(format!("引擎已启动 pid={}", child.id()));
                *child_arc.lock().unwrap() = Some(child);
                emit_done(true, "安装并启动成功".into());
            }
            Err(e) => {
                emit_progress(format!("引擎启动失败: {e}"));
                emit_done(false, "引擎启动失败".into());
            }
        }
    });
}

fn main() {
    // 引擎子进程句柄，供事件循环在退出时回收、安装线程回填
    let engine_child = Arc::new(Mutex::new(None));
    let engine_child_setup = engine_child.clone();
    let engine_child_run = engine_child.clone();

    let app = tauri::Builder::default()
        .manage(EngineState(engine_child.clone()))
        .setup(move |app| {
            // 启动即尝试拉起已安装/存在的本地引擎；未安装会失败（页面提示安装按钮）
            let child = spawn_engine(app.handle());
            *engine_child_setup.lock().unwrap() = child;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![install_local_engine])
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
