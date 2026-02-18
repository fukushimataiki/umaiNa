"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, Crown } from "lucide-react"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  requireDeviceOwner?: boolean
}

export function AuthGuard({ children, requireDeviceOwner = false }: AuthGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">ログインが必要です</CardTitle>
            <CardDescription>
              この機能を利用するにはログインが必要です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/register">新規登録</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/" className="text-primary hover:underline">
                ホームに戻る
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show device owner prompt if required but user is not device owner
  if (requireDeviceOwner && !user?.isDeviceOwner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700]/20">
              <Crown className="h-8 w-8 text-[#FFD700]" />
            </div>
            <CardTitle className="text-2xl">デバイスオーナー限定</CardTitle>
            <CardDescription>
              {"この機能はumaiNaデバイスをお持ちの方専用です。デバイス番号を登録してOwner's Loungeにアクセスしましょう。"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-[#FFD700] text-foreground hover:bg-[#FFD700]/90" asChild>
              <Link href="/device-registration">デバイス番号を登録</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/" className="text-primary hover:underline">
                ホームに戻る
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
