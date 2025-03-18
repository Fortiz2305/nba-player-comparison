import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NBA Player Comparison | Find Similar Basketball Players",
  description: "Compare NBA players and discover similar athletes based on stats, metrics, and playing style. Find players like LeBron, Curry, Jokic, and more.",
  keywords: "NBA comparison, basketball stats, compare NBA players, player analytics, similar players, basketball data, player statistics, NBA similarity tool",
  authors: [{ name: "NBA Player Comparison Tool" }],
  creator: "NBA Player Comparison Tool",
  publisher: "NBA Player Comparison Tool",
  openGraph: {
    type: "website",
    url: "https://datosconnba.netlify.app",
    title: "NBA Player Comparison | Find Similar Basketball Players",
    description: "Find NBA players with similar playstyles, stats, and metrics. Compare points, rebounds, assists, and discover basketball player similarities.",
    siteName: "NBA Player Comparison",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NBA Player Comparison Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NBA Player Comparison | Find Similar Basketball Players",
    description: "Find NBA players with similar playstyles, stats, and metrics. Compare points, rebounds, assists, and discover basketball player similarities.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://datosconnba.netlify.app",
    languages: {
      'en': 'https://datosconnba.netlify.app/en',
      'es': 'https://datosconnba.netlify.app/es',
    },
  },
  category: "Sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
