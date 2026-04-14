"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ContributionTimePoint } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/demo-data";

interface ContributionAreaChartProps {
  data: ContributionTimePoint[];
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px] space-y-1"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <p className="text-label-md text-on-surface-variant font-medium">{label}</p>
      {payload.reverse().map((p) => (
        <p key={p.name} className="flex items-center gap-2 font-mono font-tabular text-xs">
          <span className="size-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="w-[80px] text-on-surface">{p.name}</span>
          <span style={{ color: p.color }}>{formatCurrency(p.value)}</span>
        </p>
      ))}
      <p className="flex items-center gap-2 font-mono font-tabular text-xs pt-1 border-t border-surface-container">
        <span className="size-2 rounded-full inline-block bg-on-surface" />
        <span className="w-[80px] text-on-surface font-semibold">Total</span>
        <span className="text-on-surface font-semibold">{formatCurrency(total)}</span>
      </p>
    </div>
  );
};

export function ContributionAreaChart({ data }: ContributionAreaChartProps) {
  // Extract channel names from data (exclude 'period' and 'baseline')
  const channelNames = data.length > 0
    ? Object.keys(data[0]).filter((k) => k !== "period" && k !== "baseline")
    : [];

  // Stack order: baseline at bottom, then channels
  const stackKeys = ["baseline", ...channelNames];
  const colors = [CHART_COLORS.baseline, ...CHART_COLORS.channels];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid vertical={false} stroke="var(--surface-container)" />
        <XAxis
          dataKey="period"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-body)" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrency(v, true)}
          tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-body)" }}
          width={56}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--outline-variant)", strokeDasharray: "4 2" }} />
        {stackKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="1"
            stroke={colors[i % colors.length]}
            fill={colors[i % colors.length]}
            fillOpacity={key === "baseline" ? 0.15 : 0.6}
            strokeWidth={1}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
