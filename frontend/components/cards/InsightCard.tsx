import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsightCard as InsightCardType } from "@/lib/types";

interface InsightCardProps {
  insight: InsightCardType;
  staggerIndex?: number;
}

const PRIORITY_STYLES: Record<string, string> = {
  high:   "border-l-primary",
  medium: "border-l-info",
  low:    "border-l-outline",
};

export function InsightCard({ insight, staggerIndex = 0 }: InsightCardProps) {
  return (
    <div
      className={cn(
        "bg-[#FFFBEB] rounded-card p-5 border-l-4 animate-fade-up",
        PRIORITY_STYLES[insight.priority]
      )}
      style={{
        boxShadow: "var(--shadow-float)",
        "--stagger-delay": `${staggerIndex * 80}ms`,
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-7 rounded-[8px] bg-primary/10 shrink-0">
            <Sparkles size={14} className="text-primary" />
          </div>
          <span className="text-label-md font-semibold text-primary uppercase tracking-wider">
            AI Insight
          </span>
        </div>
        {insight.impact && (
          <span className="flex items-center gap-1 text-xs font-semibold text-grade-elite bg-grade-elite/10 px-2.5 py-1 rounded-badge">
            <TrendingUp size={12} />
            {insight.impact}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-3 text-sm font-semibold text-on-surface leading-snug">
        {insight.title}
      </h3>

      {/* Body */}
      <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">
        {insight.body}
      </p>

      {/* Action */}
      {insight.action && (
        <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all">
          {insight.action}
          <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}
