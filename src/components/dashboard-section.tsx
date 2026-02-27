"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { rankConfig, mockSaltSavings } from "@/lib/mock-data"
import {
  ArrowRight,
  Star,
  Heart,
  Crown,
  Zap,
} from "lucide-react"

export function DashboardSection() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) return null

  const rankInfo = rankConfig[user.rank]
  const nextRankPoints = user.rank === 'master' ? user.points : (
    user.rank === 'expert' ? 1000 :
    user.rank === 'regular' ? 500 : 100
  )

  return (
    <section className="px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              こんにちは、{user.nickname}さん
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">今日も減塩ライフを楽しみましょう</p>
          </div>
          <Button variant="outline" asChild size="sm" className="w-fit rounded-xl border-primary/20 bg-transparent text-primary hover:bg-primary/8">
            <Link href="/profile">
              マイページ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                ランク・ポイント
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${rankInfo.color}18` }}
                >
                  <span className="text-2xl font-bold" style={{ color: rankInfo.color }}>
                    {rankInfo.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: rankInfo.color }}>
                    {rankInfo.name}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{user.points}pt</p>
                  <p className="text-sm text-muted-foreground">
                    次のランクまで {nextRankPoints - user.points}pt
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-warm-500 transition-all"
                  style={{ width: `${(user.points / nextRankPoints) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage/10">
                  <Heart className="h-4 w-4 text-sage" />
                </div>
                塩分節約バンク
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">今月の節約量</p>
                <p className="text-3xl font-bold text-foreground">{mockSaltSavings.thisMonth}g</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-sage-light/60 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/15">
                  <span className="text-lg">🧂</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">累計 {mockSaltSavings.total}g</p>
                  <p className="text-xs text-muted-foreground">塩小瓶 約{Math.floor(mockSaltSavings.total / 30)}本分</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.isDeviceOwner && (
            <Card className="overflow-hidden border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-yellow-50/60 dark:border-amber-800/30 dark:from-amber-950/20 dark:to-yellow-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD700]/20">
                    <Crown className="h-4 w-4 text-[#FFD700]" />
                  </div>
                  {"Owner's Lounge"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  デバイス購入者限定の特別エリアです
                </p>
                <div className="mb-4 flex gap-2">
                  <Badge variant="secondary" className="border-amber-200/40 bg-white/60">
                    <Zap className="mr-1 h-3 w-3" />
                    専用レシピ
                  </Badge>
                  <Badge variant="secondary" className="border-amber-200/40 bg-white/60">
                    公式サポート
                  </Badge>
                </div>
                <Button className="w-full rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-sm hover:shadow-md" asChild>
                  <Link href="/owners-lounge">
                    ラウンジに入る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
