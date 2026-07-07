// 大师来了 —— Tauri v2 薄壳
// 职责极薄：① 加载远程/本地页面（见 tauri.conf.json 的 url）
//            ② 启动时自动拉起本地 Python 引擎（uv run python main.py）
//            ③ 未安装时，用户点击"安装本地引擎"按钮，把随包附带的引擎源码
//               部署到软件目录（~/Library/Application Support/<id>/local-engine）并 uv sync
//            ④ 退出时回收引擎子进程
// 不打包前端；引擎以"源码 + 便携 uv"形式随 .app 分发（Resources 目录）。

use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpStream;
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use tauri::{Emitter, Manager};

/// 全局持有引擎子进程句柄，供退出时回收、安装线程回填。
struct EngineState(pub Arc<Mutex<Option<Child>>>);

/// 引擎固定端口：单实例，避免重复拉起互相抢端口。
const ENGINE_PORT: u16 = 18741;
const ENGINE_HOST: &str = "127.0.0.1";

/// 解析引擎实际监听端口：
/// 1. 引擎目录下的 .local-engine.port 文件（Python 启动时写入，优先）
/// 2. 回退到固定常量 ENGINE_PORT（18741）
/// 统一端口真相源，消除三套系统各说各话的矛盾。
fn resolve_engine_port(app: &tauri::AppHandle) -> u16 {
    let dir = resolve_engine_dir(app);
    let port_file = dir.join(".local-engine.port");
    if let Ok(content) = fs::read_to_string(&port_file) {
        if let Ok(port) = content.trim().parse::<u16>() {
            return port;
        }
    }
    ENGINE_PORT
}

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

/// 定位 uv：优先级 PATH → 常见安装位置 → 随包附带的 uv（Contents/Resources/uv）
/// → 已部署到软件目录的 uv（app_data_dir/local-engine/uv，避免包内二进制被 quarantine 拦截）。
/// Tauri 起的二进制不一定继承用户 shell 的 PATH（uv 在 ~/.local/bin），必须显式探测。
fn find_uv(app: &tauri::AppHandle) -> Option<PathBuf> {
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
    if let Ok(rd) = app.path().resource_dir() {
        let bundled = rd.join("uv");
        if bundled.exists() {
            return Some(bundled);
        }
    }
    if let Ok(data) = app.path().app_data_dir() {
        let deployed = data.join("local-engine").join("uv");
        if deployed.exists() {
            return Some(deployed);
        }
    }
    None
}

/// 极小 HTTP GET 探测引擎健康检查是否就绪（仅本机 127.0.0.1）。
fn engine_health_ok(port: u16) -> bool {
    if let Ok(mut stream) = TcpStream::connect((ENGINE_HOST, port)) {
        let req = format!(
            "GET /api/health HTTP/1.1\r\nHost: {ENGINE_HOST}:{port}\r\nConnection: close\r\n\r\n"
        );
        if stream.write_all(req.as_bytes()).is_ok() {
            let mut reader = BufReader::new(stream);
            let mut line = String::new();
            if reader.read_line(&mut line).is_ok() {
                return line.starts_with("HTTP/1.1 200") || line.starts_with("HTTP/1.0 200");
            }
        }
    }
    false
}

/// 轮询引擎健康检查，直到就绪或超时。
fn wait_engine_ready(port: u16, timeout: Duration) -> bool {
    let start = Instant::now();
    while start.elapsed() < timeout {
        if engine_health_ok(port) {
            return true;
        }
        std::thread::sleep(Duration::from_millis(300));
    }
    false
}

/// 引擎运行日志路径（软件目录下 engine.log），便于排查崩溃。
fn engine_log_path(app: &tauri::AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .map(|d| d.join("engine.log"))
        .unwrap_or_else(|_| PathBuf::from("engine.log"))
}

