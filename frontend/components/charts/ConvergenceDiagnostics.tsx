"use client";

import type { ConvergenceParam } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ConvergenceDiagnosticsProps {
  data: ConvergenceParam[];
}

const STATUS_STYLES = {
  converged: { bg: "bg-grade-elite", label: "Converged", textColor: "text-grade-elite" },
  borderline: { bg: "bg-grade-scaling", label: "Borderline", textColor: "text-grade-scaling" },
  not_converged: { bg: "bg-error", label: "Not Converged", textColor: "text-error" },
};

export function ConvergenceDiagnostics({ data }: ConvergenceDiagnosticsProps) {
  // Scale: R-hat of 1.0 = 0%, 1.2 = 100% of bar
  const maxRhat = 1.2;

  return (
    <div className="space-y-3">
      {/* Threshold legend */}
      <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-2">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-grade-elite" />
          &lt; 1.1 Converged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-grade-scaling" />
          1.1–1.2 Borderline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-error" />
          &gt; 1.2 Not converged
        </span>
      </div>

      {data.map((param) => {
        const style = STATUS_STYLES[param.status];
        const barWidth = Math.min(((param.rhat - 1.0) / (maxRhat - 1.0)) * 100, 100);

        return (
          <div key={param.parameter} className="flex items-center gap-4">
            <span className="text-sm text-on-surface font-medium w-[180px] shrink-0 truncate">
              {param.parameter}
            </span>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden relative">
                {/* 1.1 threshold marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-on-surface-variant/20"
                  style={{ left: `${((1.1 - 1.0) / (maxRhat - 1.0)) * 100}%` }}
                />
                <div
                  className={cn("h-full rounded-full transition-all duration-slow", style.bg)}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="text-xs font-mono font-tabular w-[3.5rem] text-right text-on-surface">
                {param.rhat.toFixed(3)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
