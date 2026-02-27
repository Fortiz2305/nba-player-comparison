import { MICHIGAN_GOLD } from "../data";
import { AnimateOnScroll } from "./animate-on-scroll";

const steps = [
  {
    number: "01",
    title: "Recopilación de datos",
    description:
      "Los datos provienen de Basketball Reference mediante scraping. Se obtienen las estadísticas universitarias de todos los jugadores drafteados entre 2005 y 2025. Más de 1.200 jugadores NBA cuando aún estaban en NCAA.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Normalización de estadísticas",
    description:
      "Cada stat (puntos, rebotes, tapones, asistencias...) se escala de 0 a 1 para que todas pesen igual. Así un tapón cuenta tanto como un punto al calcular distancias.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Cálculo de similitud",
    description:
      "Se utiliza K-Nearest Neighbors: cada jugador es un punto en un espacio de 17 dimensiones (una por stat). Los más cercanos a Aday Mara son los más similares. Es el mismo tipo de algoritmo que usa Spotify para recomendarte canciones.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-4 py-16 sm:py-20">
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="mx-auto max-w-4xl">
        <AnimateOnScroll>
          <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
            ¿Cómo está calculado todo esto?
          </h2>
          <p className="mb-14 text-center text-zinc-400">
            Para los curiosos: la metodología detrás de las comparaciones
          </p>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 150}>
              <div className="group relative h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700">
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#FFCB05]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(255,203,5,0.1)", color: MICHIGAN_GOLD }}
                  >
                    {step.icon}
                  </div>
                  <span className="font-mono text-sm text-zinc-600">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/es"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FFCB05] px-6 py-3 text-sm font-semibold text-[#00274C] transition-transform hover:scale-105"
          >
            Prueba con otro jugador
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
