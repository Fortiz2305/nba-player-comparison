import { NextIntlClientProvider } from 'next-intl';
import { locales, type Locale } from '@/i18n';
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = params.locale;

  if (locale === 'es') {
    return {
      title: "Comparación de Jugadores NBA | Encuentra Jugadores Similares",
      description: "Compara jugadores de la NBA y descubre atletas similares basados en estadísticas, métricas y estilo de juego. Encuentra jugadores como LeBron, Curry, Jokic, y más.",
      keywords: "comparación NBA, estadísticas baloncesto, comparar jugadores NBA, analítica jugadores, jugadores similares, datos baloncesto, estadísticas jugadores, herramienta similitud NBA",
      alternates: {
        canonical: `https://datosconnba.netlify.app/${locale}`,
        languages: {
          'en': 'https://datosconnba.netlify.app/en',
          'es': 'https://datosconnba.netlify.app/es',
        },
      },
      openGraph: {
        title: "Comparación de Jugadores NBA | Encuentra Jugadores Similares",
        description: "Encuentra jugadores de la NBA con estilos de juego, estadísticas y métricas similares. Compara puntos, rebotes, asistencias y descubre similitudes entre jugadores de baloncesto.",
      },
      twitter: {
        title: "Comparación de Jugadores NBA | Encuentra Jugadores Similares",
        description: "Encuentra jugadores de la NBA con estilos de juego, estadísticas y métricas similares. Compara puntos, rebotes, asistencias y descubre similitudes entre jugadores de baloncesto.",
      },
    };
  }

  return {
    alternates: {
      canonical: `https://datosconnba.netlify.app/${locale}`,
      languages: {
        'en': 'https://datosconnba.netlify.app/en',
        'es': 'https://datosconnba.netlify.app/es',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
