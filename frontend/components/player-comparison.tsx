"use client"

import { useEffect, useState } from "react"
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
import { getAllPlayers, getSimilarPlayers, calculateSkillRatings } from "@/lib/api"
import { PlayerStats, SimilarPlayer, PlayerSkillRatings } from "@/types/player"

interface RadarDataPoint {
  category: string
  [key: string]: string | number
}

interface DetailedStat {
  stat: string
  value: number
}

export default function PlayerComparison() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [availablePlayers, setAvailablePlayers] = useState<PlayerStats[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null)
  const [selectedPlayerSkills, setSelectedPlayerSkills] = useState<PlayerSkillRatings | null>(null)
  const [similarPlayers, setSimilarPlayers] = useState<SimilarPlayer[]>([])
  const [similarPlayersSkills, setSimilarPlayersSkills] = useState<Map<string, PlayerSkillRatings>>(new Map())
  const [chartType, setChartType] = useState("radar")
  const [selectedPlayerForDetails, setSelectedPlayerForDetails] = useState<SimilarPlayer | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const currentSeason = "2023_24"

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        setHasError(false)
        const players = await getAllPlayers(currentSeason)
        setAvailablePlayers(players)
      } catch (error) {
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : "Failed to fetch players")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [currentSeason])

  const handlePlayerSelect = async (playerName: string) => {
    try {
      setIsLoading(true)
      setHasError(false)

      const player = availablePlayers.find(p => p.player === playerName)
      if (!player) return

      const response = await getSimilarPlayers(playerName, currentSeason, 5)

      setSelectedPlayer(response.query_player)
      const queryPlayerSkills = calculateSkillRatings(response.query_player)
      setSelectedPlayerSkills(queryPlayerSkills)

      setSimilarPlayers(response.similar_players)

      const skillsMap = new Map<string, PlayerSkillRatings>()
      response.similar_players.forEach(player => {
        skillsMap.set(player.player, calculateSkillRatings(player.stats))
      })
      setSimilarPlayersSkills(skillsMap)

      setOpen(false)
    } catch (error) {
      setHasError(true)
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch similar players")
      console.error('Error fetching similar players:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayerClick = (player: SimilarPlayer) => {
    setSelectedPlayerForDetails(player)
    setShowDetailsDialog(true)
  }

  const getRadarData = (): RadarDataPoint[] => {
    if (!selectedPlayer || !selectedPlayerSkills) return []

    const categories = ["scoring", "playmaking", "defense", "athleticism", "basketball_iq"]
    return categories.map((category) => {
      const data: RadarDataPoint = { category }

      data[selectedPlayer.player] = selectedPlayerSkills[category as keyof PlayerSkillRatings]

      similarPlayers.slice(0, 3).forEach(player => {
        const skills = similarPlayersSkills.get(player.player)
        if (skills) {
          data[player.player] = skills[category as keyof PlayerSkillRatings]
        }
      })

      return data
    })
  }

  const getDetailedStats = (player: PlayerStats): DetailedStat[] => {
    return [
      { stat: "PPG", value: player.points_per_game },
      { stat: "RPG", value: player.total_rebounds_per_game },
      { stat: "APG", value: player.assists_per_game },
      { stat: "SPG", value: player.steals_per_game },
      { stat: "BPG", value: player.blocks_per_game },
      { stat: "FG%", value: player.field_goal_percentage * 100 },
    ]
  }

  const playerColors = [
    "#3366CC", // Primary blue
    "#FF9933", // Orange
    "#33CC99", // Teal
    "#CC3366", // Magenta
  ]

  if (isLoading && availablePlayers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading players...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p className="text-lg mb-2">Error loading data</p>
          <p>{errorMessage}</p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

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
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                    Loading...
                  </span>
                ) : selectedPlayer ? (
                  selectedPlayer.player
                ) : (
                  "Select an NBA player..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
              <Command>
                <CommandInput placeholder="Search for a player..." className="h-12" />
                <CommandList>
                  <CommandEmpty>No player found.</CommandEmpty>
                  <CommandGroup heading="Players">
                    {availablePlayers && availablePlayers.length > 0 ? (
                      availablePlayers.map((player) => {
                        return (
                          <CommandItem
                            key={player.player_id || player.player}
                            value={player.player}
                            onSelect={(value) => {
                              handlePlayerSelect(value);
                            }}
                            className="cursor-pointer py-3 flex items-center"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 flex-shrink-0",
                                selectedPlayer?.player === player.player ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="flex flex-col">
                              <span className="font-medium text-base text-foreground">{player.player}</span>
                              <span className="text-sm text-muted-foreground">
                                {player.team} • {player.position}
                              </span>
                            </span>
                          </CommandItem>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500">
                        {isLoading ? "Loading players..." : "No players available"}
                      </div>
                    )}
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
                      {selectedPlayer.player}
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
                        key={player.player}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handlePlayerClick(player)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{player.player}</p>
                              <p className="text-sm text-slate-500">{player.stats.team}</p>
                            </div>
                            <Badge
                              className={`${
                                player.similarity_score > 90
                                  ? "bg-green-600"
                                  : player.similarity_score > 80
                                    ? "bg-blue-600"
                                    : "bg-orange-500"
                              }`}
                            >
                              {Math.round(player.similarity_score)}%
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

                        <Radar
                          name={selectedPlayer.player}
                          dataKey={selectedPlayer.player}
                          stroke={playerColors[0]}
                          fill={playerColors[0]}
                          fillOpacity={0.3}
                        />

                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Radar
                            key={player.player}
                            name={player.player}
                            dataKey={player.player}
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
                        data={getDetailedStats(selectedPlayer)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stat" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name={selectedPlayer.player} fill="#3366CC" />
                        {similarPlayers.length > 0 && (
                          <Bar
                            dataKey="value"
                            name={similarPlayers[0].player}
                            fill="#FF9933"
                          />
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

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlayerForDetails?.player}
              <Badge className="bg-blue-600">{selectedPlayerForDetails?.position}</Badge>
            </DialogTitle>
            <DialogDescription>{selectedPlayerForDetails?.stats.team}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Similarity Score</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {selectedPlayerForDetails && Math.round(selectedPlayerForDetails.similarity_score)}%
                </div>
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
                  getDetailedStats(selectedPlayerForDetails.stats).map((stat, index) => (
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
