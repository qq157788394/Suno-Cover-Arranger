// 大师来了 —— Tauri v2 薄壳
// 职责极薄：① 加载远程/本地页面（见 tauri.conf.json 的 url）
//            ② 启动时自动拉起本地 Python 引擎（runtime 内自包含 Python 直启）
//            ③ 引擎以「自包含 runtime」（python-build-standalone + 依赖 + 模型 + 代码）
//               形式随 .app 分发（Resources/local-engine），无需 uv、无需运行时联网装依赖
//            ④ 退出时回收引擎子进程
// 运行时只管启动，不碰 uv、不联网装东西；新版本经签名引擎包热更新（失败回退内置版）。

use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpStream;
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex, OnceLock};
use std::time::{Duration, Instant};

use tauri::{Emitter, Manager};

/// 引擎热更新模块：比对 engine-manifest.json，下载签名引擎包并原子替换 runtime，失败回退内置基线。
mod engine_update;
use engine_update::{check_engine_update, update_engine};

/// Suno 试听缓存网络层（M1）：解析分享链接 → 取权 → 下载加密 m4a。
mod suno_probe;

/// Suno 试听缓存解密层（M2）：SHA256(glt) → AES-GCM 解包 → AES-CTR 还原 fMP4。
mod suno_decrypt;

/// Suno 试听缓存转码层（M2）：ffmpeg 转 320kbps MP3 落盘。
mod suno_transcode;

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

// （已移除 uv 依赖：运行时改用 python-build-standalone 自包含解释器，不再探测/调用 uv）

