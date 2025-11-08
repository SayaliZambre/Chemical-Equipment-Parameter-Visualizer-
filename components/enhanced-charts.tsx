"use client"

import { useMemo } from "react"

interface EnhancedChartsProps {
  session: {
    equipment_distribution: Record<string, number>
    total_count: number
    avg_flowrate: number
    avg_pressure: number
    avg_temperature: number
  }
}

export function EnhancedCharts({ session }: EnhancedChartsProps) {
  const distribution = session.equipment_distribution || {}
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0)

  const chartData = useMemo(() => {
    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }))
  }, [distribution, total])

  const colors = ["#8366d9", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

  // Simulated trend data
  const trendData = [
    { label: "Min", value: 20 },
    { label: "Q1", value: 45 },
    { label: "Median", value: 65 },
    { label: "Q3", value: 80 },
    { label: "Max", value: 95 },
  ]

  const maxValue = Math.max(...trendData.map((d) => d.value))

  return (
    <div className="space-y-6">
      {/* Equipment Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Equipment Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-xs">
              {chartData.length > 0 ? (
                <>
                  {chartData.map((item, idx) => {
                    const startAngle = chartData.slice(0, idx).reduce((sum, d) => sum + (d.count / total) * 360, 0)
                    const endAngle = startAngle + (item.count / total) * 360
                    const start = polarToCartesian(100, 100, 80, endAngle)
                    const end = polarToCartesian(100, 100, 80, startAngle)
                    const largeArc = endAngle - startAngle > 180 ? 1 : 0

                    return (
                      <g key={idx}>
                        <path
                          d={`M 100 100 L ${start.x} ${start.y} A 80 80 0 ${largeArc} 0 ${end.x} ${end.y} Z`}
                          fill={colors[idx % colors.length]}
                          stroke="var(--background)"
                          strokeWidth="2"
                        />
                      </g>
                    )
                  })}
                  <circle cx="100" cy="100" r="50" fill="var(--card)" />
                </>
              ) : null}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-col justify-center gap-3">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.count} items ({item.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Bar Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Parameter Distribution</h3>
        <div className="space-y-4">
          {trendData.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.value}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
