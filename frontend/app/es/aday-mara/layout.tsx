import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿A quién se parecerá Aday Mara en la NBA? | Comparación estadística",
  description:
    "Comparamos las estadísticas universitarias de Aday Mara con todos los jugadores drafteados desde 2005 que pasaron por la universidad americana.",
  keywords:
    "Aday Mara, Michigan, NCAA, Draft 2026, comparación, estadísticas, NBA Draft, Big Ten, pívot",
  openGraph: {
    type: "article",
    url: "https://datosconnba.netlify.app/es/aday-mara",
    title: "¿A quién se parecerá Aday Mara en la NBA?",
    description:
      "Comparamos sus stats universitarias con todos los jugadores drafteados desde 2005 que pasaron por NCAA. Descubre a quién se parecerá el pívot español de 2.21m.",
    siteName: "DatosConNBA",
    locale: "es_ES",
    images: [
      {
        url: "/og-aday-mara.png",
        width: 1200,
        height: 630,
        alt: "Aday Mara - Comparación NCAA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "¿A quién se parecerá Aday Mara en la NBA?",
    description:
      "Comparamos sus stats universitarias con todos los jugadores drafteados desde 2005 que pasaron por NCAA. Descubre a quién se parecerá el pívot español de 2.21m.",
    images: ["/og-aday-mara.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AdayMaraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
