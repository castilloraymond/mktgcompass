"use client";

import { useState, useCallback } from "react";
import { Sparkles, RotateCcw, Check, Info } from "lucide-react";
import type { BudgetOptimization } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface BudgetAllocatorProps {
  data: BudgetOptimization;
}

export function BudgetAllocator({ data }: BudgetAllocatorProps) {
  const [allocations, setAllocations] = useState<Record<string, number>>(
    Object.fromEntries(data.current_allocation.map((a) => [a.channel, a.amount]))
  );
  const [applied, setApplied] = useState(false);

  const total = Object.values(allocations).reduce((s, v) => s + v, 0);
  const remaining = data.total_budget - total;
  const hasChanges = data.current_allocation.some((a) => allocations[a.channel] !== a.amount);

  const update = useCallback((channel: string, value: number) => {
    setAllocations((prev) => ({ ...prev, [channel]: value }));
    setApplied(false);
  }, []);

  const applyRecommended = () => {
    setAllocations(
      Object.fromEntries(
        data.recommended_allocation.map((a) => [a.channel, a.amount])
      )
    );
    setApplied(false);
  };

  const reset = () => {
    setAllocations(
      Object.fromEntries(data.current_allocation.map((a) => [a.channel, a.amount]))
    );
    setApplied(false);
  };

  // Estimate lift based on deviation from current
  const estimatedLift = (() => {
    const totalDiff = data.current_allocation.reduce((sum, a) => {
      const rec = data.recommended_allocation.find((r) => r.channel === a.channel);
      const curr = allocations[a.channel];
      if (!rec) return sum;
      const progress = (curr - a.amount) / ((rec.amount - a.amount) || 1);
      return sum + progress;
    }, 0);
    const avgProgress = totalDiff / data.current_allocation.length;
    return (avgProgress * data.projected_lift_pct).toFixed(1);
  })();

  return (
    <div className="space-y-6">
      {/* Header badge */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-badge">
          Simulation Mode
        </span>
        <span className="text-xs text-on-surface-variant">
          Drag sliders to model reallocation scenarios
        </span>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-start gap-3 bg-surface-warning rounded-card p-4">
        <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-on-surface">AI Recommendation</p>
          <p className="text-sm text-on-surface-variant mt-1">
            Shifting <strong>{formatCurrency(7_150)}</strong> from Meta Ads to Google Search and Email
            is projected to improve total revenue by{" "}
            <strong className="text-grade-elite">{data.projected_lift_pct}%</strong>.
          </p>
          <button
            onClick={applyRecommended}
            className="mt-2 text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
          >
            Apply this strategy →
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {data.current_allocation.map((alloc) => {
          const rec = data.recommended_allocation.find((r) => r.channel === alloc.channel);
          const curr = allocations[alloc.channel];
          const max = Math.max(alloc.amount * 2.5, (rec?.amount ?? alloc.amount) * 1.5, 100_000);
          const changed = curr !== alloc.amount;

          return (
            <div key={alloc.channel}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-on-surface">{alloc.channel}</span>
                  {changed && (
                    <span
                      className={cn(
                        "text-xs font-semibold px-1.5 py-0.5 rounded-full",
                        curr > alloc.amount
                          ? "text-grade-elite bg-grade-elite/10"
                          : "text-error bg-error/10"
                      )}
                    >
                      {curr > alloc.amount ? "+" : ""}{formatCurrency(curr - alloc.amount)}
                    </span>
                  )}
                </div>
                <span className="text-sm font-mono font-tabular font-semibold text-on-surface">
                  {formatCurrency(curr)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={max}
                  step={500}
                  value={curr}
                  onChange={(e) => update(alloc.channel, Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--primary-container) 0%, var(--primary) ${(curr / max) * 100}%, var(--surface-container) ${(curr / max) * 100}%)`,
                  }}
                />
                {/* Recommended marker */}
                {rec && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-grade-optimal opacity-60"
                    style={{ left: `${(rec.amount / max) * 100}%` }}
                    title={`Recommended: ${formatCurrency(rec.amount)}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="rounded-[12px] bg-surface-container p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant font-medium">Total Allocated</span>
          <span className="font-mono font-tabular font-semibold text-on-surface">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant font-medium flex items-center gap-1">
            Remaining Cap
            <Info size={12} className="text-on-surface-variant" />
          </span>
          <span
            className={cn(
              "font-mono font-tabular font-semibold",
              remaining < 0 ? "text-error" : "text-grade-elite"
            )}
          >
            {formatCurrency(remaining)}
          </span>
        </div>
        {hasChanges && (
          <div className="flex items-center justify-between text-sm pt-1 border-t border-t-surface-high">
            <span className="text-on-surface-variant font-medium">Projected Lift</span>
            <span className="font-semibold text-grade-elite">+{estimatedLift}%</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {hasChanges && (
          <button
            onClick={() => setApplied(true)}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-[12px] bg-primary-gradient text-white text-sm font-semibold btn-primary-lift"
          >
            <Check size={16} />
            {applied ? "Strategy Applied" : "Apply Strategy"}
          </button>
        )}
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-[12px] bg-surface-high text-on-surface text-sm font-medium hover:bg-surface-container transition-colors"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </div>
  );
}
