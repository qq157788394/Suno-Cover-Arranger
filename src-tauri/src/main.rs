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

use base64::{engine::general_purpose::STANDARD as B64, Engine as _};
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

/// 读取 /api/health 完整 JSON（仅本机）。不可达或解析失败返回 None。
/// 用于提取 model_ready 与 layers 等就绪信息，供检测面板展示「缺一不可」的依赖状态。
/// 读取本机引擎某个 JSON 端点（/api/health、/api/selfcheck、/api/assets 等）。
/// 不可达或解析失败返回 None。
fn engine_get_json(port: u16, path: &str) -> Option<serde_json::Value> {
    let mut stream = TcpStream::connect((ENGINE_HOST, port)).ok()?;
    let req = format!(
        "GET {path} HTTP/1.1\r\nHost: {ENGINE_HOST}:{port}\r\nConnection: close\r\n\r\n"
    );
    stream.write_all(req.as_bytes()).ok()?;
    let mut reader = BufReader::new(stream);
    let mut headers_done = false;
    let mut body = String::new();
    let mut line = String::new();
    loop {
        line.clear();
        if reader.read_line(&mut line).ok()? == 0 {
            break;
        }
        if !headers_done {
            if line == "\r\n" {
                headers_done = true;
            }
            continue;
        }
        body.push_str(&line);
    }
    if body.is_empty() {
        return None;
    }
    serde_json::from_str::<serde_json::Value>(&body).ok()
}

fn engine_health_json(port: u16) -> Option<serde_json::Value> {
    engine_get_json(port, "/api/health")
}

/// 读取 /api/selfcheck 完整 JSON（仅本机）。不可达或解析失败返回 None。
/// 用于确认「端到端分析」是否真能跑通，作为放行闸门的最后一道。
/// 旧引擎无此端点 -> 返回 404 文本 -> 解析失败 -> None（保守拦截，不误放行）。
fn engine_selfcheck_json(port: u16) -> Option<serde_json::Value> {
    engine_get_json(port, "/api/selfcheck")
}