/// 极小 HTTP GET 探测引擎健康检查是否就绪（仅本机 127.0.0.1）。
fn engine_health_ok(port: u16) -> bool {
    if let Ok(mut stream) = TcpStream::connect((ENGINE_HOST, port)) {
        // 读超时：引擎异常不关连接时不至于永久阻塞本线程（审查 #7）。
        let _ = stream.set_read_timeout(Some(Duration::from_secs(5)));
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
    // 读超时：自检可能跑数十秒，给足 60s 上限，但引擎异常时不至于永久阻塞（审查 #7）。
    let _ = stream.set_read_timeout(Some(Duration::from_secs(60)));
    let req =
        format!("GET {path} HTTP/1.1\r\nHost: {ENGINE_HOST}:{port}\r\nConnection: close\r\n\r\n");
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

// （已移除 engine_assets_json：逐资产下载模式废弃，引擎改为构建期自包含 runtime 整体分发）

/// 端到端自检结果进程内缓存（审查 #6）。
/// 自检会真实跑整条 ML 管线（含首次权重下载），耗时可观；但同一引擎进程生命周期内结果稳定，
/// 故按端口缓存，避免每次检测/重检测/预拉取都重跑全量自检、拖慢就绪。
/// 引擎停掉后 `running` 为 false，get_engine_status 不会走到这里取缓存，故端口不变时安全复用。
static SELFCHECK_CACHE: OnceLock<Mutex<Option<(u16, serde_json::Value)>>> = OnceLock::new();

fn cached_selfcheck(port: u16) -> Option<serde_json::Value> {
    let cache = SELFCHECK_CACHE.get_or_init(|| Mutex::new(None));
    let guard = cache.lock().ok()?;
    match guard.as_ref() {
        Some((p, v)) if *p == port => Some(v.clone()),
        _ => None,
    }
}

fn store_selfcheck(port: u16, val: serde_json::Value) {
    let cache = SELFCHECK_CACHE.get_or_init(|| Mutex::new(None));
    if let Ok(mut guard) = cache.lock() {
        *guard = Some((port, val));
    }
}

/// 热更新可用性进程内缓存：check_engine_update 拉取清单比对后写入，
/// get_engine_status 读取以展示「是否有可用更新」，避免每次检测都联网拉清单。
static ENGINE_UPDATE_CACHE: OnceLock<Mutex<Option<bool>>> = OnceLock::new();

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
/// 返回子进程句柄（便于退出时回收）；runtime 缺失或启动失败返回 None 并写日志。
///
/// 运行时**直接调用 runtime 内的自包含 Python**（python-build-standalone），
/// 完全绕过 `uv`、不触发 uv sync、不联网装依赖。
/// - 解释器：`<dir>/runtime/bin/python3`（构建期生成，uv 管不到）
/// - 代码：`<dir>/main.py`（dev 用源码；prod 用同步到 app_data_dir 的副本）
/// - 依赖：`<dir>/runtime/lib/python3.12/site-packages`（pip install --target 产物）
/// - 模型缓存：HOME 重定向到 `<dir>/runtime/models/home`（构建期已预热，离线可用）
fn start_engine_process(app: &tauri::AppHandle, dir: &Path) -> Option<Child> {
    let rt = dir.join("runtime");
    let py = rt.join("bin").join("python3");
    if !py.exists() {
        log(&format!(
            "runtime 缺失解释器：{:?}（引擎未打包或构建失败）",
            py
        ));
        return None;
    }
    let main_py = dir.join("main.py");
    if !main_py.exists() {
        log(&format!("引擎目录无 main.py：{:?}", dir));
        return None;
    }
    let models_home = rt.join("models").join("home");
    let site_pkg = rt.join("lib").join("python3.12").join("site-packages");

    let log_path = engine_log_path(app);
    let log_file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .ok();
    let stderr_file = log_file.as_ref().and_then(|f| f.try_clone().ok());

    match Command::new(&py)
        .arg(&main_py)
        .current_dir(dir)
        .env("LOCAL_ENGINE_PORT", ENGINE_PORT.to_string())
        .env("HOME", &models_home)
        .env("PYTHONPATH", &site_pkg)
        .env("HF_HUB_OFFLINE", "1")
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

// （已移除 venv 概念：运行时改用 runtime/bin/python3 自包含解释器，见 start_engine_process）

/// 解析 local-engine 运行目录（按优先级）：
/// 1. DASHI_ENGINE_DIR 环境变量（高级用户/启动器设置绝对路径，最高优先）
/// dev 构建（debug_assertions）：优先项目源码 local-engine（CWD / exe 向上），
///   确保「改源码即见效」，不再被软件目录里可能陈旧的拷贝截胡。
/// release 构建：优先已安装的软件目录（随 .app 分发），源码仅作兜底。
/// 2. 已安装的引擎：软件目录下的 local-engine（首次安装后落此处）
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

    let is_dev = cfg!(debug_assertions);

    // 项目源码探测（CWD + 从 exe 向上遍历）
    let find_source = || -> Option<PathBuf> {
        if let Ok(cwd) = std::env::current_dir() {
            let cand = cwd.join("local-engine");
            if cand.exists() {
                return Some(cand);
            }
        }
        if let Ok(exe) = std::env::current_exe() {
            let mut p = exe.parent();
            while let Some(dir) = p {
                let cand = dir.join("local-engine");
                if cand.exists() {
                    return Some(cand);
                }
                p = dir.parent();
            }
        }
        None
    };

    // dev：源码优先于软件目录陈旧拷贝
    if is_dev {
        if let Some(src) = find_source() {
            return src;
        }
    }

    // ── 策略 2：已安装的引擎（软件目录，含自包含 runtime）──
    if let Ok(data) = app.path().app_data_dir() {
        let installed = data.join("local-engine");
        if installed.join("runtime").exists() || installed.join("main.py").exists() {
            return installed;
        }
    }

    // release：源码兜底
    if !is_dev {
        if let Some(src) = find_source() {
            return src;
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

/// 把包内 Resources/local-engine（含自包含 runtime + 引擎代码）同步到软件目录
/// （app_data_dir/local-engine），确保重建 .app 后运行的是新版，无需手动点「安装」。
/// 差量策略：dest 的 runtime/VERSION 与 src 一致、且 dest/main.py 已存在，则跳过
/// 整目录拷贝（runtime 体积大，避免每次启动都复制数百 MB）。
/// 拷贝排除 __pycache__ / .venv / .git / .deps_hash 等无需产物。
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
    // 差量：版本一致且代码已存在，跳过（runtime 大，避免重复拷贝）
    let src_ver = fs::read_to_string(src.join("runtime").join("VERSION")).ok();
    let dest_ver = fs::read_to_string(dest.join("runtime").join("VERSION")).ok();
    if dest.join("main.py").exists() && src_ver == dest_ver {
        log("引擎已是最新（runtime/VERSION 一致），跳过同步");
        return;
    }
    log(&format!("同步引擎（含 runtime）到 {}", dest.display()));
    if let Err(e) = copy_dir_all(&src, &dest) {
        log(&format!("引擎同步失败（不影响已部署版本）: {e}"));
    } else {
        log(&format!("已同步引擎到 {}", dest.display()));
    }
}

/// 启动本地引擎（应用启动时自动调用）。
/// ① 同步包内最新引擎（含 runtime）到软件目录（重建 .app 即生效）；
/// ② 清理占用端口的残留引擎，避免孤儿进程；
/// ③ 定位目录后启动自包含 runtime 并轮询就绪。
fn spawn_engine(app: &tauri::AppHandle) -> Option<Child> {
    // ① 同步最新引擎（含 runtime），覆盖旧 main.py，不触及已写缓存
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

    // ③ 拉起最新引擎（自包含 runtime，无需 uv）
    log(&format!("准备启动引擎：cwd={:?}", dir));
    let child = start_engine_process(app, &dir);
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

/// 递归复制引擎目录到目标（用于把随包引擎部署到软件目录）。
/// 排除 __pycache__ / .venv / .git / .deps_hash 等无需/敏感产物，避免污染软件目录与重复拷贝体积。
fn copy_dir_all(src: &Path, dst: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let name = entry.file_name();
        let name_str = name.to_string_lossy();
        if name_str == "__pycache__"
            || name_str == ".venv"
            || name_str == ".git"
            || name_str == ".deps_hash"
        {
            continue;
        }
        let ty = entry.file_type()?;
        let target = dst.join(&name);
        if ty.is_dir() {
            copy_dir_all(&entry.path(), &target)?;
        } else {
            fs::copy(entry.path(), &target)?;
        }
    }
    Ok(())
}

// （已移除 run_install：引擎改为构建期自包含 runtime 随包分发，应用启动即自动拉起，
// 无需运行时 uv sync「安装」。相关热更新逻辑见 update_engine 命令。）

// （已移除 install_local_engine / run_prefetch / prefetch_asset / asset_pkg_name：
// 引擎改为构建期自包含 runtime 随包分发，无需运行时 uv 安装 / 逐资产下载。
// 新版本经签名引擎包热更新，见 update_engine 命令。）

/// 客户端模式下，网页经 Rust 代理调用本地引擎做扒谱。
///
/// 网页直连 127.0.0.1 会被 WKWebView 当作混合内容 / 私有网络拦截
/// （这正是「检测面板绿了但一上传就 ENGINE_OFFLINE」的根因），
/// 因此由 Rust 用原生 reqwest 转发（与 get_engine_status 同路，可靠）。
///
/// 入参 file_bytes 为原始音频字节（Vec<u8>），由前端以 Uint8Array 经 Tauri IPC 二进制通道传入，
/// 不再经 base64 中转（去掉 33% 体积开销与主线程编码，ADR-6 / 审查 #5/#7）。
/// 用 reqwest multipart 直接以内存字节构造表单，无需落临时文件。
///
/// 全程异步（ADR-1 + ADR-6 合并）：reqwest 让出运行时，不再 spawn_blocking，亦不依赖 curl 子进程。
async fn run_analyze(file_name: &str, file_bytes: Vec<u8>) -> Result<String, String> {
    let port = ENGINE_PORT;
    let url = format!("http://{ENGINE_HOST}:{port}/api/analyze");

    // 把原始文件名带给引擎：/api/analyze 靠 file.filename 决定临时文件后缀，
    // 否则缺后缀会让非 mp3 格式（wav/flac/ogg/aac）识别失败。
    // 仅保留安全白名单字符，杜绝路径/表单注入（审查 #14）。
    let safe_name: String = file_name
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-'))
        .collect();

    let part = reqwest::multipart::Part::bytes(file_bytes)
        .file_name(safe_name)
        .mime_str("application/octet-stream")
        .map_err(|e| format!("构造上传表单失败：{e}"))?;
    let form = reqwest::multipart::Form::new().part("file", part);

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(300))
        .build()
        .map_err(|e| format!("创建 HTTP 客户端失败：{e}"))?;

    let resp = client
        .post(&url)
        // 不显式带 Origin：本机 Rust->引擎属服务端调用，引擎 _origin_ok(None) 直接放行，
        // 且规避收紧后的跨域头误判（审查 ADR-2）。
        .multipart(form)
        .send()
        .await;

    match resp {
        Ok(r) => {
            let status = r.status();
            let body = r
                .text()
                .await
                .map_err(|e| format!("读取引擎响应失败：{e}"))?;
            if status == reqwest::StatusCode::OK {
                Ok(body)
            } else {
                Err(format!(
                    "本地引擎返回错误（HTTP {}）：{}",
                    status.as_u16(),
                    body
                ))
            }
        }
        Err(e) => {
            // 连接被拒 / 超时 = 引擎确实没在跑 → 离线语义。
            // 前端按 [ENGINE_OFFLINE] 前缀分流到「引擎连接中断」面板（审查 #8）。
            Err(format!(
                "[ENGINE_OFFLINE]: 无法连接到本地引擎（{}:{}），引擎可能已停止运行：{}",
                ENGINE_HOST, port, e
            ))
        }
    }
}

/// Tauri 命令：代理网页调用本地引擎（ADR-1 + ADR-6 合并）。
/// 入参 file_bytes 为原始字节（Vec<u8>），前端以 Uint8Array 经 IPC 传入，免 base64 中转。
#[tauri::command]
async fn analyze_local_engine(file_name: String, file_bytes: Vec<u8>) -> Result<String, String> {
    run_analyze(&file_name, file_bytes).await
}

/// Tauri 命令：Suno 试听缓存 M1 冒烟（解析 → 取权 → 下载加密 m4a）。
/// browser-token 生成算法尚未具备前，内部会以明确消息失败，其他逻辑已可编译。
#[tauri::command]
async fn suno_trial_probe(link: String) -> Result<serde_json::Value, String> {
    suno_probe::probe(&link).await
}

/// Tauri 命令：Suno 试听缓存端到端（M1+M2）：解析 → 取权 → 下载 → 解密 → ffmpeg 转 320k MP3。
/// 产物落临时目录，返回 `{ content_id, mp3_size, mp3_path }` 供前端接管/呈现。
/// engine_dir 由 Rust 侧 resolve_engine_dir 决定，用于兜底定位 imageio_ffmpeg。
#[tauri::command]
async fn run_trial_cache(app: tauri::AppHandle, link: String) -> Result<serde_json::Value, String> {
    let engine_dir = resolve_engine_dir(&app);
    // 缓存产物落 appData 固定子目录；取不到 appData 时兜底系统临时目录。
    let data_dir_res = app.path().app_data_dir();
    log(&format!(
        "run_trial_cache app_data_dir={:?}",
        data_dir_res.as_ref().map(|p| p.to_string_lossy().to_string())
    ));
    let cache_dir = data_dir_res
        .map(|d| d.join("suno_trial_cache"))
        .unwrap_or_else(|_| std::env::temp_dir().join("suno_trial_cache"));
    log(&format!("run_trial_cache cache_dir={}", cache_dir.display()));
    // 阶段进度事件：前端 listen("suno-trial-progress") 接收 { stage }，逐步渲染步骤条。
    let app_handle = app.clone();
    suno_probe::run_trial_pipeline(&link, Some(&engine_dir), &cache_dir, move |stage: &str| {
        let _ = app_handle.emit("suno-trial-progress", serde_json::json!({ "stage": stage }));
    })
    .await
}

/// Tauri 命令：在系统文件管理器中打开指定文件所在文件夹并选中该文件。
/// macOS 用 `open -R`；Windows 用 `explorer /select,`；其余平台用 `xdg-open` 打开父目录。
#[tauri::command]
fn reveal_in_folder(path: String) -> Result<(), String> {
    let p = PathBuf::from(&path);
    if !p.exists() {
        return Err(format!("文件不存在：{path}"));
    }
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path])
            .spawn()
            .map_err(|e| format!("打开所在文件夹失败：{e}"))?;
    }
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(format!("/select,{}", p.display()))
            .spawn()
            .map_err(|e| format!("打开所在文件夹失败：{e}"))?;
    }
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        if let Some(parent) = p.parent() {
            Command::new("xdg-open")
                .arg(parent)
                .spawn()
                .map_err(|e| format!("打开所在文件夹失败：{e}"))?;
        }
    }
    Ok(())
}

