"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpotCard } from "@/components/spot-card"
import { mockSpots, spotCategories } from "@/lib/mock-data"
import { Search, Plus, MapPin, List, Map } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function SpotsPage() {
  return (
    <Suspense>
      <SpotsContent />
    </Suspense>
  )
}

function SpotsContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("query") || "")
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.get("category") || "all")
  const [selectedSaltLevel, setSelectedSaltLevel] = useState<string>(searchParams?.get("saltLevel") || "all")
  const [sortBy, setSortBy] = useState(searchParams?.get("sortBy") || "popular")
  const [viewMode, setViewMode] = useState<"list" | "map">(searchParams?.get("viewMode") as "list" | "map" || "list")

  const filteredSpots = mockSpots
    .filter((spot) => {
      const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || spot.category === selectedCategory
      const matchesSaltLevel = selectedSaltLevel === "all" || spot.saltLevel === selectedSaltLevel
      return matchesSearch && matchesCategory && matchesSaltLevel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.ratingCount - a.ratingCount
        case "rating":
          return b.avgRating - a.avgRating
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">スポット</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {filteredSpots.length}件のスポットが見つかりました
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "map")}>
                <TabsList className="h-9">
                  <TabsTrigger value="list" className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm">
                    <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">リスト</span>
                  </TabsTrigger>
                  <TabsTrigger value="map" className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm">
                    <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">地図</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button asChild size="sm">
                <Link href="/spots/new">
                  <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">スポットを投稿</span>
                  <span className="sm:hidden">投稿</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
            {/* Search and Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="店名・エリアで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[120px] lg:w-[140px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {spotCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSaltLevel} onValueChange={setSelectedSaltLevel}>
                  <SelectTrigger className="w-full sm:w-[120px] lg:w-[140px]">
                    <SelectValue placeholder="塩分" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="low">低塩</SelectItem>
                    <SelectItem value="medium">中塩</SelectItem>
                    <SelectItem value="high">高塩</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[120px] lg:w-[140px]">
                    <SelectValue placeholder="並び替え" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">人気順</SelectItem>
                    <SelectItem value="rating">評価順</SelectItem>
                    <SelectItem value="newest">新着順</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salt Level Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
              <span className="text-muted-foreground">塩分レベル:</span>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-[#10B981] text-xs text-white">低塩</Badge>
                <span className="text-muted-foreground">1.5g以下</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-[#F59E0B] text-xs text-white">中塩</Badge>
                <span className="text-muted-foreground">1.5〜3g</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-[#EF4444] text-xs text-white">高塩</Badge>
                <span className="text-muted-foreground">3g以上</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === "list" ? (
            filteredSpots.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSpots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center sm:py-16">
                <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground sm:mb-4 sm:h-12 sm:w-12" />
                <p className="mb-2 text-base font-medium text-foreground sm:text-lg">
                  該当するスポットがありません
                </p>
                <p className="mb-4 px-4 text-sm text-muted-foreground sm:px-0 sm:text-base">
                  この地域にはまだスポットがありません。あなたが最初の投稿者になりませんか?
                </p>
                <Button asChild size="sm">
                  <Link href="/spots/new">
                    <Plus className="mr-2 h-4 w-4" />
                    スポットを投稿
                  </Link>
                </Button>
              </div>
            )
          ) : (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary sm:aspect-[16/9]">
              <div className="flex h-full items-center justify-center">
                <div className="text-center px-4">
                  <Map className="mx-auto mb-3 h-10 w-10 text-muted-foreground sm:mb-4 sm:h-12 sm:w-12" />
                  <p className="text-base font-medium text-foreground sm:text-lg">地図表示</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Google Maps APIを連携すると地図が表示されます
                  </p>
                </div>
              </div>
              {/* Placeholder pins */}
              {filteredSpots.map((spot, index) => (
                <div
                  key={spot.id}
                  className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg sm:h-8 sm:w-8"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 2) * 20}%`,
                  }}
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
