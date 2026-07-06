import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Preset } from "../types";

export const defaultPresets: Preset[] = [
  {
    id: "claude-opus",
    provider: "Claude Code",
    name: "Claude Opus",
    label: "Deep reasoning",
    description: "Architecture, difficult debugging, multi-file planning",
    icon: "brain",
    colorHint: "purple",
    adapter: "claude_code",
    commandTemplate: "/model opus",
  },
  {
    id: "claude-sonnet",
    provider: "Claude Code",
    name: "Claude Sonnet",
    label: "Balanced",
    description: "Daily coding, implementation, fixes",
    icon: "zap",
    colorHint: "blue",
    adapter: "claude_code",
    commandTemplate: "/model sonnet",
  },
  {
    id: "codex-main",
    provider: "Codex",
    name: "Codex Main",
    label: "Build",
    description: "General coding and agentic tasks",
    icon: "terminal",
    colorHint: "green",
    adapter: "codex",
    commandTemplate: "/model gpt-5.5",
  },
  {
    id: "codex-fast",
    provider: "Codex",
    name: "Codex Fast",
    label: "Fast",
    description: "Quick edits, questions, and smaller tasks",
    icon: "bolt",
    colorHint: "yellow",
    adapter: "codex",
    commandTemplate: "/model mini",
  },
  {
    id: "auto",
    provider: "Loadout",
    name: "Auto",
    label: "Smart routing",
    description: "Choose a preset based on task type later",
    icon: "sparkles",
    colorHint: "white",
    adapter: "none",
    commandTemplate: "",
  },
];

interface PresetStore {
  presets: Preset[];
  selectedId: string | null;
  addPreset: (preset: Preset) => void;
  updatePreset: (id: string, preset: Partial<Preset>) => void;
  deletePreset: (id: string) => void;
  setSelectedId: (id: string) => void;
}

export const usePresetStore = create<PresetStore>()(
  persist(
    (set) => ({
      presets: defaultPresets,
      selectedId: defaultPresets[0].id,
      addPreset: (preset) =>
        set((state) => ({ presets: [...state.presets, preset] })),
      updatePreset: (id, updated) =>
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === id ? { ...p, ...updated } : p
          ),
        })),
      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
        })),
      setSelectedId: (id) => set({ selectedId: id }),
    }),
    {
      name: "loadout-presets",
    }
  )
);
