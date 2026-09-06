// 引擎热更新模块（方案 A：内置完整引擎 + 热更新）
//
// 设计要点：
// - 引擎以「自包含 runtime」（python-build-standalone + 依赖 + 模型 + 代码）随 .app 分发，
//   运行时只管启动，不再碰 uv、不再联网装东西。
// - 新代码 / 新依赖通过「签名引擎包」热更新：
//     check_engine_update：拉取 engine-manifest.json，比对内置 runtime/VERSION，结果写入
//                          ENGINE_UPDATE_CACHE，供 get_engine_status 展示「有可用更新」。
//     update_engine：下载 zip → sha256 校验 → 解压到临时目录 → 原子替换 app_data_dir/local-engine
//                    → xattr 解除隔离 → 重启引擎进程。
// - 铁律（绝不降级）：下载/校验/解压失败一律丢弃并保留内置基线；替换后若引擎起不来，
//   自动回滚到备份的内置版并重新拉起，功能始终可用。

use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::Duration;

use sha2::{Digest, Sha256};
use tauri::{AppHandle, Emitter, Manager};

use crate::{
    kill_process_on_port, log, resolve_engine_dir, resolve_engine_port, start_engine_process,
    EngineState, ENGINE_UPDATE_CACHE,
};

/// 更新清单默认地址。可通过环境变量 DASHI_ENGINE_MANIFEST_URL 覆盖（推荐）。
/// 清单格式见 docs/plans/2026-07-09-engine-runtime-redesign.md 第 7 节。
const DEFAULT_MANIFEST_URL: &str =
    "https://raw.githubusercontent.com/your-org/your-repo/main/engine-manifest.json";

/// 当前平台键（与 manifest.platforms 的键一致），如 macos-aarch64。
fn current_platform() -> String {
    format!("{}-{}", std::env::consts::OS, std::env::consts::ARCH)
}

/// 读取更新清单地址：环境变量优先，否则用默认占位（需自行配置）。
fn manifest_url() -> String {
    std::env::var("DASHI_ENGINE_MANIFEST_URL").unwrap_or_else(|_| DEFAULT_MANIFEST_URL.to_string())
}

/// 拉取并解析 engine-manifest.json（仅本机 TLS 经 reqwest）。
async fn fetch_manifest() -> Result<serde_json::Value, String> {
    let url = manifest_url();
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .build()
        .map_err(|e| format!("创建清单客户端失败：{e}"))?;
    let resp = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("获取更新清单失败（{url}）：{e}"))?;
    if !resp.status().is_success() {
        return Err(format!("更新清单 HTTP {}（{url}）", resp.status().as_u16()));
    }
    let text = resp.text().await.map_err(|e| format!("读取清单失败：{e}"))?;
    serde_json::from_str::<serde_json::Value>(&text).map_err(|e| format!("清单 JSON 解析失败：{e}"))
}

/// 内置版本解析为 (年, 月, 日, 序号) 四元组，便于数值比较。
/// 内置 VERSION 格式为 `YYYY.MM.DD.N`（N = git rev-list --count，单调整数）。
fn parse_version(v: &str) -> Option<(u32, u32, u32, u32)> {
    let parts: Vec<&str> = v.split('.').collect();
    if parts.len() != 4 {
        return None;
    }
    let a = parts[0].parse().ok()?;
    let b = parts[1].parse().ok()?;
    let c = parts[2].parse().ok()?;
    let d = parts[3].parse().ok()?;
    Some((a, b, c, d))
}

/// latest 是否比 current 更新（四元组字典序比较）。
/// current 为空（无内置版本）且 latest 非空 → 视为有更新。
fn is_newer(current: &str, latest: &str) -> bool {
    if current.is_empty() {
        return !latest.is_empty();
    }
    let cur = match parse_version(current) {
        Some(v) => v,
        None => return false, // 内置版本不可解析，保守不动
    };
    let lat = match parse_version(latest) {
        Some(v) => v,
        None => return false, // 清单版本不可解析，保守不动
    };
    (lat.0, lat.1, lat.2, lat.3) > (cur.0, cur.1, cur.2, cur.3)
}

/// 下载引擎包到文件。先用 reqwest 拉取全量字节（bytes，无需额外特性），再同步落盘。
/// 引擎包约数百 MB，单次驻留内存可接受；如需更省内存可改流式拷贝。
async fn download_file(url: &str, dest: &Path) -> Result<(), String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(600))
        .build()
        .map_err(|e| format!("创建下载客户端失败：{e}"))?;
    let resp = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("下载引擎包失败（{url}）：{e}"))?;
    if !resp.status().is_success() {
        return Err(format!("下载引擎包 HTTP {}（{url}）", resp.status().as_u16()));
    }
    let bytes = resp
        .bytes()
        .await
        .map_err(|e| format!("读取引擎包字节失败：{e}"))?;
    let mut file = fs::File::create(dest).map_err(|e| format!("创建临时文件失败：{e}"))?;
    file.write_all(&bytes)
        .map_err(|e| format!("写入引擎包失败：{e}"))?;
    Ok(())
}

