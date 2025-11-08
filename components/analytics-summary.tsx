"use client"

interface AnalyticsSummaryProps {
  session: {
    total_count: number
    avg_flowrate: number
    avg_pressure: number
    avg_temperature: number
  }
}

export function AnalyticsSummary({ session }: AnalyticsSummaryProps) {
  const stats = [
    {
      label: "Total Equipment",
      value: session.total_count,
      unit: "items",
    },
    {
      label: "Avg Flowrate",
      value: session.avg_flowrate.toFixed(2),
      unit: "units",
    },
    {
      label: "Avg Pressure",
      value: session.avg_pressure.toFixed(2),
      unit: "bar",
    },
    {
      label: "Avg Temperature",
      value: session.avg_temperature.toFixed(2),
      unit: "K",
    },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Analytics Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-background/50 rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-accent">
              {stat.value} <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
