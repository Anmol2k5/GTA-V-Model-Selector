# Electron Alongside Tauri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Electron shell for the existing Loadout React model selector without removing Tauri.

**Architecture:** Keep Vite/React as the shared renderer. Add an Electron main process for overlay window, tray, global hotkey, and IPC, plus a preload bridge consumed by the existing `LoadoutWheel`.

**Tech Stack:** Electron, electron-builder, concurrently, wait-on, React, Vite, TypeScript.

## Global Constraints

- Do not delete or modify `src-tauri/`.
- Keep the React UI in `src/`.
- Default hotkey is `Alt+Space`.
- Selected model commands are copied as existing strings such as `/model opus`.
- Electron must work on Windows first.

---

### Task 1: Add Electron Shell Dependencies And Scripts

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: npm scripts `electron:start`, `electron:dev`, and `electron:build`.

- [ ] **Step 1: Add dependencies**

Add dev dependencies:

```json
"concurrently": "^9.2.1",
"electron": "^38.4.0",
"electron-builder": "^26.0.12",
"wait-on": "^9.0.3"
```

- [ ] **Step 2: Add scripts**

Add scripts:

```json
"electron:start": "electron .",
"electron:dev": "concurrently -k \"npm run dev -- --host 127.0.0.1\" \"wait-on http://127.0.0.1:1420 && electron .\"",
"electron:build": "npm run build && electron-builder"
```

- [ ] **Step 3: Add Electron entry metadata**

Add:

```json
"main": "electron/main.cjs"
```

Add build metadata:

```json
"build": {
  "appId": "com.loadout.app",
  "productName": "Loadout",
  "files": [
    "dist/**/*",
    "electron/**/*",
    "package.json"
  ],
  "directories": {
    "buildResources": "src-tauri/icons",
    "output": "release/electron"
  },
  "win": {
    "target": "nsis",
    "icon": "src-tauri/icons/icon.ico"
  }
}
```

- [ ] **Step 4: Install packages**

Run: `npm install`

Expected: `package-lock.json` updates with Electron dependencies.

### Task 2: Add Electron Main Process

**Files:**
- Create: `electron/main.cjs`

**Interfaces:**
- Consumes: renderer bridge events from `electron/preload.cjs`.
- Produces: IPC events `hotkey-pressed`, `hotkey-released`; IPC handler `set-overlay-visible`.

- [ ] **Step 1: Create Electron main process**

Create `electron/main.cjs` with BrowserWindow setup, globalShortcut registration, tray menu, and IPC.

- [ ] **Step 2: Verify shell syntax**

Run: `node -c electron/main.cjs`

Expected: no syntax errors.

### Task 3: Add Electron Preload Bridge

**Files:**
- Create: `electron/preload.cjs`
- Modify: `src/vite-env.d.ts`

**Interfaces:**
- Produces: `window.loadoutNative.onHotkeyPressed`, `window.loadoutNative.onHotkeyReleased`, `window.loadoutNative.setOverlayVisible`, and `window.loadoutNative.platform`.

- [ ] **Step 1: Create preload bridge**

Expose only the required IPC surface using `contextBridge`.

- [ ] **Step 2: Add renderer types**

Declare `Window.loadoutNative` in `src/vite-env.d.ts`.

- [ ] **Step 3: Verify preload syntax**

Run: `node -c electron/preload.cjs`

Expected: no syntax errors.

### Task 4: Update LoadoutWheel Runtime Bridge

**Files:**
- Modify: `src/components/overlay/LoadoutWheel.tsx`

**Interfaces:**
- Consumes: `window.loadoutNative` when available.
- Keeps: existing Tauri event behavior when Electron bridge is absent.

- [ ] **Step 1: Add native helper functions**

Add helper functions that call Electron first and fall back to Tauri.

- [ ] **Step 2: Replace direct `invoke` calls**

Use the helper for overlay visibility changes.

- [ ] **Step 3: Subscribe to Electron events**

When `window.loadoutNative` exists, use Electron event listeners and skip Tauri listeners.

- [ ] **Step 4: Build renderer**

Run: `npm run build`

Expected: TypeScript and Vite build pass.

### Task 5: Verify And Smoke Test

**Files:**
- No source changes unless verification finds a defect.

**Interfaces:**
- Verifies: Electron shell can start, frontend builds, lint has no errors.

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: no errors.

- [ ] **Step 2: Run Electron syntax checks**

Run: `node -c electron/main.cjs` and `node -c electron/preload.cjs`

Expected: no syntax errors.

- [ ] **Step 3: Start Electron dev**

Run: `npm run electron:dev`

Expected: app starts, `Alt+Space` opens the selector, release confirms selection.