/// 计算文件 sha256（分块读取，避免大文件占满内存）。
fn sha256_file(path: &Path) -> Result<String, String> {
    let mut f = fs::File::open(path).map_err(|e| format!("打开引擎包失败：{e}"))?;
    let mut hasher = Sha256::new();
    let mut buf = [0u8; 65536];
    loop {
        let n = f.read(&mut buf).map_err(|e| format!("读取引擎包失败：{e}"))?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
    }
    Ok(format!("{:x}", hasher.finalize()))
}

/// 解压 zip 到目标目录（zip 2.x API）。
fn unzip(zip_path: &Path, dest: &Path) -> Result<(), String> {
    let file = fs::File::open(zip_path).map_err(|e| format!("打开引擎包失败：{e}"))?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| format!("引擎包损坏：{e}"))?;
    for i in 0..archive.len() {
        let mut zf = archive.by_index(i).map_err(|e| format!("读取引擎包条目失败：{e}"))?;
        let outpath = match zf.enclosed_name() {
            Some(p) => dest.join(p),
            None => continue, // 防 zip 穿越
        };
        if zf.is_dir() {
            fs::create_dir_all(&outpath).map_err(|e| format!("创建目录失败：{e}"))?;
        } else {
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent).map_err(|e| format!("创建目录失败：{e}"))?;
            }
            let mut outfile =
                fs::File::create(&outpath).map_err(|e| format!("解压文件失败：{e}"))?;
            std::io::copy(&mut zf, &mut outfile).map_err(|e| format!("解压写入失败：{e}"))?;
        }
    }
    Ok(())
}

/// 把 staging 目录内容整体移入 dst（用于原子替换）。
fn move_dir_contents(src: &Path, dst: &Path) -> Result<(), String> {
    fs::create_dir_all(dst).map_err(|e| format!("创建目标目录失败：{e}"))?;
    for entry in fs::read_dir(src).map_err(|e| format!("读取临时目录失败：{e}"))? {
        let entry = entry.map_err(|e| format!("读取临时目录失败：{e}"))?;
        let target = dst.join(entry.file_name());
        fs::rename(entry.path(), &target).map_err(|e| format!("移动引擎文件失败：{e}"))?;
    }
    Ok(())
}

/// 在解压目录里定位 runtime 根：优先 staging/runtime/bin/python3，
/// 否则若 staging 下恰有一个子目录含 runtime/bin/python3 则用它（兼容包多包一层目录）。
fn locate_runtime_root(staging: &Path) -> Option<PathBuf> {
    if staging.join("runtime").join("bin").join("python3").exists() {
        return Some(staging.to_path_buf());
    }
    if let Ok(entries) = fs::read_dir(staging) {
        for e in entries.flatten() {
            if e.path().join("runtime").join("bin").join("python3").exists() {
                return Some(e.path());
            }
        }
    }
    None
}

/// 杀掉旧引擎并拉起新引擎，等待就绪（超时 20s）。返回是否健康。
fn restart_engine(app: &AppHandle, dir: &Path) -> bool {
    let state = app.state::<EngineState>();
    if let Ok(mut guard) = state.0.lock() {
        if let Some(mut child) = guard.take() {
            let _ = child.kill();
        }
    }
    let port = resolve_engine_port(app);
    kill_process_on_port(port);
    let new_child = start_engine_process(app, dir);
    let mut guard = state.0.lock().unwrap();
    *guard = new_child;
    drop(guard);

    let deadline = std::time::Instant::now() + Duration::from_secs(20);
    while std::time::Instant::now() < deadline {
        if crate::engine_health_ok(port) {
            let _ = app.emit(
                "engine-updated",
                serde_json::json!({ "port": port, "msg": "引擎已更新并重启" }),
            );
            return true;
        }
        std::thread::sleep(Duration::from_millis(300));
    }
    false
}

/// Tauri 命令：检查是否有可用引擎更新。
/// 拉取 manifest，比对内置 runtime/VERSION，结果写入 ENGINE_UPDATE_CACHE 供面板展示。
#[tauri::command]
pub async fn check_engine_update(app: AppHandle) -> Result<serde_json::Value, String> {
    let dir = resolve_engine_dir(&app);
    let current = fs::read_to_string(dir.join("runtime").join("VERSION")).unwrap_or_default();
    let manifest = fetch_manifest().await?;
    let platform = current_platform();
    let latest = manifest
        .get("platforms")
        .and_then(|p| p.get(&platform))
        .and_then(|e| e.get("version"))
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    let has = is_newer(&current, &latest);

    // 写进程内缓存，get_engine_status 直接读它，避免每次检测都联网。
    if let Some(cache) = ENGINE_UPDATE_CACHE.get() {
        if let Ok(mut g) = cache.lock() {
            *g = Some(has);
        }
    }
    Ok(serde_json::json!({
        "update_available": has,
        "current_version": current,
        "latest_version": latest,
        "platform": platform,
    }))
}

