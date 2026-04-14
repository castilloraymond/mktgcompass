import { DEMO_DATA } from "@/lib/demo-data";
import { ModelFitChart } from "@/components/charts/ModelFitChart";
import { ConvergenceDiagnostics } from "@/components/charts/ConvergenceDiagnostics";
import { AdstockDecay } from "@/components/charts/AdstockDecay";
import { KPICard } from "@/components/cards/KPICard";
import { formatPercent } from "@/lib/utils";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ModelHealthPage() {
  const { model_health } = DEMO_DATA;
  const { fit_metrics, convergence_status } = model_health;

  const statusConfig = {
    converged: { icon: CheckCircle, label: "All parameters converged", color: "text-grade-elite", bg: "bg-grade-elite/10" },
    borderline: { icon: AlertTriangle, label: "Some parameters borderline", color: "text-grade-scaling", bg: "bg-grade-scaling/10" },
    not_converged: { icon: AlertTriangle, label: "Convergence issues detected", color: "text-error", bg: "bg-error/10" },
  };
  const status = statusConfig[convergence_status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="animate-fade-up">
        <h1
          className="text-headline-md font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Model Health
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Diagnostics from your Meridian MCMC run — review model fit and convergence before interpreting results
        </p>
      </div>

      {/* Status banner */}
      <div
        className={`flex items-center justify-between ${status.bg} rounded-card p-5 animate-fade-up`}
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "60ms" } as React.CSSProperties}
      >
        <div className="flex items-center gap-3">
          <StatusIcon size={20} className={status.color} />
          <div>
            <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {convergence_status === "converged"
                ? "All R-hat values are below 1.1 — the MCMC chains have converged and results are reliable."
                : "Some parameters may need more iterations. Consider re-running with n_keep=2000."}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-primary-gradient text-white text-sm font-semibold btn-primary-lift"
        >
          View Dashboard
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Fit Metrics */}
      <div className="grid grid-cols-3 gap-5">
        <KPICard
          label="R-Squared"
          value={fit_metrics.r_squared.toFixed(2)}
          subtitle="variance explained by model"
          staggerIndex={0}
          tooltip="R² measures how much of the variation in your KPI the model explains. Values above 0.85 indicate a good fit."
          tooltipTechnicalName="Coefficient of Determination"
        />
        <KPICard
          label="MAPE"
          value={`${fit_metrics.mape.toFixed(1)}%`}
          subtitle="mean absolute prediction error"
          staggerIndex={1}
          tooltip="Average percentage error between the model's predictions and actual values. Lower is better — under 5% is excellent."
          tooltipTechnicalName="Mean Absolute Percentage Error"
        />
        <KPICard
          label="WMAPE"
          value={`${fit_metrics.wmape.toFixed(1)}%`}
          subtitle="weighted prediction error"
          staggerIndex={2}
          tooltip="Like MAPE but weighted by actual values, giving more importance to larger outcomes. Under 5% is excellent."
          tooltipTechnicalName="Weighted Mean Absolute Percentage Error"
        />
      </div>

      {/* Model Fit Chart */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{
          border: "1px solid var(--outline)",
          boxShadow: "var(--shadow-float)",
          "--stagger-delay": "200ms",
        } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2 className="text-title-lg text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
            Model Fit: Expected vs Actual
          </h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Solid line is actual KPI, dashed is model prediction, shaded area is 90% credible interval
          </p>
        </div>
        <ModelFitChart data={model_health.fit_chart} />
      </div>

      {/* Convergence Diagnostics */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{
          border: "1px solid var(--outline)",
          boxShadow: "var(--shadow-float)",
          "--stagger-delay": "260ms",
        } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2 className="text-title-lg text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
            Convergence Diagnostics (R-hat)
          </h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            R-hat measures whether MCMC chains have converged — values below 1.1 indicate reliable posterior estimates
          </p>
        </div>
        <ConvergenceDiagnostics data={model_health.convergence} />
      </div>

      {/* Adstock Decay */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{
          border: "1px solid var(--outline)",
          boxShadow: "var(--shadow-float)",
          "--stagger-delay": "320ms",
        } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2 className="text-title-lg text-on-surface" style={{ fontFamily: "var(--font-display)" }}>
            Adstock Decay (Carryover Effects)
          </h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            How long each channel's effect persists after a spend event — higher carryover means longer-lasting impact
          </p>
        </div>
        <AdstockDecay channels={DEMO_DATA.adstock_decay} />
      </div>
    </div>
  );
}
