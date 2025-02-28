"use client"

import { useState } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Define types for our data structures
interface Player {
  id: number
  name: string
  team: string
  position: string
}

interface SimilarPlayer extends Player {
  similarity: number
}

interface PlayerStats {
  scoring: number
  playmaking: number
  defense: number
  athleticism: number
  basketball_iq: number
}

interface DetailedStat {
  stat: string
  value: number
}

interface RadarDataPoint {
  category: string
  [key: string]: string | number
}

type PlayerStatsMap = {
  [key: string]: PlayerStats
}

type DetailedStatsMap = {
  [key: string]: DetailedStat[]
}

type SimilarPlayersMap = {
  [key: string]: SimilarPlayer[]
}

const nbaPlayers: Player[] = [
  { id: 1, name: "LeBron James", team: "Los Angeles Lakers", position: "SF" },
  { id: 2, name: "Stephen Curry", team: "Golden State Warriors", position: "PG" },
  { id: 3, name: "Kevin Durant", team: "Phoenix Suns", position: "SF" },
  { id: 4, name: "Giannis Antetokounmpo", team: "Milwaukee Bucks", position: "PF" },
  { id: 5, name: "Nikola Jokić", team: "Denver Nuggets", position: "C" },
  { id: 6, name: "Luka Dončić", team: "Dallas Mavericks", position: "PG" },
  { id: 7, name: "Joel Embiid", team: "Philadelphia 76ers", position: "C" },
  { id: 8, name: "Jayson Tatum", team: "Boston Celtics", position: "SF" },
  { id: 9, name: "Ja Morant", team: "Memphis Grizzlies", position: "PG" },
  { id: 10, name: "Kawhi Leonard", team: "Los Angeles Clippers", position: "SF" },
]

const similarPlayersData: SimilarPlayersMap = {
  "LeBron James": [
    { id: 8, name: "Jayson Tatum", similarity: 92, team: "Boston Celtics", position: "SF" },
    { id: 3, name: "Kevin Durant", similarity: 89, team: "Phoenix Suns", position: "SF" },
    { id: 4, name: "Giannis Antetokounmpo", similarity: 85, team: "Milwaukee Bucks", position: "PF" },
    { id: 6, name: "Luka Dončić", similarity: 82, team: "Dallas Mavericks", position: "PG" },
  ],
  "Stephen Curry": [
    { id: 9, name: "Ja Morant", similarity: 88, team: "Memphis Grizzlies", position: "PG" },
    { id: 6, name: "Luka Dončić", similarity: 85, team: "Dallas Mavericks", position: "PG" },
    { id: 3, name: "Kevin Durant", similarity: 80, team: "Phoenix Suns", position: "SF" },
    { id: 10, name: "Kawhi Leonard", similarity: 75, team: "Los Angeles Clippers", position: "SF" },
  ],
}

const getPlayerStats = (playerName: string): PlayerStats => {
  const statsMap: PlayerStatsMap = {
    "LeBron James": { scoring: 90, playmaking: 95, defense: 85, athleticism: 95, basketball_iq: 98 },
    "Stephen Curry": { scoring: 95, playmaking: 90, defense: 75, athleticism: 85, basketball_iq: 95 },
    "Kevin Durant": { scoring: 98, playmaking: 80, defense: 85, athleticism: 90, basketball_iq: 90 },
    "Giannis Antetokounmpo": { scoring: 90, playmaking: 80, defense: 90, athleticism: 95, basketball_iq: 85 },
    "Nikola Jokić": { scoring: 90, playmaking: 95, defense: 75, athleticism: 75, basketball_iq: 98 },
    "Luka Dončić": { scoring: 92, playmaking: 95, defense: 75, athleticism: 85, basketball_iq: 95 },
    "Joel Embiid": { scoring: 92, playmaking: 75, defense: 90, athleticism: 90, basketball_iq: 88 },
    "Jayson Tatum": { scoring: 92, playmaking: 80, defense: 85, athleticism: 90, basketball_iq: 88 },
    "Ja Morant": { scoring: 88, playmaking: 90, defense: 75, athleticism: 98, basketball_iq: 85 },
    "Kawhi Leonard": { scoring: 90, playmaking: 80, defense: 95, athleticism: 90, basketball_iq: 95 },
  }

  return statsMap[playerName] || { scoring: 0, playmaking: 0, defense: 0, athleticism: 0, basketball_iq: 0 }
}