/// 读取 /api/assets：逐条资产就绪状态，供检测面板列出缺失项并触发下载。
fn engine_assets_json(port: u16) -> Option<serde_json::Value> {
    engine_get_json(port, "/api/assets")
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

/// 清理占用引擎端口的残留进程（如上一会话未回收的孤儿引擎）。
/// 仅 macOS 实现（lsof）；其他平台静默跳过。配合「退出时回收」可保证单实例。
fn kill_process_on_port(port: u16) {
    #[cfg(target_os = "macos")]
    {
        let out = Command::new("lsof")
            .args(["-ti", &format!("tcp:{port}")])
            .output();
        if let Ok(out) = out {
            let pids = String::from_utf8_lossy(&out.stdout);
            for pid in pids.split_whitespace() {
                let _ = Command::new("kill").args(["-9", pid]).output();
                log(&format!("已清理占用端口 {port} 的残留进程 pid={pid}"));
            }
        }
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = port;
    }
}

/// 把包内 Resources/local-engine 的源码同步到软件目录（app_data_dir/local-engine），
/// 确保重建 .app 后运行的是新版代码，无需手动点「安装」。
/// 仅覆盖源码文件；.venv 等运行时产物不在 Resources 中，不会被触及。
/// 无 app_data_dir 或 Resources 缺失时跳过（开发模式沿用既有目录）。
fn sync_engine_source(app: &tauri::AppHandle) {
    let src = match app.path().resource_dir() {
        Ok(rd) => rd.join("local-engine"),
        Err(_) => return,
    };
    if !src.exists() {
        return; // 开发模式：无打包资源，跳过同步
    }
    let dest = match app.path().app_data_dir() {
        Ok(d) => d.join("local-engine"),
        Err(_) => return,
    };
    if let Err(e) = copy_dir_all(&src, &dest) {
        log(&format!("引擎源码同步失败（不影响已部署版本）: {e}"));
    } else {
        log(&format!("已同步引擎源码到 {}", dest.display()));
    }
}

/// 启动本地引擎（应用启动时自动调用）。
/// ① 同步包内最新源码到软件目录（重建 .app 即生效）；
/// ② 清理占用端口的残留引擎，避免孤儿进程；
/// ③ 定位 uv 与目录后启动并轮询就绪。
fn spawn_engine(app: &tauri::AppHandle) -> Option<Child> {
    // ① 同步最新引擎源码（覆盖旧 main.py，不触及 .venv）
    sync_engine_source(app);

    let dir = resolve_engine_dir(app);
    if !dir.join("main.py").exists() {
        log(&format!(
            "引擎目录 {:?} 无 main.py，跳过自动启动（页面将引导安装）",
            dir
        ));
        return None;
    }

    // ② 清理端口占用（孤儿引擎 / 上一会话残留）
    let port = resolve_engine_port(app);
    kill_process_on_port(port);
    if engine_health_ok(port) {
        log(&format!(
            "端口 {port} 仍被未知进程占用，引擎可能因绑定失败而启动失败，详见 engine.log"
        ));
    }

    // ③ 拉起最新引擎
    let uv = match find_uv(app) {
        Some(u) => u,
        None => {
            log("未找到 uv（PATH 与常见路径均无），跳过引擎自动启动");
            return None;
        }
    };
    log(&format!("准备启动引擎：uv={:?} cwd={:?}", uv, dir));
    let child = start_engine_process(app, &uv, &dir);
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
/// 真正执行安装/升级的后台工作，返回 Result<成功消息, 失败原因>。
/// 进度通过 `engine-install-progress` 事件回流；成功就绪时仍发 `engine-ready`。
/// 命令层（install_local_engine）在 async 运行时里 spawn_blocking 它，
/// 使前端 invoke 在后台真正干完后才 resolve/reject，期间 webview 不被冻结。
fn run_install(app: tauri::AppHandle) -> Result<String, String> {
    // 复制 Arc 供安装线程回填运行中的子进程
    let state = app.state::<EngineState>();
    let child_arc = state.0.clone();
    let app_for_pump = app.clone();

    let emit_progress = |msg: String| {
        let _ = app.emit("engine-install-progress", msg);
    };
    let emit_ready = |port: u16, msg: String| {
        let _ = app.emit(
            "engine-ready",
            serde_json::json!({ "port": port, "msg": msg }),
        );
    };

    // 引擎已在运行 → 检查是否为最新版本（新版 /api/health 含 model_ready 字段）。
    // 旧版进程占着端口时，liveness 通过但 freshness 不通过 → 走杀进程+重装升级路径。
    let port = resolve_engine_port(&app);
    if engine_health_ok(port) {
        let is_stale = match engine_health_json(port) {
            Some(ref json) => json.get("model_ready").is_none(),
            None => true, // JSON 解析失败 → 视为过期
        };
        if !is_stale {
            emit_progress("检测到引擎已在运行且为最新版本".into());
            emit_ready(port, "引擎已就绪".into());
            return Ok("引擎已就绪".into());
        }
        emit_progress("检测到旧版引擎正在运行，将自动重启升级…".into());
    }

    let resource_dir = match app.path().resource_dir() {
        Ok(d) => d,
        Err(e) => {
            emit_progress(format!("无法定位资源目录: {e}"));
            return Err("资源目录缺失".into());
        }
    };
    let engine_src = resource_dir.join("local-engine");
    let uv_bin = resource_dir.join("uv");

    if !engine_src.exists() {
        emit_progress("安装包内未找到引擎源码（Resources/local-engine）".into());
        return Err("引擎源码缺失".into());
    }

    let data_dir = match app.path().app_data_dir() {
        Ok(d) => d,
        Err(e) => {
            emit_progress(format!("无法定位软件目录: {e}"));
            return Err("软件目录缺失".into());
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
                        return Err("uv 缺失".into());
                    }
                }
            }
        }
    } else {
        match find_uv(&app) {
            Some(u) => u,
            None => {
                emit_progress("未找到 uv，无法安装依赖".into());
                return Err("uv 缺失".into());
            }
        }
    };

    // 始终重新拷贝源码，确保引擎逻辑（如固定端口）随包更新生效。
    // 走到这里说明引擎未在运行（前面 health 检查已拦截在跑的情况），覆盖安全。
    emit_progress(format!("部署引擎到: {}", dest.display()));
    if let Err(e) = copy_dir_all(&engine_src, &dest) {
        emit_progress(format!("复制源码失败: {e}"));
        return Err("复制失败".into());
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
                return Err("uv sync 失败".into());
            }
        };
        // stdout 流式回报进度（独立线程，避免阻塞）
        if let Some(out) = sync.stdout.take() {
            let pump_app = app_for_pump.clone();
            std::thread::spawn(move || {
                for line in BufReader::new(out).lines().map_while(Result::ok) {
                    let _ = pump_app.emit("engine-install-progress", line);
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
                return Err("uv sync 失败".into());
            }
        };
        if !sync_status.success() {
            let tail = err_out.lines().rev().take(8).collect::<Vec<_>>().join("\n");
            emit_progress(format!("uv sync 未成功完成:\n{}", tail));
            return Err("依赖安装失败".into());
        }
        emit_progress("依赖安装完成".into());
    } else {
        emit_progress("依赖已安装，跳过 uv sync".into());
    }

    // 预下载并缓存 ffmpeg 静态二进制（imageio-ffmpeg），使 MP3/FLAC/OGG/AAC 在
    // 离线状态下也能解码。安装阶段有网络（uv sync 已用），此处一次性缓存到用户 cache，
    // 之后运行自检/上传均不再需要联网。失败不影响 WAV，仅警告。
    emit_progress("正在准备 ffmpeg（音频解码所需，首次需联网）…".into());
    let ffmpeg_probe = Command::new(&uv)
        .arg("run")
        .arg("python")
        .arg("-c")
        .arg("import imageio_ffmpeg; imageio_ffmpeg.get_ffmpeg_exe()")
        .current_dir(&dest)
        .output();
    match ffmpeg_probe {
        Ok(o) if o.status.success() => {
            emit_progress("ffmpeg 已就绪（MP3/FLAC/OGG/AAC 可用）".into())
        }
        Ok(o) => emit_progress(format!(
            "ffmpeg 准备提醒：{}",
            String::from_utf8_lossy(&o.stderr)
                .lines()
                .rev()
                .take(2)
                .collect::<Vec<_>>()
                .join(" ")
        )),
        Err(e) => emit_progress(format!("ffmpeg 准备跳过（不影响 WAV）：{e}")),
    }

    // 启动引擎：先回收已记录的旧进程，再用 kill_process_on_port 清理任何占用端口的孤儿进程。
    // 这样即使上一会话残留的引擎不在此 EngineState 中，按钮也能自带清端口能力。
    if let Some(mut old) = child_arc.lock().unwrap().take() {
        let _ = old.kill();
    }
    let port = resolve_engine_port(&app);
    kill_process_on_port(port);
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
                return Ok("安装并启动成功".into());
            }
            emit_progress("引擎启动后健康检查未通过，详见软件目录 engine.log".into());
            return Err("引擎未就绪（见 engine.log）".into());
        }
        None => {
            emit_progress("引擎启动失败，详见软件目录 engine.log".into());
            return Err("引擎启动失败".into());
        }
    }
}

