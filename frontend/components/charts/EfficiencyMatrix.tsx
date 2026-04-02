import type { ChannelEfficiency } from "@/lib/types";
import { formatCurrency, formatMultiple, cn } from "@/lib/utils";
import {
  Target, Search, Youtube, Mail, Monitor, Music,
} from "lucide-react";

const GRADE_STYLES: Record<string, { bg: string; text: string }> = {
  "A+": { bg: "bg-grade-elite/10",   text: "text-grade-elite"   },
  "A":  { bg: "bg-grade-elite/10",   text: "text-grade-elite"   },
  "B":  { bg: "bg-grade-optimal/10", text: "text-grade-optimal" },
  "C":  { bg: "bg-grade-scaling/10", text: "text-grade-scaling" },
  "D":  { bg: "bg-error/10",         text: "text-error"         },
};

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  "Meta Ads":      Target,
  "Google Search": Search,
  "YouTube":       Youtube,
  "Email":         Mail,
  "Display":       Monitor,
  "TikTok":        Music,
};

interface EfficiencyMatrixProps {
  channels: ChannelEfficiency[];
}

export function EfficiencyMatrix({ channels }: EfficiencyMatrixProps) {
  const maxRoas = Math.max(...channels.map((c) => c.roas));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {["Channel", "Spend", "CPA", "ROAS", "Grade"].map((h) => (
              <th
                key={h}
                className="text-label-md font-medium text-on-surface-variant text-left pb-3 pr-6 last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {channels.map((ch) => {
            const Icon = CHANNEL_ICONS[ch.channel] ?? Target;
            const grade = GRADE_STYLES[ch.grade] ?? GRADE_STYLES["C"];
            return (
              <tr key={ch.channel} className="hover:bg-surface-low transition-colors group">
                {/* Channel */}
                <td className="py-3 pr-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-[8px] bg-surface-container group-hover:bg-surface-high transition-colors">
                      <Icon size={16} className="text-on-surface-variant" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{ch.channel}</p>
                      <p className="text-xs text-on-surface-variant">{ch.channel_type}</p>
                    </div>
                  </div>
                </td>

                {/* Spend */}
                <td className="py-3 pr-6">
                  <span className="text-sm font-mono font-tabular text-on-surface">
                    {formatCurrency(ch.spend)}
                  </span>
                </td>

                {/* CPA */}
                <td className="py-3 pr-6">
                  <span className="text-sm font-mono font-tabular text-on-surface">
                    {formatCurrency(ch.cpa)}
                  </span>
                </td>

                {/* ROAS — with mini bar */}
                <td className="py-3 pr-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-tabular font-semibold text-on-surface min-w-[3rem]">
                      {formatMultiple(ch.roas)}
                    </span>
                    <div className="flex-1 min-w-[80px] h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-slow"
                        style={{ width: `${(ch.roas / maxRoas) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Grade */}
                <td className="py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-badge text-xs font-semibold",
                      grade.bg, grade.text
                    )}
                  >
                    {ch.grade} {ch.grade_label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
