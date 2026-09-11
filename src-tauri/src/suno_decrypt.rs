// Suno 试听缓存 · 解密层（M2）
// 职责：把 CloudFront 直取的加密 m4a + mango/rights 的 wrapped key/iv，还原为合法 fMP4。
// 流程完全复刻 Suno 前端 JS（技术方案 §1 步骤 2~6）：
//   1. aesKey = SHA256(glt)                       —— AES-256-GCM 解包密钥
//   2. ctrKey = AES-GCM.decrypt(iv=key[0:12], aad=contentId, data=key[12:])   —— AES-CTR 会话密钥
//   3. ctrIv  = AES-GCM.decrypt(iv=iv[0:12],  aad=contentId, data=iv[12:])    —— AES-CTR 计数器初值
//   4. 整个 fMP4 按 AES-CTR 逐块解密
// 全程纯 Rust（aes-gcm / aes / ctr），无系统加密库依赖。

use aes::Aes128;
use aes::Aes256;
use aes_gcm::aead::Aead;
use aes_gcm::aead::KeyInit;
use aes_gcm::aead::Payload;
use aes_gcm::Aes256Gcm;
use aes_gcm::Nonce;
use ctr::cipher::KeyIvInit;
use ctr::cipher::StreamCipher;
use ctr::Ctr128BE;
use sha2::{Digest, Sha256};

/// 解包用的 GCM IV 固定长度（wrapped key/iv 前 12 字节）。
const GCM_IV_LEN: usize = 12;

/// 对一定长度的字节做 AES-GCM 解包（无 AAD）。
///
/// - `gcm_key`：AES-GCM 密钥（这里是 SHA256(glt) 的 32 字节）。
/// - `data`：`<12B GCM IV><ciphertext+tag>`，与 Suno 前端传入的结构一致。
/// - `aad`：关联数据（Suno 用 utf8(contentId)）。
/// 返回解包后的明文（长度由数据本身决定：= len - 16 tag - 密文长度）。调用方据此适配
/// AES-128/256（真实数据下实际为单一定长，代码按 AES-CTR 密钥长度自适应）。
fn gcm_unwrap(gcm_key: &[u8], data: &[u8], aad: &[u8]) -> Result<Vec<u8>, String> {
    if data.len() < GCM_IV_LEN + 16 {
        return Err(format!("wrapped 数据过短（{} 字节），无法解包", data.len()));
    }
    let (iv_bytes, ct) = data.split_at(GCM_IV_LEN);
    let cipher = Aes256Gcm::new(gcm_key.into());
    let nonce = Nonce::from_slice(iv_bytes); // 12 字节 GCM IV
    cipher
        .decrypt(nonce, Payload { msg: ct, aad })
        .map_err(|_| "AES-GCM 解包失败：密钥/glt 或 content_id 与密文不匹配".to_string())
}

/// 解包 wrapped key 的会话密钥长度（仅取长度，供判定 AES-128/256）。
pub fn unwrap_key_len(
    gcm_key: &[u8],
    wrapped_key: &[u8],
    content_id: &str,
) -> Result<usize, String> {
    Ok(gcm_unwrap(gcm_key, wrapped_key, content_id.as_bytes())?.len())
}

/// 解包 wrapped iv 的计数器初值长度（应恒为 16，非法时明确报错）。
pub fn unwrap_iv_len(gcm_key: &[u8], wrapped_iv: &[u8], content_id: &str) -> Result<usize, String> {
    let iv = gcm_unwrap(gcm_key, wrapped_iv, content_id.as_bytes())?;
    if iv.len() != 16 {
        return Err(format!(
            "解包出的计数器初值长度异常：{}（应为 16）",
            iv.len()
        ));
    }
    Ok(iv.len())
}

/// 对整个 fMP4 做 AES-CTR 解密。
/// - `ctr_key`：会话密钥，16 字节 → AES-128，32 字节 → AES-256（自适应）。
/// - `ctr_iv`：16 字节计数器初值。
/// - `data`：原地解密并返回（消费输入，适合大字节流）。
fn aes_ctr_decrypt_inplace(ctr_key: &[u8], ctr_iv: &[u8], data: &mut [u8]) -> Result<(), String> {
    // WebCrypto AES-CTR 计数器按 big-endian 递增（低位在区块末尾），对应 Ctr128BE。
    match ctr_key.len() {
        16 => {
            let mut cipher = Ctr128BE::<Aes128>::new_from_slices(ctr_key, ctr_iv)
                .map_err(|e| format!("构造 AES-128-CTR 失败：{e}"))?;
            cipher.apply_keystream(data);
            Ok(())
        }
        32 => {
            let mut cipher = Ctr128BE::<Aes256>::new_from_slices(ctr_key, ctr_iv)
                .map_err(|e| format!("构造 AES-256-CTR 失败：{e}"))?;
            cipher.apply_keystream(data);
            Ok(())
        }
        n => Err(format!("非法的 AES-CTR 会话密钥长度：{n}（应为 16 或 32）")),
    }
}