#[tauri::command]
async fn install_local_engine(app: tauri::AppHandle) -> Result<String, String> {
    // spawn_blocking 让重活跑在专用线程，前端 invoke 在真正干完后才 resolve/reject，
    // 期间 webview 不被冻结，loading 转圈与进度日志保持实时。
    let handle = tauri::async_runtime::spawn_blocking(move || run_install(app));
    match handle.await {
        Ok(result) => result,
        Err(_) => Err("安装任务异常终止".into()),
    }
}

/// 资产 id -> PyPI 包名（用于 uv sync --reinstall-package 精准重装，确保随 wheel 的
/// data_files 权重/模型重新落地）。ffmpeg 走 imageio 拉取，不在此映射内。
fn asset_pkg_name(asset_id: &str) -> Option<&'static str> {
    match asset_id {
        "lv_weights" => Some("lv-chordia"),
        "madmom_models" => Some("madmom"),
        "chord_romanizer" => Some("chord-romanizer"),
        _ => None,
    }
}

/// 检测面板「下载/修复」按钮触发：对指定资产做本地拉取，消除运行时下载。
/// - ffmpeg: 经 imageio-ffmpeg 下载并缓存静态二进制（一次性）。
/// - lv_weights / madmom_models / chord_romanizer: 重新 uv sync（必要时 --reinstall-package）
///   修复缺失的 Python 包 / 模型权重（随 wheel 安装的 data_files）。
/// 返回成功消息；失败返回含真实原因的 Err（前端展示 + 提示需联网）。
fn run_prefetch(app: &tauri::AppHandle, asset_id: &str) -> Result<String, String> {
    let dir = resolve_engine_dir(app);
    let uv = find_uv(app).ok_or("uv 缺失，无法拉取依赖")?;
    match asset_id {
        "ffmpeg" => {
            // imageio-ffmpeg 是解码 mp3/flac/ogg/aac 必需。但打包副本的 pyproject 可能滞后、
            // 未声明它，导致 uv sync 没把它装进 venv。先确保包装好：已装则秒过；
            // 缺失则 uv add 安装（并写回 pyproject，使后续 uv sync 不再丢失）；离线才真失败。
            let add = Command::new(&uv)
                .arg("add")
                .arg("imageio-ffmpeg")
                .current_dir(&dir)
                .output()
                .map_err(|e| format!("uv add 启动失败：{e}"))?;
            if !add.status.success() {
                return Err(format!(
                    "imageio-ffmpeg 安装失败（需联网）：{}",
                    String::from_utf8_lossy(&add.stderr)
                        .lines()
                        .rev()
                        .take(3)
                        .collect::<Vec<_>>()
                        .join(" ")
                ));
            }
            // 再拉取 ffmpeg 静态二进制（首次联网下载，缓存到用户 cache 目录）。
            let out = Command::new(&uv)
                .arg("run")
                .arg("python")
                .arg("-c")
                .arg("import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")
                .current_dir(&dir)
                .output()
                .map_err(|e| format!("调用 imageio-ffmpeg 失败：{e}"))?;
            if out.status.success() {
                Ok("ffmpeg 已下载并缓存，MP3/FLAC/OGG/AAC 可解码".into())
            } else {
                Err(format!(
                    "ffmpeg 二进制下载失败（需联网）：{}",
                    String::from_utf8_lossy(&out.stderr)
                        .lines()
                        .rev()
                        .take(3)
                        .collect::<Vec<_>>()
                        .join(" ")
                ))
            }
        }
        "python_pkgs" => {
            let out = Command::new(&uv)
                .arg("sync")
                .current_dir(&dir)
                .output()
                .map_err(|e| format!("uv sync 启动失败：{e}"))?;
            if out.status.success() {
                Ok("已重新安装全部依赖，缺失项已补齐".into())
            } else {
                Err(format!(
                    "依赖修复失败（需联网）：{}",
                    String::from_utf8_lossy(&out.stderr)
                        .lines()
                        .rev()
                        .take(5)
                        .collect::<Vec<_>>()
                        .join(" ")
                ))
            }
        }
        id if asset_pkg_name(id).is_some() => {
            let pkg = asset_pkg_name(id).unwrap();
            let out = Command::new(&uv)
                .arg("sync")
                .arg("--reinstall-package")
                .arg(pkg)
                .current_dir(&dir)
                .output()
                .map_err(|e| format!("uv sync 启动失败：{e}"))?;
            if out.status.success() {
                Ok(format!("已重新安装 {pkg}，缺失的模型/权重已补齐"))
            } else {
                Err(format!(
                    "{pkg} 修复失败（需联网）：{}",
                    String::from_utf8_lossy(&out.stderr)
                        .lines()
                        .rev()
                        .take(5)
                        .collect::<Vec<_>>()
                        .join(" ")
                ))
            }
        }
        _ => Err(format!("未知资产：{asset_id}")),
    }
}

