import { DEMO_DATA } from "@/lib/demo-data";
import { BudgetAllocator } from "@/components/charts/BudgetAllocator";
import { KPICard } from "@/components/cards/KPICard";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/utils";

export default function PerformancePage() {
  const { overview, budget_optimization } = DEMO_DATA;

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="animate-fade-up">
        <h1
          className="text-headline-md font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Performance & Budget Lab
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Model what-if scenarios and optimize your budget allocation
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total Revenue"       value={formatCurrency(overview.total_revenue, true)}   delta={formatPercent(overview.total_revenue_delta)} deltaType="positive" staggerIndex={0} />
        <KPICard label="Blended ROAS"        value={formatMultiple(overview.blended_roas)}           delta="vs 3.50 target"                              deltaType="positive" staggerIndex={1} />
        <KPICard label="Weighted CPA"        value={formatCurrency(overview.weighted_cpa)}           delta={formatPercent(overview.weighted_cpa_delta)}  deltaType="positive" staggerIndex={2} />
        <KPICard label="Incrementality Lift" value={`${overview.incrementality_lift}%`}             delta="high confidence"                             deltaType="positive" staggerIndex={3} />
      </div>

      {/* Budget Lab */}
      <div className="grid grid-cols-3 gap-6">
        <div
          className="col-span-2 bg-surface-lowest rounded-card p-6 animate-fade-up"
          style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "240ms" } as React.CSSProperties}
        >
          <div className="mb-5">
            <h2 className="text-title-lg font-semibold text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
              Budget Reallocation Lab
            </h2>
            <p className="text-label-md text-on-surface-variant mt-1">
              Drag sliders to simulate reallocation. Projected impact updates in real time.
            </p>
          </div>
          <BudgetAllocator data={budget_optimization} />
        </div>

        {/* Info panel */}
        <div className="space-y-4 animate-fade-up" style={{ "--stagger-delay": "300ms" } as React.CSSProperties}>
          <div className="bg-surface-lowest rounded-card p-5" style={{ boxShadow: "var(--shadow-float)" }}>
            <h3 className="text-sm font-semibold text-on-surface mb-3">How This Works</h3>
            <ul className="space-y-3 text-sm text-on-surface-variant">
              {[
                "The MMM model learned each channel's saturation curve from your historical data.",
                "The budget optimizer finds the allocation that maximizes projected revenue given your total budget.",
                "Confidence interval shows model uncertainty — wider = less data for that channel.",
                "Results assume your marketing mix and market conditions stay similar.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 size-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-lowest rounded-card p-5" style={{ boxShadow: "var(--shadow-float)" }}>
            <h3 className="text-sm font-semibold text-on-surface mb-2">Projected Lift</h3>
            <div
              className="text-3xl font-bold text-grade-elite font-tabular"
              style={{ fontFamily: "var(--font-display)" }}
            >
              +{budget_optimization.projected_lift_pct}%
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              {budget_optimization.confidence_interval} confidence
            </p>
            <p className="text-xs text-on-surface-variant mt-3">
              Equivalent to approximately{" "}
              <strong className="text-on-surface">
                {formatCurrency(overview.total_revenue * budget_optimization.projected_lift_pct / 100, true)}
              </strong>{" "}
              in additional revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
