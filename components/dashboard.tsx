"use client"

import { useState } from "react"
import { UploadSection } from "./upload-section"
import { AdvancedMetrics } from "./advanced-metrics"
import { EnhancedCharts } from "./enhanced-charts"
import { useAuth } from "@/hooks/use-auth"
import { EnhancedHistoryPanel } from "./enhanced-history-panel"
import { Chatbot } from "./chatbot"
import { ThemeToggle } from "./theme-toggle"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [currentSession, setCurrentSession] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = (session: any) => {
    setCurrentSession(session)
    setRefreshKey((prev) => prev + 1)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chemical Equipment Visualizer</h1>
            <p className="text-muted-foreground mt-1">Analyze equipment parameters from CSV data</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Upload & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <UploadSection onUploadSuccess={handleUploadSuccess} />
            {currentSession && (
              <>
                <AdvancedMetrics session={currentSession} />
                <EnhancedCharts session={currentSession} />
              </>
            )}
          </div>

          {/* Middle Column - History */}
          <div>
            <EnhancedHistoryPanel key={refreshKey} onSessionSelect={setCurrentSession} />
          </div>

          {/* Right Column - Chatbot */}
          <div className="h-[600px]">
            <Chatbot />
          </div>
        </div>
      </main>
    </div>
  )
}
