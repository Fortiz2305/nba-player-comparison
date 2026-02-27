import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { Limitations } from "./components/limitations";
import { SimilarPlayers } from "./components/similar-players";
import { RadarComparison } from "./components/radar-comparison";
import { StatsTable } from "./components/stats-table";
import { Methodology } from "./components/methodology";

export default function AdayMaraPage() {
  return (
    <main className="dark min-h-screen bg-zinc-950 font-[family-name:var(--font-geist-sans)] text-white">
      <Hero />
      <SimilarPlayers />
      <RadarComparison />
      <StatsTable />
      <HowItWorks />
      <Limitations />
      <Methodology />
    </main>
  );
}
