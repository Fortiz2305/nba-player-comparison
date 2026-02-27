import { MICHIGAN_GOLD } from "../data";
import { AnimateOnScroll } from "./animate-on-scroll";

const limitations = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: "Solo jugadores universitarios (NCAA)",
    description:
      "La comparación incluye únicamente jugadores que pasaron por la universidad en Estados Unidos. Por eso NO aparecen jugadores europeos como Pau Gasol, Luka Dončić, Ricky Rubio, o Nikola Jokić, que llegaron directamente de Europa.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Jugadores drafteados desde 2005",
    description:
      "Solo incluye jugadores drafteados a partir de 2005, cuando se prohibió el salto directo desde el instituto. No aparecen jugadores que fueron directo de high school como Kobe Bryant, LeBron James (draft 2003), o Kevin Garnett.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: "Estadísticas universitarias, no NBA",
    description:
      "La comparación se basa en las estadísticas de NCAA, no en su carrera NBA. Un jugador puede tener stats universitarias modestas y luego brillar en la NBA (o viceversa). Solo predice estilo de juego, no éxito profesional.",
  },
];

export function Limitations() {
  return (
    <section className="relative px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <AnimateOnScroll>
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              Importante
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              ¿Qué jugadores NO aparecen?
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Para evitar confusiones, estas son las limitaciones de la comparación
            </p>
          </div>
        </AnimateOnScroll>

        <div className="space-y-4">
          {limitations.map((limitation, i) => (
            <AnimateOnScroll key={i} delay={i * 100}>
              <div className="group rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 transition-colors hover:border-amber-500/40">
                <div className="flex gap-4">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
                  >
                    {limitation.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-base font-semibold text-white">
                      {limitation.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {limitation.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={300}>
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-sm leading-relaxed text-zinc-400">
              <span className="font-semibold" style={{ color: MICHIGAN_GOLD }}>
                En resumen:
              </span>{" "}
              Esta herramienta solo compara el <strong className="text-white">estilo de juego universitario</strong> de Aday Mara con otros jugadores que también pasaron por la NCAA. Es útil para ver <em>qué tipo de jugador es</em>, pero no predice su futuro en la NBA.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