#[tauri::command]
async fn prefetch_asset(app: tauri::AppHandle, asset_id: String) -> Result<String, String> {
    // spawn_blocking 让重活跑在专用线程，前端 invoke 在真正干完后才 resolve/reject。
    let handle = tauri::async_runtime::spawn_blocking(move || run_prefetch(&app, &asset_id));
    match handle.await {
        Ok(result) => result,
        Err(_) => Err("下载任务异常终止".into()),
    }
}

/// 客户端模式下，网页经 Rust 代理调用本地引擎做扒谱。
///
/// 网页直连 127.0.0.1 会被 WKWebView 当作混合内容 / 私有网络拦截
/// （这正是「检测面板绿了但一上传就 ENGINE_OFFLINE」的根因），
/// 因此由 Rust 用 curl 子进程转发（与 get_engine_status 同路，可靠）。
///
/// 返回引擎原始 JSON 字符串；失败返回含真实原因的 Err（前端直接展示，无需 DevTools）。
#[tauri::command]
fn analyze_local_engine(file_name: String, file_bytes: String) -> Result<String, String> {
    let port = ENGINE_PORT;
    let base = format!("http://{ENGINE_HOST}:{port}");

    // 网页经 Tauri 二进制通道传来的音频，这里为兼容 tauri-build 命令权限代码生成，
    // 改用 base64 字符串（Vec<u8> 参数会导致该版本代码生成跳过本命令的权限）。
    let bytes = B64
        .decode(&file_bytes)
        .map_err(|e| format!("音频数据 base64 解码失败：{e}"))?;

    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let tmp = std::env::temp_dir().join(format!(
        "dashi_analyze_{}_{}.tmp",
        std::process::id(),
        nanos
    ));
    std::fs::write(&tmp, &bytes).map_err(|e| format!("写入临时文件失败：{e}"))?;

    let tmp_display = tmp.display().to_string();
    // 把原始文件名带给引擎：/api/analyze 靠 file.filename 决定临时文件后缀，
    // 否则 .tmp 后缀会让非 mp3 格式（wav/flac/ogg/aac）识别失败。
    // 过滤会破坏 curl -F "name=@path;filename=..." 语法的字符。
    let safe_name: String = file_name
        .chars()
        .filter(|c| !matches!(c, ';' | '"' | '\n' | '\r'))
        .collect();
    let form_arg = format!("file=@{tmp_display};filename={safe_name}");
    let out = Command::new("curl")
        .args([
            "-s",
            "--max-time",
            "300",
            "-w",
            "\n__HTTP__%{http_code}",
            "-X",
            "POST",
            &format!("{base}/api/analyze"),
            "-H",
            "Origin: https://qq157788394.github.io",
            "-F",
            &form_arg,
        ])
        .output()
        .map_err(|e| format!("调用本地引擎失败（curl 无法启动）：{e}"))?;
    let _ = std::fs::remove_file(&tmp);

    let stdout = String::from_utf8_lossy(&out.stdout);
    let (body, code) = match stdout.rsplit_once("__HTTP__") {
        Some((b, c)) => (b.trim_end().to_string(), c.trim().to_string()),
        None => (stdout.to_string(), String::new()),
    };
    if code == "200" {
        Ok(body)
    } else {
        Err(format!("本地引擎返回错误（HTTP {code}）：{body}"))
    }
}

