/// <reference types="vite/client" />

interface LoadoutNativeBridge {
  platform: "electron";
  onHotkeyPressed: (callback: () => void) => () => void;
  onHotkeyReleased: (callback: () => void) => () => void;
  setOverlayVisible: (visible: boolean) => Promise<void>;
}

interface Window {
  loadoutNative?: LoadoutNativeBridge;
}
