# Electron Alongside Tauri Design

## Goal

Add Electron as a parallel native shell for Loadout while leaving the existing Tauri implementation intact.

## Architecture

The existing React/Vite frontend remains the shared UI. Electron adds a separate native shell under `electron/` with a main process for window lifecycle, global shortcut handling, tray menu, and IPC. A preload script exposes a small `window.loadoutNative` bridge so React can subscribe to hotkey events and request overlay visibility changes without importing Electron in renderer code.

## Runtime Behavior

Electron creates one transparent, frameless, always-on-top overlay window. The window loads the Vite dev server during development and `dist/index.html` after build. Pressing `Alt+Space` shows and focuses the overlay, while releasing the shortcut emits a release event so the wheel confirms the current preset and hides. The renderer keeps the existing keyboard and mouse wheel navigation.

## Frontend Integration

`LoadoutWheel` supports both native runtimes. In Electron it uses `window.loadoutNative`; in Tauri it keeps the existing `@tauri-apps/api` event and command path. Browser/mock mode remains safe by ignoring missing native APIs.

## Scripts

`package.json` gets Electron scripts:

- `electron:start` runs Electron against an already-running Vite server.
- `electron:dev` runs Vite and Electron together.
- `electron:build` builds the Vite renderer and packages Electron.

## Constraints

- Do not delete or modify `src-tauri/`.
- Keep the React UI in `src/`.
- Default hotkey is `Alt+Space`.
- Selected model commands are copied as existing strings such as `/model opus`.
- Electron must work on Windows first.

## Verification

Run `npm run build`, `npm run lint`, and start the Electron dev app. Native verification is that `Alt+Space` opens the overlay and releasing the hotkey confirms selection and copies the selected command.
