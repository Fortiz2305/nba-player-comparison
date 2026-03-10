"use client";

import { AnimateOnScroll } from "./animate-on-scroll";
import { LEBRON_RAPM } from "../data";

export function RapmCard() {
  return (
    <div id="rapm" className="py-12">
      <div className="mx-auto max-w-4xl px-4">
        <AnimateOnScroll>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            RAPM de LeBron · 2025-26
          </p>

          <p className="mt-2 text-7xl font-black leading-none tracking-tighter text-red-400 sm:text-8xl">
            {LEBRON_RAPM.total.toFixed(1)}
          </p>

          <div className="mt-6 flex gap-8">
            <p className="text-sm text-zinc-500">
              <span className="mr-1.5 font-semibold tabular-nums text-red-400/70">
                {LEBRON_RAPM.offense.toFixed(1)}
              </span>
              ofensivo
            </p>
            <p className="text-sm text-zinc-500">
              <span className="mr-1.5 font-semibold tabular-nums text-red-400/70">
                {LEBRON_RAPM.defense.toFixed(1)}
              </span>
              defensivo
            </p>
          </div>

        </AnimateOnScroll>
      </div>
    </div>
  );
}
