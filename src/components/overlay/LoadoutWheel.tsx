import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePresetStore } from "../../stores";
import { Brain, Zap, Terminal, Bolt, Sparkles } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

// Helper to get icon component
const getIcon = (iconName: string) => {
  switch (iconName) {
    case "brain": return <Brain className="w-8 h-8" />;
    case "zap": return <Zap className="w-8 h-8" />;
    case "terminal": return <Terminal className="w-8 h-8" />;
    case "bolt": return <Bolt className="w-8 h-8" />;
    case "sparkles": return <Sparkles className="w-8 h-8" />;
    default: return <Sparkles className="w-8 h-8" />;
  }
};

// Helper for color glow
const getColorClasses = (colorHint: string) => {
  switch (colorHint) {
    case "purple": return "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-purple-400";
    case "blue": return "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-blue-400";
    case "green": return "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)] text-green-400";
    case "yellow": return "border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.4)] text-yellow-400";
    default: return "border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.4)] text-white";
  }
};

export const LoadoutWheel: React.FC = () => {
  const { presets, selectedId, setSelectedId } = usePresetStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Find current index
  const currentIndex = presets.findIndex((p) => p.id === selectedId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  
  const handleSelect = useCallback((index: number) => {
    if (index >= 0 && index < presets.length) {
      setSelectedId(presets[index].id);
    }
  }, [presets, setSelectedId]);

  const handleNext = useCallback(() => {
    handleSelect(Math.min(safeIndex + 1, presets.length - 1));
  }, [safeIndex, presets.length, handleSelect]);

  const handlePrev = useCallback(() => {
    handleSelect(Math.max(safeIndex - 1, 0));
  }, [safeIndex, handleSelect]);

  const safeIndexRef = useRef(safeIndex);
  useEffect(() => {
    safeIndexRef.current = safeIndex;
  }, [safeIndex]);

  const confirmSelection = useCallback(() => {
    const selected = presets[safeIndexRef.current];
    if (selected) {
      console.log("Confirmed selection:", selected.name);
      if (selected.adapter !== "none" && selected.commandTemplate) {
        navigator.clipboard.writeText(selected.commandTemplate).then(() => {
          console.log("Copied command to clipboard");
        });
      }
    }
    setIsOpen(false);
    invoke("set_overlay_visible", { visible: false });
  }, [presets]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Enter") {
        confirmSelection();
      } else if (e.key === "Escape") {
        setIsOpen(false);
        invoke("set_overlay_visible", { visible: false });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, confirmSelection]);

  // Fix Q/E mappings in wheel listener
  useEffect(() => {
    const handleKeyDownFixed = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight" || e.key === "e" || e.key === "E") {
        handleNext(); 
      } else if (e.key === "ArrowLeft" || e.key === "q" || e.key === "Q") {
        handlePrev(); 
      }
    };
    window.addEventListener("keydown", handleKeyDownFixed);
    return () => window.removeEventListener("keydown", handleKeyDownFixed);
  }, [isOpen, handleNext, handlePrev]);

  // Mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen) return;
      if (e.deltaY > 0) handleNext();
      else if (e.deltaY < 0) handlePrev();
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isOpen, handleNext, handlePrev]);

  // Listen to Rust hotkey events
  useEffect(() => {
    const unlistenPressed = listen("hotkey-pressed", () => {
      setIsOpen(true);
      invoke("set_overlay_visible", { visible: true });
    });
    const unlistenReleased = listen("hotkey-released", () => {
      setIsOpen((open) => {
        if (open) {
          confirmSelection();
        }
        return false;
      });
    });

    return () => {
      unlistenPressed.then(f => f());
      unlistenReleased.then(f => f());
    };
  }, [confirmSelection]);

  const currentPreset = presets[safeIndex];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-auto flex flex-col justify-end items-center pb-12 bg-black/40">
      
      {/* Current Selection Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="text-white/60 text-sm font-semibold tracking-widest uppercase mb-1">
          {currentPreset.provider}
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          {currentPreset.name}
        </h1>
        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm mb-2 backdrop-blur-md border border-white/20">
          {currentPreset.label}
        </div>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {currentPreset.description}
        </p>
      </motion.div>

      {/* Wheel Container */}
      <div className="relative w-full max-w-5xl h-48 flex items-center justify-center perspective-1000">
        
        {/* Release instruction */}
        <div className="absolute -top-12 text-white/50 text-xs font-semibold tracking-widest animate-pulse">
          RELEASE TO EQUIP
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence mode="popLayout">
            {presets.map((preset, idx) => {
              const isSelected = idx === safeIndex;
              const distance = Math.abs(idx - safeIndex);
              
              if (distance > 3) return null; // Only show nearby items

              // Calculate style based on distance
              const scale = isSelected ? 1 : Math.max(0.7, 1 - distance * 0.15);
              const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.3);
              const yOffset = isSelected ? 0 : distance * 10;
              const zIndex = 10 - distance;

              return (
                <motion.div
                  key={preset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity, scale, y: yOffset }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`
                    flex flex-col items-center justify-center p-6 rounded-2xl
                    w-40 h-40 border bg-neutral-900/80 backdrop-blur-xl
                    transition-colors duration-200
                    ${isSelected ? getColorClasses(preset.colorHint) : "border-white/10 text-white/60"}
                  `}
                  style={{ zIndex }}
                >
                  <div className="mb-3">
                    {getIcon(preset.icon)}
                  </div>
                  <div className="text-center font-bold uppercase tracking-wider text-sm leading-tight">
                    {preset.name.replace("Claude ", "").replace("Codex ", "")}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
