// Suno 试听缓存 · 转码层（M2）
// 职责：把 M2 解出的合法 fMP4，用 ffmpeg 转码为 320kbps MP3 落盘。
// 承载选型（技术方案）：优先 PATH 探测系统 ffmpeg；兜底扫描 local-engine 自带的
// imageio_ffmpeg 二进制。转码参数锁定 `-codec:a libmp3lame -b:a 320k`。

use std::path::{Path, PathBuf};
use std::process::Command;

/// 转码后 MP3 的可解析信息（供前端展示与码率校验）。
#[derive(Debug, Clone)]
pub struct Mp3Info {
    /// 输出文件字节数。
    pub size: u64,
    /// 时长（秒）。
    pub duration_sec: Option<f64>,
    /// 码率（kbps），用于校验 ≈320。
    pub bitrate_kbps: Option<u32>,
    /// 声道数。
    pub channels: Option<u32>,
    /// 采样率（Hz）。
    pub sample_rate: Option<u32>,
}

/// 最短合理 MP3 大小阈值：小于此值视为转码异常（单位：字节）。
const MIN_MP3_BYTES: u64 = 1024;
/// 码率校验容忍区间（kbps）：低于下限视为转码参数被改动/失效。
const MIN_BITRATE_KBPS: u32 = 312;

/// 常见平台 ffmpeg 可执行文件名。
const FFMPEG_BINARIES: [&str; 2] = ["ffmpeg", "ffmpeg.exe"];

/// GUI 启动的桌面 App（尤其 macOS）**不继承登录 Shell 的 PATH**，
/// 运行时只能用 launchd 给的最小 PATH（通常仅 `/usr/bin:/bin:/usr/sbin:/sbin`），
/// 于是 Homebrew / MacPorts / 手动安装的 ffmpeg 通过 `which` 探测不到。
/// 这里显式补扫各平台常见安装目录作为兜底，避免「本机明明装了 ffmpeg 却报未找到」。
#[cfg(target_os = "macos")]
const FFMPEG_COMMON_DIRS: &[&str] = &[
    "/opt/homebrew/bin",     // Apple Silicon Homebrew
    "/usr/local/bin",        // Intel Homebrew / 手动安装
    "/opt/local/bin",        // MacPorts
    "/usr/local/ffmpeg/bin", // 手动编译常见路径
    "/usr/bin",              // 系统自带（通常无，兜底）
];

#[cfg(target_os = "windows")]
const FFMPEG_COMMON_DIRS: &[&str] = &[
    "C:\\ffmpeg\\bin",
    "C:\\Program Files\\ffmpeg\\bin",
    "C:\\ProgramData\\chocolatey\\bin",
];

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
const FFMPEG_COMMON_DIRS: &[&str] = &["/usr/local/bin", "/opt/local/bin", "/usr/bin"];

/// 通过 PATH 探测系统 ffmpeg 绝对路径（macOS/Linux 用 `which`，Windows 用 `where`）。
/// `which` 落空时（GUI 启动无登录 Shell PATH），再补扫 [`FFMPEG_COMMON_DIRS`]。
fn probe_path_ffmpeg() -> Option<PathBuf> {
    let which = if cfg!(target_os = "windows") {
        "where"
    } else {
        "which"
    };
    for name in FFMPEG_BINARIES {
        if let Ok(out) = Command::new(which).arg(name).output() {
            if out.status.success() {
                let line = String::from_utf8_lossy(&out.stdout)
                    .lines()
                    .next()
                    .unwrap_or("")
                    .trim()
                    .to_string();
                if !line.is_empty() && is_executable(Path::new(&line)) {
                    return Some(PathBuf::from(line));
                }
            }
        }
    }
    // GUI 启动无登录 Shell PATH 时 `which` 必然落空，补扫常见安装位置。
    for dir in FFMPEG_COMMON_DIRS {
        for name in FFMPEG_BINARIES {
            let cand = Path::new(dir).join(name);
            if is_executable(&cand) {
                return Some(cand);
            }
        }
    }
    None
}

