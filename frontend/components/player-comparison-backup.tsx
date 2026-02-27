"use client"

// Este archivo contiene las mejoras UI/UX aplicadas
// Cambios principales:
// 1. cursor-pointer en todas las cards clickeables
// 2. Mejores hover states con transiciones suaves (200ms)
// 3. Glassmorphism sutil en card principal
// 4. Micro-animaciones respetando prefers-reduced-motion
// 5. Mejor spacing y breathing room
// 6. Focus states más visibles para accesibilidad
// 7. Loading skeleton mejorado
// 8. Badges con diseño más pulido

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
import { Check, ChevronsUpDown, HelpCircle, X, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getAllPlayers, getSimilarPlayers, calculateSkillRatings, getSeasons } from "@/lib/api"
import { PlayerStats, SimilarPlayer, PlayerSkillRatings } from "@/types/player"
import { useTranslations } from 'next-intl'
import { BasketballLoader } from "@/components/BasketballLoader"

interface RadarDataPoint {
  category: string
  [key: string]: string | number
}

interface DetailedStat {
  stat: string
  value: number
  fullName: string
}

export function PlayerComparison() {
  const translations = useTranslations();
  const [open, setOpen] = useState(false)
  const [seasonOpen, setSeasonOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlayerLoading, setIsPlayerLoading] = useState(false)
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
  const [selectedSeason, setSelectedSeason] = useState<string>("2024_25")
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileDialog, setShowMobileDialog] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkIfMobile()
      window.addEventListener('resize', checkIfMobile)

      return () => {
        window.removeEventListener('resize', checkIfMobile)
      }
    }
  }, [])

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
      setIsPlayerLoading(true)
      setHasError(false)
      setOpen(false)

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
    } catch (error) {
      setHasError(true)
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch similar players")
      console.error('Error fetching similar players:', error)
    } finally {
      setIsPlayerLoading(false)
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
      const data: RadarDataPoint = { category: translations(`skills.${category}`) }

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
      styles.push("elite scorer")
    } else if (player.points_per_game >= 15) {
      styles.push("scorer")
    }

    if (player.assists_per_game >= 7) {
      styles.push("elite playmaker")
    } else if (player.assists_per_game >= 4) {
      styles.push("playmaker")
    }

    if (player.total_rebounds_per_game >= 10) {
      styles.push("elite rebounder")
    } else if (player.total_rebounds_per_game >= 7) {
      styles.push("rebounder")
    }

    const defensive_impact = player.steals_per_game + player.blocks_per_game
    if (defensive_impact >= 3) {
      styles.push("elite defender")
    } else if (defensive_impact >= 1.5) {
      styles.push("defender")
    }

    if (player.field_goal_percentage >= 0.55) {
      styles.push("efficient")
    }

    if (player.three_point_percentage >= 0.4 && player.three_point_attempts_per_game >= 3) {
      styles.push("sharpshooter")
    } else if (player.three_point_percentage >= 0.35 && player.three_point_attempts_per_game >= 2) {
      styles.push("three point shooter")
    }

    if (player.position.includes("C")) {
      if (player.blocks_per_game >= 1.5) {
        styles.push("rim protector")
      }
    }

    if (player.position.includes("PG")) {
      if (player.assists_per_game >= 8) {
        styles.push("floor general")
      }
    }

    if (styles.length === 0) {
      if (player.position.includes("G")) {
        styles.push("guard")
      } else if (player.position.includes("F")) {
        styles.push("forward")
      } else if (player.position.includes("C")) {
        styles.push("center")
      } else {
        styles.push("role player")
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
      <div className="flex items-center justify-center h-64 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
          <p className="text-base sm:text-lg">{translations('loading.data')}</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
        <div className="text-center text-red-500">
          <p className="text-base sm:text-lg mb-2">{translations('error.loadingData')}</p>
          <p className="text-sm sm:text-base">{errorMessage}</p>
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
    <div className="space-y-8 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
      {isPlayerLoading && <BasketballLoader />}

      <div className="flex flex-col items-center justify-center space-y-6 w-full">
        <div className="w-full max-w-2xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* SEASON SELECT - MEJORADO */}
            <div className="flex flex-col w-full md:w-1/3 gap-2">
              <label htmlFor="season-select" className="font-semibold text-sm ml-1 text-slate-700 dark:text-slate-300">
                {translations('season.label')}
              </label>
              <Popover open={seasonOpen} onOpenChange={setSeasonOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="season-select"
                    variant="outline"
                    role="combobox"
                    aria-expanded={seasonOpen}
                    className="w-full justify-between bg-white dark:bg-slate-900 border-2 hover:border-blue-400 h-12 sm:h-14 text-base sm:text-lg transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setSeasonOpen(!seasonOpen)}
                    disabled={isLoading || isPlayerLoading || availableSeasons.length === 0}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                        {translations('loading.data')}
                      </span>
                    ) : (
                      <span className="truncate font-medium">{formatSeasonDisplay(selectedSeason)}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-shrink-0" />
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
                            className="cursor-pointer py-3 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors duration-150"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 flex-shrink-0 transition-opacity duration-150",
                                selectedSeason === season ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="font-medium">{formatSeasonDisplay(season)}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* PLAYER SELECT - MEJORADO */}
            <div className="flex flex-col w-full md:w-2/3 gap-2">
              <label htmlFor="player-select" className="font-semibold text-sm ml-1 text-slate-700 dark:text-slate-300">
                {translations('player.label')}
              </label>
              {isMobile ? (
                <>
                  <Button
                    id="player-select"
                    variant="outline"
                    className="w-full justify-between bg-white dark:bg-slate-900 border-2 hover:border-blue-400 h-12 sm:h-14 text-base sm:text-lg transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setShowMobileDialog(true)}
                    disabled={isLoading || isPlayerLoading || availablePlayers.length === 0}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                        {translations('loading.data')}
                      </span>
                    ) : selectedPlayer ? (
                      <span className="truncate font-medium">{selectedPlayer.player}</span>
                    ) : (
                      <span className="truncate text-slate-500">{translations('player.select')}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-shrink-0" />
                  </Button>

                  <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
                    <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-0">
                      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b">
                        <h2 className="text-xl font-semibold">{translations('player.select')}</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowMobileDialog(false)}
                          className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </div>
                      <Command className="rounded-t-none">
                        <CommandInput placeholder={translations('player.search')} className="h-12" />
                        <CommandList className="max-h-[60vh] overflow-y-auto">
                          <CommandEmpty>{translations('player.notFound')}</CommandEmpty>
                          <CommandGroup heading={translations('player.playersHeading')}>
                            {availablePlayers && availablePlayers.length > 0 ? (
                              availablePlayers.map((player) => (
                                <CommandItem
                                  key={player.player_id || player.player}
                                  value={player.player}
                                  onSelect={(value) => {
                                    handlePlayerSelect(value);
                                    setShowMobileDialog(false);
                                  }}
                                  className="cursor-pointer py-3 flex items-center hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors duration-150"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 flex-shrink-0 transition-opacity duration-150",
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
                              ))
                            ) : (
                              <div className="p-4 text-center text-sm text-slate-500">
                                {isLoading ? translations('loading.players') : translations('player.noPlayers')}
                              </div>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <Popover open={open && !isPlayerLoading} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="player-select"
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-white dark:bg-slate-900 border-2 hover:border-blue-400 h-12 sm:h-14 text-base sm:text-lg transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setOpen(!open)}
                      disabled={isLoading || isPlayerLoading || availablePlayers.length === 0}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                          {translations('loading.data')}
                        </span>
                      ) : selectedPlayer ? (
                        <span className="truncate font-medium">{selectedPlayer.player}</span>
                      ) : (
                        <span className="truncate text-slate-500">{translations('player.select')}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="player-select-popover w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                    <div className="md:hidden sticky top-0 z-10 py-2 px-4 bg-white dark:bg-slate-900 border-b flex items-center justify-between">
                      <h2 className="text-lg font-medium">{translations('player.select')}</h2>
                      <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                    <Command>
                      <CommandInput placeholder={translations('player.search')} className="h-12" />
                      <CommandList className="md:max-h-[300px] max-h-[60vh]">
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
                                  className="cursor-pointer py-3 flex items-center hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors duration-150"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 flex-shrink-0 transition-opacity duration-150",
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
              )}
            </div>
          </div>
        </div>

        {selectedPlayer && !isPlayerLoading && (
          <div className="w-full">
            {/* CARD PRINCIPAL CON GLASSMORPHISM SUTIL */}
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-xl border-0 ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader className="p-6 sm:p-8">
                <div className="flex justify-between items-start flex-wrap gap-6">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
                      {selectedPlayer.player}
                      <Badge className="ml-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-150 px-3 py-1">{selectedPlayer.position}</Badge>
                    </CardTitle>
                    <CardDescription className="text-lg">{selectedPlayer.team} • {formatSeasonDisplay(selectedPlayer.season)}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPlayer(null);
                        setSimilarPlayers([]);
                      }}
                      className="hidden sm:flex hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                    >
                      {translations('player.backToSelection')}
                    </Button>
                    <Tabs defaultValue="radar" className="w-[200px]" onValueChange={setChartType}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="radar" className="transition-all duration-150">{translations('charts.radar')}</TabsTrigger>
                        <TabsTrigger value="bar" className="transition-all duration-150">{translations('charts.stats')}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlayer(null);
                    setSimilarPlayers([]);
                  }}
                  className="mt-4 w-full sm:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                >
                  {translations('player.backToSelection')}
                </Button>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold">{translations('player.similarPlayers')}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {similarPlayers.map((player, index) => (
                      <Card
                        key={player.player}
                        className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-2 hover:border-blue-400 group"
                        onClick={() => handlePlayerClick(player)}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1 min-w-0 pr-3">
                              <p className="font-bold text-base mb-1 truncate group-hover:text-blue-600 transition-colors duration-150">{player.player}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{player.stats.team}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{formatSeasonDisplay(player.season)}</p>
                            </div>
                            <Badge
                              className={`${
                                player.similarity_score > 0.9
                                  ? "bg-emerald-500 hover:bg-emerald-600"
                                  : player.similarity_score > 0.8
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-amber-500 hover:bg-amber-600"
                              } text-sm font-bold px-2.5 py-1 flex-shrink-0 transition-colors duration-150`}
                            >
                              {Math.round(player.similarity_score * 100)}%
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="h-[320px] sm:h-[420px] mt-8">
                  {chartType === "radar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={getRadarData()}
                        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                        outerRadius={isMobile ? "65%" : "70%"}
                      >
                        <PolarGrid gridType="circle" stroke="#e2e8f0" />
                        <PolarAngleAxis
                          dataKey="category"
                          tick={{
                            fontSize: isMobile ? 12 : 14,
                            fill: "currentColor",
                            fontWeight: 600
                          }}
                          tickLine={false}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickCount={5}
                          axisLine={false}
                        />

                        <Radar
                          name={`${selectedPlayer.player} (${formatSeasonDisplay(selectedPlayer.season)})`}
                          dataKey={`${selectedPlayer.player} (${selectedPlayer.season})`}
                          stroke={playerColors[0]}
                          fill={playerColors[0]}
                          fillOpacity={0.3}
                          strokeWidth={2.5}
                        />

                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Radar
                            key={player.player}
                            name={`${player.player} (${formatSeasonDisplay(player.season)})`}
                            dataKey={`${player.player} (${player.season})`}
                            stroke={playerColors[index + 1]}
                            fill={playerColors[index + 1]}
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        ))}

                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            fontSize: isMobile ? 10 : 12,
                            paddingTop: 20
                          }}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            fontSize: isMobile ? 10 : 12,
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getDetailedStats(selectedPlayer)}
                        margin={isMobile ? { top: 5, right: 5, left: 5, bottom: 65 } : { top: 20, right: 20, left: 0, bottom: 5 }}
                        layout="horizontal"
                        barSize={isMobile ? 14 : 24}
                        barGap={isMobile ? 3 : 6}
                        barCategoryGap={isMobile ? 8 : 12}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="stat"
                          tick={{ fontSize: isMobile ? 10 : 13, fontWeight: 600 }}
                          tickLine={!isMobile}
                          height={isMobile ? 20 : 30}
                        />
                        <YAxis
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickLine={!isMobile}
                          width={isMobile ? 28 : 45}
                          domain={[0, 'auto']}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            fontSize: isMobile ? 10 : 12,
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                          formatter={(value, name) => {
                            const nameStr = String(name);
                            return [`${Number(value).toFixed(1)}`, nameStr.includes(' (') ? nameStr.split(' (')[0] : nameStr];
                          }}
                          labelFormatter={(label) => {
                            const stat = getDetailedStats(selectedPlayer).find(s => s.stat === label);
                            return stat ? stat.fullName : String(label);
                          }}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            fontSize: isMobile ? 8 : 12,
                            paddingTop: 5,
                            bottom: 0,
                            lineHeight: "1.2em"
                          }}
                          iconSize={isMobile ? 10 : 14}
                          formatter={(value) => {
                            if (isMobile && typeof value === 'string') {
                              const name = value.split(' (')[0];
                              return name.length > 10 ? name.substring(0, 10) + '...' : name;
                            }
                            return value;
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name={`${selectedPlayer.player} (${formatSeasonDisplay(selectedPlayer.season)})`}
                          fill={playerColors[0]}
                          radius={[4, 4, 0, 0]}
                        />
                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Bar
                            key={player.player}
                            dataKey="value"
                            name={`${player.player} (${formatSeasonDisplay(player.season)})`}
                            fill={playerColors[index + 1]}
                            radius={[4, 4, 0, 0]}
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

      {/* DIALOG DE DETALLES MEJORADO */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[540px] p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              {selectedPlayerForDetails?.player}
              <Badge className="bg-blue-600 hover:bg-blue-700 transition-colors duration-150 px-3 py-1">{selectedPlayerForDetails?.position}</Badge>
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {selectedPlayerForDetails?.stats.team} • {selectedPlayerForDetails && formatSeasonDisplay(selectedPlayerForDetails.season)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">{translations('player.similarityScore')}</h4>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {selectedPlayerForDetails && (selectedPlayerForDetails.similarity_score * 100).toFixed(1)}%
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">{translations('player.playingStyle')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlayerForDetails && getPlayerPlayingStyles(selectedPlayerForDetails.stats).map((style) => (
                    <Badge key={style} variant="secondary" className="text-xs font-medium px-2 py-1">
                      {translations(`playingStyles.${style.replace(/\s+/g, '')}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">{translations('player.keyStats')}</h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedPlayerForDetails &&
                  getDetailedStats(selectedPlayerForDetails.stats).map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 p-3 rounded-lg text-center hover:shadow-md transition-shadow duration-150">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">
                        {stat.stat}
                        {isMobile ? (
                          <div className="text-xs opacity-70 mt-1">
                            {stat.fullName}
                          </div>
                        ) : (
                          <TooltipProvider>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger asChild>
                                <span className="cursor-help inline-flex items-center ml-1">
                                  <HelpCircle size={12} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{stat.fullName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{stat.value.toFixed(1)}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full hover:shadow-lg transition-all duration-200" onClick={() => setShowDetailsDialog(false)}>
                {translations('player.close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media (max-width: 768px) {
          .player-select-popover {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            transform: none !important;
            border-radius: 0 !important;
          }
        }

        /* Respetar prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
