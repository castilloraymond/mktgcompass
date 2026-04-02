import { SaturationCurve } from "@/components/charts/SaturationCurve";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { EfficiencyMatrix } from "@/components/charts/EfficiencyMatrix";
import { DEMO_DATA } from "@/lib/demo-data";

export default function AttributionPage() {
  const { saturation_curves, waterfall, efficiency_matrix } = DEMO_DATA;

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
          Deep-dive into how each channel drives revenue
        </p>
      </div>

      {/* Saturation Curves */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "60ms" } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2
            className="text-title-lg font-semibold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Saturation Curves
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            Diminishing returns per channel — where each additional dollar is less efficient
          </p>
        </div>
        <SaturationCurve channels={saturation_curves} />
      </div>

      {/* Revenue Bridge */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "120ms" } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2
            className="text-title-lg font-semibold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Revenue Contribution Bridge
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            Baseline revenue + each channel's incremental contribution
          </p>
        </div>
        <WaterfallChart data={waterfall} />
      </div>

      {/* Efficiency Matrix */}
      <div
        className="bg-surface-lowest rounded-card p-6 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "180ms" } as React.CSSProperties}
      >
        <div className="mb-5">
          <h2
            className="text-title-lg font-semibold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Channel Efficiency Matrix
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            Ranked by ROAS — which channels are earning their budget
          </p>
        </div>
        <EfficiencyMatrix channels={efficiency_matrix} />
      </div>
    </div>
  );
}
