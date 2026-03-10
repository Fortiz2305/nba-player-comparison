import { AnimateOnScroll } from "./animate-on-scroll";
import { RapmCard } from "./rapm-card";
import { RapmTimeline } from "./rapm-timeline";

export function Methodology() {
  return (
    <section className="border-t border-zinc-800 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            ¿Cómo se calcula?
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              Primero asignamos a cada equipo un rating basado en su rendimiento
              neto ponderado, la dificultad de su calendario y su historial en
              playoffs.
            </p>
            <p>
              Para medir el impacto individual de LeBron usamos{" "}
              <a
                href="https://nbarapm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 underline underline-offset-2 transition-colors hover:text-zinc-200"
              >
                RAPM
              </a>
              : un modelo estadístico que aísla cuánto aporta cada jugador al
              rendimiento de su equipo, separando su efecto del de sus compañeros
              y rivales.
            </p>
            <p>
              Con esos datos simulamos el bracket completo de playoffs 50.000
              veces — con ventaja de campo, inercia competitiva y fatiga — una
              vez con LeBron en la rotación y otra sin él.
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      <RapmCard />

      <div className="mx-auto max-w-4xl px-4">
        <AnimateOnScroll>
          <p className="mb-6 text-sm text-zinc-500">
            En las últimas 17 temporadas de la NBA, LeBron nunca había registrado un RAPM
            negativo. Este año es la primera vez.
          </p>
        </AnimateOnScroll>
      </div>

      <RapmTimeline />
    </section>
  );
}
