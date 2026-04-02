"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import type { WaterfallItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface WaterfallChartProps {
  data: WaterfallItem[];
}

const TYPE_COLORS: Record<string, string> = {
  baseline: "#9CA3AF",
  positive: "#D97706",
  negative: "#DC2626",
  total:    "#855300",
};

// Build cumulative offsets for a true waterfall
function buildWaterfallData(items: WaterfallItem[]) {
  let running = 0;
  return items.map((item) => {
    if (item.type === "baseline") {
      running = item.value;
      return { ...item, bottom: 0, bar: item.value };
    }
    if (item.type === "total") {
      return { ...item, bottom: 0, bar: item.value };
    }
    const bottom = item.value >= 0 ? running : running + item.value;
    const bar = Math.abs(item.value);
    running += item.value;
    return { ...item, bottom, bar };
  });
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: WaterfallItem }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as WaterfallItem & { bar: number };
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px]"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <p className="font-semibold text-on-surface">{d.label}</p>
      <p
        className="font-mono font-tabular mt-1"
        style={{ color: TYPE_COLORS[d.type] }}
      >
        {d.value >= 0 ? "+" : ""}{formatCurrency(d.value)}
      </p>
    </div>
  );
};

export function WaterfallChart({ data }: WaterfallChartProps) {
  const chartData = buildWaterfallData(data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barCategoryGap="25%">
        <CartesianGrid vertical={false} stroke="var(--surface-container)" strokeDasharray="0" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-body)" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrency(v, true)}
          tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-body)" }}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <ReferenceLine y={0} stroke="var(--outline-variant)" />
        {/* Invisible spacer bar for offset */}
        <Bar dataKey="bottom" stackId="wf" fill="transparent" />
        {/* The visible bar */}
        <Bar dataKey="bar" stackId="wf" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={TYPE_COLORS[entry.type]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
