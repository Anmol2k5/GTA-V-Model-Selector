#[cfg(target_os = "windows")]
use tauri::Manager;
use std::sync::Mutex;

mod hotkeys;
mod tray;
#[cfg(target_os = "windows")]
mod windows;

pub struct AppState {
    pub hotkey: Mutex<String>,
}

#[tauri::command]
fn update_hotkey(app: tauri::AppHandle, new_hotkey: String) -> Result<(), String> {
    {
        let state = app.state::<AppState>();
        let mut hotkey = state.hotkey.lock().unwrap();
        *hotkey = new_hotkey;
    }
    hotkeys::register_hotkeys(&app)?;
    Ok(())
}

#[tauri::command]
fn set_overlay_visible(app: tauri::AppHandle, visible: bool) {
    #[cfg(target_os = "windows")]
    if let Some(window) = app.get_webview_window("overlay") {
        if visible {
            let _ = window.show();
            let _ = window.set_focus();
            let _ = window.set_ignore_cursor_events(false);
        } else {
            // Keep window shown but ignore cursor events, or hide it
            let _ = window.set_ignore_cursor_events(true);
            let _ = window.hide();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        // Include tauri-plugin-store if we add it, but for now we haven't added it to Cargo.toml. 
        // Wait, did AOEOverlay have it? Let me check Cargo.toml later.
        .manage(AppState {
            hotkey: Mutex::new("Alt+Space".to_string()),
        })
        .setup(|app| {
            tray::setup_tray(app)?;

            if let Err(e) = hotkeys::register_hotkeys(app.handle()) {
                eprintln!("Failed to register hotkeys: {}", e);
            }

            #[cfg(target_os = "windows")]
            {
                windows::setup_overlay_window(app.handle().clone());
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            update_hotkey,
            set_overlay_visible,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