/// 启动引擎进程；stdout/stderr 重定向到 engine.log 便于排查。
/// 返回子进程句柄（便于退出时回收）；uv 缺失或启动失败返回 None 并写日志。
fn start_engine_process(app: &tauri::AppHandle, uv: &Path, dir: &Path) -> Option<Child> {
    let log_path = engine_log_path(app);
    let log_file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .ok();
    let stderr_file = log_file.as_ref().and_then(|f| f.try_clone().ok());
    match Command::new(uv)
        .args(["run", "python", "main.py"])
        .current_dir(dir)
        .env("LOCAL_ENGINE_PORT", ENGINE_PORT.to_string())
        .stdout(log_file.map(Stdio::from).unwrap_or(Stdio::null()))
        .stderr(stderr_file.map(Stdio::from).unwrap_or(Stdio::null()))
        .spawn()
    {
        Ok(child) => Some(child),
        Err(e) => {
            log(&format!("引擎启动失败：{:?}", e));
            None
        }
    }
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

/// 启动本地引擎（应用启动时自动调用）。
/// 单实例：若固定端口已在服务，直接上报 ready 不再拉起；否则定位 uv 与目录后启动并轮询就绪。
fn spawn_engine(app: &tauri::AppHandle) -> Option<Child> {
    let port = resolve_engine_port(app);
    if engine_health_ok(port) {
        let _ = app.emit(
            "engine-ready",
            serde_json::json!({ "port": port, "msg": "引擎已在运行" }),
        );
        return None;
    }
    let uv = match find_uv(app) {
        Some(u) => u,
        None => {
            log("未找到 uv（PATH 与常见路径均无），跳过引擎自动启动");
            return None;
        }
    };
    let dir = resolve_engine_dir(app);
    if !dir.join("main.py").exists() {
        log(&format!("引擎目录 {:?} 无 main.py，跳过自动启动（页面将引导安装）", dir));
        return None;
    }
    log(&format!("准备启动引擎：uv={:?} cwd={:?}", uv, dir));
    let child = start_engine_process(app, &uv, &dir);
    let port = resolve_engine_port(app);
    match child {
        Some(ref c) => {
            log(&format!("引擎子进程已启动 pid={}", c.id()));
            if wait_engine_ready(port, Duration::from_secs(20)) {
                let _ = app.emit(
                    "engine-ready",
                    serde_json::json!({ "port": port, "msg": "引擎已启动" }),
                );
            } else {
                log("引擎启动后 20s 内健康检查未通过，详见软件目录 engine.log");
            }
        }
        None => {}
    }
    child
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
/// 幂等：已安装且引擎已在跑 → 直接成功；已部署但没跑 → 跳过拷贝/sync 直接启动。
/// 在后台线程执行，通过事件向前端回报进度；命令本身立即返回。
#[tauri::command]
fn install_local_engine(app: tauri::AppHandle) {
    // 复制 Arc 供安装线程回填运行中的子进程
    let state = app.state::<EngineState>();
    let child_arc = state.0.clone();
    let app_for_pump = app.clone();

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
        let emit_ready = |port: u16, msg: String| {
            let _ = app.emit(
                "engine-ready",
                serde_json::json!({ "port": port, "msg": msg }),
            );
        };

        // 已在运行 → 直接成功（单实例保护）
        let port = resolve_engine_port(&app);
        if engine_health_ok(port) {
            emit_progress("检测到引擎已在运行".into());
            emit_ready(port, "引擎已就绪".into());
            emit_done(true, "引擎已就绪".into());
            return;
        }

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

        let data_dir = match app.path().app_data_dir() {
            Ok(d) => d,
            Err(e) => {
                emit_progress(format!("无法定位软件目录: {e}"));
                emit_done(false, "软件目录缺失".into());
                return;
            }
        };
        let dest = data_dir.join("local-engine");

        // 把 uv 一并部署到软件目录：包内的 uv 可能被 macOS quarantine 拦截，
        // 复制到 app_data_dir 后不再带隔离标记，可直接执行。
        let uv = if uv_bin.exists() {
            let uv_dest = dest.join("uv");
            match fs::copy(&uv_bin, &uv_dest) {
                Ok(_) => {
                    #[cfg(unix)]
                    {
                        use std::os::unix::fs::PermissionsExt;
                        let _ = fs::set_permissions(&uv_dest, fs::Permissions::from_mode(0o755));
                    }
                    uv_dest
                }
                Err(e) => {
                    emit_progress(format!("复制 uv 失败: {e}，回退系统 uv"));
                    match find_uv(&app) {
                        Some(u) => u,
                        None => {
                            emit_progress("未找到 uv，无法安装依赖".into());
                            emit_done(false, "uv 缺失".into());
                            return;
                        }
                    }
                }
            }
        } else {
            match find_uv(&app) {
                Some(u) => u,
                None => {
                    emit_progress("未找到 uv，无法安装依赖".into());
                    emit_done(false, "uv 缺失".into());
                    return;
                }
            }
        };

        // 始终重新拷贝源码，确保引擎逻辑（如固定端口）随包更新生效。
        // 走到这里说明引擎未在运行（前面 health 检查已拦截在跑的情况），覆盖安全。
        emit_progress(format!("部署引擎到: {}", dest.display()));
        if let Err(e) = copy_dir_all(&engine_src, &dest) {
            emit_progress(format!("复制源码失败: {e}"));
            emit_done(false, "复制失败".into());
            return;
        }

        // 仅当 .venv 不存在才 uv sync（避免重复 sync 抢锁失败）
        if !dest.join(".venv").exists() {
            emit_progress("开始安装依赖（首次需联网下载，请稍候）…".into());
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
            // stdout 流式回报进度（独立线程，避免阻塞）
            if let Some(out) = sync.stdout.take() {
                std::thread::spawn(move || {
                    for line in BufReader::new(out).lines().map_while(Result::ok) {
                        let _ = app_for_pump.emit("engine-install-progress", line);
                    }
                });
            }
            // stderr 收集，失败时回显具体原因
            let mut err_out = String::new();
            if let Some(err) = sync.stderr.take() {
                for line in BufReader::new(err).lines().map_while(Result::ok) {
                    err_out.push_str(&line);
                    err_out.push('\n');
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
                let tail = err_out.lines().rev().take(8).collect::<Vec<_>>().join("\n");
                emit_progress(format!("uv sync 未成功完成:\n{}", tail));
                emit_done(false, "依赖安装失败".into());
                return;
            }
            emit_progress("依赖安装完成".into());
        } else {
            emit_progress("依赖已安装，跳过 uv sync".into());
        }

        // 启动引擎（先回收已记录的旧进程，避免孤儿）
        if let Some(mut old) = child_arc.lock().unwrap().take() {
            let _ = old.kill();
        }
        let port = resolve_engine_port(&app);
        emit_progress("正在启动本地引擎…".into());
        match start_engine_process(&app, &uv, &dest) {
            Some(child) => {
                *child_arc.lock().unwrap() = Some(child);
                if wait_engine_ready(port, Duration::from_secs(30)) {
                    emit_progress(format!(
                        "引擎已就绪 http://{}:{}",
                        ENGINE_HOST, port
                    ));
                    emit_ready(port, "引擎已启动".into());
                    emit_done(true, "安装并启动成功".into());
                } else {
                    emit_progress("引擎启动后健康检查未通过，详见软件目录 engine.log".into());
                    emit_done(false, "引擎未就绪（见 engine.log）".into());
                }
            }
            None => {
                emit_progress("引擎启动失败，详见软件目录 engine.log".into());
                emit_done(false, "引擎启动失败".into());
            }
        }
    });
}

/// 查询引擎安装/运行状态，供前端在上传前展示依赖清单。
/// 返回：uv 运行时是否就绪、随包源码是否存在、依赖环境(.venv)是否已建、
/// 引擎服务是否在跑、在跑时的端口。
#[tauri::command]
fn get_engine_status(app: tauri::AppHandle) -> serde_json::Value {
    let uv_present = find_uv(&app).is_some();
    let dir = resolve_engine_dir(&app);
    let source_present = dir.join("main.py").exists();
    let venv_present = app
        .path()
        .app_data_dir()
        .map(|d| d.join("local-engine").join(".venv").exists())
        .unwrap_or(false);
    let port = resolve_engine_port(&app);
    let running = engine_health_ok(port);
    let port_val = if running {
        serde_json::json!(port)
    } else {
        serde_json::Value::Null
    };
    serde_json::json!({
        "uv_present": uv_present,
        "source_present": source_present,
        "venv_present": venv_present,
        "running": running,
        "port": port_val
    })
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
        .invoke_handler(tauri::generate_handler![install_local_engine, get_engine_status])
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
