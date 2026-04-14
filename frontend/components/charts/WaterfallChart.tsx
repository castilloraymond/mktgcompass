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

// Colors for Meridian decomposition components
const TYPE_COLORS: Record<string, string> = {
  intercept:     "#6B7280",  // gray — baseline intercept
  time_effects:  "#8B5CF6",  // purple — temporal patterns
  controls:      "#06B6D4",  // cyan — control variables
  channel:       "#2563EB",  // blue — media channels
  total:         "#3B82F6",  // blue — total
};

// Build cumulative offsets for a true waterfall
function buildWaterfallData(items: WaterfallItem[]) {
  let running = 0;
  return items.map((item) => {
    if (item.type === "intercept") {
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
  const typeLabels: Record<string, string> = {
    intercept: "Model intercept (baseline demand)",
    time_effects: "Seasonal & temporal patterns",
    controls: "Control variables (holidays, pricing, etc.)",
    channel: "Incremental media contribution",
    total: "Total predicted outcome",
  };
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px]"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <p className="font-semibold text-on-surface">{d.label}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{typeLabels[d.type]}</p>
      <p
        className="font-mono font-tabular mt-1"
        style={{ color: TYPE_COLORS[d.type] }}
      >
        {d.type !== "intercept" && d.type !== "total" ? (d.value >= 0 ? "+" : "") : ""}{formatCurrency(d.value)}
      </p>
    </div>
  );
};

export function WaterfallChart({ data }: WaterfallChartProps) {
  const chartData = buildWaterfallData(data);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} barCategoryGap="25%" margin={{ bottom: 10 }}>
        <CartesianGrid vertical={false} stroke="var(--surface-container)" strokeDasharray="0" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          interval={0}
          height={60}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tick={{ fill: "var(--on-surface-variant)", fontSize: 11, fontFamily: "var(--font-body)", angle: -40, textAnchor: "end", dy: 4 } as any}
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
