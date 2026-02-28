import { MICHIGAN_GOLD } from "../data";
import { AnimateOnScroll } from "./animate-on-scroll";

export function DraftPrediction() {
  return (
    <section className="relative px-4 py-16 sm:py-20">
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="mx-auto max-w-2xl">
        <AnimateOnScroll>
          <div className="rounded-2xl border border-[#FFCB05]/20 bg-[#FFCB05]/5 p-8 text-center sm:p-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#FFCB05]">
              Predicción de draft
            </p>
            <p className="mb-4 text-sm text-zinc-400">
              Según la posición de draft de sus 15 jugadores más similares
            </p>

            <div className="mb-6">
              <span
                className="text-6xl font-bold sm:text-7xl"
                style={{ color: MICHIGAN_GOLD }}
              >
                #24
              </span>
              <p className="mt-2 text-sm text-zinc-400">
                Draft 2026
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div>
                <span className="block text-lg font-bold text-white">#1</span>
                <span className="text-xs text-zinc-500">Karl-Anthony Towns</span>
              </div>
              <div className="h-px w-12 bg-zinc-700" />
              <div>
                <span className="block text-lg font-bold text-white">#46</span>
                <span className="text-xs text-zinc-500">A.J. Hammons</span>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-zinc-500">
              Estimación basada únicamente en estadísticas universitarias — el draft depende de muchos otros factores como atleticismo, potencial físico o necesidades de los equipos.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
