const { contextBridge, ipcRenderer } = require("electron");

function subscribe(channel, callback) {
  const listener = () => callback();
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld("loadoutNative", {
  platform: "electron",
  onHotkeyPressed(callback) {
    return subscribe("hotkey-pressed", callback);
  },
  onHotkeyReleased(callback) {
    return subscribe("hotkey-released", callback);
  },
  setOverlayVisible(visible) {
    return ipcRenderer.invoke("set-overlay-visible", visible);
  },
});
