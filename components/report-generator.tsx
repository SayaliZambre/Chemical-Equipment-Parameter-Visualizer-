"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface ReportGeneratorProps {
  session: {
    id: string
    file_name: string
    created_at: string
    total_count: number
    avg_flowrate: number
    avg_pressure: number
    avg_temperature: number
    equipment_distribution: Record<string, number>
  }
}

export function ReportGenerator({ session }: ReportGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [reportFormat, setReportFormat] = useState<"pdf" | "csv" | "json">("pdf")
  const { token } = useAuth()

  const generateReport = async () => {
    setGenerating(true)
    try {
      const response = await fetch(`/api/sessions/${session.id}/generate_report/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format: reportFormat }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url

        const timestamp = new Date(session.created_at).toISOString().split("T")[0]
        a.download = `Report-${timestamp}.${reportFormat === "pdf" ? "pdf" : reportFormat}`

        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error("Failed to generate report:", err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Generate Report</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Report Format</label>
          <div className="flex gap-2">
            {(["pdf", "csv", "json"] as const).map((format) => (
              <button
                key={format}
                onClick={() => setReportFormat(format)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  reportFormat === format
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:border-primary/50"
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateReport}
          disabled={generating}
          className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
        >
          {generating ? "Generating..." : "Download Report"}
        </button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>File: {session.file_name}</p>
          <p>Date: {new Date(session.created_at).toLocaleDateString()}</p>
          <p>Items: {session.total_count}</p>
        </div>
      </div>
    </div>
  )
}