const getDetailedStats = (playerName: string): DetailedStat[] => {
  const statsMap: DetailedStatsMap = {
    "LeBron James": [
      { stat: "PPG", value: 27.2 },
      { stat: "RPG", value: 7.5 },
      { stat: "APG", value: 8.3 },
      { stat: "SPG", value: 1.3 },
      { stat: "BPG", value: 0.8 },
      { stat: "FG%", value: 52.0 },
    ],
    "Stephen Curry": [
      { stat: "PPG", value: 29.4 },
      { stat: "RPG", value: 6.1 },
      { stat: "APG", value: 6.3 },
      { stat: "SPG", value: 1.4 },
      { stat: "BPG", value: 0.4 },
      { stat: "FG%", value: 49.0 },
    ],
    "Jayson Tatum": [
      { stat: "PPG", value: 26.9 },
      { stat: "RPG", value: 8.1 },
      { stat: "APG", value: 4.7 },
      { stat: "SPG", value: 1.1 },
      { stat: "BPG", value: 0.7 },
      { stat: "FG%", value: 47.0 },
    ],
    "Kevin Durant": [
      { stat: "PPG", value: 28.3 },
      { stat: "RPG", value: 7.0 },
      { stat: "APG", value: 5.5 },
      { stat: "SPG", value: 0.8 },
      { stat: "BPG", value: 1.2 },
      { stat: "FG%", value: 53.0 },
    ],
    "Giannis Antetokounmpo": [
      { stat: "PPG", value: 29.7 },
      { stat: "RPG", value: 11.5 },
      { stat: "APG", value: 5.8 },
      { stat: "SPG", value: 1.1 },
      { stat: "BPG", value: 1.3 },
      { stat: "FG%", value: 55.0 },
    ],
    "Luka Dončić": [
      { stat: "PPG", value: 32.4 },
      { stat: "RPG", value: 8.6 },
      { stat: "APG", value: 8.0 },
      { stat: "SPG", value: 1.4 },
      { stat: "BPG", value: 0.5 },
      { stat: "FG%", value: 49.0 },
    ],
    "Ja Morant": [
      { stat: "PPG", value: 24.8 },
      { stat: "RPG", value: 5.9 },
      { stat: "APG", value: 8.2 },
      { stat: "SPG", value: 1.1 },
      { stat: "BPG", value: 0.3 },
      { stat: "FG%", value: 47.0 },
    ],
    "Kawhi Leonard": [
      { stat: "PPG", value: 23.8 },
      { stat: "RPG", value: 6.5 },
      { stat: "APG", value: 3.9 },
      { stat: "SPG", value: 1.4 },
      { stat: "BPG", value: 0.5 },
      { stat: "FG%", value: 51.0 },
    ],
  }

  return statsMap[playerName] || []
}

// Format radar chart data
const formatRadarData = (players: Player[]): RadarDataPoint[] => {
  const categories = ["scoring", "playmaking", "defense", "athleticism", "basketball_iq"]
  return categories.map((category) => {
    const data: RadarDataPoint = { category }
    players.forEach((player) => {
      const stats = getPlayerStats(player.name)
      data[player.name] = stats[category as keyof PlayerStats]
    })
    return data
  })
}

