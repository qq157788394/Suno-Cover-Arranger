// Suno 试听缓存 · 网络层（M1）
// 职责：解析分享链接 → 取解密权（mango/rights）→ 从 CloudFront 直取加密 m4a。
// 全链路不依赖登录态、不注入会话凭据，仅用本地生成的 browser-token + device-id。
// 参考技术方案 §0.1 / §3；解密见 suno_decrypt.rs（M2）。

use base64::engine::general_purpose::STANDARD as BASE64;
use base64::engine::general_purpose::STANDARD_NO_PAD as BASE64_NOPAD;
use base64::Engine as _;
use sha2::Digest as _;
use std::path::{Path, PathBuf};

/// Suno 后端基址（旧 community 接口 studio-api.suno.ai 已 Service Suspended，勿用）。
const SUNO_API_BASE: &str = "https://studio-api-prod.suno.com";
/// Suno 网页基址（歌曲页/分享页）。歌曲页为 SSR，<head> 内静态注入 og:title，可免登录取标题。
const SUNO_WEB_BASE: &str = "https://suno.com";
/// 播放流 CDN 基址。注意域名是 `d2lwuy8qc234o3`（末尾 o3），非常见拼写 o3g。
const SUNO_CDN_BASE: &str = "https://d2lwuy8qc234o3.cloudfront.net";

/// 归一化后的链接信息。
#[derive(Debug, Clone)]
pub struct SunoLink {
    /// 短链 token（/s/<token>）或已是 content_id 的 uuid，二者至少填一个。
    pub short_token: Option<String>,
    pub content_id: Option<String>,
}

/// share/code 解析出的歌曲信息。
#[derive(Debug, Clone)]
pub struct SongMeta {
    pub content_id: String,
    pub title: Option<String>,
    /// 分享者昵称（share/code 响应里的 sharer_display_name），作 artist 兜底展示。
    pub artist: Option<String>,
}

/// mango/rights 返回的包裹态授权信息。
#[derive(Debug, Clone)]
pub struct Rights {
    /// wrapped key（前 12B 为 GCM iv，余下为 GCM ciphertext）。
    pub key: Vec<u8>,
    /// wrapped iv（前 12B 为 GCM iv，余下为 GCM ciphertext）。
    pub iv: Vec<u8>,
    /// guest license token，SHA-256 后作为 GCM 解包密钥。
    pub glt: String,
}

/// 从原始输入解析出链接结构，作为后续接口调用的输入。
/// 支持短链 `/s/<token>` 与全链 `/song/<uuid>` / `https://suno.com/song/<uuid>`。
pub fn parse_suno_link(link: &str) -> Result<SunoLink, String> {
    let t = link.trim();
    if t.is_empty() {
        return Err("链接为空".into());
    }
    // 取出 path 部分，兼容带不带协议头。
    let path = match t.find("://") {
        Some(idx) => {
            let rest = &t[idx + 3..];
            rest.find('/').map(|i| &rest[i..]).unwrap_or("")
        }
        None => t,
    };
    let path = path.trim_end_matches('/');

    if let Some(rest) = path
        .strip_prefix("/s/")
        .or_else(|| path.strip_prefix("/s="))
    {
        if rest.is_empty() {
            return Err("短链缺少 token".into());
        }
        return Ok(SunoLink {
            short_token: Some(rest.to_string()),
            content_id: None,
        });
    }

    if let Some(rest) = path.strip_prefix("/song/") {
        let id = rest.trim();
        if !is_uuid(id) {
            return Err(format!("非法的歌曲 ID：{id}"));
        }
        return Ok(SunoLink {
            short_token: None,
            content_id: Some(id.to_string()),
        });
    }

    // 兜底：整串本身是裸 uuid。
    if is_uuid(t) {
        return Ok(SunoLink {
            short_token: None,
            content_id: Some(t.to_string()),
        });
    }

    Err("无法识别的链接格式，请输入 /s/<token> 或 /song/<uuid>（或完整 suno.com 链接）".into())
}

