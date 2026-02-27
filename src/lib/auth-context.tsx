"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "./supabase/client"

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

function profileToAuthUser(profile: Record<string, unknown>, email: string): AuthUser {
  return {
    id: profile.id as string,
    email,
    nickname: profile.nickname as string,
    ageGroup: (profile.age_group as string) || '',
    reductionReason: (profile.reduction_reason as string) || '',
    rank: (profile.rank as AuthUser['rank']) || 'beginner',
    points: (profile.points as number) || 0,
    isDeviceOwner: (profile.is_device_owner as boolean) || false,
    deviceNumber: (profile.device_number as string) || null,
    createdAt: (profile.created_at as string) || '',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check current session
    const initAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()
          if (profile) {
            setUser(profileToAuthUser(profile, authUser.email || ''))
          }
        }
      } catch {
        // No session
      }
      setIsLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (profile) {
            setUser(profileToAuthUser(profile, session.user.email || ''))
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { success: false, error: "メールアドレスまたはパスワードが正しくありません" }
    }

    return { success: true }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nickname: data.nickname,
        },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: "このメールアドレスは既に登録されています" }
      }
      return { success: false, error: error.message }
    }

    // Update profile with additional fields
    if (authData.user) {
      await supabase
        .from('profiles')
        .update({
          age_group: data.ageGroup,
          reduction_reason: data.reductionReason,
        })
        .eq('id', authData.user.id)
    }

    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const verifyDeviceNumber = async (deviceNumber: string): Promise<{ success: boolean; error?: string }> => {
    const upperNumber = deviceNumber.toUpperCase()

    // Check if device number is valid
    const { data: device } = await supabase
      .from('valid_device_numbers')
      .select('*')
      .eq('device_number', upperNumber)
      .single()

    if (!device) {
      return { success: false, error: "無効なデバイス番号です。正しい番号を入力してください。" }
    }

    if (device.is_used) {
      return { success: false, error: "このデバイス番号は既に使用されています。" }
    }

    if (user) {
      // Mark device as used
      await supabase
        .from('valid_device_numbers')
        .update({
          is_used: true,
          used_by: user.id,
          used_at: new Date().toISOString(),
        })
        .eq('device_number', upperNumber)

      // Update profile
      await supabase
        .from('profiles')
        .update({
          is_device_owner: true,
          device_number: upperNumber,
        })
        .eq('id', user.id)

      setUser({
        ...user,
        isDeviceOwner: true,
        deviceNumber: upperNumber,
      })
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
