"use client";

import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ModelFitPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ModelFitChartProps {
  data: ModelFitPoint[];
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const actual = payload.find((p) => p.name === "actual");
  const expected = payload.find((p) => p.name === "expected");
  const ciLower = payload.find((p) => p.name === "ci_lower");
  const ciUpper = payload.find((p) => p.name === "ci_upper");
  return (
    <div
      className="bg-surface-lowest text-on-surface text-sm px-4 py-3 rounded-[12px] space-y-1"
      style={{ boxShadow: "var(--shadow-overlay)" }}
    >
      <p className="text-label-md text-on-surface-variant font-medium">{label}</p>
      {actual && (
        <p className="flex items-center gap-2 font-mono font-tabular">
          <span className="size-2 rounded-full inline-block bg-primary" />
          <span className="text-on-surface">{formatCurrency(actual.value)}</span>
          <span className="text-on-surface-variant text-xs">actual</span>
        </p>
      )}
      {expected && (
        <p className="flex items-center gap-2 font-mono font-tabular">
          <span className="size-2 rounded-full inline-block" style={{ background: "#8B5CF6" }} />
          <span style={{ color: "#8B5CF6" }}>{formatCurrency(expected.value)}</span>
          <span className="text-on-surface-variant text-xs">predicted</span>
        </p>
      )}
      {ciLower && ciUpper && (
        <p className="text-xs text-on-surface-variant font-mono">
          90% CI: [{formatCurrency(ciLower.value)}, {formatCurrency(ciUpper.value)}]
        </p>
      )}
    </div>
  );
};

export function ModelFitChart({ data }: ModelFitChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data}>
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
          width={60}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--outline-variant)", strokeDasharray: "4 2" }} />
        {/* CI band */}
        <Area
          type="monotone"
          dataKey="ci_upper"
          stroke="none"
          fill="#8B5CF6"
          fillOpacity={0.1}
          baseValue="dataMin"
        />
        <Area
          type="monotone"
          dataKey="ci_lower"
          stroke="none"
          fill="#FFFFFF"
          fillOpacity={1}
          baseValue="dataMin"
        />
        {/* Expected (predicted) — dashed */}
        <Line
          type="monotone"
          dataKey="expected"
          stroke="#8B5CF6"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
        />
        {/* Actual — solid */}
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--primary)", stroke: "var(--surface-lowest)", strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
