import { HillCurve } from "@/components/charts/HillCurve";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { EfficiencyMatrix } from "@/components/charts/EfficiencyMatrix";
import { ROIBarChart } from "@/components/charts/ROIBarChart";
import { ContributionAreaChart } from "@/components/charts/ContributionAreaChart";
import { DEMO_DATA } from "@/lib/demo-data";

export default function AttributionPage() {
  const { hill_curves, waterfall, efficiency_matrix, contributions_over_time } = DEMO_DATA;

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="animate-fade-up">
        <h1
          className="text-headline-md font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Attribution Explorer
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Deep-dive into how each channel drives incremental revenue
        </p>
      </div>

      {/* ROI Bar Chart + Efficiency Matrix — side by side */}
      <div className="grid grid-cols-2 gap-6">
        <div
          className="bg-surface-lowest rounded-card p-6 animate-fade-up"
          style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "60ms" } as React.CSSProperties}
        >
          <div className="mb-5">
            <h2
              className="text-title-lg font-semibold text-on-surface"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Incremental ROI by Channel
            </h2>
            <p className="text-label-md text-on-surface-variant mt-1">
              Posterior mean ROI with 90% credible interval whiskers
            </p>
          </div>
          <ROIBarChart channels={efficiency_matrix} />
        </div>

        <div
          className="bg-surface-lowest rounded-card p-6 animate-fade-up"
          style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "90ms" } as React.CSSProperties}
        >
          <div className="mb-5">
            <h2
              className="text-title-lg font-semibold text-on-surface"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contribution Over Time
            </h2>
            <p className="text-label-md text-on-surface-variant mt-1">
              How each channel's incremental contribution evolves quarterly
            </p>
          </div>
          <ContributionAreaChart data={contributions_over_time} />
        </div>
      </div>

      {/* Hill Curves (Response Curves) */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "120ms" } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2
            className="text-title-lg font-semibold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Response Curves (Hill Function)
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            How each channel's incremental outcome responds to spend — the ec parameter marks the half-saturation point where diminishing returns steepen
          </p>
        </div>
        <HillCurve channels={hill_curves} />
      </div>

      {/* Revenue Decomposition */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "180ms" } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2
            className="text-title-lg font-semibold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Revenue Decomposition
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            Model intercept, time effects, control variables, and each channel's incremental contribution
          </p>
        </div>
        <WaterfallChart data={waterfall} />
      </div>

      {/* Channel Efficiency Matrix */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "240ms" } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2
            className="text-title-lg font-semibold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Channel Efficiency Matrix
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            Ranked by incremental ROI — which channels generate the most return per dollar of spend
          </p>
        </div>
        <EfficiencyMatrix channels={efficiency_matrix} />
      </div>
    </div>
  );
}