/// 判段字符串是否为标准 UUID（8-4-4-4-12 十六进制）。
fn is_uuid(s: &str) -> bool {
    let ok = s.len() == 36
        && s.as_bytes().get(8) == Some(&b'-')
        && s.as_bytes().get(13) == Some(&b'-')
        && s.as_bytes().get(18) == Some(&b'-')
        && s.as_bytes().get(23) == Some(&b'-');
    ok && s.chars().all(|c| c.is_ascii_hexdigit() || c == '-')
}

/// 在 JSON 树中宽松查找目标键的首个非空字符串值（先序遍历，命中即返）。
/// 用于兼容 share/code 响应的多种字段名（title/image_url…），顶层/嵌套均可命中。
fn find_string_rec(v: &serde_json::Value, keys: &[&str]) -> Option<String> {
    match v {
        serde_json::Value::Object(map) => {
            for k in keys {
                if let Some(val) = map.get(*k) {
                    if let Some(s) = val.as_str() {
                        if !s.is_empty() {
                            return Some(s.to_string());
                        }
                    }
                }
            }
            for val in map.values() {
                if let Some(found) = find_string_rec(val, keys) {
                    return Some(found);
                }
            }
            None
        }
        serde_json::Value::Array(arr) => arr
            .iter()
            .find_map(|val| find_string_rec(val, keys)),
        _ => None,
    }
}

/// 生成随机 device-id（标准 UUID v4 形态）。非密码学随机，仅作匿名标识，够用即可。
/// 用时间纳秒、递增计数与进程号混合出 16 字节，再按 RFC 4122 置 version=4、variant=10。
pub fn gen_device_id() -> String {
    use std::sync::atomic::{AtomicU64, Ordering};
    static SEQ: AtomicU64 = AtomicU64::new(0);
    let t = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos() as u64)
        .unwrap_or(0);
    let seq = SEQ.fetch_add(1, Ordering::Relaxed);
    // 两个 u64 混合出 16 字节，避免旧实现高位恒 0 导致 device-id 前段全为 0。
    let hi = t ^ (seq.wrapping_mul(0x9E37_79B9_7F4A_7C15));
    let lo = t
        .wrapping_mul(0x2545_F491_4F6C_DD1D)
        ^ seq.wrapping_mul(31)
        ^ ((std::process::id() as u64) << 32);
    let mut b = [0u8; 16];
    b[..8].copy_from_slice(&hi.to_le_bytes());
    b[8..].copy_from_slice(&lo.to_le_bytes());
    // RFC 4122：version 字段（第 7 字节高 4 位）= 4；variant（第 9 字节高 2 位）= 10。
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    format!(
        "{:02x}{:02x}{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}{:02x}{:02x}{:02x}{:02x}",
        b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7],
        b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15]
    )
}

/// 构造对 Suno 后端请求所需的统一请求头。
/// browser-token 由 browser_token() 本地生成（见其 TODO）。
fn build_client() -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(60))
        .build()
        .map_err(|e| format!("创建 HTTP 客户端失败：{e}"))
}

/// 本地生成 browser-token。
///
/// 实测（真实 Chrome 抓包）其形态为 `{"token":"<base64>"}`，内层 base64 解码即
/// `{"timestamp":<毫秒>}`，**无签名**（见技术方案 §0.1 补记）。生成逻辑：
///   b64 = base64url_no_pad(`{"timestamp":<now_ms>}`)；
///   header = `{"token":"<b64>"}`。
/// 时间戳取当前墙钟毫秒即可，Suno 服务端按时间窗校验。
async fn browser_token(_device_id: &str) -> Result<String, String> {
    let ts = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    let payload = format!("{{\"timestamp\":{ts}}}");
    let b64 = BASE64_NOPAD.encode(payload.as_bytes());
    Ok(format!("{{\"token\":\"{b64}\"}}"))
}

/// 供完整链路（M2/M3）直接调用：生成真实并可用的 browser-token。
pub async fn make_browser_token() -> Result<String, String> {
    let device = gen_device_id();
    browser_token(&device).await
}

