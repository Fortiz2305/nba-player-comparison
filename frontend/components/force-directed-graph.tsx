"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ClusteringVisualizationData } from '@/types/cluster'
import { useTranslations } from 'next-intl'
import { PlayerStats } from '@/types/player'

interface ForceDirectedGraphProps {
  data: ClusteringVisualizationData
  height: number
  width: number
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  team: string
  position: string
  cluster: number
  stats: PlayerStats
  radius: number
}

export function ForceDirectedGraph({ data, height, width }: ForceDirectedGraphProps) {
  const translations = useTranslations()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || !data.nodes.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const containerWidth = width
    const containerHeight = height

    // Color schemes
    const clusterColors = [
      "#3366CC", // Blue
      "#DC3912", // Red
      "#FF9900", // Orange
      "#109618", // Green
      "#990099", // Purple
      "#0099C6", // Teal
      "#DD4477", // Pink
      "#66AA00", // Lime
    ]

    const positionColors: Record<string, string> = {
      "C": "#E57373", // Centers - Red
      "PF": "#FFB74D", // Power Forwards - Orange
      "SF": "#FFF176", // Small Forwards - Yellow
      "SG": "#81C784", // Shooting Guards - Green
      "PG": "#64B5F6", // Point Guards - Blue
      "G": "#7986CB", // Guards - Indigo
      "F": "#BA68C8", // Forwards - Purple
      "F-C": "#A1887F", // Forward-Centers - Brown
      "G-F": "#90A4AE", // Guard-Forwards - Gray
    }

    const getPositionColor = (position: string): string => {
      for (const [key, value] of Object.entries(positionColors)) {
        if (position.includes(key)) {
          return value
        }
      }
      return "#BDBDBD" // Default gray
    }

    // Convert visualization nodes to simulation nodes
    const simulationNodes: SimulationNode[] = data.nodes.map(node => ({
      id: node.id,
      name: node.name,
      team: node.team,
      position: node.position,
      cluster: node.cluster,
      stats: node.stats,
      radius: node.radius,
    }))

    // Get unique clusters
    const uniqueClusters = Array.from(new Set(simulationNodes.map(n => n.cluster))).sort((a, b) => a - b)

    // Create cluster centers for each cluster
    const clusters = new Map()
    uniqueClusters.forEach(clusterId => {
      // Position clusters in a circular pattern
      const angle = (clusterId / uniqueClusters.length) * 2 * Math.PI
      const centerX = containerWidth / 2 + Math.cos(angle) * (containerWidth * 0.3)
      const centerY = containerHeight / 2 + Math.sin(angle) * (containerHeight * 0.3)

      clusters.set(clusterId, { x: centerX, y: centerY })
    })

    // Use a smaller collision radius for a more compact visualization
    const simulation = d3.forceSimulation<SimulationNode>(simulationNodes)
      .force("link", d3.forceLink<SimulationNode, d3.SimulationLinkDatum<SimulationNode>>(data.links as d3.SimulationLinkDatum<SimulationNode>[])
        .id(d => d.id)
        .distance(d => {
          // Shorter distances for links within the same cluster
          const source = typeof d.source === 'object' ? d.source : null
          const target = typeof d.target === 'object' ? d.target : null
          if (source && target && source.cluster === target.cluster) {
            return 10 // Shorter distance for same cluster
          }
          return 50 // Longer distance for inter-cluster links
        })
      )
      .force("charge", d3.forceManyBody().strength(-20)) // Weaker repulsion
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2).strength(0.1))
      .force("collision", d3.forceCollide<SimulationNode>().radius(d => d.radius * 0.8))

      // Add cluster-specific forces to pull nodes toward their cluster center
      .force("cluster", alpha => {
        for (const node of simulationNodes) {
          const cluster = clusters.get(node.cluster)
          if (cluster && node.x && node.y) {
            node.vx = (node.vx || 0) + (cluster.x - node.x) * alpha * 0.5
            node.vy = (node.vy || 0) + (cluster.y - node.y) * alpha * 0.5
          }
        }
      })
      .force("x", d3.forceX<SimulationNode>(d => clusters.get(d.cluster)?.x || containerWidth / 2).strength(0.2))
      .force("y", d3.forceY<SimulationNode>(d => clusters.get(d.cluster)?.y || containerHeight / 2).strength(0.2))

    const container = svg.append("g")

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform)
      })

    svg.call(zoom)

    // Initialize with a slight zoom out to show everything
    svg.call(zoom.transform, d3.zoomIdentity.scale(0.85).translate(containerWidth * 0.075, containerHeight * 0.075))

    // Create a group for the links
    const link = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", d => Math.sqrt(d.value || 1))

    // Create node groups
    const nodeGroup = container.append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, SimulationNode>(".node")
      .data(simulationNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, SimulationNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )

    // Add circles to node groups
    nodeGroup.append("circle")
      .attr("r", d => Math.min(d.radius || 4, 6))
      .attr("fill", d => clusterColors[d.cluster % clusterColors.length])
      .attr("stroke", d => getPositionColor(d.position))
      .attr("stroke-width", 1.5)

    // Create a group for the legend
    const legendG = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${containerWidth - 160}, 10)`)

    // Add rectangular background for the legend
    legendG.append("rect")
      .attr("width", 150)
      .attr("height", 120)
      .attr("fill", "white")
      .attr("opacity", 0.8)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)

    // Add legend title
    legendG.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("font-weight", "bold")
      .attr("font-size", "10px")
      .text(translations('clustering.legend'))

    // Add cluster legend
    const clusterLegend = legendG.append("g")
      .attr("transform", "translate(10, 30)")

    uniqueClusters.forEach((cluster, i) => {
      const g = clusterLegend.append("g")
        .attr("transform", `translate(0, ${i * 12})`)

      g.append("circle")
        .attr("r", 4)
        .attr("fill", clusterColors[cluster % clusterColors.length])

      g.append("text")
        .attr("x", 8)
        .attr("y", 3)
        .attr("font-size", "8px")
        .text(`${translations('clustering.cluster')} ${cluster}`)
    })

    // Add position legend
    const positionLegend = legendG.append("g")
      .attr("transform", `translate(80, 30)`)

    // Select main positions to avoid overcrowding
    const mainPositions = ["PG", "SG", "SF", "PF", "C"] as const

    mainPositions.forEach((pos, i) => {
      const g = positionLegend.append("g")
        .attr("transform", `translate(0, ${i * 12})`)

      g.append("circle")
        .attr("r", 4)
        .attr("fill", "white")
        .attr("stroke", positionColors[pos])
        .attr("stroke-width", 1.5)

      g.append("text")
        .attr("x", 8)
        .attr("y", 3)
        .attr("font-size", "8px")
        .text(pos)
    })

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => {
          const source = typeof d.source === 'string' ? null : d.source
          return source?.x || 0
        })
        .attr("y1", d => {
          const source = typeof d.source === 'string' ? null : d.source
          return source?.y || 0
        })
        .attr("x2", d => {
          const target = typeof d.target === 'string' ? null : d.target
          return target?.x || 0
        })
        .attr("y2", d => {
          const target = typeof d.target === 'string' ? null : d.target
          return target?.y || 0
        })

      nodeGroup
        .attr("transform", d => `translate(${d.x || 0},${d.y || 0})`)
    })

    // Increase simulation iterations for better layout
    simulation.alpha(1).restart()

    return () => {
      simulation.stop()
    }
  }, [data, height, width, translations])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="bg-slate-100 dark:bg-slate-800 rounded-md"
    />
  )
}