/// 启动时清空试听缓存目录（上次会话的 fmp4/mp3 产物无留存价值，避免磁盘累积）。
/// 该功能定位为「缓存」而非「下载」，按用户要求每次启动即清空，不留历史。
fn clear_trial_cache(app: &tauri::AppHandle) {
    let Ok(dir) = app.path().app_data_dir() else {
        return;
    };
    let cache_dir = dir.join("suno_trial_cache");
    if cache_dir.exists() {
        if let Err(e) = std::fs::remove_dir_all(&cache_dir) {
            log(&format!("清空试听缓存目录失败：{e}"));
        }
    }
}

/// Tauri 命令：把试听缓存 mp3 另存到系统「下载」目录（macOS 即 ~/Downloads），
/// 文件名用歌曲名（非法字符已清理，重名自动追加 ` (n)` 避免覆盖），返回最终保存的绝对路径。
/// 前端据此提示「已保存」并提供「打开所在文件夹」（reveal_in_folder 定位真实文件）。
#[tauri::command]
async fn save_trial_mp3(
    app: tauri::AppHandle,
    mp3_path: String,
    filename: String,
) -> Result<String, String> {
    let src = PathBuf::from(&mp3_path);
    if !src.exists() {
        return Err(format!("缓存文件不存在：{mp3_path}"));
    }
    let base = suno_probe::sanitize_filename(&filename);
    let dest_dir = app
        .path()
        .download_dir()
        .map_err(|e| format!("获取下载目录失败：{e}"))?;
    // 文件复制（10MB+）放 blocking 线程执行，避免阻塞 async runtime / 主线程。
    tauri::async_runtime::spawn_blocking(move || {
        std::fs::create_dir_all(&dest_dir).map_err(|e| format!("创建下载目录失败：{e}"))?;
        // 重名追加 (n)，超过上限后追加时间戳兜底，避免死循环。
        let mut dest = dest_dir.join(format!("{base}.mp3"));
        let mut n = 1;
        while dest.exists() && n <= 999 {
            dest = dest_dir.join(format!("{base} ({n}).mp3"));
            n += 1;
        }
        if dest.exists() {
            let ts = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_millis())
                .unwrap_or(0);
            dest = dest_dir.join(format!("{base}-{ts}.mp3"));
        }
        std::fs::copy(&src, &dest).map_err(|e| format!("保存 MP3 失败：{e}"))?;
        Ok::<String, String>(dest.to_string_lossy().to_string())
    })
    .await
    .map_err(|e| format!("保存任务失败：{e}"))?
}

