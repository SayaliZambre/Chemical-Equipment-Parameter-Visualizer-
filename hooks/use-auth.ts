"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: number
  username: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      // Verify token is still valid by fetching user profile
      verifyToken(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/users/0/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem("auth_token")
        setToken(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("Token verification failed:", err)
      localStorage.removeItem("auth_token")
      setToken(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await fetch("/api-token-auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      localStorage.setItem("auth_token", data.token)
      setToken(data.token)

      // Fetch user profile
      const userResponse = await fetch("/api/users/0/", {
        headers: {
          Authorization: `Token ${data.token}`,
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed")
    }
  }, [])

  const register = useCallback(async (username: string, password: string, email: string) => {
    try {
      const response = await fetch("/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(error.message || "Registration failed")
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const response = await fetch("/api/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Password reset request failed")
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(error.message || "Failed to request password reset")
    }
  }, [])

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    requestPasswordReset,
  }
}