/// 主入口：把加密 m4a 解密为合法 fMP4。
///
/// - `encrypted`：CloudFront 取的加密 m4a 原始字节。
/// - `wrapped_key` / `wrapped_iv`：mango/rights 返回的 44 字节 wrapped（base64 已解码）。
/// - `glt`：guest license token（SHA256 作 GCM 解包密钥）。
/// - `content_id`：用于 AAD 的歌曲 UUID。
pub fn decrypt_clip(
    encrypted: &[u8],
    wrapped_key: &[u8],
    wrapped_iv: &[u8],
    glt: &str,
    content_id: &str,
) -> Result<Vec<u8>, String> {
    // 1. aesKey = SHA256(glt)
    let aes_gcm_key = Sha256::digest(glt.as_bytes());
    let aes_gcm_key = aes_gcm_key.as_slice();

    // 2/3. GCM 解包，AAD = utf8(contentId)
    let ctr_key = gcm_unwrap(aes_gcm_key, wrapped_key, content_id.as_bytes())?;
    let ctr_iv = gcm_unwrap(aes_gcm_key, wrapped_iv, content_id.as_bytes())?;
    if ctr_iv.len() != 16 {
        return Err(format!(
            "解包出的计数器初值长度异常：{}（应为 16）",
            ctr_iv.len()
        ));
    }

    // 4. AES-CTR 整包解密
    let mut out = encrypted.to_vec();
    aes_ctr_decrypt_inplace(&ctr_key, &ctr_iv, &mut out)?;
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// SHA256(glt) 密钥长度为 32 字节（AES-256-GCM 用它作解包密钥）。
    #[test]
    fn glt_hash_is_32_bytes() {
        let glt = "glt-test-token";
        assert_eq!(Sha256::digest(glt.as_bytes()).len(), 32);
        assert_eq!(Sha256::digest("").as_slice().len(), 32);
    }

    /// AES-CTR 对称性：CTR 加解密同操作（keystream XOR），双击应还原明文。
    /// 覆盖 128/256 两种会话密钥长度。
    #[test]
    fn ctr_symmetry_both_key_sizes() {
        for keylen in [16usize, 32] {
            let key = vec![9u8; keylen];
            let iv = [3u8; 16].to_vec();
            let plain: Vec<u8> = (0..128u8).collect();
            let mut buf = plain.clone();
            aes_ctr_decrypt_inplace(&key, &iv, &mut buf).unwrap();
            aes_ctr_decrypt_inplace(&key, &iv, &mut buf).unwrap();
            assert_eq!(buf, plain, "keylen={keylen} 双击 keystream 应还原明文");
        }
    }

    /// GCM 解包往返：用已知随机 wrapped 结构与固定 AAD 验证解包结果与构造值一致。
    #[test]
    fn gcm_unwrap_roundtrip() {
        let gcm_key = [5u8; 32].to_vec();
        let aad = b"content-id-abc".to_vec();
        // 构造 wrapped：12B IV + 16 字节明文(key)，经 Aes256Gcm 加密（ciphertext+tag 附尾）。
        let mut pkey = [0u8; 16];
        for (i, b) in pkey.iter_mut().enumerate() {
            *b = (i as u8).wrapping_add(0x10);
        }
        let cipher = Aes256Gcm::new(gcm_key.as_slice().into());
        let nonce = Nonce::from_slice(&[0xAAu8; 12]);
        let enc = cipher
            .encrypt(
                nonce,
                Payload {
                    msg: &pkey,
                    aad: aad.as_slice(),
                },
            )
            .unwrap();
        // wrapped = iv(12) || enc
        let mut wrapped: Vec<u8> = Vec::new();
        wrapped.extend_from_slice(&[0xAAu8; 12]);
        wrapped.extend_from_slice(&enc);
        // 解包应还原 16 字节明文。
        let got = gcm_unwrap(&gcm_key, &wrapped, aad.as_slice()).unwrap();
        assert_eq!(got, pkey);
    }
}
