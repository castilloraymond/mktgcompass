import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsightCard as InsightCardType } from "@/lib/types";

interface InsightCardProps {
  insight: InsightCardType;
  staggerIndex?: number;
}

export function InsightCard({ insight, staggerIndex = 0 }: InsightCardProps) {
  return (
    <div
      className={cn("bg-surface-lowest rounded-card p-5 animate-fade-up")}
      style={{
        border: "1px solid var(--outline)",
        boxShadow: "var(--shadow-float)",
        "--stagger-delay": `${staggerIndex * 80}ms`,
      } as React.CSSProperties}
    >
      {/* Impact badge */}
      {insight.impact && (
        <div className="mb-3">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-[6px]"
            style={{
              background: "var(--accent-primary-light)",
              color: "var(--accent-primary)",
            }}
          >
            {insight.impact}
          </span>
        </div>
      )}

      {/* Title */}
      <h3
        className="text-[0.9375rem] font-semibold text-on-surface leading-snug"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {insight.title}
      </h3>

      {/* Body */}
      <p className="mt-1.5 text-[0.875rem] text-on-surface-variant leading-relaxed">
        {insight.body}
      </p>

      {/* Action button */}
      {insight.action && (
        <button
          className="mt-4 flex items-center gap-1.5 text-[0.8125rem] font-semibold transition-all hover:gap-2"
          style={{ color: "var(--accent-primary)" }}
        >
          {insight.action}
          <ArrowRight size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
