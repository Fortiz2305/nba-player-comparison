'use client';

import Logo from '@/components/logo';
import { useParams } from 'next/navigation';
import { InfoDialog } from '../../components/info-dialog';
import { useEffect } from 'react';
import { PlayerComparison } from '../../components/player-comparison';
import { useTranslations } from 'next-intl';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;
  const translations = useTranslations();

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: translations('app.schemaTitle'),
      description: translations('app.schemaDescription'),
      applicationCategory: 'SportsApplication',
      operatingSystem: 'Web',
      url: 'https://datosconnba.netlify.app',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      keywords: translations('app.keywords'),
    };

    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [locale, translations]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Logo />
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {translations('app.title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {translations('app.description')}
              </p>
            </div>
          </div>
        </header>

        <PlayerComparison />

        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="mb-2">
            {translations('app.copyright')}
          </p>
          <p>
            {translations('app.statsInfo')}
          </p>
        </footer>
      </div>
      <InfoDialog />
    </main>
  );
}
