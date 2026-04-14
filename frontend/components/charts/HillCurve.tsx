"use client";

import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot, ReferenceLine,
} from "recharts";
import { useState } from "react";
import type { HillCurveChannel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface HillCurveProps {
  channels: HillCurveChannel[];
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: number;
}) => {
  if (!active || !payload?.length) return null;
  // Find the response line entry (not CI areas)
  const responseLine = payload.find((p) => !p.dataKey.includes("ci_"));
  if (!responseLine) return null;
  const ciLower = payload.find((p) => p.dataKey.includes("ci_lower"));
  const ciUpper = payload.find((p) => p.dataKey.includes("ci_upper"));
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px] space-y-1"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <p className="text-label-md text-on-surface-variant font-medium">
        Spend: {formatCurrency(label ?? 0)}
      </p>
      <p className="flex items-center gap-2 font-mono font-tabular">
        <span className="size-2 rounded-full inline-block" style={{ background: responseLine.color }} />
        <span style={{ color: responseLine.color }}>{formatCurrency(responseLine.value)}</span>
        <span className="text-on-surface-variant text-xs">response</span>
      </p>
      {ciLower && ciUpper && (
        <p className="text-xs text-on-surface-variant font-mono">
          90% CI: [{formatCurrency(ciLower.value)}, {formatCurrency(ciUpper.value)}]
        </p>
      )}
    </div>
  );
};

export function HillCurve({ channels }: HillCurveProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const visibleChannels = selected
    ? channels.filter((c) => c.channel === selected)
    : channels;

  // Merge all channels onto a unified X axis
  const allSpends = Array.from(
    new Set(channels.flatMap((c) => c.curve_points.map((p) => p.spend)))
  ).sort((a, b) => a - b);

  const merged = allSpends.map((spend) => {
    const point: Record<string, number> = { spend };
    visibleChannels.forEach((ch) => {
      const match = ch.curve_points.find((p) => p.spend === spend);
      if (match) {
        point[ch.channel] = match.response;
        point[`${ch.channel}_ci_lower`] = match.response_ci_lower;
        point[`${ch.channel}_ci_upper`] = match.response_ci_upper;
      }
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
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={merged}>
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
            label={{
              value: "Incremental Outcome",
              angle: -90,
              position: "insideLeft",
              offset: -8,
              style: { fill: "var(--on-surface-variant)", fontSize: 11, fontFamily: "var(--font-body)" },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--outline-variant)", strokeDasharray: "4 2" }} />

          {/* CI bands and response lines for each visible channel */}
          {visibleChannels.map((ch, i) => {
            const idx = channels.findIndex((c) => c.channel === ch.channel);
            const color = CHART_COLORS.channels[idx % CHART_COLORS.channels.length];
            return (
              <Area
                key={`${ch.channel}_ci`}
                type="monotone"
                dataKey={`${ch.channel}_ci_upper`}
                stroke="none"
                fill={color}
                fillOpacity={0.12}
                connectNulls
                baseValue="dataMin"
              />
            );
          })}

          {visibleChannels.map((ch) => {
            const idx = channels.findIndex((c) => c.channel === ch.channel);
            const color = CHART_COLORS.channels[idx % CHART_COLORS.channels.length];
            return (
              <Line
                key={ch.channel}
                type="monotone"
                dataKey={ch.channel}
                stroke={color}
                strokeWidth={2.5}
                dot={false}
                connectNulls
              />
            );
          })}

          {/* ec (half-saturation) reference lines */}
          {visibleChannels.map((ch) => {
            const idx = channels.findIndex((c) => c.channel === ch.channel);
            const color = CHART_COLORS.channels[idx % CHART_COLORS.channels.length];
            return (
              <ReferenceLine
                key={`${ch.channel}_ec`}
                x={ch.ec}
                stroke={color}
                strokeDasharray="6 3"
                strokeWidth={1}
                strokeOpacity={0.5}
                label={{
                  value: `ec = ${formatCurrency(ch.ec, true)}`,
                  position: "top",
                  fill: color,
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }}
              />
            );
          })}

          {/* Current spend markers */}
          {visibleChannels.map((ch) => {
            const idx = channels.findIndex((c) => c.channel === ch.channel);
            const color = CHART_COLORS.channels[idx % CHART_COLORS.channels.length];
            const closest = ch.curve_points.reduce((prev, curr) =>
              Math.abs(curr.spend - ch.current_spend) < Math.abs(prev.spend - ch.current_spend) ? curr : prev
            );
            return (
              <ReferenceDot
                key={ch.channel}
                x={closest.spend}
                y={closest.response}
                r={5}
                fill={color}
                stroke="var(--surface-lowest)"
                strokeWidth={2}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Hill parameters legend */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 justify-center">
        {visibleChannels.map((ch, i) => {
          const idx = channels.findIndex((c) => c.channel === ch.channel);
          const color = CHART_COLORS.channels[idx % CHART_COLORS.channels.length];
          return (
            <div key={ch.channel} className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="size-2 rounded-full" style={{ background: color }} />
              <span className="font-medium text-on-surface">{ch.channel}</span>
              <span className="font-mono">ec={formatCurrency(ch.ec, true)}</span>
              <span className="font-mono">slope={ch.slope.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-label-md text-on-surface-variant mt-2 text-center">
        Dots mark current spend · Dashed lines mark half-saturation (ec) · Shaded area is 90% credible interval
      </p>
    </div>
  );
}
