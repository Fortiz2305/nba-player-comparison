import { Hero } from "./components/hero";
import { SimilarPlayers } from "./components/similar-players";
import { RadarComparison } from "./components/radar-comparison";
import { DraftPrediction } from "./components/draft-prediction";
import { HowItWorks } from "./components/how-it-works";
import { Methodology } from "./components/methodology";

export default function AdayMaraPage() {
  return (
    <main className="dark min-h-screen bg-zinc-950 font-[family-name:var(--font-geist-sans)] text-white">
      <Hero />
      <SimilarPlayers />
      <RadarComparison />
      <DraftPrediction />
      <HowItWorks />
      <Methodology />
    </main>
  );
}