/// 在 local-engine 自带的 imageio_ffmpeg 目录里找可执行的 ffmpeg 二进制（兜底）。
/// 目录形如 `<runtime>/lib/python3.12/site-packages/imageio_ffmpeg/binaries/`，
/// 内含平台相关的 `ffmpeg-<os>.…` 可执行文件（跳过同名的 `.txt` 说明）。
fn probe_engine_ffmpeg(engine_dir: &Path) -> Option<PathBuf> {
    let site_pkgs = engine_dir
        .join("runtime")
        .join("lib")
        .join("python3.12")
        .join("site-packages");
    let bin_dir = site_pkgs.join("imageio_ffmpeg").join("binaries");
    if !bin_dir.is_dir() {
        return None;
    }
    let dirs = std::fs::read_dir(bin_dir).ok()?;
    for entry in dirs.flatten() {
        let path = entry.path();
        let Some(name) = entry.file_name().to_str().map(str::to_string) else {
            continue;
        };
        // 只要可执行 ffmpeg 本体，跳过 .txt 说明与 md5 校验文件。
        if !name.starts_with("ffmpeg") || !name.contains('.') || name.ends_with(".txt") {
            continue;
        }
        let is_exec = is_executable(&path);
        if is_exec {
            return Some(path);
        }
    }
    None
}

/// 判断路径是否可执行文件（POSIX 检查执行位；Windows 无执行位概念，直接按存在返回）。
#[cfg(unix)]
fn is_executable(path: &Path) -> bool {
    use std::os::unix::fs::PermissionsExt;
    path.is_file() && {
        let Ok(md) = std::fs::metadata(path) else {
            return false;
        };
        md.permissions().mode() & 0o111 != 0
    }
}

/// Windows 分支：仅按「是文件」判定可执行（.exe 等），避免引入 unix 专有的 PermissionsExt。
#[cfg(windows)]
fn is_executable(path: &Path) -> bool {
    path.is_file()
}

/// 定位可用的 ffmpeg 可执行文件：优先系统 PATH，其次 local-engine 的 imageio_ffmpeg。
/// `engine_dir` 为 optional，方便转码层与引擎目录解耦（由调用方传入）。
pub fn find_ffmpeg(engine_dir: Option<&Path>) -> Result<PathBuf, String> {
    if let Some(p) = probe_path_ffmpeg() {
        return Ok(p);
    }
    if let Some(dir) = engine_dir {
        if let Some(p) = probe_engine_ffmpeg(dir) {
            return Ok(p);
        }
    }
    Err(
        "未找到可用 ffmpeg：系统 PATH 与 local-engine 的 imageio_ffmpeg 均无。
        请安装 ffmpeg（macOS: brew install ffmpeg）"
            .into(),
    )
}

/// 解析 ffmpeg `-i` 输出的 stderr 文本，提取时长/码率/声道/采样率。
/// 返回值顺序：(duration_sec, bitrate_kbps, channels, sample_rate)，缺失项为 None。
fn parse_probe_info(text: &str) -> (Option<f64>, Option<u32>, Option<u32>, Option<u32>) {
    let mut duration = None;
    let mut bitrate = None;
    // Stream #0:0: Audio: mp3, 44100 Hz, stereo, fltp, 320 kb/s
    let mut channels = None;
    let mut sample_rate = None;

    for line in text.lines() {
        // Duration: hh:mm:ss.mmm
        if duration.is_none() {
            if let Some(rest) = line.split("Duration:").nth(1) {
                let part = rest.trim_start();
                let nums: Vec<&str> = part.split(',').next().unwrap_or("").split(':').collect();
                if nums.len() == 3 {
                    let h: f64 = nums[0].trim().parse().unwrap_or(0.0);
                    let m: f64 = nums[1].trim().parse().unwrap_or(0.0);
                    let s: f64 = nums[2].trim().parse().unwrap_or(0.0);
                    if m < 60.0 && s < 60.0 {
                        duration = Some(h * 3600.0 + m * 60.0 + s);
                    }
                }
            }
        }
        // bitrate: 320 kb/s
        if bitrate.is_none() {
            if let Some(rest) = line.split("bitrate:").nth(1) {
                let kb: u32 = rest
                    .trim_start()
                    .split_whitespace()
                    .next()
                    .and_then(|n| n.parse().ok())
                    .unwrap_or(0);
                if kb > 24 {
                    bitrate = Some(kb);
                }
            }
        }
        // Stream 行：Audio: mp3, 44100 Hz, stereo/fltp, ...
        if line.contains("Audio:") && line.contains(" Hz") {
            let segs: Vec<&str> = line.split(',').map(|s| s.trim()).collect();
            for seg in &segs {
                if let Some(rest) = seg.strip_suffix(" Hz") {
                    if let Ok(hz) = rest.trim().parse() {
                        sample_rate = Some(hz);
                    }
                }
            }
            // 声道：近似取 channel 单词（stereo=2，mono=1）。
            for seg in &segs {
                let s = seg.trim().trim_end_matches("(s16p)").trim();
                if s.eq_ignore_ascii_case("stereo") || s == "(stereo)" || s.trim() == "stereo" {
                    channels = Some(2);
                } else if s.eq_ignore_ascii_case("mono") {
                    channels = Some(1);
                }
            }
        }
    }
    (duration, bitrate, channels, sample_rate)
}

