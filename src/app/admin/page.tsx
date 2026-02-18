"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockRecipes, mockSpots, rankConfig } from "@/lib/mock-data"
import { 
  Users, 
  UtensilsCrossed, 
  MapPin, 
  MessageSquare, 
  TrendingUp,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Shield,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  BarChart3,
  ShieldCheck
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

// Mock admin data
const mockUsers = [
  { id: "1", nickname: "健一", email: "kenichi@example.com", rank: "regular", points: 280, isDeviceOwner: true, status: "active", createdAt: "2025-10-15" },
  { id: "2", nickname: "美香", email: "mika@example.com", rank: "expert", points: 520, isDeviceOwner: true, status: "active", createdAt: "2025-09-20" },
  { id: "3", nickname: "太郎", email: "taro@example.com", rank: "beginner", points: 45, isDeviceOwner: false, status: "active", createdAt: "2025-12-01" },
  { id: "4", nickname: "花子", email: "hanako@example.com", rank: "regular", points: 180, isDeviceOwner: false, status: "suspended", createdAt: "2025-11-10" },
  { id: "5", nickname: "次郎", email: "jiro@example.com", rank: "beginner", points: 30, isDeviceOwner: false, status: "active", createdAt: "2025-12-10" },
]

const mockSupportTickets = [
  { id: "1", userId: "2", userNickname: "美香", category: "usage", content: "電流レベル3で使用していますが、あまり効果を感じません。", status: "pending", createdAt: "2026-01-20" },
  { id: "2", userId: "1", userNickname: "健一", category: "trouble", content: "充電ができなくなりました。", status: "in_progress", createdAt: "2026-01-18" },
  { id: "3", userId: "2", userNickname: "美香", category: "other", content: "新しいレシピの追加リクエストです。", status: "resolved", createdAt: "2026-01-15" },
]

const mockPurchaseIds = [
  { id: "UMAINA-2024-0001", deviceModel: "Standard", isUsed: true, usedBy: "美香", usedAt: "2025-09-20" },
  { id: "UMAINA-2024-0002", deviceModel: "Standard", isUsed: true, usedBy: "健一", usedAt: "2025-10-15" },
  { id: "UMAINA-2024-0003", deviceModel: "Pro", isUsed: false, usedBy: null, usedAt: null },
  { id: "UMAINA-2024-0004", deviceModel: "Standard", isUsed: false, usedBy: null, usedAt: null },
]

const analyticsData = [
  { date: "1月16日", mau: 4200, recipes: 45, spots: 12 },
  { date: "1月17日", mau: 4350, recipes: 52, spots: 15 },
  { date: "1月18日", mau: 4500, recipes: 48, spots: 18 },
  { date: "1月19日", mau: 4680, recipes: 61, spots: 14 },
  { date: "1月20日", mau: 4820, recipes: 55, spots: 20 },
  { date: "1月21日", mau: 4950, recipes: 67, spots: 16 },
  { date: "1月22日", mau: 5100, recipes: 72, spots: 22 },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userSearch, setUserSearch] = useState("")
  const [contentSearch, setContentSearch] = useState("")

  const filteredUsers = mockUsers.filter((user) =>
    user.nickname.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const statusConfig = {
    pending: { label: "未対応", color: "bg-[#F59E0B] text-white", icon: Clock },
    in_progress: { label: "対応中", color: "bg-[#3B82F6] text-white", icon: Eye },
    resolved: { label: "完了", color: "bg-[#10B981] text-white", icon: CheckCircle },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">管理画面</span>
            </div>
          </div>
          <Badge variant="outline" className="text-primary">
            管理者
          </Badge>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Stats Overview */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">総ユーザー数</p>
                  <p className="text-2xl font-bold text-foreground">8,901</p>
                  <p className="text-xs text-[#10B981]">+12% 今月</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B]/10">
                  <UtensilsCrossed className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">レシピ数</p>
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="text-xs text-[#10B981]">+45 今週</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6]/10">
                  <MapPin className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">スポット数</p>
                  <p className="text-2xl font-bold text-foreground">567</p>
                  <p className="text-xs text-[#10B981]">+18 今週</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/10">
                  <Crown className="h-6 w-6 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">デバイス購入者</p>
                  <p className="text-2xl font-bold text-foreground">342</p>
                  <p className="text-xs text-muted-foreground">登録率 85%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                概要
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                ユーザー
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                コンテンツ
              </TabsTrigger>
              <TabsTrigger value="owners" className="gap-2">
                <Crown className="h-4 w-4" />
                購入者管理
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                サポート
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>MAU推移</CardTitle>
                    <CardDescription>月間アクティブユーザー数</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                          <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line type="monotone" dataKey="mau" stroke="#E67E66" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>投稿数推移</CardTitle>
                    <CardDescription>レシピ・スポットの投稿数</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                          <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="recipes" fill="#E67E66" name="レシピ" />
                          <Bar dataKey="spots" fill="#3B82F6" name="スポット" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>最近のアクティビティ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: "recipe", user: "美香", action: "レシピを投稿", title: "出汁香る減塩味噌汁", time: "5分前" },
                        { type: "spot", user: "太郎", action: "スポットを投稿", title: "だし茶漬け えん 東京駅店", time: "15分前" },
                        { type: "user", user: "新規ユーザー", action: "アカウント作成", title: "", time: "30分前" },
                        { type: "owner", user: "健一", action: "購入ID登録", title: "UMAINA-2024-0010", time: "1時間前" },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              activity.type === "recipe" ? "bg-primary/10" :
                              activity.type === "spot" ? "bg-[#3B82F6]/10" :
                              activity.type === "owner" ? "bg-[#FFD700]/10" :
                              "bg-secondary"
                            }`}>
                              {activity.type === "recipe" && <UtensilsCrossed className="h-4 w-4 text-primary" />}
                              {activity.type === "spot" && <MapPin className="h-4 w-4 text-[#3B82F6]" />}
                              {activity.type === "user" && <Users className="h-4 w-4 text-muted-foreground" />}
                              {activity.type === "owner" && <Crown className="h-4 w-4 text-[#FFD700]" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {activity.user}が{activity.action}
                              </p>
                              {activity.title && (
                                <p className="text-xs text-muted-foreground">{activity.title}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>ユーザー管理</CardTitle>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="ユーザーを検索..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ユーザー</TableHead>
                        <TableHead>ランク</TableHead>
                        <TableHead>ポイント</TableHead>
                        <TableHead>購入者</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>登録日</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const rank = rankConfig[user.rank as keyof typeof rankConfig]
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                    {user.nickname.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">{user.nickname}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" style={{ color: rank.color }}>
                                {rank.name}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.points}pt</TableCell>
                            <TableCell>
                              {user.isDeviceOwner && (
                                <Crown className="h-5 w-5 text-[#FFD700]" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "secondary" : "destructive"}>
                                {user.status === "active" ? "有効" : "停止中"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    詳細を見る
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Shield className="mr-2 h-4 w-4" />
                                    {user.status === "active" ? "アカウント停止" : "アカウント有効化"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <CardTitle>コンテンツ管理</CardTitle>
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="コンテンツを検索..."
                          value={contentSearch}
                          onChange={(e) => setContentSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>タイプ</TableHead>
                          <TableHead>タイトル</TableHead>
                          <TableHead>投稿者</TableHead>
                          <TableHead>評価</TableHead>
                          <TableHead>閲覧数</TableHead>
                          <TableHead>投稿日</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockRecipes.slice(0, 5).map((recipe) => (
                          <TableRow key={recipe.id}>
                            <TableCell>
                              <Badge variant="outline">
                                <UtensilsCrossed className="mr-1 h-3 w-3" />
                                レシピ
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{recipe.title}</TableCell>
                            <TableCell>{recipe.userNickname}</TableCell>
                            <TableCell>{recipe.avgRating.toFixed(1)}</TableCell>
                            <TableCell>{recipe.views.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">{recipe.createdAt}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    詳細を見る
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    削除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {mockSpots.slice(0, 3).map((spot) => (
                          <TableRow key={spot.id}>
                            <TableCell>
                              <Badge variant="outline">
                                <MapPin className="mr-1 h-3 w-3" />
                                スポット
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{spot.name}</TableCell>
                            <TableCell>{spot.userNickname}</TableCell>
                            <TableCell>{spot.avgRating.toFixed(1)}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell className="text-muted-foreground">{spot.createdAt}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    詳細を見る
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    削除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Owners Tab */}
            <TabsContent value="owners">
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/10">
                        <Crown className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">登録済み購入者</p>
                        <p className="text-2xl font-bold text-foreground">342</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10">
                        <CheckCircle className="h-6 w-6 text-[#10B981]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">使用済み購入ID</p>
                        <p className="text-2xl font-bold text-foreground">342</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">未使用購入ID</p>
                        <p className="text-2xl font-bold text-foreground">58</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>購入ID管理</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>購入ID</TableHead>
                          <TableHead>デバイスモデル</TableHead>
                          <TableHead>ステータス</TableHead>
                          <TableHead>登録ユーザー</TableHead>
                          <TableHead>登録日</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPurchaseIds.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">{item.id}</TableCell>
                            <TableCell>{item.deviceModel}</TableCell>
                            <TableCell>
                              {item.isUsed ? (
                                <Badge className="bg-[#10B981] text-white">使用済み</Badge>
                              ) : (
                                <Badge variant="secondary">未使用</Badge>
                              )}
                            </TableCell>
                            <TableCell>{item.usedBy || "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{item.usedAt || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B]/10">
                        <Clock className="h-6 w-6 text-[#F59E0B]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">未対応</p>
                        <p className="text-2xl font-bold text-foreground">3</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6]/10">
                        <Eye className="h-6 w-6 text-[#3B82F6]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">対応中</p>
                        <p className="text-2xl font-bold text-foreground">2</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10">
                        <CheckCircle className="h-6 w-6 text-[#10B981]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">完了（今月）</p>
                        <p className="text-2xl font-bold text-foreground">24</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>サポート問い合わせ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ステータス</TableHead>
                          <TableHead>ユーザー</TableHead>
                          <TableHead>カテゴリ</TableHead>
                          <TableHead>内容</TableHead>
                          <TableHead>日時</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSupportTickets.map((ticket) => {
                          const status = statusConfig[ticket.status as keyof typeof statusConfig]
                          return (
                            <TableRow key={ticket.id}>
                              <TableCell>
                                <Badge className={status.color}>
                                  <status.icon className="mr-1 h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{ticket.userNickname}</TableCell>
                              <TableCell>
                                {ticket.category === "usage" && "使い方"}
                                {ticket.category === "trouble" && "故障・トラブル"}
                                {ticket.category === "other" && "その他"}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">{ticket.content}</TableCell>
                              <TableCell className="text-muted-foreground">{ticket.createdAt}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  対応
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export function Loading() {
  return null
}
