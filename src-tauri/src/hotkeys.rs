use crate::AppState;
use tauri::{AppHandle, Emitter, Manager, Runtime};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

fn parse_shortcut(key_str: &str) -> Option<Shortcut> {
    let parts: Vec<&str> = key_str.split('+').collect();
    let mut modifiers = Modifiers::empty();
    let mut code = None;

    for part in parts {
        match part.to_uppercase().as_str() {
            "ALT" => modifiers.insert(Modifiers::ALT),
            "CTRL" | "CONTROL" => modifiers.insert(Modifiers::CONTROL),
            "SHIFT" => modifiers.insert(Modifiers::SHIFT),
            "SUPER" | "META" | "COMMAND" | "WINDOWS" | "CMD" => modifiers.insert(Modifiers::SUPER),
            rest => {
                if let Some(c) = string_to_code(rest) {
                    code = Some(c);
                }
            }
        }
    }
    code.map(|c| Shortcut::new(Some(modifiers), c))
}

fn string_to_code(key: &str) -> Option<Code> {
    match key.to_uppercase().as_str() {
        "SPACE" => Some(Code::Space),
        "A" => Some(Code::KeyA),
        "B" => Some(Code::KeyB),
        // we can support more later if needed, but space is primary for now
        _ => None,
    }
}

pub fn register_hotkeys<R: Runtime>(app: &AppHandle<R>) -> Result<(), String> {
    if let Err(e) = app.global_shortcut().unregister_all() {
        eprintln!("Warning: Failed to unregister existing hotkeys: {}", e);
    }

    let hotkey_str = {
        let state = app.state::<AppState>();
        state.hotkey.lock().unwrap().clone()
    };

    if let Some(shortcut) = parse_shortcut(&hotkey_str) {
        let app_handle = app.clone();
        
        app.global_shortcut()
            .on_shortcut(shortcut, move |app, triggered_shortcut, event| {
                if *triggered_shortcut == shortcut {
                    if event.state == ShortcutState::Pressed {
                        let _ = app_handle.emit("hotkey-pressed", ());
                    } else if event.state == ShortcutState::Released {
                        let _ = app_handle.emit("hotkey-released", ());
                    }
                }
            })
            .map_err(|e| format!("Failed to register hotkey: {}", e))?;
    } else {
        eprintln!("Failed to parse hotkey: {}", hotkey_str);
    }

    Ok(())
}
