"use client";

import { useState } from "react";
import {
  similarPlayers,
  extendedSimilarPlayers,
  MICHIGAN_GOLD,
} from "../data";
import type { SimilarPlayer } from "../data";
import { AnimateOnScroll } from "./animate-on-scroll";

function PlayerCard({
  player,
  rank,
}: {
  player: SimilarPlayer;
  rank: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900">
      <div className="flex items-start justify-between">
        <span
          className="text-4xl font-black"
          style={{
            color: rank === 1 ? MICHIGAN_GOLD : "rgb(82 82 91)",
          }}
        >
          #{rank}
        </span>
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            similitud
          </p>
          <p className="text-xl font-bold text-emerald-400">
            {player.similarityScore}%
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-white">{player.name}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {player.university} · {player.season}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-zinc-300">
          Pick #{player.draftPick}
        </span>
        <span className="text-zinc-500">
          {player.draftTeam} ({player.draftYear})
        </span>
      </div>
    </div>
  );
}

export function SimilarPlayers() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <AnimateOnScroll>
          <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
            Top 5 jugadores más similares
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            Jugadores NBA cuyas stats universitarias más se parecen a las de
            Aday Mara
          </p>
        </AnimateOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {similarPlayers.map((player, index) => (
            <AnimateOnScroll key={player.name} delay={index * 100}>
              <PlayerCard player={player} rank={index + 1} />
            </AnimateOnScroll>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            {expanded ? "Ocultar" : "Ver más jugadores similares"}
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

        {expanded && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extendedSimilarPlayers.map((player, index) => (
              <PlayerCard
                key={player.name}
                player={player}
                rank={index + 6}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
