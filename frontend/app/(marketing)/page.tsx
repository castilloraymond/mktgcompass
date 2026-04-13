import { Hero } from "@/components/marketing/Hero";
import { ValueProps } from "@/components/marketing/ValueProps";
import {
  FeatureShowcase,
  AttributionVisual,
  InsightsVisual,
  BudgetVisual,
} from "@/components/marketing/FeatureShowcase";
import { BentoGrid } from "@/components/marketing/BentoGrid";

export default function MarketingHomePage() {
  return (
    <>
      <Hero />

      <ValueProps />

      <section id="how-it-works">
        <FeatureShowcase
          eyebrow="Automated attribution"
          title="See what's actually pulling its weight"
          body="MktgCompass runs Google Meridian — the same Bayesian MMM engine used by enterprise teams — and surfaces a plain-English efficiency grade for every channel. No more guessing whether Meta is earning its keep."
          bullets={[
            "Causal contribution, not last-click fiction",
            "Saturation curves show where extra spend stops working",
            "Letter grades you can explain in a stand-up",
          ]}
          visual={<AttributionVisual />}
          background="default"
        />

        <FeatureShowcase
          eyebrow="AI-powered insights"
          title="Numbers that explain themselves"
          body="Every metric comes with a plain-English 'why' written by Claude. No statistical jargon, no Rosetta Stone needed — just clear recommendations you can take straight to your CMO."
          bullets={[
            "Written explanations for every channel result",
            "Proactive alerts when a channel goes off-track",
            "Ask follow-up questions in natural language",
          ]}
          visual={<InsightsVisual />}
          reverse
          background="surface"
        />

        <FeatureShowcase
          eyebrow="Budget optimization"
          title="A smarter plan for next quarter"
          body="Get a reallocation recommendation that maximizes revenue across your current mix — with diminishing returns built in, so you don't blow past the point where extra dollars stop working."
          bullets={[
            "One-click reallocation suggestions with projected ROAS lift",
            "Respects channel-level minimums and constraints",
            "Show before/after scenarios to stakeholders",
          ]}
          visual={<BudgetVisual />}
          background="default"
        />
      </section>

      <BentoGrid />
    </>
  );
}
