import { InsightCard } from "@/components/cards/InsightCard";
import { DEMO_DATA } from "@/lib/demo-data";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

export default function InsightsPage() {
  const { insights } = DEMO_DATA;

  const high   = insights.filter((i) => i.priority === "high");
  const medium = insights.filter((i) => i.priority === "medium");
  const low    = insights.filter((i) => i.priority === "low");

  return (
    <div className="space-y-8 max-w-[900px]">
      <div className="animate-fade-up">
        <h1
          className="text-headline-md font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AI Insights
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Personalized recommendations generated from your MMM results
        </p>
      </div>

      {/* Summary banner */}
      <div
        className="flex items-center gap-4 bg-surface-warning rounded-card p-5 animate-fade-up"
        style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "60ms" } as React.CSSProperties}
      >
        <div className="flex items-center justify-center size-12 rounded-[14px] bg-primary/10">
          <Sparkles size={22} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">
            {insights.length} insights generated from your model
          </p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Acting on all high-priority recommendations could improve blended ROAS by up to{" "}
            <strong className="text-grade-elite">+18%</strong>
          </p>
        </div>
      </div>

      {high.length > 0 && (
        <section className="space-y-4 animate-fade-up" style={{ "--stagger-delay": "120ms" } as React.CSSProperties}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-error" />
            <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wider">
              High Priority
            </h2>
          </div>
          {high.map((ins, i) => <InsightCard key={ins.id} insight={ins} staggerIndex={i} />)}
        </section>
      )}

      {medium.length > 0 && (
        <section className="space-y-4 animate-fade-up" style={{ "--stagger-delay": "200ms" } as React.CSSProperties}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-info" />
            <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wider">
              Growth Opportunities
            </h2>
          </div>
          {medium.map((ins, i) => <InsightCard key={ins.id} insight={ins} staggerIndex={i} />)}
        </section>
      )}

      {low.length > 0 && (
        <section className="space-y-4 animate-fade-up" style={{ "--stagger-delay": "280ms" } as React.CSSProperties}>
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
            Additional Notes
          </h2>
          {low.map((ins, i) => <InsightCard key={ins.id} insight={ins} staggerIndex={i} />)}
        </section>
      )}
    </div>
  );
}
