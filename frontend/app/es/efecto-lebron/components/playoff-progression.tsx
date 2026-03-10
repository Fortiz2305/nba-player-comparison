"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnimateOnScroll } from "./animate-on-scroll";
import { ChartTooltip } from "./chart-tooltip";
import { LAKERS_PURPLE, LAKERS_GOLD, getAverageRoundData } from "../data";

const data = getAverageRoundData();

export function PlayoffProgression() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            ¿Hasta dónde llegan?
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Probabilidad media de avanzar en cada ronda
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150}>
          <div className="mt-10">
            <div className="mb-6 flex items-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: LAKERS_PURPLE }} />
                Con LeBron
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: LAKERS_GOLD }} />
                Sin LeBron
              </span>
            </div>
          </div>
          <div role="img" aria-label={`Gráfico de área mostrando probabilidades medias por ronda. Con LeBron: R1 ${data[0].conLeBron}%, Conf Finals ${data[2].conLeBron}%. Sin LeBron: R1 ${data[0].sinLeBron}%, Conf Finals ${data[2].sinLeBron}%.`}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={LAKERS_PURPLE} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={LAKERS_PURPLE} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={LAKERS_GOLD} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={LAKERS_GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" />
                <XAxis
                  dataKey="round"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#52525b", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="conLeBron"
                  stroke={LAKERS_PURPLE}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  fill="url(#gradPurple)"
                  dot={{ r: 4, fill: LAKERS_PURPLE }}
                />
                <Area
                  type="monotone"
                  dataKey="sinLeBron"
                  stroke={LAKERS_GOLD}
                  strokeWidth={2}
                  fill="url(#gradGold)"
                  dot={{ r: 4, fill: LAKERS_GOLD }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
