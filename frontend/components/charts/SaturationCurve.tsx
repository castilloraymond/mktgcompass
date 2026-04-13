"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceDot,
} from "recharts";
import { useState } from "react";
import type { SaturationChannel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface SaturationCurveProps {
  channels: SaturationChannel[];
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: number;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px] space-y-1"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <p className="text-label-md text-on-surface-variant font-medium">
        Spend: {formatCurrency(label ?? 0)}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 font-mono font-tabular">
          <span className="size-2 rounded-full inline-block" style={{ background: p.color }} />
          <span style={{ color: p.color }}>{formatCurrency(p.value)}</span>
          <span className="text-on-surface-variant text-xs">return</span>
        </p>
      ))}
    </div>
  );
};

export function SaturationCurve({ channels }: SaturationCurveProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Merge all channels onto a unified X axis
  const allSpends = Array.from(
    new Set(channels.flatMap((c) => c.curve_points.map((p) => p.spend)))
  ).sort((a, b) => a - b);

  const merged = allSpends.map((spend) => {
    const point: Record<string, number> = { spend };
    channels.forEach((ch) => {
      const match = ch.curve_points.find((p) => p.spend === spend);
      if (match) point[ch.channel] = match.marginal_return;
    });
    return point;
  });

  return (
    <div>
      {/* Channel legend + selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {channels.map((ch, i) => {
          const color = CHART_COLORS.channels[i % CHART_COLORS.channels.length];
          const isSelected = selected === null || selected === ch.channel;
          return (
            <button
              key={ch.channel}
              onClick={() => setSelected(selected === ch.channel ? null : ch.channel)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-badge text-xs font-medium transition-all",
                isSelected
                  ? "bg-surface-container text-on-surface"
                  : "bg-surface-low text-on-surface-variant opacity-50"
              )}
            >
              <span className="size-2 rounded-full" style={{ background: color }} />
              {ch.channel}
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                style={{ background: ch.saturation_pct > 70 ? "var(--error)" : ch.saturation_pct > 50 ? "var(--accent-warning)" : "var(--success)" }}
              >
                {ch.saturation_pct}% sat
              </span>
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={merged}>
          <CartesianGrid vertical={false} stroke="var(--surface-container)" />
          <XAxis
            dataKey="spend"
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v, true)}
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
          {channels.map((ch, i) => {
            const color = CHART_COLORS.channels[i % CHART_COLORS.channels.length];
            const isActive = selected === null || selected === ch.channel;
            return (
              <Line
                key={ch.channel}
                type="monotone"
                dataKey={ch.channel}
                stroke={color}
                strokeWidth={isActive ? 2.5 : 1}
                dot={false}
                strokeOpacity={isActive ? 1 : 0.2}
                connectNulls
              />
            );
          })}
          {/* Current spend markers */}
          {channels.map((ch, i) => {
            if (selected && selected !== ch.channel) return null;
            const color = CHART_COLORS.channels[i % CHART_COLORS.channels.length];
            const closest = ch.curve_points.reduce((prev, curr) =>
              Math.abs(curr.spend - ch.current_spend) < Math.abs(prev.spend - ch.current_spend) ? curr : prev
            );
            return (
              <ReferenceDot
                key={ch.channel}
                x={closest.spend}
                y={closest.marginal_return}
                r={5}
                fill={color}
                stroke="var(--surface-lowest)"
                strokeWidth={2}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-label-md text-on-surface-variant mt-2 text-center">
        Dots mark current spend levels
      </p>
    </div>
  );
}