/// 用 ffmpeg `-i` 读取文件的流信息（不经转码）。返回 None 表示探针失败。
/// 依赖 ffmpeg 自身（已定位），不额外依赖 ffprobe，与 imageio 兜底兼容。
fn probe_file(ffmpeg: &Path, path: &Path) -> Option<Mp3Info> {
    let size = std::fs::metadata(path).ok()?.len();
    let out = Command::new(ffmpeg).args(["-i"]).arg(path).output().ok()?;
    // ffmpeg -i 无输出文件通常 exit!=0，但 stderr 会携带时长/码率信息，故解析 stderr。
    let text = String::from_utf8_lossy(&out.stderr);
    let (duration_sec, bitrate_kbps, channels, sample_rate) = parse_probe_info(&text);
    Some(Mp3Info {
        size,
        duration_sec,
        bitrate_kbps,
        channels,
        sample_rate,
    })
}

/// 把解密后的 fMP4 转码为 320kbps MP3，并用 ffmpeg 探针校验码率与时长效用。
///
/// - `src`：M2 解密输出的合法 fMP4 路径（程序生成的临时文件）。
/// - `dst`：目标 MP3 路径。
/// - `engine_dir`：optional，用于兜底定位 imageio_ffmpeg。
/// - `title`：可选标题，写入 MP3 metadata（来自 share/code 元数据，选填）。
/// - 成功返回 `Mp3Info`（含时长/码率/声道，供前端展示与校验）；失败返回含 stderr 的明确错误。
pub fn transcode_to_mp3(
    src: &Path,
    dst: &Path,
    engine_dir: Option<&Path>,
    title: Option<&str>,
) -> Result<Mp3Info, String> {
    let ffmpeg = find_ffmpeg(engine_dir)?;

    let mut cmd = Command::new(&ffmpeg);
    cmd.args(["-loglevel", "error", "-i"])
        .arg(src)
        .args(["-vn", "-codec:a", "libmp3lame", "-b:a", "320k", "-map_metadata", "0"]);
    // 可选标题写入 metadata（artist 依赖元数据，本版仅写 title）。
    if let Some(t) = title.map(str::trim).filter(|t| !t.is_empty()) {
        let meta = format!("title={t}");
        cmd.args(["-metadata", &meta]);
    }
    cmd.args(["-y"]).arg(dst);

    let out = cmd
        .output()
        .map_err(|e| format!("执行 ffmpeg 失败：{e}"))?;
    if !out.status.success() {
        let stderr = String::from_utf8_lossy(&out.stderr);
        return Err(format!(
            "ffmpeg 转码失败（exit {:?}）：{}",
            out.status.code(),
            stderr.trim()
        ));
    }

    let info = probe_file(&ffmpeg, dst)
        .ok_or_else(|| "读取输出文件信息失败".to_string())?;
    if info.size < MIN_MP3_BYTES {
        return Err(format!("转码产物异常过小（{} 字节），疑似非有效 MP3", info.size));
    }
    // 码率校验：目标 320k，命中区间 [MIN_BITRATE_KBPS, +∞)。解析不到即报错（转码可能失败），
    // 异常偏低说明转码参数被改/编码异常。
    let bitrate = info
        .bitrate_kbps
        .ok_or_else(|| "无法解析 MP3 码率，转码可能失败".to_string())?;
    if bitrate < MIN_BITRATE_KBPS {
        return Err(format!("转码码率异常：{bitrate} kbps（目标 320k），疑似参数失效"));
    }
    Ok(info)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// find_ffmpeg 任一路径命中即返回路径（不依赖本机是否装了 ffmpeg——若没装则返回 Err，
    /// 测试据此两分支都接受，优先断言「能定位时为绝对路径」）。
    #[test]
    fn find_ffmpeg_resolves_something() {
        match find_ffmpeg(None) {
            Ok(p) => assert!(p.is_absolute(), "定位到的 ffmpeg 应为绝对路径，得到 {p:?}"),
            Err(e) => assert!(
                e.contains("ffmpeg"),
                "未安装时错误信息应说明 ffmpeg 缺失：{e}"
            ),
        }
    }

    /// 兜底探测：data 风格目录不存在时应返回 None（不崩溃）。
    #[test]
    fn probe_engine_ffmpeg_missing_dir_is_none() {
        let fake = std::env::temp_dir().join("no-such-engine-dir");
        assert!(probe_engine_ffmpeg(&fake).is_none());
    }
}
