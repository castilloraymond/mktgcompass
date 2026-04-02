import { KPICard } from "@/components/cards/KPICard";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { EfficiencyMatrix } from "@/components/charts/EfficiencyMatrix";
import { InsightCard } from "@/components/cards/InsightCard";
import { DEMO_DATA } from "@/lib/demo-data";
import { formatCurrency, formatPercent, formatMultiple } from "@/lib/utils";
import { Calendar, Cpu } from "lucide-react";

export default function OverviewPage() {
  const { overview, waterfall, efficiency_matrix, insights } = DEMO_DATA;

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <h1
            className="text-headline-md font-bold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Campaign Overview
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {DEMO_DATA.data_period} · Last model run: {DEMO_DATA.model_run_date}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-lowest px-3 py-2 rounded-[10px] border-ghost">
            <Calendar size={14} />
            {DEMO_DATA.data_period}
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-grade-elite bg-grade-elite/10 px-3 py-2 rounded-[10px]">
            <Cpu size={14} />
            Model ready
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(overview.total_revenue, true)}
          delta={formatPercent(overview.total_revenue_delta)}
          deltaType="positive"
          subtitle="vs. prior period"
          staggerIndex={0}
        />
        <KPICard
          label="Blended ROAS"
          value={formatMultiple(overview.blended_roas)}
          delta={`${overview.blended_roas_vs_target > 0 ? "+" : ""}${overview.blended_roas_vs_target.toFixed(2)}x vs target`}
          deltaType="positive"
          subtitle="revenue per $ spent"
          staggerIndex={1}
        />
        <KPICard
          label="Weighted CPA"
          value={formatCurrency(overview.weighted_cpa)}
          delta={formatPercent(overview.weighted_cpa_delta)}
          deltaType="positive"
          subtitle="cost per acquisition"
          staggerIndex={2}
        />
        <KPICard
          label="Incrementality Lift"
          value={`${overview.incrementality_lift}%`}
          delta={`${overview.incrementality_confidence} confidence`}
          deltaType="positive"
          subtitle="revenue above baseline"
          staggerIndex={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Waterfall — takes 2 cols */}
        <div
          className="col-span-2 bg-surface-lowest rounded-card p-6 animate-fade-up"
          style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "240ms" } as React.CSSProperties}
        >
          <div className="mb-4">
            <h2 className="text-title-lg font-semibold text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
              Revenue Contribution Bridge
            </h2>
            <p className="text-label-md text-on-surface-variant mt-1">
              How each channel contributed to total revenue
            </p>
          </div>
          <WaterfallChart data={waterfall} />
        </div>

        {/* Top insight */}
        <div className="space-y-4 animate-fade-up" style={{ "--stagger-delay": "300ms" } as React.CSSProperties}>
          <h2 className="text-title-lg font-semibold text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
            Top Insights
          </h2>
          {insights.slice(0, 2).map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} staggerIndex={i} />
          ))}
        </div>
      </div>

      {/* Efficiency Matrix */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "360ms" } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2 className="text-title-lg font-semibold text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
            Channel Efficiency Matrix
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            ROAS, CPA, and efficiency grades across all channels
          </p>
        </div>
        <EfficiencyMatrix channels={efficiency_matrix} />
      </div>
    </div>
  );
}
