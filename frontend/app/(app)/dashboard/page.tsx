import { KPICard } from "@/components/cards/KPICard";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { EfficiencyMatrix } from "@/components/charts/EfficiencyMatrix";
import { InsightCard } from "@/components/cards/InsightCard";
import { DEMO_DATA } from "@/lib/demo-data";
import { formatCurrency, formatPercent, formatMultiple } from "@/lib/utils";
import { Cpu, Sparkles } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function OverviewPage() {
  const { overview, waterfall, efficiency_matrix, insights } = DEMO_DATA;
  const greeting = getGreeting();

  return (
    <div className="space-y-8 max-w-[1200px]">

      {/* Greeting */}
      <div className="animate-fade-up flex items-start justify-between">
        <div>
          <h1
            className="text-headline-md text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {greeting}, Raymond.
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Here's how your campaigns are performing — {DEMO_DATA.data_period}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-[8px]"
          style={{
            background: "var(--surface-container)",
            color: "var(--on-surface-variant)",
            border: "1px solid var(--outline)",
          }}
        >
          <Cpu size={13} strokeWidth={1.75} />
          Model ready · {DEMO_DATA.model_run_date}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-5">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(overview.total_revenue, true)}
          delta={formatPercent(overview.total_revenue_delta)}
          deltaType="positive"
          subtitle="vs. prior period"
          staggerIndex={0}
          tooltip="Your total sales revenue this period, including both ad-driven and organic purchases."
          tooltipLink="/performance"
        />
        <KPICard
          label="Incremental ROI"
          value={formatMultiple(overview.incremental_roi)}
          delta={`90% CI: [${formatMultiple(overview.incremental_roi_ci[0])}, ${formatMultiple(overview.incremental_roi_ci[1])}]`}
          deltaType="positive"
          subtitle="incremental return per $1 spent"
          staggerIndex={1}
          tooltip="For every $1 you spent on advertising, this is how much incremental revenue the model attributes to your ads — revenue that wouldn't have happened without them."
          tooltipTechnicalName="Incremental ROI (Meridian)"
          tooltipLink="/attribution"
        />
        <KPICard
          label="Model Fit"
          value={`R² ${overview.model_r_squared.toFixed(2)}`}
          delta="MAPE 2.1%"
          deltaType="positive"
          subtitle="how well the model explains your data"
          staggerIndex={2}
          tooltip="R-squared measures how much of the variation in your revenue the model explains. 0.94 means 94% — an excellent fit. MAPE is the average prediction error."
          tooltipTechnicalName="R² / MAPE"
          tooltipLink="/model-health"
        />
        <KPICard
          label="Incremental Revenue"
          value={formatCurrency(overview.incremental_revenue, true)}
          delta={`90% CI: [${formatCurrency(overview.incremental_revenue_ci[0], true)}, ${formatCurrency(overview.incremental_revenue_ci[1], true)}]`}
          deltaType="positive"
          subtitle="revenue your ads created"
          staggerIndex={3}
          tooltip="Of your total revenue, this amount came specifically because of your ads — the model separates ad-driven revenue from what would have happened organically."
          tooltipTechnicalName="Incremental Outcome (Meridian)"
          tooltipLink="/attribution"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Waterfall — 2 cols */}
        <div
          className="col-span-2 bg-surface-lowest rounded-card p-6 animate-fade-up"
          style={{
            border: "1px solid var(--outline)",
            boxShadow: "var(--shadow-float)",
            "--stagger-delay": "220ms",
          } as React.CSSProperties}
        >
          <div className="mb-5">
            <h2 className="text-title-lg text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
              Revenue Decomposition
            </h2>
            <p className="text-[0.875rem] text-on-surface-variant mt-1">
              Intercept, time effects, controls, and each channel's incremental contribution
            </p>
          </div>
          <WaterfallChart data={waterfall} />
        </div>

        {/* AI Insights — 1 col */}
        <div className="space-y-4 animate-fade-up" style={{ "--stagger-delay": "280ms" } as React.CSSProperties}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} strokeWidth={1.75} style={{ color: "var(--accent-primary)" }} />
            <h2 className="text-title-lg text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
              AI Insights
            </h2>
          </div>
          {insights.slice(0, 2).map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} staggerIndex={i} />
          ))}
        </div>
      </div>

      {/* Channel Performance */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{
          border: "1px solid var(--outline)",
          boxShadow: "var(--shadow-float)",
          "--stagger-delay": "340ms",
        } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2 className="text-title-lg text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
            Channel Performance
          </h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Incremental ROI, cost per incremental outcome, and efficiency grades across all channels
          </p>
        </div>
        <EfficiencyMatrix channels={efficiency_matrix} />
      </div>

    </div>
  );
}
