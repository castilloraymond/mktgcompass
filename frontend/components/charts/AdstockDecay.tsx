"use client";

import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import type { AdstockDecayChannel } from "@/lib/types";
import { CHART_COLORS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface AdstockDecayProps {
  channels: AdstockDecayChannel[];
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: number;
}) => {
  if (!active || !payload?.length) return null;
  const lines = payload.filter((p) => !p.dataKey.includes("_ci"));
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px] space-y-1"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <p className="text-label-md text-on-surface-variant font-medium">
        Lag {label} {label === 1 ? "period" : "periods"}
      </p>
      {lines.map((p) => (
        <p key={p.name} className="flex items-center gap-2 font-mono font-tabular">
          <span className="size-2 rounded-full inline-block" style={{ background: p.color }} />
          <span style={{ color: p.color }}>{(p.value * 100).toFixed(0)}%</span>
          <span className="text-on-surface-variant text-xs">weight</span>
        </p>
      ))}
    </div>
  );
};

export function AdstockDecay({ channels }: AdstockDecayProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const visibleChannels = selected
    ? channels.filter((c) => c.channel === selected)
    : channels;

  // Merge all channels onto unified lag axis
  const maxLag = Math.max(...channels.flatMap((c) => c.decay_weights.map((w) => w.lag)));
  const lags = Array.from({ length: maxLag + 1 }, (_, i) => i);

  const merged = lags.map((lag) => {
    const point: Record<string, number> = { lag };
    visibleChannels.forEach((ch) => {
      const match = ch.decay_weights.find((w) => w.lag === lag);
      if (match) {
        point[ch.channel] = match.weight;
        point[`${ch.channel}_ci_upper`] = match.ci_upper;
      }
    });
    return point;
  });

  return (
    <div>
      {/* Channel selector */}
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

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={merged}>
          <CartesianGrid vertical={false} stroke="var(--surface-container)" />
          <XAxis
            dataKey="lag"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-body)" }}
            label={{
              value: "Lag (periods)",
              position: "insideBottom",
              offset: -5,
              style: { fill: "var(--on-surface-variant)", fontSize: 11, fontFamily: "var(--font-body)" },
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontFamily: "var(--font-body)" }}
            width={48}
            label={{
              value: "Weight",
              angle: -90,
              position: "insideLeft",
              offset: -4,
              style: { fill: "var(--on-surface-variant)", fontSize: 11, fontFamily: "var(--font-body)" },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--outline-variant)", strokeDasharray: "4 2" }} />

          {/* CI bands */}
          {visibleChannels.map((ch) => {
            const idx = channels.findIndex((c) => c.channel === ch.channel);
            const color = CHART_COLORS.channels[idx % CHART_COLORS.channels.length];
            return (
              <Area
                key={`${ch.channel}_ci`}
                type="monotone"
                dataKey={`${ch.channel}_ci_upper`}
                stroke="none"
                fill={color}
                fillOpacity={0.1}
                connectNulls
                baseValue={0}
              />
            );
          })}

          {/* Decay lines */}
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
                dot={{ r: 3, fill: color, stroke: "var(--surface-lowest)", strokeWidth: 2 }}
                connectNulls
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-label-md text-on-surface-variant mt-2 text-center">
        Higher carryover (slower decay) means the channel's effect persists longer after each spend event
      </p>
    </div>
  );
}
