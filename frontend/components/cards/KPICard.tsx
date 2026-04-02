import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  className?: string;
  staggerIndex?: number;
}

export function KPICard({
  label,
  value,
  delta,
  deltaType = "neutral",
  subtitle,
  className,
  staggerIndex = 0,
}: KPICardProps) {
  return (
    <div
      className={cn(
        "bg-surface-lowest rounded-card p-6 animate-fade-up",
        className
      )}
      style={{
        boxShadow: "var(--shadow-float)",
        "--stagger-delay": `${staggerIndex * 60}ms`,
      } as React.CSSProperties}
    >
      <p className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-baseline gap-3 mt-2">
        <span
          className="text-[2rem] font-bold leading-none text-on-surface font-tabular"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-1 text-sm font-semibold",
              deltaType === "positive" && "text-grade-elite",
              deltaType === "negative" && "text-error",
              deltaType === "neutral"  && "text-on-surface-variant"
            )}
          >
            {deltaType === "positive" && <TrendingUp size={14} />}
            {deltaType === "negative" && <TrendingDown size={14} />}
            {delta}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-label-md text-on-surface-variant mt-1.5">{subtitle}</p>
      )}
    </div>
  );
}
