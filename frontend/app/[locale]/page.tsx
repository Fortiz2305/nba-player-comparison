'use client';

import PlayerComparison from '@/components/player-comparison';
import Logo from '@/components/logo';
import { useParams } from 'next/navigation';
import { InfoDialog } from '../../components/info-dialog';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;

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
                  ? 'Encuentra los jugadores más similares en la liga basados en estadísticas y estilo de juego'
                  : 'Find the most similar players in the league based on stats and playing style'}
              </p>
            </div>
          </div>
        </header>
        <PlayerComparison />
      </div>
      <InfoDialog />
    </main>
  );
}
