"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ErrorBar, Cell,
} from "recharts";
import type { ChannelEfficiency } from "@/lib/types";
import { formatMultiple, cn } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/demo-data";

interface ROIBarChartProps {
  channels: ChannelEfficiency[];
}

const GRADE_STYLES: Record<string, { bg: string; text: string }> = {
  "A+": { bg: "bg-grade-elite/10",   text: "text-grade-elite" },
  "A":  { bg: "bg-grade-elite/10",   text: "text-grade-elite" },
  "B":  { bg: "bg-grade-optimal/10", text: "text-grade-optimal" },
  "C":  { bg: "bg-grade-scaling/10", text: "text-grade-scaling" },
  "D":  { bg: "bg-error/10",         text: "text-error" },
};

const CustomTooltip = ({
  active, payload,
}: {
  active?: boolean;
  payload?: { payload: ChannelEfficiency }[];
}) => {
  if (!active || !payload?.length) return null;
  const ch = payload[0].payload;
  const grade = GRADE_STYLES[ch.grade] ?? GRADE_STYLES["C"];
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px] space-y-1.5"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <div className="flex items-center gap-2">
        <p className="font-semibold text-on-surface">{ch.channel}</p>
        <span className={cn("px-1.5 py-0.5 rounded-badge text-[10px] font-semibold", grade.bg, grade.text)}>
          {ch.grade}
        </span>
      </div>
      <p className="font-mono font-tabular text-primary">
        ROI: {formatMultiple(ch.roi)}
      </p>
      <p className="text-xs text-on-surface-variant font-mono">
        90% CI: [{formatMultiple(ch.roi_ci[0])}, {formatMultiple(ch.roi_ci[1])}]
      </p>
    </div>
  );
};

export function ROIBarChart({ channels }: ROIBarChartProps) {
  // Sort by ROI descending
  const sorted = [...channels].sort((a, b) => b.roi - a.roi);

  // Add error bar data
  const chartData = sorted.map((ch) => ({
    ...ch,
    errorLower: ch.roi - ch.roi_ci[0],
    errorUpper: ch.roi_ci[1] - ch.roi,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, sorted.length * 52)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
        <CartesianGrid horizontal={false} stroke="var(--surface-container)" />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}x`}
          tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-body)" }}
        />
        <YAxis
          type="category"
          dataKey="channel"
          axisLine={false}
          tickLine={false}
          width={110}
          tick={{ fill: "var(--on-surface)", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-low)", fillOpacity: 0.5 }} />
        <Bar dataKey="roi" radius={[0, 6, 6, 0]} barSize={24}>
          {chartData.map((entry, index) => (
            <Cell
              key={entry.channel}
              fill={CHART_COLORS.channels[index % CHART_COLORS.channels.length]}
              fillOpacity={0.85}
            />
          ))}
          <ErrorBar
            dataKey="errorUpper"
            direction="x"
            width={6}
            stroke="var(--on-surface-variant)"
            strokeWidth={1.5}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
