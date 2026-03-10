import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cambiarían los playoffs de Lakers sin LeBron?",
  description:
    "Con los datos de la temporada regular, simulamos 50.000 playoffs completos para ver cómo cambian las opciones de Lakers con y sin LeBron en cancha.",
  keywords:
    "LeBron James, Lakers, playoffs, RAPM, Monte Carlo, simulación, NBA 2025-26",
  openGraph: {
    type: "article",
    url: "https://datosconnba.netlify.app/es/efecto-lebron",
    title: "¿Cuánto cambiarían los playoffs de Lakers sin LeBron?",
    description:
      "Con los datos de la temporada regular, simulamos 50.000 playoffs completos para ver cómo cambian las opciones de Lakers con y sin LeBron en cancha.",
    siteName: "DatosConNBA",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Cuánto cambiarían los playoffs de Lakers sin LeBron?",
    description:
      "Con los datos de la temporada regular, simulamos 50.000 playoffs completos para ver cómo cambian las opciones de Lakers con y sin LeBron en cancha.",
  },
};

export default function EfectoLeBronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
