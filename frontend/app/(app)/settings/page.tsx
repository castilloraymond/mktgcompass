import { Settings, Database, Key, Cpu, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-[680px]">
      <div className="animate-fade-up">
        <h1
          className="text-headline-md font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Configure your data sources and model preferences
        </p>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-3 bg-surface-warning rounded-card p-4 animate-fade-up" style={{ "--stagger-delay": "60ms" } as React.CSSProperties}>
        <AlertTriangle size={16} className="text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-on-surface-variant">
          <strong className="text-on-surface">Demo mode:</strong> Settings are not persisted. Authentication and data source integrations will be available in the full release.
        </p>
      </div>

      {[
        {
          icon: Database,
          title: "Data Sources",
          description: "Connect Google Ads, Meta Ads, or GA4 for automatic data import",
          badge: "Coming Soon",
        },
        {
          icon: Cpu,
          title: "Model Configuration",
          description: "Adjust adstock lags, prior distributions, and channel groupings",
          badge: "Advanced",
        },
        {
          icon: Key,
          title: "API Keys",
          description: "Manage your Anthropic API key for the AI assistant",
          badge: null,
        },
        {
          icon: Settings,
          title: "Account",
          description: "Profile, preferences, and team management",
          badge: "Coming Soon",
        },
      ].map(({ icon: Icon, title, description, badge }, i) => (
        <div
          key={title}
          className="flex items-center gap-4 bg-surface-lowest rounded-card p-5 animate-fade-up cursor-pointer hover:bg-surface-low transition-colors"
          style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": `${(i + 2) * 60}ms` } as React.CSSProperties}
        >
          <div className="flex items-center justify-center size-10 rounded-[12px] bg-surface-container">
            <Icon size={20} className="text-on-surface-variant" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-on-surface">{title}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
          </div>
          {badge && (
            <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-badge">
              {badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
