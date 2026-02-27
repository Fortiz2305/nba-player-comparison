"use client";

import { MICHIGAN_GOLD } from "../data";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00274C] via-[#001a33] to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,203,5,0.12),transparent_50%)]" />
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FFCB05]/40 to-transparent" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: MICHIGAN_GOLD,
            borderColor: "rgba(255,203,5,0.25)",
            backgroundColor: "rgba(255,203,5,0.05)",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#FFCB05]" />
          Michigan · Big Ten · 2.21m · Draft 2026
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          ¿A quién se parecerá{" "}
          <span
            className="bg-gradient-to-r from-[#FFCB05] to-[#FFE085] bg-clip-text text-transparent"
          >
            Aday Mara
          </span>{" "}
          en la NBA?
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Comparamos sus estadísticas universitarias con las de más de{" "}
          <span className="font-semibold text-zinc-200">1.200 jugadores drafteados</span>{" "}
          en los últimos 20 años cuando estaban en NCAA
        </p>

        <button
          onClick={() => document.getElementById('similar-players')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-[#FFCB05]"
        >
          Ver jugadores similares
          <svg className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
