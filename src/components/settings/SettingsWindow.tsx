import React from "react";
import { usePresetStore } from "../../stores";

export const SettingsWindow: React.FC = () => {
  const { presets } = usePresetStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-neutral-100">Loadout Settings</h1>
        
        <section className="mb-12 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Global Hotkey</h2>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              value="Alt+Space" 
              readOnly 
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white w-64"
            />
            <span className="text-neutral-500 text-sm">Hotkey editing coming soon...</span>
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-200">Model Presets</h2>
            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors">
              Add Preset
            </button>
          </div>

          <div className="space-y-4">
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{preset.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                      {preset.label}
                    </span>
                  </div>
                  <div className="text-neutral-500 text-sm">{preset.description}</div>
                  <div className="text-neutral-600 font-mono text-xs mt-2 bg-neutral-900 p-2 rounded border border-neutral-800 inline-block">
                    {preset.commandTemplate || "No command"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-neutral-400 hover:text-white px-3 py-1 rounded hover:bg-neutral-800 transition-colors">
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-red-900/30 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
