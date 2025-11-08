"use client"

import type React from "react"

interface MetricCardProps {
  label: string
  value: string | number
  unit: string
  icon: React.ReactNode
  color: "blue" | "green" | "orange" | "purple"
}

function MetricCard({ label, value, unit, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-75">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <p className="text-xs opacity-60 mt-1">{unit}</p>
        </div>
        <div className="text-xl opacity-40">{icon}</div>
      </div>
    </div>
  )
}

interface AdvancedMetricsProps {
  session: {
    total_count: number
    avg_flowrate: number
    avg_pressure: number
    avg_temperature: number
    max_temperature?: number
    min_temperature?: number
    max_pressure?: number
    min_pressure?: number
  }
}

export function AdvancedMetrics({ session }: AdvancedMetricsProps) {
  const metrics = [
    {
      label: "Total Equipment",
      value: session.total_count,
      unit: "items",
      icon: "📦",
      color: "blue" as const,
    },
    {
      label: "Avg Flowrate",
      value: session.avg_flowrate.toFixed(1),
      unit: "units/min",
      icon: "💧",
      color: "green" as const,
    },
    {
      label: "Avg Pressure",
      value: session.avg_pressure.toFixed(1),
      unit: "bar",
      icon: "⚙️",
      color: "orange" as const,
    },
    {
      label: "Avg Temperature",
      value: session.avg_temperature.toFixed(1),
      unit: "K",
      icon: "🌡️",
      color: "purple" as const,
    },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Key Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>
    </div>
  )
}
