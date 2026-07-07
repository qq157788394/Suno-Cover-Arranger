use tauri_build::{AppManifest, Attributes};

fn main() {
    // 显式登记自定义命令，使 Tauri v2 生成 allow-/deny- 权限（否则 capability 引用会报 not found）
    let attrs = Attributes::new()
        .app_manifest(AppManifest::default().commands(&["install_local_engine", "get_engine_status"]));
    tauri_build::try_build(attrs).expect("tauri build failed");
}
