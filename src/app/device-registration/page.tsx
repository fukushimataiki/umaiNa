"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Crown, CheckCircle, AlertCircle, Info } from "lucide-react"
import { toast } from "sonner"

export default function DeviceRegistrationPage() {
  return (
    <AuthGuard>
      <DeviceRegistrationContent />
    </AuthGuard>
  )
}

function DeviceRegistrationContent() {
  const router = useRouter()
  const { user, verifyDeviceNumber } = useAuth()
  const [deviceNumber, setDeviceNumber] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // If already a device owner, show success state
  if (user?.isDeviceOwner && !isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700]/20">
                <CheckCircle className="h-8 w-8 text-[#10B981]" />
              </div>
              <CardTitle className="text-2xl">登録済みです</CardTitle>
              <CardDescription>
                {"あなたは既にデバイスオーナーとして登録されています。Owner's Loungeにアクセスできます。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">登録済みデバイス番号</p>
                <p className="mt-1 font-mono text-lg font-bold text-foreground">{user.deviceNumber}</p>
              </div>
              <Button className="w-full bg-[#FFD700] text-foreground hover:bg-[#FFD700]/90" asChild>
                <Link href="/owners-lounge">
                  <Crown className="mr-2 h-4 w-4" />
                  {"Owner's Loungeへ"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!deviceNumber.trim()) {
      setError("デバイス番号を入力してください")
      return
    }

    setIsLoading(true)

    const result = await verifyDeviceNumber(deviceNumber)

    if (result.success) {
      setIsSuccess(true)
      toast.success("デバイス登録が完了しました！", {
        description: "Owner's Loungeへアクセスできるようになりました。",
      })
    } else {
      setError(result.error || "登録に失敗しました")
    }

    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700]/20">
                <CheckCircle className="h-8 w-8 text-[#10B981]" />
              </div>
              <CardTitle className="text-2xl">登録完了</CardTitle>
              <CardDescription>
                {"デバイスオーナーとして登録されました。Owner's Loungeにアクセスできるようになりました！"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-[#FFD700] text-foreground hover:bg-[#FFD700]/90" asChild>
                <Link href="/owners-lounge">
                  <Crown className="mr-2 h-4 w-4" />
                  {"Owner's Loungeへ"}
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/">ホームに戻る</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700]/20">
              <Crown className="h-8 w-8 text-[#FFD700]" />
            </div>
            <CardTitle className="text-2xl">デバイス登録</CardTitle>
            <CardDescription>
              {"umaiNaデバイスの番号を入力して、Owner's Loungeにアクセスしましょう"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="deviceNumber">デバイス番号</Label>
                <Input
                  id="deviceNumber"
                  type="text"
                  placeholder="UMN-2025-XXXXXX"
                  value={deviceNumber}
                  onChange={(e) => setDeviceNumber(e.target.value.toUpperCase())}
                  required
                  disabled={isLoading}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  デバイス本体またはパッケージに記載されている番号を入力してください
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#FFD700] text-foreground hover:bg-[#FFD700]/90" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    確認中...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    デバイスを登録
                  </>
                )}
              </Button>
            </form>

            {/* Test Device Number Info */}
            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Info className="h-4 w-4 text-primary" />
                テスト用デバイス番号
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="font-mono">UMN-2025-001234</p>
                <p className="font-mono">UMN-2025-005678</p>
                <p className="font-mono">UMN-2025-009999</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