/// 查询引擎安装/运行状态，供前端在上传前展示依赖清单。
/// 返回：uv 运行时是否就绪、随包源码是否存在、依赖环境(.venv)是否已建、
/// 引擎服务是否在跑、在跑时的端口、端到端自检(analysis_ok)是否通过。
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
    // 服务在跑时再读 /api/health 的 JSON，提取 model_ready 与三层 layers。
    // 不可达（running=false）时直接置 false / null，避免多余探测。
    let (model_ready, layers, analysis_ok, ffmpeg_available, compress_ok, assets) = if running {
        let health = engine_health_json(port);
        // 新版 /api/health 含 model_ready + layers；旧版仅有 status。
        // 缺失时返回 Null（前端显示"未知"），避免误判为 false（永远 ❌）。
        let mr = health
            .as_ref()
            .and_then(|j| j.get("model_ready").and_then(|b| b.as_bool()));
        let ly = health
            .as_ref()
            .and_then(|j| j.get("layers"))
            .cloned()
            .unwrap_or(serde_json::Value::Null);
        // 端到端自检：旧引擎无 /api/selfcheck -> None（保守拦截，不误放行）。
        // 同一次响应里顺带取出 ffmpeg_available / compress_ok，避免重复 HTTP 探测。
        let sc = engine_selfcheck_json(port);
        let ao = sc
            .as_ref()
            .and_then(|j| j.get("analysis_ok").and_then(|b| b.as_bool()));
        let fa = sc
            .as_ref()
            .and_then(|j| j.get("ffmpeg_available").and_then(|b| b.as_bool()));
        let co = sc
            .as_ref()
            .and_then(|j| j.get("compress_ok").and_then(|b| b.as_bool()));
        // 逐条资产就绪状态（lv 权重 / madmom 模型 / chord-romanizer / ffmpeg）。
        // 缺失项即检测面板要展示并提供「下载/修复」按钮的内容。
        let aj = engine_assets_json(port);
        let assets_val = aj
            .as_ref()
            .and_then(|j| j.get("assets").cloned())
            .unwrap_or(serde_json::Value::Null);
        (mr, ly, ao, fa, co, assets_val)
    } else {
        (
            None,
            serde_json::Value::Null,
            None,
            None,
            None,
            serde_json::Value::Null,
        )
    };
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
        "model_ready": model_ready,
        "layers": layers,
        "analysis_ok": analysis_ok,
        "ffmpeg_available": ffmpeg_available,
        "compress_ok": compress_ok,
        "assets": assets,
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
        .invoke_handler(tauri::generate_handler![install_local_engine, get_engine_status, analyze_local_engine, prefetch_asset])
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