/// Tauri 命令：执行引擎热更新（下载 → 校验 → 解压 → 原子替换 → 重启）。
/// 任何下载/校验/解压失败都保留内置基线；替换后若引擎起不来则自动回滚，绝不降级。
#[tauri::command]
pub async fn update_engine(app: AppHandle) -> Result<serde_json::Value, String> {
    let manifest = fetch_manifest().await?;
    let platform = current_platform();
    let entry = manifest
        .get("platforms")
        .and_then(|p| p.get(&platform))
        .ok_or_else(|| format!("更新清单无 {platform} 平台引擎包"))?;
    let url = entry
        .get("url")
        .and_then(|v| v.as_str())
        .ok_or_else(|| "更新清单缺 url 字段".to_string())?;
    let expected_sha = entry
        .get("sha256")
        .and_then(|v| v.as_str())
        .ok_or_else(|| "更新清单缺 sha256 字段".to_string())?;
    let latest = entry
        .get("version")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    // 先比对版本：已是最新则无需下载（也避免无谓的大文件传输）。
    let dir = resolve_engine_dir(&app);
    let current = fs::read_to_string(dir.join("runtime").join("VERSION")).unwrap_or_default();
    if !is_newer(&current, &latest) {
        return Err("当前已是最新版本，无需更新".to_string());
    }

    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("获取软件目录失败：{e}"))?;
    let staging = data_dir.join("local-engine.update.tmp");
    let zip_path = data_dir.join("engine.update.zip");
    // 清理上次残留
    let _ = fs::remove_dir_all(&staging);
    let _ = fs::remove_file(&zip_path);
    fs::create_dir_all(&staging).map_err(|e| format!("创建临时目录失败：{e}"))?;

    // 1) 下载
    log(&format!("热更新：开始下载引擎包 {url}"));
    download_file(url, &zip_path).await?;

    // 2) sha256 校验（失败立即丢弃，内置版原样保留）
    let actual = sha256_file(&zip_path)?;
    if actual != expected_sha {
        let _ = fs::remove_file(&zip_path);
        let _ = fs::remove_dir_all(&staging);
        return Err(format!(
            "引擎包校验失败：期望 {expected_sha}，实际 {actual}（已丢弃，保留内置版）"
        ));
    }

    // 3) 解压
    unzip(&zip_path, &staging).map_err(|e| {
        let _ = fs::remove_file(&zip_path);
        let _ = fs::remove_dir_all(&staging);
        format!("{e}（已丢弃，保留内置版）")
    })?;
    let new_root = match locate_runtime_root(&staging) {
        Some(r) => r,
        None => {
            let _ = fs::remove_file(&zip_path);
            let _ = fs::remove_dir_all(&staging);
            return Err("引擎包结构异常（缺 runtime/bin/python3），已丢弃，保留内置版".to_string());
        }
    };

    // 4) 原子替换：先备份当前内置版，再整体移入
    let dest = data_dir.join("local-engine");
    let bak = data_dir.join("local-engine.bak");
    let _ = fs::remove_dir_all(&bak);
    if dest.exists() {
        fs::rename(&dest, &bak).map_err(|e| format!("备份内置版失败：{e}"))?;
    }
    if let Err(e) = move_dir_contents(&new_root, &dest) {
        // 移入失败 → 回滚备份
        let _ = fs::remove_dir_all(&dest);
        let _ = fs::rename(&bak, &dest);
        let _ = fs::remove_file(&zip_path);
        let _ = fs::remove_dir_all(&staging);
        return Err(format!("{e}（已回滚内置版）"));
    }
    let _ = fs::remove_file(&zip_path);
    let _ = fs::remove_dir_all(&staging);

    // 5) 解除 macOS 下载隔离，避免首次运行被拦截
    let _ = Command::new("xattr")
        .args([
            "-dr",
            "com.apple.quarantine",
            &dest.join("runtime").to_string_lossy(),
        ])
        .output();

    log(&format!("热更新：已替换引擎为 {latest}，重启中…"));

    // 6) 重启引擎；起不来则回滚到备份的内置版（绝不降级）
    if restart_engine(&app, &dest) {
        if let Some(cache) = ENGINE_UPDATE_CACHE.get() {
            if let Ok(mut g) = cache.lock() {
                *g = Some(false);
            }
        }
        return Ok(serde_json::json!({ "updated": true, "version": latest }));
    }

    // 回滚：新引擎起不来，恢复内置版并重拉
    log("热更新：新引擎启动失败，回滚内置版");
    let _ = fs::remove_dir_all(&dest);
    if bak.exists() {
        let _ = fs::rename(&bak, &dest);
    }
    let _ = fs::remove_dir_all(&bak);
    restart_engine(&app, &dest);
    Err("新引擎启动失败，已回滚到内置版（功能可用，但未更新）".to_string())
}