/// 匿名核心客户端：注入统一请求头（browser-token / device-id / origin / referer / UA）。
async fn authed_get(url: &str, device_id: &str, token: &str) -> Result<reqwest::Response, String> {
    let client = build_client()?;
    client
        .get(url)
        .header("browser-token", token)
        .header("device-id", device_id)
        .header("origin", "https://suno.com")
        .header("referer", "https://suno.com/")
        .header("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
        .send()
        .await
        .map_err(|e| format!("请求失败（{url}）：{e}"))
}

/// 用短链 token 换歌曲信息：`GET /api/share/code/{token}`。
/// 返回 `(content_id, SongMeta)`；meta 里 title 为宽松提取（字段名多态），缺失时 None。
async fn resolve_from_share(
    token: &str,
    device_id: &str,
    bt: &str,
) -> Result<(String, SongMeta), String> {
    let url = format!("{SUNO_API_BASE}/api/share/code/{token}");
    let resp = authed_get(&url, device_id, bt).await?;
    let status = resp.status().as_u16();
    if status != 200 {
        // 区分「凭证失效/风控」与普通失败。
        return match status {
            401 | 403 => Err(format!(
                "凭证校验失败（HTTP {status}），链接可能已失效或被风控"
            )),
            _ => Err(format!("解析短链失败（HTTP {status}）")),
        };
    }
    let body = resp
        .text()
        .await
        .map_err(|e| format!("读取解析结果失败：{e}"))?;
    let v: serde_json::Value =
        serde_json::from_str(&body).map_err(|e| format!("解析响应 JSON 失败：{e}"))?;
    // 取 content_id（注意字段可能嵌套在 data 下）。
    let get_id = |node: &serde_json::Value| {
        node.get("content_id")
            .or_else(|| node.get("id"))
            .and_then(|x| x.as_str())
            .map(str::to_string)
    };
    let id = v
        .get("data")
        .and_then(get_id)
        .or_else(|| get_id(&v))
        .ok_or_else(|| "短链解析成功但未返回歌曲 ID".to_string())?;
    // 元数据：匿名接口通常不含 title（实测响应仅分享者字段 + content_id），
    // title 探测仅作防御以防未来字段变更；artist 用分享者昵称兜底。
    let title = find_string_rec(&v, &["title", "song_title"])
        .filter(|t| t.len() > 3 && !is_uuid(t));
    let artist = find_string_rec(&v, &["sharer_display_name"]);
    Ok((
        id.clone(),
        SongMeta {
            content_id: id,
            title,
            artist,
        },
    ))
}

/// 从 HTML 的 `<meta>` 标签中提取指定键（property/name/itemprop，如 `og:title`）的 content 值。
/// 只在 `<meta ...>` 标签内匹配键，避免全局 find 误命中 <script>/JSON-LD/正文里的同名文本；
/// 且键定位到后仅在当前标签的 `>` 前查找 `content=`，避免误取相邻 meta（如 `content="yes"`）。
fn extract_meta_content(html: &str, key: &str) -> Option<String> {
    // 遍历每个 <meta ...> 标签，只在标签内判定键归属。
    for (start, _) in html.match_indices("<meta") {
        let tail = &html[start..];
        let tag_end = tail.find('>')?;
        let tag = &tail[..tag_end];
        // 键必须以 `property/name/itemprop="key"` 的形态出现（Next.js 生成顺序固定，属性在前）。
        let key_as_attr = ["property=\"", "name=\"", "itemprop=\""]
            .iter()
            .any(|p| tag.contains(&format!("{p}{key}\"")));
        if !key_as_attr {
            continue;
        }
        // 定位 content= 后取值。
        let after = &tag[tag.find("content=")? + "content=".len()..];
        // 跳过 `=` 后的空白与起始引号。
        let after =
            after.trim_start_matches(|c: char| c.is_whitespace() || c == '"' || c == '\'');
        // 值以结束引号收尾，否则退化为空白收尾。
        let len = after
            .find(|c: char| c == '"' || c == '\'' || c.is_whitespace())
            .unwrap_or(after.len());
        let val = &after[..len];
        if !val.is_empty() {
            return Some(val.to_string());
        }
    }
    None
}

/// 用 content_id 请求歌曲页 HTML（`suno.com/song/{uuid}`），提取 og:title 作为曲名元数据。
/// 歌曲页为 SSR，`<head>` 内静态注入 og 标签，普通浏览器 UA 即可取到、无需登录态；
/// 失败时静默降级，不影响解密/转码主链路。
async fn fetch_song_page_meta(
    content_id: &str,
    device_id: &str,
    token: &str,
) -> Result<SongMeta, String> {
    let url = format!("{SUNO_WEB_BASE}/song/{content_id}");
    let resp = authed_get(&url, device_id, token).await?;
    let status = resp.status().as_u16();
    if status != 200 {
        return Err(format!("歌曲页 HTTP {status}"));
    }
    let html = resp
        .text()
        .await
        .map_err(|e| format!("读取歌曲页失败：{e}"))?;
    let title = extract_meta_content(&html, "og:title").filter(|t| !t.trim().is_empty());
    Ok(SongMeta {
        content_id: content_id.to_string(),
        title,
        // artist 仍以 share/code 响应里的分享者昵称为准，此处不覆盖。
        artist: None,
    })
}

/// 把歌曲标题转成安全的文件名片段（去除路径分隔符/Windows 保留字符/控制字符），
/// 空结果回退 `unnamed`。用于 mp3 缓存落盘命名，使产物文件名可读（歌名）而非 UUID。
/// pub(crate)：main.rs 的 save_trial_mp3 另存到下载目录时复用同一套命名规则。
pub(crate) fn sanitize_filename(name: &str) -> String {
    let cleaned: String = name
        .chars()
        .map(|c| match c {
            '\\' | '/' | ':' | '*' | '?' | '"' | '<' | '>' | '|' => '_',
            c if c.is_control() => '_',
            c => c,
        })
        .collect();
    let cleaned = cleaned.trim();
    if cleaned.is_empty() {
        "unnamed".to_string()
    } else {
        cleaned.to_string()
    }
}

/// 统一收口：把 SunoLink 归一到 content_id，并尽量带回标题/封面元数据。
/// 短链先走 share/code（可得 content_id + 分享者昵称）；若标题仍缺失，
/// 再请求歌曲页（`suno.com/song/{uuid}`）提取 og:title 补齐，确保下载文件名可用歌曲名。
pub async fn resolve_song_info(
    link: &SunoLink,
    device_id: &str,
    token: &str,
) -> Result<(String, SongMeta), String> {
    let mut meta = match &link.content_id {
        Some(id) => SongMeta {
            content_id: id.clone(),
            title: None,
            artist: None,
        },
        None => {
            let t = link
                .short_token
                .as_ref()
                .ok_or_else(|| "无有效链接信息".to_string())?;
            resolve_from_share(t, device_id, token).await?.1
        }
    };
    let content_id = meta.content_id.clone();
    // share/code 与直接 uuid 路径通常都不含 title，用歌曲页 og:title 补齐。
    if meta.title.is_none() {
        if let Ok(m) = fetch_song_page_meta(&content_id, device_id, token).await {
            meta.title = meta.title.or(m.title);
            meta.artist = meta.artist.or(m.artist);
        }
    }
    Ok((content_id, meta))
}

/// 统一收口：把 SunoLink 归一到 content_id。
pub async fn resolve_content_id(
    link: &SunoLink,
    device_id: &str,
    token: &str,
) -> Result<String, String> {
    Ok(resolve_song_info(link, device_id, token).await?.0)
}

/// 取解密授权：`POST /api/mango/rights`，body 仅 content_id + content_type=clip。
pub async fn fetch_rights(
    content_id: &str,
    device_id: &str,
    token: &str,
) -> Result<Rights, String> {
    let client = build_client()?;
    let body = serde_json::json!({
        "content_params": { "content_id": content_id, "content_type": "clip" }
    });
    let resp = client
        .post(format!("{SUNO_API_BASE}/api/mango/rights"))
        .header("browser-token", token)
        .header("device-id", device_id)
        .header("origin", "https://suno.com")
        .header("referer", "https://suno.com/")
        .header("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("取授权失败：{e}"))?;
    let status = resp.status().as_u16();
    if status != 200 {
        return Err(format!("取授权失败（HTTP {status}）"));
    }
    let text = resp
        .text()
        .await
        .map_err(|e| format!("读取授权响应失败：{e}"))?;
    let v: serde_json::Value =
        serde_json::from_str(&text).map_err(|e| format!("授权 JSON 解析失败：{e}"))?;
    // key/iv 为 base64 的 wrapped 字节；glt 为字符串。
    let b64 = |k: &str| -> Result<Vec<u8>, String> {
        v.get(k)
            .and_then(|x| x.as_str())
            .map(|s| {
                BASE64
                    .decode(s)
                    .map_err(|e| format!("{k} base64 解码失败：{e}"))
            })
            .unwrap_or_else(|| Err(format!("响应缺少 {k}")))
    };
    let key = b64("key")?;
    let iv = b64("iv")?;
    let glt = v
        .get("glt")
        .and_then(|x| x.as_str())
        .ok_or_else(|| "响应缺少 glt".to_string())?
        .to_string();
    Ok(Rights { key, iv, glt })
}

/// 按 content_id 从 CloudFront 直取加密 m4a（整包下载；较大时改为流式落盘）。
/// CDN 为公开对象存储，通常无需 browser-token，但统一携带 token 更稳。
/// device_id 与上游 resolve/fetch_rights 保持一致，便于服务端会话匹配与排查。
pub async fn download_m4a(content_id: &str, device_id: &str, token: &str) -> Result<Vec<u8>, String> {
    let url = format!("{SUNO_CDN_BASE}/1/clip/{content_id}.m4a");
    let resp = authed_get(&url, device_id, token).await?;
    let status = resp.status().as_u16();
    if status != 200 {
        return Err(format!("下载播放流失败（HTTP {status}）"));
    }
    let bytes = resp
        .bytes()
        .await
        .map_err(|e| format!("读取播放流失败：{e}"))?;
    if bytes.len() < 16 {
        return Err("播放流数据过短，可能非有效 m4a".into());
    }
    Ok(bytes.to_vec())
}

/// M1 冒烟入口：一条命令跑通「解析 → 取权 → 下载加密 m4a」，返回关键尺寸与字段，
/// 供前端/命令行验证网络链路。解密在 M2 接入（suno_decrypt.rs）。
pub async fn probe(link: &str) -> Result<serde_json::Value, String> {
    let parsed = parse_suno_link(link)?;
    let device_id = gen_device_id();
    let token = browser_token(&device_id).await?;
    let content_id = resolve_content_id(&parsed, &device_id, &token).await?;
    let rights = fetch_rights(&content_id, &device_id, &token).await?;
    let bytes = download_m4a(&content_id, &device_id, &token).await?;
    Ok(serde_json::json!({
        "content_id": content_id,
        "encrypted_size": bytes.len(),
        "rights_key_len": rights.key.len(),
        "rights_iv_len": rights.iv.len(),
        "glt_len": rights.glt.len(),
    }))
}

/// 端到端完整链路（M1+M2）：解析 → 取权 → 下载加密 m4a → 解密 fMP4 → ffmpeg 转 320k MP3。
/// 不依赖 Tauri AppHandle，可被 Tauri 命令与网络冒烟测试复用。
/// - `engine_dir`：兜底定位 imageio_ffmpeg；传 `None` 则仅探测系统 PATH。
/// - `out_dir`：产物（fMP4 留档 + mp3）落盘目录。
/// - `on_stage`：阶段进度回调，贯穿「下载/解密/转码」关键节点，供前端上报进度。
/// 返回 `{ content_id, mp3_path, mp3_size, has_key32 }`。
///
/// > 真实样本上会暴露「会话密钥是 AES-128 还是 AES-256」——由 `has_key32` 标记返回，
/// > Decrypt 层已按解密出的密钥长度自适应，因此两种都能转出，此字段仅作排查参考。
pub async fn run_trial_pipeline<F: Fn(&str)>(
    link: &str,
    engine_dir: Option<&Path>,
    out_dir: &Path,
    on_stage: F,
) -> Result<serde_json::Value, String> {
    // 1) 网络层
    on_stage("下载");
    let parsed = parse_suno_link(link)?;
    let device_id = gen_device_id();
    let token = make_browser_token().await?;
    let (content_id, meta) = resolve_song_info(&parsed, &device_id, &token).await?;
    on_stage("取权");
    let rights = fetch_rights(&content_id, &device_id, &token).await?;
    let encrypted = download_m4a(&content_id, &device_id, &token).await?;
    on_stage("下载完成");

    // 2) 解密层：还原合法 fMP4
    on_stage("解密");
    let fmp4 = crate::suno_decrypt::decrypt_clip(
        &encrypted,
        &rights.key,
        &rights.iv,
        &rights.glt,
        &content_id,
    )?;
    // 判据：AES-GCM 解包出的会话密钥长度（16=AES-128，32=AES-256）。
    let ctr_key_len = determine_ctr_key_len(&rights.key, &rights.iv, &rights.glt, &content_id)?;
    on_stage("解密完成");

    // 3) 落盘并转码 320k MP3（标题可选写入 metadata；返回 ffmpeg 探针的时长/码率/声道）
    std::fs::create_dir_all(out_dir).map_err(|e| format!("创建产物目录失败：{e}"))?;
    // fmp4 为内部留档，用 content_id 命名；mp3 面向用户，用歌曲标题命名（缺失回退 content_id）。
    let fmp4_path: PathBuf = out_dir.join(format!("{content_id}.fmp4"));
    let mp3_name = sanitize_filename(meta.title.as_deref().unwrap_or(&content_id));
    let mp3_path: PathBuf = out_dir.join(format!("{mp3_name}.mp3"));
    std::fs::write(&fmp4_path, &fmp4).map_err(|e| format!("解密产物留档失败：{e}"))?;
    on_stage("转码");
    let info =
        crate::suno_transcode::transcode_to_mp3(&fmp4_path, &mp3_path, engine_dir, meta.title.as_deref())?;
    on_stage("完成");

    Ok(serde_json::json!({
        "content_id": content_id,
        "title": meta.title,
        "artist": meta.artist,
        "mp3_path": mp3_path.to_string_lossy(),
        "mp3_size": info.size,
        "duration_sec": info.duration_sec,
        "bitrate_kbps": info.bitrate_kbps,
        "channels": info.channels,
        "sample_rate": info.sample_rate,
        "has_key32": ctr_key_len == 32,
        "encrypted_size": encrypted.len(),
    }))
}

/// 仅计算解密会话密钥长度（16 或 32），用于判定实际是 AES-128 还是 AES-256。
/// 复用 decrypt_clip 内部的 GCM 解包逻辑，独立跑一遍、只取其长度。
fn determine_ctr_key_len(
    wrapped_key: &[u8],
    wrapped_iv: &[u8],
    glt: &str,
    content_id: &str,
) -> Result<usize, String> {
    let aes_gcm_key = sha2::Sha256::digest(glt.as_bytes());
    let len = crate::suno_decrypt::unwrap_key_len(aes_gcm_key.as_slice(), wrapped_key, content_id)?;
    // 顺带校验 IV 长度合法（16）。
    crate::suno_decrypt::unwrap_iv_len(aes_gcm_key.as_slice(), wrapped_iv, content_id)?;
    Ok(len)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 离线：生成的 browser-token 应符合 `{"token":"<base64({\"timestamp\":N})>"}`。
    #[test]
    fn browser_token_shape_matches_suno() {
        let device = gen_device_id();
        // browser_token 是 async，block_on 同步得到结果。
        let t = tokio::runtime::Runtime::new()
            .unwrap()
            .block_on(super::browser_token(&device))
            .expect("token 生成应成功");
        // 解最外层 JSON 拿到 token 字段。
        let outer: serde_json::Value = serde_json::from_str(&t).unwrap();
        let b64 = outer["token"].as_str().expect("外层有 token 字段");
        // 内层 base64 解回 JSON，应含 timestamp 数值。
        let dec = BASE64_NOPAD.decode(b64).unwrap();
        let inner: serde_json::Value = serde_json::from_slice(&dec).unwrap();
        assert!(inner["timestamp"].is_number(), "token 应含 timestamp");
        assert!(inner["timestamp"].as_u64().unwrap() > 0);
    }

    /// 离线：从真实 Suno 歌曲页 HTML 片段提取 og:title / og:image，须精确命中所在
    /// meta 标签，不得误取相邻的 `<meta ... content="yes">`。
    #[test]
    fn extract_meta_content_isolates_own_tag() {
        // 复刻 suno.com/song/{uuid} 的 <head> 片段：og:title 紧邻一个 content="yes" 的 meta。
        let html = r#"<meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-title" content="Suno"/><meta property="og:title" content="v14.1-新国风交响《美丽的神话》（Eb）"/><meta property="og:image" content="https://cdn2.suno.ai/image_large_936af04a-927e-40df-b479-5614ea2528e3.jpeg"/>"#;
        assert_eq!(
            extract_meta_content(html, "og:title").as_deref(),
            Some("v14.1-新国风交响《美丽的神话》（Eb）")
        );
        assert_eq!(
            extract_meta_content(html, "og:image").as_deref(),
            Some("https://cdn2.suno.ai/image_large_936af04a-927e-40df-b479-5614ea2528e3.jpeg")
        );
    }

    /// 网络冒烟（默认跳过）：用公开短链真实走通解析→取权→下载加密 m4a。
    /// 运行方式：`cargo test -- --ignored suno_probe_smoke`
    #[test]
    #[ignore = "会真实请求 Suno 网络，仅手动冒烟时运行"]
    fn suno_probe_smoke() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        let v = rt.block_on(super::probe("https://suno.com/s/ripkWueqMkrAOnbR"));
        let v = v.expect("M1 网络冒烟应成功");
        assert!(v["encrypted_size"].as_u64().unwrap() > 4096);
        assert_eq!(v["rights_key_len"].as_u64().unwrap(), 44);
        assert_eq!(v["rights_iv_len"].as_u64().unwrap(), 44);
        eprintln!("SMOKE OK: {v}");
    }

    /// 端到端冒烟（默认跳过）：真实样本走通「下载→解密→ffmpeg 转 320k MP3」。
    /// 运行方式：`cargo test -- --ignored trial_pipeline_smoke`
    /// 这不仅是链路验证，还是「会话密钥是 AES-128 还是 AES-256」的关键判据：
    /// 解密成功 + ffmpeg 转出合法 mp3，即证明 AAD/contentId 与密钥长度假设全部正确。
    #[test]
    #[ignore = "会真实请求 Suno 网络并消耗一次试听，仅手动冒烟时运行"]
    fn trial_pipeline_smoke() {
        let rt = tokio::runtime::Runtime::new().unwrap();
        let out = std::env::temp_dir();
        let v = rt.block_on(super::run_trial_pipeline(
            "https://suno.com/s/ripkWueqMkrAOnbR",
            None,
            &out,
            |_| {},
        ));
        let v = v.expect("M2 端到端冒烟应成功（下载+解密+转码）");
        assert!(v["mp3_size"].as_u64().unwrap() > 4096, "mp3 应非空有效");
        eprintln!("E2E SMOKE OK: {v:#}");
    }
}
