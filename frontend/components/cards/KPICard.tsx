"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Info, ArrowRight } from "lucide-react";
import Link from "next/link";

interface KPICardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  className?: string;
  staggerIndex?: number;
  tooltip?: string;
  tooltipTechnicalName?: string;
  tooltipLink?: string;
}

export function KPICard({
  label,
  value,
  delta,
  deltaType = "neutral",
  subtitle,
  className,
  staggerIndex = 0,
  tooltip,
  tooltipTechnicalName,
  tooltipLink,
}: KPICardProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setTooltipOpen(true);
  };

  const hide = () => {
    hideTimer.current = setTimeout(() => setTooltipOpen(false), 150);
  };

  return (
    <div
      className={cn("relative animate-fade-up", className)}
      style={{ "--stagger-delay": `${staggerIndex * 70}ms` } as React.CSSProperties}
    >
      <div
        className="bg-surface-lowest rounded-card p-6 h-full transition-shadow duration-200"
        style={{
          border: "1px solid var(--outline)",
          boxShadow: "var(--shadow-float)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-float)")}
      >
        {/* Label row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-overline text-on-surface-variant">{label}</p>
          {tooltip && (
            <div onMouseEnter={show} onMouseLeave={hide} className="relative">
              <button
                aria-label={`More info about ${label}`}
                className="flex items-center justify-center size-5 rounded-full text-on-surface-variant/40 hover:text-on-surface-variant transition-colors cursor-help"
              >
                <Info size={13} />
              </button>

              {tooltipOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-[12px] p-4 z-50 text-xs leading-relaxed"
                  style={{
                    background: "#111827",
                    boxShadow: "var(--shadow-overlay)",
                  }}
                  onMouseEnter={show}
                  onMouseLeave={hide}
                >
                  {tooltipTechnicalName && (
                    <p
                      className="mb-1.5 font-semibold uppercase tracking-wider"
                      style={{ fontSize: "10px", color: "rgba(255,255,255,0.40)" }}
                    >
                      Also called: {tooltipTechnicalName}
                    </p>
                  )}
                  <p style={{ color: "rgba(255,255,255,0.85)" }}>{tooltip}</p>
                  {tooltipLink && (
                    <Link
                      href={tooltipLink}
                      className="mt-3 flex items-center gap-1 font-semibold transition-colors"
                      style={{ color: "rgba(255,255,255,0.50)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.90)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                    >
                      See full breakdown <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Value */}
        <p
          className="text-[2.25rem] font-bold leading-none text-on-surface font-tabular"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          {value}
        </p>

        {/* Delta */}
        {delta && (
          <p
            className={cn(
              "mt-2.5 flex items-center gap-1 text-[0.8125rem] font-medium",
              deltaType === "positive" && "text-grade-elite",
              deltaType === "negative" && "text-error",
              deltaType === "neutral"  && "text-on-surface-variant"
            )}
          >
            {deltaType === "positive" && <TrendingUp size={13} strokeWidth={2} />}
            {deltaType === "negative" && <TrendingDown size={13} strokeWidth={2} />}
            {delta}
          </p>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-1 text-[0.75rem] text-on-surface-variant">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
