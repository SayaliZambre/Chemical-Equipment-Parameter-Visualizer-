"use client"

import { useMemo } from "react"

interface VisualizationChartsProps {
  session: {
    equipment_distribution: Record<string, number>
  }
}

export function VisualizationCharts({ session }: VisualizationChartsProps) {
  const distribution = session.equipment_distribution || {}
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0)

  const chartData = useMemo(() => {
    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }))
  }, [distribution, total])

  const colors = ["#8366d9", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Equipment Distribution</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  {item.count} ({item.percentage}%)
                </p>
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
