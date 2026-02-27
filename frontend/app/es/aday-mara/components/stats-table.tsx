"use client";

import { useState } from "react";
import {
  adayMara,
  similarPlayers,
  extendedSimilarPlayers,
  statColumns,
  MICHIGAN_GOLD,
} from "../data";
import type { PlayerStats } from "../data";
import { AnimateOnScroll } from "./animate-on-scroll";

const topPlayers = [adayMara, ...similarPlayers];
const allPlayers = [adayMara, ...similarPlayers, ...extendedSimilarPlayers];

function getMaxForStat(players: PlayerStats[], key: keyof PlayerStats): number {
  return Math.max(...players.map((p) => p[key] as number));
}

export function StatsTable() {
  const [expanded, setExpanded] = useState(false);
  const displayedPlayers = expanded ? allPlayers : topPlayers;

  return (
    <section className="relative px-4 py-16 sm:py-20">
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <AnimateOnScroll>
          <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
            Estadísticas por partido
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            Comparación completa incluyendo asistencias, robos y pérdidas
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80">
                  <th className="sticky left-0 z-10 bg-zinc-900/80 px-4 py-3 text-left font-semibold text-zinc-300">
                    Jugador
                  </th>
                  {statColumns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-center font-semibold text-zinc-300"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedPlayers.map((player, rowIndex) => {
                  const isAday = rowIndex === 0;
                  return (
                    <tr
                      key={player.name}
                      className={`border-b border-zinc-800/50 transition-colors ${
                        isAday ? "" : "hover:bg-zinc-900/40"
                      }`}
                    >
                      <td
                        className={`sticky left-0 z-10 px-4 py-3 ${
                          isAday
                            ? "border-l-2 bg-zinc-950"
                            : "bg-zinc-950"
                        }`}
                        style={
                          isAday
                            ? { borderLeftColor: MICHIGAN_GOLD }
                            : undefined
                        }
                      >
                        <span
                          className="font-semibold"
                          style={{
                            color: isAday ? MICHIGAN_GOLD : "#e4e4e7",
                          }}
                        >
                          {player.name}
                        </span>
                        <span className="ml-2 text-xs text-zinc-500">
                          {player.university}
                        </span>
                      </td>
                      {statColumns.map((col) => {
                        const value = player[col.key] as number;
                        const isMax =
                          value === getMaxForStat(displayedPlayers, col.key);
                        return (
                          <td
                            key={col.key}
                            className={`px-4 py-3 text-center font-mono ${
                              isMax ? "font-bold text-white" : "text-zinc-400"
                            }`}
                          >
                            {isMax && (
                              <span
                                className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: MICHIGAN_GOLD }}
                              />
                            )}
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              {expanded ? "Mostrar solo top 5" : "Ver los 15 jugadores"}
              <svg
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
