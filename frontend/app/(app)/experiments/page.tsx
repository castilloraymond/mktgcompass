import { FlaskConical, Lock } from "lucide-react";
import Link from "next/link";

export default function ExperimentsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-[480px] mx-auto">
      <div className="flex items-center justify-center size-20 rounded-[24px] bg-surface-container">
        <FlaskConical size={36} className="text-on-surface-variant" strokeWidth={1.25} />
      </div>

      <div>
        <h1
          className="text-headline-md font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AutoResearch
        </h1>
        <p className="text-body-md text-on-surface-variant mt-3 max-w-[360px]">
          AI-powered experiment design for A/B tests, geo-holdouts, and
          incrementality studies. Coming in v2 — designed to feed results back
          into the MMM as calibration priors.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container px-4 py-2 rounded-badge">
        <Lock size={12} />
        Coming Soon
      </div>

      <Link
        href="/dashboard"
        className="text-sm font-medium text-primary hover:opacity-70 transition-opacity"
      >
        ← Back to Overview
      </Link>
    </div>
  );
}
