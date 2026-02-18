"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RecipeCard } from "@/components/recipe-card"
import { mockRecipes, recipeCategories, recipeTags } from "@/lib/mock-data"
import { Search, Plus, Filter, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const Loading = () => null

export default function RecipesPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all")
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get("tags")
    return tags ? tags.split(",") : []
  })
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular")

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const filteredRecipes = mockRecipes
    .filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => recipe.tags.includes(tag))
      return matchesSearch && matchesCategory && matchesTags
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views
        case "rating":
          return b.avgRating - a.avgRating
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "salt-low":
          return a.estimatedSalt - b.estimatedSalt
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
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">レシピ</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {filteredRecipes.length}件のレシピが見つかりました
              </p>
            </div>
            <Button asChild size="sm" className="w-fit sm:w-auto">
              <Link href="/recipes/new">
                <Plus className="mr-2 h-4 w-4" />
                レシピを投稿
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
            {/* Search and Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="レシピを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {recipeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="並び替え" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">人気順</SelectItem>
                    <SelectItem value="rating">評価順</SelectItem>
                    <SelectItem value="newest">新着順</SelectItem>
                    <SelectItem value="salt-low">塩分低い順</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              {recipeTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs transition-colors sm:text-sm"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recipe Grid */}
          {filteredRecipes.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center sm:py-16">
              <p className="mb-4 text-base text-muted-foreground sm:text-lg">
                該当するレシピがありません
              </p>
              <Button variant="outline" size="sm" onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedTags([])
              }}>
                フィルターをリセット
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export { Loading }
