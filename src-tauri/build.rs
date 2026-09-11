use tauri_build::{AppManifest, Attributes};

fn main() {
    // 显式登记自定义命令，使 Tauri v2 生成 allow-/deny- 权限（否则 capability 引用会报 not found）
    let attrs = Attributes::new().app_manifest(
        AppManifest::default().commands(&[
            "get_engine_status",
            "analyze_local_engine",
            "update_engine",
            "check_engine_update",
            "run_trial_cache",
            "reveal_in_folder",
            "save_trial_mp3",
        ]),
    );
    tauri_build::try_build(attrs).expect("tauri build failed");
}
