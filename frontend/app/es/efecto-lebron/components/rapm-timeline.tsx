"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { AnimateOnScroll } from "./animate-on-scroll";
import { RAPM_HISTORY, LAKERS_GOLD } from "../data";

function CustomDot(props: { cx: number; cy: number; payload: { season: string; total: number } }) {
  const { cx, cy, payload } = props;
  const isCurrent = payload.season === "25-26";
  if (isCurrent) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#ef4444" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={12} fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.3}>
          <animate attributeName="r" values="12;16;12" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={3} fill={LAKERS_GOLD} stroke={LAKERS_GOLD} />;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { season: string; total: number } }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
      <p className="text-zinc-400">20{data.season}</p>
      <p className={`font-bold tabular-nums ${data.total < 0 ? "text-red-400" : "text-emerald-400"}`}>
        {data.total > 0 ? "+" : ""}{data.total.toFixed(1)}
      </p>
    </div>
  );
}

export function RapmTimeline() {
  return (
    <div className="pb-12">
      <div className="mx-auto max-w-4xl px-4">
        <AnimateOnScroll>
          <h3 className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
            Trayectoria RAPM · 17 temporadas
          </h3>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150}>
          <div role="img" aria-label="Gráfico de líneas mostrando la trayectoria RAPM de LeBron James en 17 temporadas. El valor bajó de +9.0 en 2009-10 hasta -1.2 en 2025-26, su primer RAPM negativo.">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={RAPM_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" />
                <XAxis
                  dataKey="season"
                  tick={{ fill: "#52525b", fontSize: 11 }}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: "#52525b", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[-3, 12]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={LAKERS_GOLD}
                  strokeWidth={2}
                  dot={<CustomDot cx={0} cy={0} payload={{ season: "", total: 0 }} />}
                  activeDot={{ r: 5, fill: LAKERS_GOLD }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
