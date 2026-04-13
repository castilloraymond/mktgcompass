import { BarChart3, Sparkles, Target, FileText, type LucideIcon } from "lucide-react";

export function BentoGrid() {
  return (
    <section id="features" className="bg-surface-lowest">
      <div className="mx-auto max-w-[1200px] px-8 py-20 lg:py-28">
        <div className="text-center max-w-[640px] mx-auto mb-14">
          <p className="text-overline text-primary mb-3">Everything you need</p>
          <h2
            className="text-headline-lg text-on-surface mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One platform, four superpowers
          </h2>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            From raw spend data to boardroom-ready recommendations — without a
            data science team or a six-figure consulting bill.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(220px,auto)]">
          {/* Tall left — Automated Attribution */}
          <BentoCard
            className="lg:row-span-2"
            icon={BarChart3}
            title="Automated Attribution"
            body="Causal channel contribution with Meridian under the hood. See exactly which dollars drove which revenue — no last-click fiction."
          >
            <AttributionMiniViz />
          </BentoCard>

          {/* Top right — Insights */}
          <BentoCard
            className="lg:col-span-2"
            icon={Sparkles}
            title="AI-Powered Insights"
            body="Claude reads your results and writes them back in plain English. The why, not just the what."
          >
            <InsightsMiniViz />
          </BentoCard>

          {/* Bottom right left — Budget */}
          <BentoCard
            icon={Target}
            title="Budget Optimization"
            body="Get a reallocation plan that maximizes ROAS across channels, with saturation curves baked in."
          >
            <BudgetMiniViz />
          </BentoCard>

          {/* Bottom right — Reports (coming soon) */}
          <BentoCard
            icon={FileText}
            title="One-Click Reports"
            body="Export board-ready PDFs and slide decks. Quarterly marketing review in thirty seconds."
            badge="Coming soon"
          >
            <ReportsMiniViz />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

/* ── Bento card primitive ───────────────────────────────────────────────── */

function BentoCard({
  icon: Icon,
  title,
  body,
  children,
  className = "",
  badge,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
  badge?: string;
}) {
  return (
    <div
      className={`group relative rounded-[20px] p-7 bg-surface-lowest flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 ${className}`}
      style={{
        border: "1px solid var(--outline)",
        boxShadow: "var(--shadow-float)",
      }}
    >
      {badge && (
        <span
          className="absolute top-5 right-5 text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider"
          style={{
            background: "var(--surface-variant)",
            color: "var(--on-surface-variant)",
            border: "1px solid var(--outline)",
          }}
        >
          {badge}
        </span>
      )}

      <div
        className="inline-flex items-center justify-center size-10 rounded-xl mb-5"
        style={{ background: "var(--accent-primary-light)" }}
      >
        <Icon size={18} className="text-primary" strokeWidth={1.75} />
      </div>

      <h3
        className="text-title-lg text-on-surface mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="text-body-sm text-on-surface-variant leading-relaxed mb-5">
        {body}
      </p>

      {children && <div className="mt-auto">{children}</div>}
    </div>
  );
}

/* ── Mini visualizations ────────────────────────────────────────────────── */

function AttributionMiniViz() {
  const items = [
    { w: "92%", color: "var(--grade-elite)" },
    { w: "74%", color: "var(--grade-optimal)" },
    { w: "58%", color: "var(--grade-scaling)" },
    { w: "41%", color: "var(--grade-scaling)" },
    { w: "28%", color: "var(--grade-poor)" },
  ];
  return (
    <div className="space-y-2.5">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-1.5 w-14 rounded bg-surface-container shrink-0" />
          <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: it.w, background: it.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function InsightsMiniViz() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div
        className="rounded-xl p-3 space-y-2"
        style={{
          background: "var(--surface-variant)",
          border: "1px solid var(--outline)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-primary-gradient" />
          <div className="h-1.5 w-12 rounded bg-on-surface" />
        </div>
        <div className="h-1 w-full rounded bg-surface-container" />
        <div className="h-1 w-4/5 rounded bg-surface-container" />
        <div className="h-1 w-2/3 rounded bg-surface-container" />
      </div>
      <div
        className="rounded-xl p-3 space-y-2 bg-surface-lowest"
        style={{ border: "1px solid var(--outline)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ background: "var(--grade-elite)" }}
          />
          <div className="h-1.5 w-14 rounded bg-on-surface" />
        </div>
        <div className="h-1 w-full rounded bg-surface-container" />
        <div className="h-1 w-3/4 rounded bg-surface-container" />
        <div className="h-1 w-5/6 rounded bg-surface-container" />
      </div>
    </div>
  );
}

function BudgetMiniViz() {
  const rows = [
    { before: 40, after: 60, color: "var(--primary)" },
    { before: 35, after: 22, color: "var(--grade-scaling)" },
    { before: 25, after: 30, color: "var(--grade-elite)" },
  ];
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={i} className="relative h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full opacity-30"
            style={{ width: `${r.before}%`, background: r.color }}
          />
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${r.after}%`, background: r.color }}
          />
        </div>
      ))}
    </div>
  );
}

function ReportsMiniViz() {
  return (
    <div
      className="rounded-xl p-3 space-y-1.5 bg-surface-lowest"
      style={{ border: "1px solid var(--outline)" }}
    >
      <div className="h-1.5 w-24 rounded bg-on-surface" />
      <div className="h-1 w-full rounded bg-surface-container" />
      <div className="h-1 w-5/6 rounded bg-surface-container" />
      <div className="h-1 w-2/3 rounded bg-surface-container" />
      <div className="flex gap-1.5 pt-1">
        <div className="h-4 flex-1 rounded bg-primary-gradient opacity-90" />
        <div className="h-4 w-6 rounded bg-surface-container" />
      </div>
    </div>
  );
}
