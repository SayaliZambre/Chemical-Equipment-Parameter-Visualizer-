"use client"

import React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: "class" | "data-theme"
  defaultTheme?: "light" | "dark" | "system"
  enableSystem?: boolean
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  const [theme, setTheme] = React.useState<"light" | "dark" | null>(null)

  React.useEffect(() => {
    setMounted(true)

    // Initialize theme
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    let initialTheme = storedTheme || defaultTheme

    if (initialTheme === "system" && enableSystem) {
      initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    setTheme(initialTheme as "light" | "dark")
    applyTheme(initialTheme as "light" | "dark")
  }, [])

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement
    if (attribute === "class") {
      root.classList.toggle("dark", newTheme === "dark")
    }
  }

  const toggleTheme = () => {
    if (!theme) return

    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const ThemeContext = React.createContext<{
  theme: "light" | "dark" | null
  toggleTheme: () => void
}>({
  theme: null,
  toggleTheme: () => {},
})

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
