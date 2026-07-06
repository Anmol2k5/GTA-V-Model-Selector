import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { LoadoutWheel } from "./components/overlay/LoadoutWheel";
import { SettingsWindow } from "./components/settings/SettingsWindow";

function App() {
  const [windowLabel, setWindowLabel] = useState<string | null>(null);

  useEffect(() => {
    const initWindow = async () => {
      try {
        const win = getCurrentWindow();
        const searchLabel = typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("window")
          : null;
        const rawLabel = searchLabel || (win as any).label;
        const label = !rawLabel || rawLabel === "main" ? "overlay" : rawLabel;
        setWindowLabel(label);
      } catch (error) {
        console.error("Failed to get window label:", error);
        setWindowLabel("overlay");
      }
    };
    initWindow();
  }, []);

  if (!windowLabel) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (windowLabel === "overlay") {
    return (
      <div className="w-screen h-screen flex flex-col justify-end items-center pb-10 pointer-events-none">
        <LoadoutWheel />
      </div>
    );
  }

  if (windowLabel === "settings") {
    return <SettingsWindow />;
  }

  return null;
}

export default App;
