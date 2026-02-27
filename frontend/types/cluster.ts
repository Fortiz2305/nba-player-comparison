import { PlayerStats } from './player';

export interface PlayerCluster {
  cluster_id: number;
  players: PlayerStats[];
  centroid: Record<string, number>;
}

export interface ClusteringResult {
  clusters: PlayerCluster[];
  season: string;
  num_clusters: number;
}

export interface ClusteringVisualizationNode {
  id: string;
  name: string;
  team: string;
  position: string;
  cluster: number;
  stats: PlayerStats;
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ClusteringVisualizationLink {
  source: string | ClusteringVisualizationNode;
  target: string | ClusteringVisualizationNode;
  value: number;
}

export interface ClusteringVisualizationData {
  nodes: ClusteringVisualizationNode[];
  links: ClusteringVisualizationLink[];
}