/// 查询引擎状态，供前端检测面板展示与「更新」按钮判定。
/// 方案 A 自包含 runtime 的新结构：
/// - source_present：引擎代码 main.py 是否存在
/// - bundled_ok：自包含 runtime（runtime/bin/python3）是否已随包分发
/// - engine_version：runtime/VERSION（供热更新比对）
/// - update_available：check_engine_update 拉取清单比对后写入的进程内缓存
/// - running / model_ready / layers / analysis_ok / ffmpeg_available / compress_ok：运行时健康度
#[tauri::command]
fn get_engine_status(app: tauri::AppHandle) -> serde_json::Value {
    let dir = resolve_engine_dir(&app);
    let runtime = dir.join("runtime");
    let source_present = dir.join("main.py").exists();
    let bundled_ok = runtime.join("bin").join("python3").exists();
    let engine_version = fs::read_to_string(runtime.join("VERSION")).unwrap_or_default();
    let update_available = ENGINE_UPDATE_CACHE
        .get()
        .and_then(|m| m.lock().ok().and_then(|g| *g))
        .unwrap_or(false);

    let port = resolve_engine_port(&app);
    let running = engine_health_ok(port);
    // 服务在跑时再读 /api/health 的 JSON，提取 model_ready 与三层 layers。
    // 不可达（running=false）时直接置 false / null，避免多余探测。
    let (model_ready, layers, analysis_ok, ffmpeg_available, compress_ok) = if running {
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
        // 进程内缓存：同一引擎端口只跑一次全量自检（审查 #6）。
        let sc = cached_selfcheck(port).or_else(|| {
            let v = engine_selfcheck_json(port);
            if let Some(ref val) = v {
                store_selfcheck(port, val.clone());
            }
            v
        });
        let ao = sc
            .as_ref()
            .and_then(|j| j.get("analysis_ok").and_then(|b| b.as_bool()));
        let fa = sc
            .as_ref()
            .and_then(|j| j.get("ffmpeg_available").and_then(|b| b.as_bool()));
        let co = sc
            .as_ref()
            .and_then(|j| j.get("compress_ok").and_then(|b| b.as_bool()));
        (mr, ly, ao, fa, co)
    } else {
        (None, serde_json::Value::Null, None, None, None)
    };
    let port_val = if running {
        serde_json::json!(port)
    } else {
        serde_json::Value::Null
    };
    serde_json::json!({
        "source_present": source_present,
        "bundled_ok": bundled_ok,
        "engine_version": engine_version,
        "update_available": update_available,
        "running": running,
        "model_ready": model_ready,
        "layers": layers,
        "analysis_ok": analysis_ok,
        "ffmpeg_available": ffmpeg_available,
        "compress_ok": compress_ok,
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
            // 启动即清空上次会话的试听缓存（fmp4/mp3 不作为持久产物留存）。
            clear_trial_cache(app.handle());
            // 启动即尝试拉起已安装/存在的本地引擎；未安装会失败（页面提示安装按钮）
            let child = spawn_engine(app.handle());
            *engine_child_setup.lock().unwrap() = child;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_engine_status,
            analyze_local_engine,
            update_engine,
            check_engine_update,
            suno_trial_probe,
            run_trial_cache,
            reveal_in_folder,
            save_trial_mp3
        ])
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
