'use client';

import PlayerComparison from "@/components/player-comparison"
import Logo from "@/components/logo"
import { useTranslations } from 'next-intl'

export default function Home() {
  const translations = useTranslations();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Logo />
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">{translations('app.title')}</h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {translations('app.description')}
              </p>
            </div>
          </div>
        </header>
        <PlayerComparison />
      </div>
    </main>
  )
}
