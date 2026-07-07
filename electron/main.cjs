const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage } = require("electron");
const path = require("node:path");

const isDev = !app.isPackaged;
const devUrl = process.env.VITE_DEV_SERVER_URL || "http://127.0.0.1:1420";
const hotkey = "Alt+Space";

let overlayWindow = null;
let tray = null;
let hotkeyDown = false;

function getAssetPath(...segments) {
  return path.join(__dirname, "..", ...segments);
}

function getIconPath() {
  return getAssetPath("src-tauri", "icons", "icon.ico");
}

async function loadOverlay(window) {
  if (isDev) {
    await window.loadURL(`${devUrl}/?window=overlay`);
    return;
  }

  await window.loadFile(getAssetPath("dist", "index.html"), {
    query: { window: "overlay" },
  });
}

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 900,
    height: 520,
    x: 50,
    y: 50,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  loadOverlay(overlayWindow).catch((error) => {
    console.error("Failed to load overlay:", error);
  });

  overlayWindow.webContents.on("before-input-event", (_event, input) => {
    if (!hotkeyDown || input.type !== "keyUp") return;

    if (input.key === " " || input.key === "Alt" || input.code === "Space") {
      hotkeyDown = false;
      setOverlayVisible(false, true);
    }
  });

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
}

function setOverlayVisible(visible, emitEvent = false) {
  if (!overlayWindow) return;

  if (visible) {
    overlayWindow.setIgnoreMouseEvents(false);
    overlayWindow.show();
    overlayWindow.focus();
    if (emitEvent) {
      overlayWindow.webContents.send("hotkey-pressed");
    }
    return;
  }

  if (emitEvent) {
    overlayWindow.webContents.send("hotkey-released");
  }
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.hide();
}

function registerHotkey() {
  const registered = globalShortcut.register(hotkey, () => {
    if (!hotkeyDown) {
      hotkeyDown = true;
      setOverlayVisible(true, true);
      return;
    }

    overlayWindow?.webContents.send("hotkey-pressed");
  });

  if (!registered) {
    console.error(`Failed to register global shortcut: ${hotkey}`);
  }
}

function createTray() {
  const icon = nativeImage.createFromPath(getIconPath());
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);
  tray.setToolTip("Loadout");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show selector",
        click: () => setOverlayVisible(true, true),
      },
      {
        label: "Hide selector",
        click: () => setOverlayVisible(false, true),
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );
}

app.whenReady().then(() => {
  createOverlayWindow();
  createTray();
  registerHotkey();

  ipcMain.handle("set-overlay-visible", (_event, visible) => {
    setOverlayVisible(Boolean(visible), false);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOverlayWindow();
    }
  });
});

app.on("browser-window-blur", () => {
  if (!hotkeyDown) return;
  hotkeyDown = false;
  setOverlayVisible(false, true);
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
