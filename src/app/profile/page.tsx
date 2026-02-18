"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { RecipeCard } from "@/components/recipe-card"
import { SpotCard } from "@/components/spot-card"
import { 
  mockRecipes, 
  mockSpots, 
  rankConfig, 
  mockSaltSavings,
  pointActions 
} from "@/lib/mock-data"
import { 
  Star, 
  Crown, 
  Settings, 
  TrendingUp,
  Heart,
  UtensilsCrossed,
  MapPin,
  Award,
  Smartphone
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}

function ProfileContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  
  if (!user) return null
  
  const rankInfo = rankConfig[user.rank]

  // User's posts (mock - filter by user id)
  const userRecipes = mockRecipes.filter((r) => r.userId === user.id).slice(0, 2)
  const userSpots = mockSpots.filter((s) => s.userId === user.id)

  // Next rank calculation
  const ranks = Object.entries(rankConfig)
  const currentRankIndex = ranks.findIndex(([key]) => key === user.rank)
  const nextRank = ranks[currentRankIndex + 1]
  const nextRankPoints = nextRank ? nextRank[1].minPoints : user.points
  const progressToNextRank = nextRank 
    ? ((user.points - rankInfo.minPoints) / (nextRankPoints - rankInfo.minPoints)) * 100
    : 100

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8">
        <div className="mx-auto max-w-5xl">
          {/* Profile Header */}
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative shrink-0">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl sm:text-3xl">
                        {user.nickname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {user.isDeviceOwner && (
                      <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD700] sm:h-8 sm:w-8">
                        <Crown className="h-3 w-3 text-foreground sm:h-4 sm:w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{user.nickname}</h1>
                      {user.isDeviceOwner && (
                        <Badge className="bg-[#FFD700] text-foreground text-xs">
                          <Crown className="mr-1 h-3 w-3" />
                          Owner
                        </Badge>
                      )}
                    </div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge 
                        variant="secondary"
                        className="text-xs sm:text-sm"
                        style={{ backgroundColor: `${rankInfo.color}20`, color: rankInfo.color }}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        {rankInfo.name}
                      </Badge>
                      <span className="text-base font-bold text-foreground sm:text-lg">{user.points}pt</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground sm:gap-2 sm:text-sm">
                      <span>{user.ageGroup}</span>
                      <span>|</span>
                      <span className="truncate">{user.reductionReason}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild className="bg-transparent">
                    <Link href="/settings">
                      <Settings className="mr-1.5 h-4 w-4 sm:mr-2" />
                      <span className="hidden xs:inline">設定</span>
                    </Link>
                  </Button>
                  {user.isDeviceOwner ? (
                    <Button size="sm" className="bg-[#FFD700] text-foreground hover:bg-[#FFD700]/90" asChild>
                      <Link href="/owners-lounge">
                        <Crown className="mr-1.5 h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{"Owner's Lounge"}</span>
                        <span className="sm:hidden">Lounge</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 bg-transparent" asChild>
                      <Link href="/device-registration">
                        <Smartphone className="mr-1.5 h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">デバイス登録</span>
                        <span className="sm:hidden">登録</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-1 sm:mb-6 sm:h-10 sm:flex-nowrap">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">概要</TabsTrigger>
              <TabsTrigger value="recipes" className="text-xs sm:text-sm">レシピ</TabsTrigger>
              <TabsTrigger value="spots" className="text-xs sm:text-sm">スポット</TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs sm:text-sm">お気に入り</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Rank Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      ランク・ポイント
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 flex items-center gap-4">
                      <div 
                        className="flex h-16 w-16 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${rankInfo.color}20` }}
                      >
                        <Star 
                          className="h-8 w-8"
                          style={{ color: rankInfo.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">現在のランク</p>
                        <p className="text-2xl font-bold" style={{ color: rankInfo.color }}>
                          {rankInfo.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-foreground">{user.points}</p>
                        <p className="text-sm text-muted-foreground">ポイント</p>
                      </div>
                    </div>

                    {nextRank && (
                      <div className="mb-4">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">次のランクまで</span>
                          <span className="font-medium text-foreground">
                            {nextRankPoints - user.points}pt
                          </span>
                        </div>
                        <Progress value={progressToNextRank} className="h-2" />
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span>{rankInfo.name}</span>
                          <span style={{ color: nextRank[1].color }}>{nextRank[1].name}</span>
                        </div>
                      </div>
                    )}

                    <div className="rounded-lg bg-secondary p-4">
                      <p className="mb-3 text-sm font-medium text-foreground">ポイント獲得方法</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                          <span>レシピ投稿</span>
                          <span className="ml-auto font-medium text-primary">+{pointActions.recipePost}pt</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>スポット投稿</span>
                          <span className="ml-auto font-medium text-primary">+{pointActions.spotPost}pt</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span>評価</span>
                          <span className="ml-auto font-medium text-primary">+{pointActions.rating}pt</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span>役に立った</span>
                          <span className="ml-auto font-medium text-primary">+{pointActions.helpful}pt</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Salt Savings Bank */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-[#10B981]" />
                      塩分節約バンク
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-[#10B981]/10 p-4 text-center">
                        <p className="text-sm text-muted-foreground">今月の節約量</p>
                        <p className="text-3xl font-bold text-[#10B981]">{mockSaltSavings.thisMonth}g</p>
                      </div>
                      <div className="rounded-lg bg-secondary p-4 text-center">
                        <p className="text-sm text-muted-foreground">累計節約量</p>
                        <p className="text-3xl font-bold text-foreground">{mockSaltSavings.total}g</p>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <span className="text-2xl">🧂</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          塩小瓶 約{Math.floor(mockSaltSavings.total / 30)}本分を節約!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          あなたの健康に大きく貢献しています
                        </p>
                      </div>
                    </div>

                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockSaltSavings.dailyData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            className="fill-muted-foreground"
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            className="fill-muted-foreground"
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={{ fill: "#10B981" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Stats */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <TrendingUp className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      活動統計
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                      <div className="rounded-lg border border-border p-3 text-center sm:p-4">
                        <UtensilsCrossed className="mx-auto mb-1.5 h-5 w-5 text-primary sm:mb-2 sm:h-6 sm:w-6" />
                        <p className="text-xl font-bold text-foreground sm:text-2xl">{userRecipes.length + 3}</p>
                        <p className="text-xs text-muted-foreground sm:text-sm">レシピ投稿</p>
                      </div>
                      <div className="rounded-lg border border-border p-3 text-center sm:p-4">
                        <MapPin className="mx-auto mb-1.5 h-5 w-5 text-primary sm:mb-2 sm:h-6 sm:w-6" />
                        <p className="text-xl font-bold text-foreground sm:text-2xl">{userSpots.length}</p>
                        <p className="text-xs text-muted-foreground sm:text-sm">スポット投稿</p>
                      </div>
                      <div className="rounded-lg border border-border p-3 text-center sm:p-4">
                        <Star className="mx-auto mb-1.5 h-5 w-5 text-primary sm:mb-2 sm:h-6 sm:w-6" />
                        <p className="text-xl font-bold text-foreground sm:text-2xl">24</p>
                        <p className="text-xs text-muted-foreground sm:text-sm">評価・コメント</p>
                      </div>
                      <div className="rounded-lg border border-border p-3 text-center sm:p-4">
                        <Heart className="mx-auto mb-1.5 h-5 w-5 text-primary sm:mb-2 sm:h-6 sm:w-6" />
                        <p className="text-xl font-bold text-foreground sm:text-2xl">156</p>
                        <p className="text-xs text-muted-foreground sm:text-sm">役に立った</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recipes">
              {userRecipes.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mockRecipes.slice(0, 4).map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center sm:py-12">
                    <UtensilsCrossed className="mx-auto mb-3 h-10 w-10 text-muted-foreground sm:mb-4 sm:h-12 sm:w-12" />
                    <p className="mb-3 text-base font-medium text-foreground sm:mb-4 sm:text-lg">
                      まだレシピを投稿していません
                    </p>
                    <Button asChild size="sm">
                      <Link href="/recipes/new">
                        レシピを投稿する
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="spots">
              {userSpots.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {userSpots.map((spot) => (
                    <SpotCard key={spot.id} spot={spot} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center sm:py-12">
                    <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground sm:mb-4 sm:h-12 sm:w-12" />
                    <p className="mb-3 text-base font-medium text-foreground sm:mb-4 sm:text-lg">
                      まだスポットを投稿していません
                    </p>
                    <Button asChild size="sm">
                      <Link href="/spots/new">
                        スポットを投稿する
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardContent className="py-10 text-center sm:py-12">
                  <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground sm:mb-4 sm:h-12 sm:w-12" />
                  <p className="mb-2 text-base font-medium text-foreground sm:text-lg">
                    お気に入りはまだありません
                  </p>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    気になるレシピやスポットをお気に入りに追加しましょう
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
