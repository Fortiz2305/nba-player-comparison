"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { AnimateOnScroll } from "./animate-on-scroll";
import { ChartTooltip } from "./chart-tooltip";
import { RIVAL_SCENARIOS, LAKERS_PURPLE, LAKERS_GOLD } from "../data";

const chartData = RIVAL_SCENARIOS.map((s) => ({
  rival: `vs ${s.rival}`,
  conLeBron: s.conLeBron.r1Win,
  sinLeBron: s.sinLeBron.r1Win,
}));

export function RoundOneComparison() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Primera ronda — tres escenarios
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Probabilidad de ganar la serie según rival
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150}>
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: LAKERS_PURPLE }} />
                Con LeBron
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: LAKERS_GOLD }} />
                Sin LeBron
              </span>
            </div>

            <div role="img" aria-label="Gráfico de barras comparando probabilidad de ganar primera ronda. vs HOU: 19% con LeBron, 26% sin él. vs DEN: 25.4% con LeBron, 33.1% sin él. vs MIN: 25.1% con LeBron, 32.7% sin él.">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" vertical={false} />
                  <XAxis
                    dataKey="rival"
                    tick={{ fill: "#a1a1aa", fontSize: 13, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#52525b", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                  <Bar dataKey="conLeBron" fill={LAKERS_PURPLE} radius={[4, 4, 0, 0]} maxBarSize={48}>
                    <LabelList dataKey="conLeBron" position="top" fill="#71717a" fontSize={11} formatter={(v: number) => `${v}%`} />
                  </Bar>
                  <Bar dataKey="sinLeBron" fill={LAKERS_GOLD} radius={[4, 4, 0, 0]} maxBarSize={48}>
                    <LabelList dataKey="sinLeBron" position="top" fill="#FDB927" fontSize={11} fontWeight={600} formatter={(v: number) => `${v}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