export default function PlayerComparison() {
  const [open, setOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [similarPlayers, setSimilarPlayers] = useState<SimilarPlayer[]>([])
  const [chartType, setChartType] = useState("radar")
  const [selectedPlayerForDetails, setSelectedPlayerForDetails] = useState<SimilarPlayer | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const handlePlayerSelect = (playerName: string) => {
    const player = nbaPlayers.find(p => p.name === playerName)
    if (player) {
      setSelectedPlayer(player)
      // Get similar players based on the selected player
      const similar = similarPlayersData[player.name] || []
      setSimilarPlayers(similar)
      setOpen(false)
    }
  }

  const handlePlayerClick = (player: SimilarPlayer) => {
    setSelectedPlayerForDetails(player)
    setShowDetailsDialog(true)
  }

  // Prepare data for radar chart
  const getRadarData = () => {
    if (!selectedPlayer) return []

    const playersToCompare = [selectedPlayer, ...similarPlayers.slice(0, 3)]
    return formatRadarData(playersToCompare)
  }

  // Custom colors for the chart
  const playerColors = [
    "#3366CC", // Primary blue
    "#FF9933", // Orange
    "#33CC99", // Teal
    "#CC3366", // Magenta
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-full max-w-md">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-white dark:bg-slate-900 border-2 h-14 text-lg"
                onClick={() => setOpen(!open)}
              >
                {selectedPlayer ? selectedPlayer.name : "Select an NBA player..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
              <Command>
                <CommandInput placeholder="Search for a player..." className="h-12" />
                <CommandList>
                  <CommandEmpty>No player found.</CommandEmpty>
                  <CommandGroup>
                    {nbaPlayers.map((player) => (
                      <CommandItem key={player.id} value={player.name} onSelect={handlePlayerSelect}>
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedPlayer?.id === player.id ? "opacity-100" : "opacity-0")}
                        />
                        <div className="flex flex-col">
                          <span>{player.name}</span>
                          <span className="text-sm text-slate-500">
                            {player.team} • {player.position}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedPlayer && (
          <div className="w-full">
            <Card className="bg-white dark:bg-slate-900 shadow-lg border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedPlayer.name}
                      <Badge className="ml-2 bg-blue-600">{selectedPlayer.position}</Badge>
                    </CardTitle>
                    <CardDescription>{selectedPlayer.team}</CardDescription>
                  </div>
                  <Tabs defaultValue="radar" className="w-[200px]" onValueChange={setChartType}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="radar">Radar</TabsTrigger>
                      <TabsTrigger value="bar">Stats</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Most Similar Players</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {similarPlayers.map((player) => (
                      <Card
                        key={player.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handlePlayerClick(player)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{player.name}</p>
                              <p className="text-sm text-slate-500">{player.team}</p>
                            </div>
                            <Badge
                              className={`${
                                player.similarity > 90
                                  ? "bg-green-600"
                                  : player.similarity > 80
                                    ? "bg-blue-600"
                                    : "bg-orange-500"
                              }`}
                            >
                              {player.similarity}%
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="h-[400px] mt-8">
                  {chartType === "radar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />

                        {/* Selected player */}
                        <Radar
                          name={selectedPlayer.name}
                          dataKey={selectedPlayer.name}
                          stroke={playerColors[0]}
                          fill={playerColors[0]}
                          fillOpacity={0.3}
                        />

                        {/* Similar players */}
                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Radar
                            key={player.id}
                            name={player.name}
                            dataKey={player.name}
                            stroke={playerColors[index + 1]}
                            fill={playerColors[index + 1]}
                            fillOpacity={0.3}
                          />
                        ))}

                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getDetailedStats(selectedPlayer.name)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stat" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name={selectedPlayer.name} fill="#3366CC" />
                        {similarPlayers.length > 0 && (
                          <Bar dataKey="value" name={similarPlayers[0].name} fill="#FF9933" />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Player Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlayerForDetails?.name}
              <Badge className="bg-blue-600">{selectedPlayerForDetails?.position}</Badge>
            </DialogTitle>
            <DialogDescription>{selectedPlayerForDetails?.team}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Similarity Score</h4>
                <div className="text-2xl font-bold text-blue-600">{selectedPlayerForDetails?.similarity}%</div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Playing Style</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">Scorer</Badge>
                  <Badge variant="outline">Playmaker</Badge>
                  <Badge variant="outline">Athletic</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Stats</h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedPlayerForDetails &&
                  getDetailedStats(selectedPlayerForDetails.name).map((stat, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-center">
                      <div className="text-sm text-slate-500">{stat.stat}</div>
                      <div className="font-bold">{stat.value}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
