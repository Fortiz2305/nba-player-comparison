export const LAKERS_PURPLE = "#7B52AB";
export const LAKERS_GOLD = "#FDB927";

export interface RapmSeason {
  season: string;
  total: number;
}

export interface RoundProbabilities {
  r1Win: number;
  confSemis: number;
  confFinals: number;
  finals: number;
  champion: number;
}

export interface RivalScenario {
  rival: string;
  rivalRating: number;
  conLeBron: RoundProbabilities;
  sinLeBron: RoundProbabilities;
}

export const LEBRON_RAPM = {
  total: -1.2,
  offense: -0.4,
  defense: -0.8,
};

export const LAL_POWER_RATING = 0.3;
export const LAL_POWER_RATING_SIN_LEBRON = 1.5;

export const RAPM_HISTORY: RapmSeason[] = [
  { season: "09-10", total: 9.0 },
  { season: "10-11", total: 8.5 },
  { season: "11-12", total: 5.1 },
  { season: "12-13", total: 6.1 },
  { season: "13-14", total: 5.6 },
  { season: "14-15", total: 6.8 },
  { season: "15-16", total: 8.6 },
  { season: "16-17", total: 9.9 },
  { season: "17-18", total: 6.3 },
  { season: "18-19", total: 3.7 },
  { season: "19-20", total: 6.3 },
  { season: "20-21", total: 7.4 },
  { season: "21-22", total: 3.7 },
  { season: "22-23", total: 3.1 },
  { season: "23-24", total: 5.2 },
  { season: "24-25", total: 0.4 },
  { season: "25-26", total: -1.2 },
];

export const RIVAL_SCENARIOS: RivalScenario[] = [
  {
    rival: "HOU",
    rivalRating: 4.1,
    conLeBron: { r1Win: 19.0, confSemis: 19.0, confFinals: 5.7, finals: 0.2, champion: 0.0 },
    sinLeBron: { r1Win: 26.0, confSemis: 26.0, confFinals: 9.7, finals: 0.6, champion: 0.1 },
  },
  {
    rival: "DEN",
    rivalRating: 2.92,
    conLeBron: { r1Win: 25.4, confSemis: 25.4, confFinals: 7.5, finals: 0.3, champion: 0.0 },
    sinLeBron: { r1Win: 33.1, confSemis: 33.1, confFinals: 12.5, finals: 0.8, champion: 0.1 },
  },
  {
    rival: "MIN",
    rivalRating: 3.04,
    conLeBron: { r1Win: 25.1, confSemis: 25.1, confFinals: 7.3, finals: 0.3, champion: 0.0 },
    sinLeBron: { r1Win: 32.7, confSemis: 32.7, confFinals: 12.3, finals: 0.8, champion: 0.1 },
  },
];

export const ROUNDS = ["1a Ronda", "Semis", "Final Conf.", "Final", "Campeón"] as const;

export function getRoundData(scenario: RivalScenario) {
  return ROUNDS.map((round, i) => {
    const keys: (keyof RoundProbabilities)[] = ["r1Win", "confSemis", "confFinals", "finals", "champion"];
    return {
      round,
      conLeBron: scenario.conLeBron[keys[i]],
      sinLeBron: scenario.sinLeBron[keys[i]],
    };
  });
}

export function getAverageRoundData() {
  const keys: (keyof RoundProbabilities)[] = ["r1Win", "confSemis", "confFinals", "finals", "champion"];
  const count = RIVAL_SCENARIOS.length;

  return ROUNDS.map((round, i) => {
    const key = keys[i];
    const conLeBron = RIVAL_SCENARIOS.reduce((sum, s) => sum + s.conLeBron[key], 0) / count;
    const sinLeBron = RIVAL_SCENARIOS.reduce((sum, s) => sum + s.sinLeBron[key], 0) / count;
    return {
      round,
      conLeBron: Math.round(conLeBron * 10) / 10,
      sinLeBron: Math.round(sinLeBron * 10) / 10,
    };
  });
}
