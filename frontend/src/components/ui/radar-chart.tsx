import React from 'react'
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn } from '../../lib/utils'

interface RadarChartProps {
  data: any[]
  dataKeys: { key: string; name: string; color: string }[]
  nameKey: string
  className?: string
}

export function RadarChart({
  data,
  dataKeys,
  nameKey,
  className,
}: RadarChartProps) {
  return (
    <div className={cn('w-full h-[400px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={data}
        >
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey={nameKey}
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 1]}
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          {dataKeys.map((dataKey) => (
            <Radar
              key={dataKey.key}
              name={dataKey.name}
              dataKey={dataKey.key}
              stroke={dataKey.color}
              fill={dataKey.color}
              fillOpacity={0.2}
            />
          ))}
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
