import { Hero } from "./components/hero";
import { RoundOneComparison } from "./components/round-one-comparison";
import { PlayoffProgression } from "./components/playoff-progression";
import { Methodology } from "./components/methodology";
import { NarrativeBridge, Conclusion } from "./components/narrative-bridge";

export default function EfectoLeBronPage() {
  return (
    <main className="dark min-h-screen bg-[#0a0a14] font-[family-name:var(--font-geist-sans)] text-white">
      <Hero />
      <RoundOneComparison />
      <NarrativeBridge>
        Pero ganar la primera ronda es solo el principio. ¿Cómo cambia la
        historia según avanzan las rondas?
      </NarrativeBridge>
      <PlayoffProgression />
      <NarrativeBridge>
        De media, Lakers pasan de un 6.8% a un 11.5% de llegar a finales de
        conferencia sin LeBron. En ninguno de los tres escenarios les va peor
        sin él.
      </NarrativeBridge>
      <Methodology />
      <Conclusion>
        LeBron sigue promediando 21.4 puntos, 7.0 asistencias y 5.6 rebotes.
        Sus números individuales no son el problema — sigue siendo uno de los
        grandes jugadores de la liga también esta temporada. Pero los datos
        dicen que{" "}
        <span className="text-white">esta temporada, este equipo</span>{" "}
        funciona mejor sin él en cancha. A veces el encaje importa más que el
        talento individual.
      </Conclusion>
      <footer className="border-t border-zinc-800 px-4 py-10">
        <p className="text-center text-xs text-zinc-500">
          <a
            href="https://twitter.com/fortiz2305"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-400"
          >
            @fortiz2305
          </a>
          {" · "}
          <a
            href="https://datosconnba.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-400"
          >
            DatosConNBA
          </a>
        </p>
      </footer>
    </main>
  );
}
