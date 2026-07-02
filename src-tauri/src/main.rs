// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // WebKitGTK's DMA-BUF renderer throws "Error 71 (Protocol error) dispatching to
    // Wayland display" on the NVIDIA proprietary driver under Wayland. Disabling it
    // makes the webview fall back to a rendering path that works. Only set when the
    // user hasn't chosen a value, so it stays overridable. Linux-only; the variable
    // is inert on Windows/macOS.
    #[cfg(target_os = "linux")]
    if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

    app_lib::run();
}
