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
import { Check, ChevronsUpDown, HelpCircle, X, TrendingUp, BarChart3, Target } from "lucide-react"
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
    "#1E40AF",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
  ]

  const formatSeasonDisplay = (season: string): string => {
    return season.replace('_', '/');
  }

  if (isLoading && availablePlayers.length === 0 && availableSeasons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{translations('loading.data')}</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <p className="text-lg font-semibold mb-2">{translations('error.loadingData')}</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700"
            >
              {translations('error.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {isPlayerLoading && <BasketballLoader />}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,64,175,0.08),transparent_50%)] pointer-events-none" />

      <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
            <BarChart3 className="h-4 w-4" />
            NBA Analytics Platform
          </div>
        </div>

        <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto">
              <div className="flex flex-col w-full md:w-2/5 gap-2">
                <label htmlFor="season-select" className="font-bold text-sm text-blue-900 dark:text-blue-100 uppercase tracking-wide flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {translations('season.label')}
                </label>
                <Popover open={seasonOpen} onOpenChange={setSeasonOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="season-select"
                      variant="outline"
                      role="combobox"
                      aria-expanded={seasonOpen}
                      className="w-full justify-between bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-950/20 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 h-14 text-base font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer"
                      onClick={() => setSeasonOpen(!seasonOpen)}
                      disabled={isLoading || isPlayerLoading || availableSeasons.length === 0}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></span>
                          {translations('loading.data')}
                        </span>
                      ) : (
                        <span className="truncate text-blue-900 dark:text-blue-100">{formatSeasonDisplay(selectedSeason)}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-blue-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                    <Command>
                      <CommandList>
                        <CommandEmpty>{translations('player.notFound')}</CommandEmpty>
                        <CommandGroup>
                          {availableSeasons.map((season) => (
                            <CommandItem
                              key={season}
                              value={season}
                              onSelect={(value) => handleSeasonSelect(value)}
                              className="cursor-pointer py-3 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-150"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-blue-600",
                                  selectedSeason === season ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="font-semibold">{formatSeasonDisplay(season)}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col w-full md:w-3/5 gap-2">
                <label htmlFor="player-select" className="font-bold text-sm text-blue-900 dark:text-blue-100 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {translations('player.label')}
                </label>
                {isMobile ? (
                  <>
                    <Button
                      id="player-select"
                      variant="outline"
                      className="w-full justify-between bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-950/20 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 h-14 text-base font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer"
                      onClick={() => setShowMobileDialog(true)}
                      disabled={isLoading || isPlayerLoading || availablePlayers.length === 0}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></span>
                          {translations('loading.data')}
                        </span>
                      ) : selectedPlayer ? (
                        <span className="truncate text-amber-900 dark:text-amber-100">{selectedPlayer.player}</span>
                      ) : (
                        <span className="truncate text-slate-500">{translations('player.select')}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-amber-600" />
                    </Button>

                    <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
                      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-0">
                        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b">
                          <h2 className="text-xl font-bold">{translations('player.select')}</h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowMobileDialog(false)}
                            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Command>
                          <CommandInput placeholder={translations('player.search')} className="h-12" />
                          <CommandList className="max-h-[60vh]">
                            <CommandEmpty>{translations('player.notFound')}</CommandEmpty>
                            <CommandGroup>
                              {availablePlayers.map((player) => (
                                <CommandItem
                                  key={player.player_id || player.player}
                                  value={player.player}
                                  onSelect={(value) => {
                                    handlePlayerSelect(value);
                                    setShowMobileDialog(false);
                                  }}
                                  className="cursor-pointer py-3 hover:bg-amber-100 dark:hover:bg-amber-950/30"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 text-amber-600",
                                      selectedPlayer?.player === player.player ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <span className="flex flex-col">
                                    <span className="font-semibold">{player.player}</span>
                                    <span className="text-sm text-muted-foreground">{player.team} • {player.position}</span>
                                  </span>
                                </CommandItem>
                              ))}
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
                        className="w-full justify-between bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-950/20 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 h-14 text-base font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer"
                        onClick={() => setOpen(!open)}
                        disabled={isLoading || isPlayerLoading || availablePlayers.length === 0}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></span>
                            {translations('loading.data')}
                          </span>
                        ) : selectedPlayer ? (
                          <span className="truncate text-amber-900 dark:text-amber-100">{selectedPlayer.player}</span>
                        ) : (
                          <span className="truncate text-slate-500">{translations('player.select')}</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-amber-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                      <Command>
                        <CommandInput placeholder={translations('player.search')} className="h-12" />
                        <CommandList className="max-h-[400px]">
                          <CommandEmpty>{translations('player.notFound')}</CommandEmpty>
                          <CommandGroup>
                            {availablePlayers.map((player) => (
                              <CommandItem
                                key={player.player_id || player.player}
                                value={player.player}
                                onSelect={(value) => handlePlayerSelect(value)}
                                className="cursor-pointer py-3 hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors duration-150"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 text-amber-600",
                                    selectedPlayer?.player === player.player ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="flex flex-col">
                                  <span className="font-semibold">{player.player}</span>
                                  <span className="text-sm text-muted-foreground">{player.team} • {player.position}</span>
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedPlayer && !isPlayerLoading && (
          <>
            <Card className="backdrop-blur-xl bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-slate-900/95 dark:to-blue-950/50 border-0 shadow-2xl mb-6">
              <CardHeader className="p-6 sm:p-8 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl sm:text-4xl font-black text-blue-900 dark:text-blue-100">
                        {selectedPlayer.player}
                      </CardTitle>
                      <Badge className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm font-bold">
                        {selectedPlayer.position}
                      </Badge>
                    </div>
                    <CardDescription className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                      {selectedPlayer.team} • {formatSeasonDisplay(selectedPlayer.season)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPlayer(null);
                        setSimilarPlayers([]);
                      }}
                      className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold"
                    >
                      {translations('player.backToSelection')}
                    </Button>
                    <Tabs defaultValue="radar" className="w-[220px]" onValueChange={setChartType}>
                      <TabsList className="grid w-full grid-cols-2 bg-blue-100 dark:bg-blue-950/50">
                        <TabsTrigger
                          value="radar"
                          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold"
                        >
                          {translations('charts.radar')}
                        </TabsTrigger>
                        <TabsTrigger
                          value="bar"
                          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold"
                        >
                          {translations('charts.stats')}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="h-[380px] sm:h-[480px]">
                  {chartType === "radar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={getRadarData()}
                        margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                        outerRadius={isMobile ? "60%" : "65%"}
                      >
                        <PolarGrid gridType="circle" stroke="#cbd5e1" strokeWidth={1.5} />
                        <PolarAngleAxis
                          dataKey="category"
                          tick={{
                            fontSize: isMobile ? 13 : 15,
                            fill: "currentColor",
                            fontWeight: 700
                          }}
                          tickLine={false}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fontSize: isMobile ? 11 : 13, fontWeight: 600 }}
                          tickCount={6}
                          axisLine={false}
                        />

                        <Radar
                          name={`${selectedPlayer.player} (${formatSeasonDisplay(selectedPlayer.season)})`}
                          dataKey={`${selectedPlayer.player} (${selectedPlayer.season})`}
                          stroke={playerColors[0]}
                          fill={playerColors[0]}
                          fillOpacity={0.4}
                          strokeWidth={3}
                        />

                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Radar
                            key={player.player}
                            name={`${player.player} (${formatSeasonDisplay(player.season)})`}
                            dataKey={`${player.player} (${player.season})`}
                            stroke={playerColors[index + 1]}
                            fill={playerColors[index + 1]}
                            fillOpacity={0.25}
                            strokeWidth={2.5}
                          />
                        ))}

                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            fontSize: isMobile ? 11 : 13,
                            fontWeight: 600,
                            paddingTop: 24
                          }}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            fontSize: isMobile ? 11 : 13,
                            fontWeight: 600,
                            borderRadius: '12px',
                            border: '2px solid #3b82f6',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.98)'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getDetailedStats(selectedPlayer)}
                        margin={isMobile ? { top: 10, right: 10, left: -10, bottom: 70 } : { top: 20, right: 30, left: 10, bottom: 10 }}
                        barSize={isMobile ? 16 : 28}
                        barGap={isMobile ? 4 : 8}
                        barCategoryGap={isMobile ? 10 : 16}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth={1.5} />
                        <XAxis
                          dataKey="stat"
                          tick={{ fontSize: isMobile ? 11 : 14, fontWeight: 700 }}
                          tickLine={true}
                          height={isMobile ? 24 : 35}
                        />
                        <YAxis
                          tick={{ fontSize: isMobile ? 11 : 13, fontWeight: 600 }}
                          tickLine={true}
                          width={isMobile ? 32 : 50}
                          domain={[0, 'auto']}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            fontSize: isMobile ? 11 : 13,
                            fontWeight: 600,
                            borderRadius: '12px',
                            border: '2px solid #3b82f6',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.98)'
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
                            fontSize: isMobile ? 9 : 13,
                            fontWeight: 600,
                            paddingTop: 8
                          }}
                          iconSize={isMobile ? 12 : 16}
                          formatter={(value) => {
                            if (isMobile && typeof value === 'string') {
                              const name = value.split(' (')[0];
                              return name.length > 12 ? name.substring(0, 12) + '...' : name;
                            }
                            return value;
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name={`${selectedPlayer.player} (${formatSeasonDisplay(selectedPlayer.season)})`}
                          fill={playerColors[0]}
                          radius={[6, 6, 0, 0]}
                        />
                        {similarPlayers.slice(0, 3).map((player, index) => (
                          <Bar
                            key={player.player}
                            dataKey="value"
                            name={`${player.player} (${formatSeasonDisplay(player.season)})`}
                            fill={playerColors[index + 1]}
                            radius={[6, 6, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-1 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {translations('player.similarPlayers')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {similarPlayers.map((player, index) => (
                  <Card
                    key={player.player}
                    className="cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-slate-200 hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-600 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden group"
                    onClick={() => handlePlayerClick(player)}
                    style={{
                      animationDelay: `${index * 75}ms`,
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="font-black text-lg mb-2 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                            {player.player}
                          </p>
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 truncate mb-1">
                            {player.stats.team}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {formatSeasonDisplay(player.season)}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            player.similarity_score > 0.9
                              ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                              : player.similarity_score > 0.8
                                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                          } text-base font-black px-3 py-1.5 shadow-lg transition-all duration-200`}
                        >
                          {Math.round(player.similarity_score * 100)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t-2 border-slate-100 dark:border-slate-800">
                        <div className="text-center">
                          <p className="text-xs font-semibold text-slate-500 uppercase">PTS</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white">
                            {player.stats.points_per_game.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-slate-500 uppercase">REB</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white">
                            {player.stats.total_rebounds_per_game.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-slate-500 uppercase">AST</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white">
                            {player.stats.assists_per_game.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-3xl font-black">
                  {selectedPlayerForDetails?.player}
                </DialogTitle>
                <Badge className="bg-white text-blue-900 hover:bg-blue-50 px-3 py-1 text-sm font-bold">
                  {selectedPlayerForDetails?.position}
                </Badge>
              </div>
              <DialogDescription className="text-blue-100 text-lg font-semibold">
                {selectedPlayerForDetails?.stats.team} • {selectedPlayerForDetails && formatSeasonDisplay(selectedPlayerForDetails.season)}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  {translations('player.similarityScore')}
                </h4>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                  {selectedPlayerForDetails && (selectedPlayerForDetails.similarity_score * 100).toFixed(1)}%
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  {translations('player.playingStyle')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlayerForDetails && getPlayerPlayingStyles(selectedPlayerForDetails.stats).map((style) => (
                    <Badge key={style} className="bg-amber-500 hover:bg-amber-600 text-xs font-bold px-2 py-1">
                      {translations(`playingStyles.${style.replace(/\s+/g, '')}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">
                {translations('player.keyStats')}
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {selectedPlayerForDetails &&
                  getDetailedStats(selectedPlayerForDetails.stats).map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-4 rounded-xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-2 border-slate-200 dark:border-slate-700"
                    >
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                        {stat.stat}
                        {isMobile ? (
                          <div className="text-[10px] opacity-70 mt-1 normal-case">
                            {stat.fullName}
                          </div>
                        ) : (
                          <TooltipProvider>
                            <Tooltip delayDuration={200}>
                              <TooltipTrigger asChild>
                                <span className="cursor-help inline-flex items-center ml-1">
                                  <HelpCircle size={12} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-semibold">{stat.fullName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="font-black text-2xl text-slate-900 dark:text-white">
                        {stat.value.toFixed(1)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-base shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setShowDetailsDialog(false)}
            >
              {translations('player.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700;800;900&display=swap');

        body {
          font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Fira Code', 'Courier New', monospace;
          letter-spacing: -0.02em;
        }

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
