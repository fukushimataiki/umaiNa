"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { testAccounts, validDeviceNumbers } from "./mock-data"

export interface AuthUser {
  id: string
  email: string
  nickname: string
  ageGroup: string
  reductionReason: string
  rank: 'beginner' | 'regular' | 'expert' | 'master'
  points: number
  isDeviceOwner: boolean
  deviceNumber: string | null
  createdAt: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  verifyDeviceNumber: (deviceNumber: string) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
}

interface RegisterData {
  email: string
  password: string
  nickname: string
  ageGroup: string
  reductionReason: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("umaina_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("umaina_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when changed
  useEffect(() => {
    if (user) {
      localStorage.setItem("umaina_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("umaina_user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const account = testAccounts.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    )

    if (!account) {
      return { success: false, error: "メールアドレスまたはパスワードが正しくありません" }
    }

    const authUser: AuthUser = {
      id: account.id,
      email: account.email,
      nickname: account.nickname,
      ageGroup: account.ageGroup,
      reductionReason: account.reductionReason,
      rank: account.rank,
      points: account.points,
      isDeviceOwner: account.isDeviceOwner,
      deviceNumber: account.deviceNumber,
      createdAt: account.createdAt,
    }

    setUser(authUser)
    return { success: true }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if email already exists
    const existingAccount = testAccounts.find(
      acc => acc.email.toLowerCase() === data.email.toLowerCase()
    )

    if (existingAccount) {
      return { success: false, error: "このメールアドレスは既に登録されています" }
    }

    // Create new user
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      nickname: data.nickname,
      ageGroup: data.ageGroup,
      reductionReason: data.reductionReason,
      rank: 'beginner',
      points: 0,
      isDeviceOwner: false,
      deviceNumber: null,
      createdAt: new Date().toISOString().split('T')[0],
    }

    setUser(newUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  const verifyDeviceNumber = async (deviceNumber: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const isValid = validDeviceNumbers.includes(deviceNumber.toUpperCase())

    if (!isValid) {
      return { success: false, error: "無効なデバイス番号です。正しい番号を入力してください。" }
    }

    if (user) {
      const updatedUser: AuthUser = {
        ...user,
        isDeviceOwner: true,
        deviceNumber: deviceNumber.toUpperCase(),
      }
      setUser(updatedUser)
    }

    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        verifyDeviceNumber,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
