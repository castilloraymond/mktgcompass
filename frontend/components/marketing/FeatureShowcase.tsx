import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface FeatureShowcaseProps {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: ReactNode;
  reverse?: boolean;
  background?: "default" | "surface";
}

export function FeatureShowcase({
  eyebrow,
  title,
  body,
  bullets,
  visual,
  reverse = false,
  background = "default",
}: FeatureShowcaseProps) {
  return (
    <section
      className={background === "surface" ? "bg-surface" : "bg-surface-lowest"}
    >
      <div className="mx-auto max-w-[1200px] px-8 py-20 lg:py-28">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            reverse ? "lg:[&>div:first-child]:order-2" : ""
          }`}
        >
          {/* Visual */}
          <div
            className="relative rounded-[20px] overflow-hidden bg-surface-lowest"
            style={{
              border: "1px solid var(--outline)",
              boxShadow: "var(--shadow-overlay)",
            }}
          >
            {visual}
          </div>

          {/* Text */}
          <div className="max-w-[520px]">
            <p className="text-overline text-primary mb-3">{eyebrow}</p>
            <h2
              className="text-headline-md text-on-surface mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed mb-6" style={{ fontSize: "1rem" }}>
              {body}
            </p>
            <ul className="space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    className="flex items-center justify-center size-5 rounded-full shrink-0 mt-0.5"
                    style={{ background: "var(--accent-primary-light)" }}
                  >
                    <Check size={12} className="text-primary" strokeWidth={2.5} />
                  </span>
                  <span className="text-body-md text-on-surface">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Visual stubs: small stylized previews used inside each showcase ── */

export function AttributionVisual() {
  const rows = [
    { name: "Google Search", grade: "A+", color: "var(--grade-elite)", width: "92%" },
    { name: "Organic Social", grade: "B",  color: "var(--grade-optimal)", width: "74%" },
    { name: "Meta Ads",      grade: "C",  color: "var(--grade-scaling)", width: "58%" },
    { name: "Display",       grade: "D",  color: "var(--grade-poor)",    width: "32%" },
  ];
  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-32 rounded bg-on-surface" />
        <div className="h-2 w-16 rounded bg-surface-container" />
      </div>
      {rows.map((r) => (
        <div key={r.name} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[0.75rem] text-on-surface font-medium">{r.name}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ background: `${r.color}1a`, color: r.color }}
            >
              {r.grade}
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full rounded-full" style={{ width: r.width, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function InsightsVisual() {
  return (
    <div className="p-6 space-y-3">
      <div
        className="rounded-[12px] p-4 space-y-2"
        style={{ background: "var(--surface-variant)", border: "1px solid var(--outline)" }}
      >
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-primary-gradient" />
          <div className="h-2 w-20 rounded bg-on-surface" />
          <div className="ml-auto h-1.5 w-10 rounded bg-primary" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-surface-container" />
          <div className="h-1.5 w-5/6 rounded bg-surface-container" />
          <div className="h-1.5 w-2/3 rounded bg-surface-container" />
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          <div className="h-1.5 w-16 rounded bg-primary" />
        </div>
      </div>

      <div
        className="rounded-[12px] p-4 bg-surface-lowest"
        style={{ border: "1px solid var(--outline)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="size-4 rounded-full" style={{ background: "var(--grade-elite)" }} />
          <div className="h-2 w-24 rounded bg-on-surface" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-surface-container" />
          <div className="h-1.5 w-3/4 rounded bg-surface-container" />
        </div>
      </div>

      <div
        className="rounded-[12px] p-4 bg-surface-lowest"
        style={{ border: "1px solid var(--outline)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="size-4 rounded-full" style={{ background: "var(--grade-scaling)" }} />
          <div className="h-2 w-28 rounded bg-on-surface" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-surface-container" />
          <div className="h-1.5 w-4/5 rounded bg-surface-container" />
        </div>
      </div>
    </div>
  );
}

export function BudgetVisual() {
  const bars = [
    { label: "Google Search", before: 30, after: 45, color: "var(--primary)" },
    { label: "Meta Ads",      before: 35, after: 22, color: "var(--grade-scaling)" },
    { label: "Email",         before: 15, after: 18, color: "var(--grade-elite)" },
    { label: "Display",       before: 20, after: 15, color: "var(--on-surface-variant)" },
  ];
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-28 rounded bg-on-surface" />
        <div
          className="text-[10px] font-bold px-2 py-1 rounded"
          style={{ background: "var(--accent-primary-light)", color: "var(--primary)" }}
        >
          +12.4% ROAS
        </div>
      </div>
      {bars.map((b) => (
        <div key={b.label} className="space-y-1">
          <div className="flex items-center justify-between text-[0.75rem] text-on-surface-variant">
            <span>{b.label}</span>
            <span className="font-mono font-semibold" style={{ color: b.color }}>
              {b.after}%
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full opacity-30"
              style={{ width: `${b.before}%`, background: b.color }}
            />
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ width: `${b.after}%`, background: b.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
