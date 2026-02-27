export function Methodology() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm leading-relaxed text-zinc-500">
          Datos de{" "}
          <a
            href="https://www.basketball-reference.com"
            className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Basketball Reference
          </a>
          . Análisis de similitud con K-Nearest Neighbors sobre 17 estadísticas
          per-game normalizadas. Código abierto.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-zinc-600">
          <a
            href="https://datosconnba.netlify.app"
            className="transition-colors hover:text-zinc-400"
          >
            datosconnba.netlify.app
          </a>
          <span>·</span>
          <span>@fortiz2305</span>
        </div>
      </div>
    </footer>
  );
}
