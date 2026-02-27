export function Methodology() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900/40 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Fuentes de datos
            </h3>
            <a
              href="https://www.basketball-reference.com"
              className="text-sm text-zinc-300 hover:text-white underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Basketball Reference
            </a>
            <p className="mt-2 text-xs text-zinc-500">
              Todos los jugadores drafteados desde 2005 que pasaron por NCAA
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Metodología
            </h3>
            <p className="text-sm text-zinc-300">
              K-Nearest Neighbors sobre 17 estadísticas per-game normalizadas
            </p>
            <a
              href="https://github.com/Fortiz2305/nba-player-comparison"
              className="mt-2 inline-block text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver código →
            </a>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Pruébalo tú
            </h3>
            <a
              href="/es"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Comparar otros jugadores
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center">
          <a
            href="https://datosconnba.netlify.app"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            datosconnba.netlify.app
          </a>
          <p className="mt-1 text-xs text-zinc-600">
            Por{" "}
            <a
              href="https://twitter.com/fortiz2305"
              className="hover:text-zinc-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @fortiz2305
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
