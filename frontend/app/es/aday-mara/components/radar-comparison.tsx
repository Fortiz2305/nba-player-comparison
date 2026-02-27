"use client";

import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  adayMara,
  allComparablePlayers,
  radarDimensions,
  computeRadar,
  MICHIGAN_GOLD,
} from "../data";
import { AnimateOnScroll } from "./animate-on-scroll";

const PALETTE = [
  "#60a5fa",
  "#34d399",
  "#f97316",
  "#a78bfa",
  "#f472b6",
  "#facc15",
  "#22d3ee",
  "#fb923c",
];

const DEFAULT_SELECTED = allComparablePlayers.slice(0, 3).map((p) => p.name);

const adayRadar = computeRadar(adayMara);

function buildRadarData(selectedNames: string[]) {
  const selectedPlayers = selectedNames
    .map((name) => allComparablePlayers.find((p) => p.name === name))
    .filter(Boolean);

  return radarDimensions.map((dim) => {
    const entry: Record<string, string | number> = {
      dimension: dim.label,
      "Aday Mara": adayRadar[dim.dimension],
    };
    for (const player of selectedPlayers) {
      if (!player) continue;
      const radar = computeRadar(player);
      entry[player.name] = radar[dim.dimension];
    }
    return entry;
  });
}

function getColor(name: string, selectedNames: string[]) {
  return PALETTE[selectedNames.indexOf(name) % PALETTE.length];
}

export function RadarComparison() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);

  const togglePlayer = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) {
        return prev.filter((n) => n !== name);
      }
      if (prev.length >= 4) return prev;
      return [...prev, name];
    });
  };

  const radarData = buildRadarData(selected);

  return (
    <section className="relative px-4 py-16 sm:py-20">
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="mx-auto max-w-4xl">
        <AnimateOnScroll>
          <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
            Comparación por dimensiones
          </h2>
          <p className="mb-10 text-center text-zinc-400">
            Aday Mara vs jugadores NBA en NCAA — elige hasta 4
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-[#FFCB05]/30 bg-[#FFCB05]/10 px-3 py-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: MICHIGAN_GOLD }}
                />
                <span className="text-xs font-semibold text-[#FFCB05]">
                  Aday Mara
                </span>
              </div>

              {allComparablePlayers.map((player) => {
                const isActive = selected.includes(player.name);
                const isFull = selected.length >= 4 && !isActive;
                const color = isActive
                  ? getColor(player.name, selected)
                  : "#71717a";
                return (
                  <button
                    key={player.name}
                    onClick={() => togglePlayer(player.name)}
                    disabled={isFull}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "border-zinc-600 bg-zinc-800"
                        : isFull
                          ? "cursor-not-allowed border-zinc-800/50 bg-zinc-900/20 opacity-20"
                          : "border-zinc-800 bg-zinc-900/40 opacity-50 hover:opacity-80"
                    }`}
                    style={{ color }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? color : "#52525b",
                      }}
                    />
                    {player.name}
                  </button>
                );
              })}
            </div>

            <ResponsiveContainer width="100%" height={420}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: "#a1a1aa", fontSize: 13 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Aday Mara"
                  dataKey="Aday Mara"
                  stroke={MICHIGAN_GOLD}
                  fill={MICHIGAN_GOLD}
                  fillOpacity={0.15}
                  strokeWidth={2.5}
                  animationDuration={600}
                />
                {selected.map((name) => (
                  <Radar
                    key={name}
                    name={name}
                    dataKey={name}
                    stroke={getColor(name, selected)}
                    fill={getColor(name, selected)}
                    fillOpacity={0.06}
                    strokeWidth={1.5}
                    animationDuration={600}
                  />
                ))}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    color: "#e4e4e7",
                    fontSize: "13px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>

            <p className="mt-4 text-center text-sm text-zinc-400">
              Pulsa en un jugador para añadir o quitar su comparación
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
