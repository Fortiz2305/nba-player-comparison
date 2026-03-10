export function Hero() {
  return (
    <section className="px-4 pb-16 pt-16 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-4xl">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[#FDB927]/80">
          Los Angeles Lakers · 2025-26 · Datos a 10 de marzo
        </p>

        <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          ¿Cuánto cambiarían los playoffs de Lakers sin LeBron?
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Con los datos de la temporada regular hasta hoy, simulamos 50.000
          playoffs completos para ver cómo cambian las opciones de Lakers con y
          sin él en cancha.
        </p>
      </div>
    </section>
  );
}
