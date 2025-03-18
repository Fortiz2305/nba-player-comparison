'use client';

import PlayerComparison from '@/components/player-comparison';
import Logo from '@/components/logo';
import { useParams } from 'next/navigation';
import { InfoDialog } from '../../components/info-dialog';
import { useEffect } from 'react';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': locale === 'es' ? 'Comparación de Jugadores NBA' : 'NBA Player Comparison Tool',
      'description': locale === 'es'
        ? 'Herramienta gratuita para comparar estadísticas y estilos de juego de jugadores de la NBA. Encuentra jugadores similares basados en puntos, rebotes, asistencias y más.'
        : 'Free tool to compare NBA players stats and playing styles. Find similar players based on points, rebounds, assists and more.',
      'applicationCategory': 'SportsApplication',
      'operatingSystem': 'Web',
      'url': 'https://datosconnba.netlify.app',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'keywords': locale === 'es'
        ? 'comparación NBA, estadísticas baloncesto, comparar jugadores baloncesto, análisis NBA, similitud jugadores, estadísticas NBA, comparativa jugadores'
        : 'NBA comparison, basketball stats, compare basketball players, NBA analytics, player similarity, NBA statistics, player comparisons'
    };

    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [locale]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Logo />
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {locale === 'es' ? 'Comparación de Jugadores NBA' : 'NBA Player Comparison'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {locale === 'es'
                  ? 'Encuentra los jugadores más similares en la liga basados en estadísticas y estilo de juego. Compara puntos, rebotes, asistencias, porcentajes y más.'
                  : 'Find the most similar players in the league based on stats and playing style. Compare points, rebounds, assists, percentages and more.'}
              </p>
              <div className="mt-3 text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                <p className="max-w-2xl mx-auto">
                  {locale === 'es'
                    ? 'Análisis avanzado de jugadores de la NBA utilizando estadísticas oficiales. Compara a tus estrellas favoritas como LeBron James, Stephen Curry, Nikola Jokic, Luka Doncic, y más.'
                    : 'Advanced NBA player analysis using official statistics. Compare your favorite stars like LeBron James, Stephen Curry, Nikola Jokic, Luka Doncic, and more.'}
                </p>
              </div>
            </div>
          </div>
        </header>
        <PlayerComparison />
        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="mb-2">
            {locale === 'es'
              ? '© NBA Player Comparison - Herramienta de comparación de estadísticas de la NBA'
              : '© NBA Player Comparison - NBA Stats Comparison Tool'}
          </p>
          <p>
            {locale === 'es'
              ? 'Estadísticas actualizadas para todas las temporadas de la NBA. Compara jugadores por puntos, asistencias, rebotes y estilo de juego.'
              : 'Up-to-date statistics for all NBA seasons. Compare players by points, assists, rebounds and playing style.'}
          </p>
        </footer>
      </div>
      <InfoDialog />
    </main>
  );
}
