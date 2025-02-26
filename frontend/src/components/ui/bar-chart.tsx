import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '../../lib/utils'

interface BarChartProps {
  data: any[]
  dataKeys: { key: string; name: string; color: string }[]
  xAxisKey: string
  className?: string
}

export function BarChart({
  data,
  dataKeys,
  xAxisKey,
  className,
}: BarChartProps) {
  return (
    <div className={cn('w-full h-[400px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <YAxis tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Legend />
          {dataKeys.map((dataKey) => (
            <Bar
              key={dataKey.key}
              dataKey={dataKey.key}
              name={dataKey.name}
              fill={dataKey.color}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
