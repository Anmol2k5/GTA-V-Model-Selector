import { create } from "zustand";

export type OcrAssistStatus = "off" | "calibrating" | "active" | "error";

export interface OcrAssistSignals {
  age?: string;
  resources?: {
    food?: number;
    wood?: number;
    gold?: number;
    stone?: number;
  };
  population?: {
    current?: number;
    cap?: number;
  };
}

export interface OcrAssistState {
  status: OcrAssistStatus;
  lastCaptureAt?: string;
  signals: OcrAssistSignals;
  confidence: number;
  warnings: string[];
  setStatus: (status: OcrAssistStatus) => void;
  setSnapshot: (snapshot: {
    signals?: OcrAssistSignals;
    confidence?: number;
    warnings?: string[];
  }) => void;
  reset: () => void;
}

export const useOcrAssistStore = create<OcrAssistState>((set) => ({
  status: "off",
  signals: {},
  confidence: 0,
  warnings: ["OCR assist is experimental and read-only. It will not auto-advance build steps."],
  setStatus: (status) => set({ status }),
  setSnapshot: ({ signals = {}, confidence = 0, warnings = [] }) =>
    set({
      signals,
      confidence,
      warnings,
      lastCaptureAt: new Date().toISOString(),
    }),
  reset: () =>
    set({
      status: "off",
      signals: {},
      confidence: 0,
      lastCaptureAt: undefined,
      warnings: ["OCR assist is experimental and read-only. It will not auto-advance build steps."],
    }),
}));
