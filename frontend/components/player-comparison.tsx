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
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, ChevronsUpDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getAllPlayers, getSimilarPlayers, calculateSkillRatings, getSeasons } from "@/lib/api"
import { PlayerStats, SimilarPlayer, PlayerSkillRatings } from "@/types/player"
import { useTranslations } from 'next-intl'

interface RadarDataPoint {
  category: string
  [key: string]: string | number
}

interface DetailedStat {
  stat: string
  value: number
  fullName: string
}

export default function PlayerComparison() {
  const translations = useTranslations();
  const [open, setOpen] = useState(false)
  const [seasonOpen, setSeasonOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [availablePlayers, setAvailablePlayers] = useState<PlayerStats[]>([])
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null)
  const [selectedPlayerSkills, setSelectedPlayerSkills] = useState<PlayerSkillRatings | null>(null)
  const [similarPlayers, setSimilarPlayers] = useState<SimilarPlayer[]>([])
  const [similarPlayersSkills, setSimilarPlayersSkills] = useState<Map<string, PlayerSkillRatings>>(new Map())
  const [chartType, setChartType] = useState("radar")
  const [selectedPlayerForDetails, setSelectedPlayerForDetails] = useState<SimilarPlayer | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<string>("2023_24")

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setIsLoading(true)
        setHasError(false)
        const seasons = await getSeasons()
        setAvailableSeasons(seasons)
        if (seasons.length > 0 && !seasons.includes(selectedSeason)) {
          setSelectedSeason(seasons[0])
        }
      } catch (error) {
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : "Failed to fetch seasons")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeasons()
  }, [selectedSeason])

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        setHasError(false)
        const players = await getAllPlayers(selectedSeason)
        setAvailablePlayers(players)
      } catch (error) {
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : "Failed to fetch players")
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedSeason) {
      fetchPlayers()
    }
  }, [selectedSeason])

  const handleSeasonSelect = (season: string) => {
    setSelectedSeason(season)
    setSelectedPlayer(null)
    setSimilarPlayers([])
    setSeasonOpen(false)
  }

  const handlePlayerSelect = async (playerName: string) => {
    try {
      setIsLoading(true)
      setHasError(false)

      const player = availablePlayers.find(p => p.player === playerName)
      if (!player) return

      const response = await getSimilarPlayers(playerName, selectedSeason, 5)

      setSelectedPlayer(response.query_player)
      const queryPlayerSkills = calculateSkillRatings(response.query_player)
      setSelectedPlayerSkills(queryPlayerSkills)

      setSimilarPlayers(response.similar_players)

      const skillsMap = new Map<string, PlayerSkillRatings>()
      response.similar_players.forEach(player => {
        skillsMap.set(`${player.player} (${player.season})`, calculateSkillRatings(player.stats))
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

      data[`${selectedPlayer.player} (${selectedPlayer.season})`] = selectedPlayerSkills[category as keyof PlayerSkillRatings]

      similarPlayers.slice(0, 3).forEach(player => {
        const playerKey = `${player.player} (${player.season})`
        const skills = similarPlayersSkills.get(playerKey)
        if (skills) {
          data[playerKey] = skills[category as keyof PlayerSkillRatings]
        }
      })

      return data
    })
  }

  const getDetailedStats = (player: PlayerStats): DetailedStat[] => {
    return [
      {
        stat: translations('stats.ppg.abbr'),
        value: player.points_per_game,
        fullName: translations('stats.ppg.full')
      },
      {
        stat: translations('stats.rpg.abbr'),
        value: player.total_rebounds_per_game,
        fullName: translations('stats.rpg.full')
      },
      {
        stat: translations('stats.apg.abbr'),
        value: player.assists_per_game,
        fullName: translations('stats.apg.full')
      },
      {
        stat: translations('stats.spg.abbr'),
        value: player.steals_per_game,
        fullName: translations('stats.spg.full')
      },
      {
        stat: translations('stats.bpg.abbr'),
        value: player.blocks_per_game,
        fullName: translations('stats.bpg.full')
      },
      {
        stat: translations('stats.fg.abbr'),
        value: player.field_goal_percentage * 100,
        fullName: translations('stats.fg.full')
      },
    ]
  }

  const getPlayerPlayingStyles = (player: PlayerStats): string[] => {
    const styles: string[] = []

    if (player.points_per_game >= 20) {
      styles.push("Elite Scorer")
    } else if (player.points_per_game >= 15) {
      styles.push("Scorer")
    }

    if (player.assists_per_game >= 7) {
      styles.push("Elite Playmaker")
    } else if (player.assists_per_game >= 4) {
      styles.push("Playmaker")
    }

    if (player.total_rebounds_per_game >= 10) {
      styles.push("Elite Rebounder")
    } else if (player.total_rebounds_per_game >= 7) {
      styles.push("Rebounder")
    }

    const defensive_impact = player.steals_per_game + player.blocks_per_game
    if (defensive_impact >= 3) {
      styles.push("Elite Defender")
    } else if (defensive_impact >= 1.5) {
      styles.push("Defender")
    }

    if (player.field_goal_percentage >= 0.55) {
      styles.push("Efficient")
    }

    if (player.three_point_percentage >= 0.4 && player.three_point_attempts_per_game >= 3) {
      styles.push("Sharpshooter")
    } else if (player.three_point_percentage >= 0.35 && player.three_point_attempts_per_game >= 2) {
      styles.push("3PT Shooter")
    }

    if (player.position.includes("C")) {
      if (player.blocks_per_game >= 1.5) {
        styles.push("Rim Protector")
      }
    }

    if (player.position.includes("PG")) {
      if (player.assists_per_game >= 8) {
        styles.push("Floor General")
      }
    }

    if (styles.length === 0) {
      if (player.position.includes("G")) {
        styles.push("Guard")
      } else if (player.position.includes("F")) {
        styles.push("Forward")
      } else if (player.position.includes("C")) {
        styles.push("Center")
      } else {
        styles.push("Role Player")
      }
    }

    return styles
  }

  const playerColors = [
    "#3366CC", // Primary blue
    "#FF9933", // Orange
    "#33CC99", // Teal
    "#CC3366", // Magenta
  ]

  const formatSeasonDisplay = (season: string): string => {
    return season.replace('_', '/');
  }

  if (isLoading && availablePlayers.length === 0 && availableSeasons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">{translations('loading.data')}</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p className="text-lg mb-2">{translations('error.loadingData')}</p>
          <p>{errorMessage}</p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            {translations('error.retry')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-full max-w-md space-y-4">
          <div className="flex gap-4">
            <Popover open={seasonOpen} onOpenChange={setSeasonOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={seasonOpen}
                  className="w-1/3 justify-between bg-white dark:bg-slate-900 border-2 h-14 text-lg"
                  onClick={() => setSeasonOpen(!seasonOpen)}
                  disabled={isLoading || availableSeasons.length === 0}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                      {translations('loading.data')}
                    </span>
                  ) : (
                    formatSeasonDisplay(selectedSeason)
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                <Command>
                  <CommandList>
                    <CommandEmpty>{translations('player.notFound')}</CommandEmpty>
                    <CommandGroup heading={translations('season.seasonsHeading')}>
                      {availableSeasons.map((season) => (
                        <CommandItem
                          key={season}
                          value={season}
                          onSelect={(value) => handleSeasonSelect(value)}
                          className="cursor-pointer py-3"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-shrink-0",
                              selectedSeason === season ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span>{formatSeasonDisplay(season)}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-2/3 justify-between bg-white dark:bg-slate-900 border-2 h-14 text-lg"
                  onClick={() => setOpen(!open)}
                  disabled={isLoading || availablePlayers.length === 0}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                      {translations('loading.data')}
                    </span>
                  ) : selectedPlayer ? (
                    selectedPlayer.player
                  ) : (
                    translations('player.select')
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                <Command>
                  <CommandInput placeholder={translations('player.search')} className="h-12" />
                  <CommandList>
                    <CommandEmpty>{translations('player.notFound')}</CommandEmpty>
                    <CommandGroup heading={translations('player.playersHeading')}>
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
                          {isLoading ? translations('loading.players') : translations('player.noPlayers')}
                        </div>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
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
                      <TabsTrigger value="radar">{translations('charts.radar')}</TabsTrigger>
                      <TabsTrigger value="bar">{translations('charts.stats')}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{translations('player.similarPlayers')}</h3>
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
                              <p className="text-xs text-slate-400">{formatSeasonDisplay(player.season)}</p>
                            </div>
                            <Badge
                              className={`${
                                player.similarity_score > 0.9
                                  ? "bg-green-600"
                                  : player.similarity_score > 0.8
                                    ? "bg-blue-600"
                                    : "bg-orange-500"
                              }`}
                            >
                              {Math.round(player.similarity_score * 100)}%
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
                          name={`${selectedPlayer.player} (${formatSeasonDisplay(selectedPlayer.season)})`}
                          dataKey={`${selectedPlayer.player} (${selectedPlayer.season})`}
                          stroke={playerColors[0]}
                          fill={playerColors[0]}
                          fillOpacity={0.3}
                        />

                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Radar
                            key={player.player}
                            name={`${player.player} (${formatSeasonDisplay(player.season)})`}
                            dataKey={`${player.player} (${player.season})`}
                            stroke={playerColors[index + 1]}
                            fill={playerColors[index + 1]}
                            fillOpacity={0.3}
                          />
                        ))}

                        <Legend />
                        <RechartsTooltip />
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
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                          dataKey="value"
                          name={`${selectedPlayer.player} (${formatSeasonDisplay(selectedPlayer.season)})`}
                          fill={playerColors[0]}
                        />
                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Bar
                            key={player.player}
                            dataKey="value"
                            name={`${player.player} (${formatSeasonDisplay(player.season)})`}
                            fill={playerColors[index + 1]}
                          />
                        ))}
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
            <DialogDescription>
              {selectedPlayerForDetails?.stats.team} • {selectedPlayerForDetails && formatSeasonDisplay(selectedPlayerForDetails.season)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">{translations('player.similarityScore')}</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {selectedPlayerForDetails && (selectedPlayerForDetails.similarity_score * 100).toFixed(2)}%
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">{translations('player.playingStyle')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlayerForDetails && getPlayerPlayingStyles(selectedPlayerForDetails.stats).map((style) => (
                    <Badge key={style} variant="secondary" className="text-xs">
                      {translations(`playingStyles.${style.toLowerCase().replace(/\s+/g, '')}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Stats</h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedPlayerForDetails &&
                  getDetailedStats(selectedPlayerForDetails.stats).map((stat, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-center">
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="text-sm text-slate-500 cursor-help flex items-center justify-center gap-1">
                              {stat.stat}
                              <HelpCircle size={12} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{stat.fullName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="font-bold">{stat.value.toFixed(2)}</div>
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
