import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft hero gradient backdrop — marketing-only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56, 189, 248, 0.35), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-8 pt-20 pb-16 lg:pt-28 lg:pb-24 text-center">
        {/* Pill badge */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8 animate-fade-up"
          style={{
            background: "var(--surface-variant)",
            border: "1px solid var(--outline)",
          }}
        >
          <Sparkles size={13} className="text-primary" strokeWidth={1.75} />
          <span className="text-[0.75rem] font-semibold tracking-wide text-primary">
            AI-Powered Marketing Mix Modeling
          </span>
        </div>

        {/* Display heading */}
        <h1
          className="text-display-lg text-on-surface animate-fade-up max-w-[900px] mx-auto"
          style={{
            fontFamily: "var(--font-display)",
            "--stagger-delay": "80ms",
          } as React.CSSProperties}
        >
          Measure what actually <br className="hidden sm:block" />
          drives <span className="text-primary">growth.</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-body-md text-on-surface-variant mt-6 max-w-[620px] mx-auto leading-relaxed animate-fade-up"
          style={{ fontSize: "1.0625rem", "--stagger-delay": "160ms" } as React.CSSProperties}
        >
          MktgCompass turns your spend data into plain-English channel ROI,
          saturation curves, and budget recommendations. Free, open, and built
          for marketers who don't have a data science team.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex items-center justify-center gap-3 animate-fade-up"
          style={{ "--stagger-delay": "240ms" } as React.CSSProperties}
        >
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-[12px] text-[0.9375rem] font-semibold text-white bg-primary-gradient btn-primary-lift"
            style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}
          >
            Start free
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-[12px] text-[0.9375rem] font-medium text-on-surface bg-surface-lowest hover:bg-surface-low transition-colors"
            style={{ border: "1px solid var(--outline)" }}
          >
            See live demo
          </Link>
        </div>

        {/* Floating dashboard preview */}
        <div
          className="mt-16 lg:mt-20 animate-fade-up"
          style={{ "--stagger-delay": "320ms" } as React.CSSProperties}
        >
          <div
            className="relative mx-auto max-w-[1080px] rounded-[20px] overflow-hidden"
            style={{
              boxShadow: "var(--shadow-overlay)",
              border: "1px solid var(--outline)",
            }}
          >
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Stylized inline dashboard preview — avoids a binary screenshot dependency. */
function DashboardPreview() {
  return (
    <div className="bg-surface-lowest">
      {/* Fake browser chrome */}
      <div
        className="flex items-center gap-1.5 px-4 h-9 bg-surface"
        style={{ borderBottom: "1px solid var(--outline)" }}
      >
        <div className="size-2.5 rounded-full bg-surface-container" />
        <div className="size-2.5 rounded-full bg-surface-container" />
        <div className="size-2.5 rounded-full bg-surface-container" />
        <div
          className="ml-4 flex-1 h-5 rounded-md text-[10px] text-on-surface-variant flex items-center px-2"
          style={{ background: "var(--surface-lowest)", border: "1px solid var(--outline)" }}
        >
          mktgcompass.com/dashboard
        </div>
      </div>

      {/* Dashboard body */}
      <div className="flex">
        {/* Mini sidebar */}
        <div
          className="w-[180px] p-4 bg-surface hidden sm:block"
          style={{ borderRight: "1px solid var(--outline)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="size-6 rounded-md bg-primary-gradient" />
            <div className="h-2.5 w-20 rounded bg-surface-container" />
          </div>
          <div className="h-8 rounded-lg bg-primary-gradient mb-3 opacity-90" />
          <div className="space-y-1.5">
            {[true, false, false, false].map((active, i) => (
              <div
                key={i}
                className="h-6 rounded-md flex items-center px-2 gap-2"
                style={{ background: active ? "var(--accent-primary-light)" : "transparent" }}
              >
                <div
                  className="size-2 rounded-sm"
                  style={{ background: active ? "var(--accent-primary)" : "var(--surface-container)" }}
                />
                <div
                  className="h-1.5 rounded flex-1"
                  style={{ background: active ? "var(--accent-primary)" : "var(--surface-container)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 space-y-4">
          {/* Greeting */}
          <div className="space-y-2">
            <div className="h-3.5 w-48 rounded bg-surface-container" />
            <div className="h-2 w-32 rounded bg-surface-low" />
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 rounded-[10px] bg-surface-lowest"
                style={{ border: "1px solid var(--outline)" }}
              >
                <div className="h-1.5 w-12 rounded bg-surface-container mb-2" />
                <div className="h-4 w-16 rounded bg-on-surface/80 mb-1.5" style={{ background: "var(--on-surface)" }} />
                <div className="h-1.5 w-10 rounded" style={{ background: i % 2 === 0 ? "var(--success)" : "var(--error)" }} />
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="col-span-2 p-4 rounded-[10px] bg-surface-lowest h-[140px]"
              style={{ border: "1px solid var(--outline)" }}
            >
              <div className="h-2 w-28 rounded bg-surface-container mb-3" />
              {/* Fake bars */}
              <div className="flex items-end gap-2 h-[90px]">
                {[40, 70, 55, 85, 45, 95, 60, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: i === 5 ? "var(--accent-primary)" : i % 3 === 0 ? "var(--grade-scaling)" : "var(--surface-container)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div
              className="p-4 rounded-[10px] space-y-2"
              style={{ background: "var(--surface-variant)", border: "1px solid var(--outline)" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-primary-gradient" />
                <div className="h-1.5 w-14 rounded bg-on-surface/80" style={{ background: "var(--on-surface)" }} />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded bg-surface-container" />
                <div className="h-1.5 w-5/6 rounded bg-surface-container" />
                <div className="h-1.5 w-2/3 rounded bg-surface-container" />
              </div>
              <div className="h-1.5 w-20 rounded bg-primary mt-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
