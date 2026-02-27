"use client"

import { useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useTranslations } from "next-intl"
import { getPlayerClusters, getSeasons } from "@/lib/api"
import { ClusteringResult, ClusteringVisualizationData, PlayerCluster } from "@/types/cluster"
import { ForceDirectedGraph } from "./force-directed-graph"
import { BasketballLoader } from "./BasketballLoader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { PlayerStats } from "@/types/player"

export function PlayerClustering() {
  const translations = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const graphContainerRef = useRef<HTMLDivElement>(null)

  const [availableSeasons, setAvailableSeasons] = useState<string[]>([])
  const [selectedSeason, setSelectedSeason] = useState("2023_24")
  const [numClusters, setNumClusters] = useState(4)
  const [clusteringData, setClusteringData] = useState<ClusteringResult | null>(null)
  const [visualizationData, setVisualizationData] = useState<ClusteringVisualizationData | null>(null)
  const [containerWidth, setContainerWidth] = useState(600)
  const [containerHeight, setContainerHeight] = useState(350)

  // Update container dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (graphContainerRef.current) {
        setContainerWidth(graphContainerRef.current.clientWidth || 600)
        setContainerHeight(graphContainerRef.current.clientHeight || 350)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // Fetch available seasons
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
  }, [])

  // Fetch clusters when season or numClusters changes
  useEffect(() => {
    const fetchClusters = async () => {
      if (!selectedSeason) return

      try {
        setIsLoading(true)
        setHasError(false)

        const data = await getPlayerClusters(selectedSeason, numClusters)
        setClusteringData(data)

        // Process data for visualization
        const nodes = data.clusters.flatMap(cluster =>
          cluster.players.map(player => ({
            id: `${player.player}-${player.season}`,
            name: player.player,
            team: player.team,
            position: player.position,
            cluster: cluster.cluster_id,
            stats: player,
            radius: calculateNodeRadius(player)
          }))
        )

        // Create links between nodes in the same cluster
        // Only create links between nodes in the same cluster and limit the number of links
        const links = []
        for (const cluster of data.clusters) {
          const clusterPlayers = cluster.players

          for (let i = 0; i < clusterPlayers.length; i++) {
            const sourcePlayer = clusterPlayers[i]
            const sourceId = `${sourcePlayer.player}-${sourcePlayer.season}`

            // Create more links for better connectivity
            // Connect each node to multiple others in its cluster
            const maxLinks = Math.min(5, Math.floor(clusterPlayers.length / 2))

            // Connect to nearby nodes
            for (let j = 1; j <= maxLinks; j++) {
              const targetIndex = (i + j) % clusterPlayers.length
              const targetPlayer = clusterPlayers[targetIndex]
              const targetId = `${targetPlayer.player}-${targetPlayer.season}`

              links.push({
                source: sourceId,
                target: targetId,
                value: 1
              })
            }

            // Add some cross-cluster links for players with similar positions
            if (i % 3 === 0 && data.clusters.length > 1) {
              const otherCluster = data.clusters.find(c => c.cluster_id !== cluster.cluster_id)
              if (otherCluster && otherCluster.players.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherCluster.players.length)
                const targetPlayer = otherCluster.players[randomIndex]
                if (sourcePlayer.position === targetPlayer.position) {
                  links.push({
                    source: sourceId,
                    target: `${targetPlayer.player}-${targetPlayer.season}`,
                    value: 0.5 // Weaker connection for cross-cluster links
                  })
                }
              }
            }
          }
        }

        setVisualizationData({ nodes, links })
      } catch (error) {
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : "Failed to fetch player clusters")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClusters()
  }, [selectedSeason, numClusters])

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(value)
  }

  const formatSeasonDisplay = (season: string): string => {
    return season.replace('_', '/')
  }

  const calculateNodeRadius = (player: PlayerStats) => {
    // Base radius - using smaller values for a more compact visualization
    const baseRadius = 2.5

    // Adjust based on points per game (scoring stars are more prominent)
    const ppgBonus = player.points_per_game / 30

    // Adjust based on minutes per game (more playing time = more important)
    const mpgBonus = player.minutes_per_game / 60

    return Math.max(2, Math.min(4, baseRadius + ppgBonus + mpgBonus))
  }

  const renderClusterDetails = (cluster: PlayerCluster, index: number) => {
    const isSelected = index === 0
    const clusterColor = [
      "#3366CC", "#DC3912", "#FF9900", "#109618",
      "#990099", "#0099C6", "#DD4477", "#66AA00"
    ][cluster.cluster_id % 8]

    return (
      <div
        key={cluster.cluster_id}
        className={`p-3 rounded-lg border ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 hover:border-blue-200 dark:border-gray-700'}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: clusterColor }}
          ></div>
          <h3 className="font-medium">
            {translations('clustering.cluster')} {cluster.cluster_id}
          </h3>
          <Badge variant="outline" className="ml-auto">
            {cluster.players.length} {translations('clustering.players')}
          </Badge>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {cluster.players.length > 0 && (
            <ul className="list-disc list-inside">
              {cluster.players.slice(0, 5).map(player => (
                <li key={player.player}>
                  {player.player} ({player.team})
                </li>
              ))}
              {cluster.players.length > 5 && (
                <li className="italic">
                  {translations('clustering.andXMore', { count: cluster.players.length - 5 })}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
            {translations('season.label')}
          </label>
          <Select value={selectedSeason} onValueChange={handleSeasonChange} disabled={isLoading || availableSeasons.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={translations('season.select')} />
            </SelectTrigger>
            <SelectContent>
              {availableSeasons.map(season => (
                <SelectItem key={season} value={season}>
                  {formatSeasonDisplay(season)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
            {translations('clustering.numClusters')}
          </label>
          <div className="flex items-center gap-4">
            <Slider
              value={[numClusters]}
              min={2}
              max={8}
              step={1}
              onValueChange={(value: number[]) => setNumClusters(value[0])}
              className="flex-1"
              disabled={isLoading}
            />
            <span className="w-8 text-center font-medium">{numClusters}</span>
          </div>
        </div>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && <BasketballLoader />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>{translations('clustering.visualization')}</CardTitle>
              <CardDescription>{translations('clustering.visualizationDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={graphContainerRef}
                className="relative h-[350px] w-full"
              >
                {!isLoading && visualizationData ? (
                  <ForceDirectedGraph
                    data={visualizationData}
                    height={containerHeight}
                    width={containerWidth}
                  />
                ) : !isLoading && !hasError ? (
                  <div className="h-full w-full bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                    <p className="text-slate-500">{translations('clustering.visualizationPlaceholder')}</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>{translations('clustering.details')}</CardTitle>
              <CardDescription>{translations('clustering.detailsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-auto">
                {clusteringData?.clusters.map(renderClusterDetails)}

                {(!clusteringData?.clusters || clusteringData.clusters.length === 0) && !isLoading && (
                  <div className="text-center text-slate-500 py-4">
                    {translations('clustering.noClustersFound')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
