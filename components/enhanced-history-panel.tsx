"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { ReportGenerator } from "./report-generator"

interface EnhancedHistoryPanelProps {
  onSessionSelect: (session: any) => void
}

export function EnhancedHistoryPanel({ onSessionSelect }: EnhancedHistoryPanelProps) {
  const { token } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [token])

  const fetchHistory = async () => {
    if (!token) return

    try {
      const response = await fetch("/api/sessions/history/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSessions(data)
        if (data.length > 0) {
          setSelectedSessionId(data[0].id)
        }
      }
    } catch (err) {
      console.error("Failed to fetch history:", err)
    } finally {
      setLoading(false)
    }
  }

  const selectedSession = sessions.find((s: any) => s.id === selectedSessionId)

  return (
    <div className="space-y-6">
      {/* History List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : sessions.length === 0 ? (
          <p className="text-muted-foreground">No uploads yet</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sessions.map((session: any) => (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id)
                  onSessionSelect(session)
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSessionId === session.id
                    ? "bg-primary/10 border border-primary"
                    : "bg-background/50 hover:bg-background/80 border border-transparent"
                }`}
              >
                <p className="text-sm font-medium truncate">{session.file_name}</p>
                <p className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleDateString()}</p>
                <p className="text-xs text-accent mt-1">{session.total_count} items</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSession && <ReportGenerator session={selectedSession} />}
    </div>
  )
}
