import { Clock, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimerDisplay } from "./useTimerDisplay";

interface FullTimerProps {
  targetTiming?: string;
}

export function FullTimer({ targetTiming }: FullTimerProps) {
  const {
    isRunning,
    isPaused,
    timerDisplay,
    deltaStyles,
    showDelta,
    deltaPulse,
    deltaDisplay,
    voiceEnabled,
    adjustedTarget,
    toggleVoice,
  } = useTimerDisplay(targetTiming);

  return (
    <div data-testid="timer-bar" className="px-3 py-1.5 border-b border-white/10">
      <div className="flex min-w-0 items-center justify-between gap-3">
        {/* Timer display */}
        <div className="flex shrink-0 items-center gap-1.5">
          {isPaused ? (
            <Pause className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <Clock
              className={cn(
                "w-4 h-4",
                isRunning ? "text-amber-400" : "text-white/40"
              )}
            />
          )}
          <span
            className={cn(
              "font-mono font-bold text-sm tabular-nums",
              isPaused
                ? "text-amber-400 animate-pulse"
                : isRunning
                  ? "text-white"
                  : "text-white/60"
            )}
          >
            {isPaused ? `PAUSED ${timerDisplay}` : timerDisplay}
          </span>
        </div>

        {/* Delta indicator */}
        <div
          className={cn(
            "flex min-w-[64px] flex-1 items-center justify-center gap-1 font-mono text-sm font-medium tabular-nums",
            showDelta ? deltaStyles.colorClass : "text-white/30",
            deltaPulse && showDelta && "animate-pulse"
          )}
          aria-live="polite"
        >
          {showDelta && deltaStyles.icon}
          <span>{showDelta ? deltaDisplay : "—"}</span>
        </div>

        {/* Right side: target timing + mute button */}
        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
          {targetTiming && (
            <span
              className="max-w-[132px] truncate whitespace-nowrap text-xs text-white/40"
              title={adjustedTarget ? `Original: ${targetTiming}` : undefined}
            >
              Target:{" "}
              <span className="font-mono text-white/60 tabular-nums">
                {adjustedTarget ? `~${adjustedTarget}` : targetTiming}
              </span>
            </span>
          )}

          {/* Mute/unmute button */}
          <button
            onClick={toggleVoice}
            className={cn(
              "p-1 rounded hover:bg-white/10 transition-colors",
              voiceEnabled ? "text-white/80" : "text-white/40"
            )}
            title={voiceEnabled ? "Mute voice coaching" : "Enable voice coaching"}
          >
            {voiceEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
