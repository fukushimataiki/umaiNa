import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RecipeCard } from "@/components/recipe-card"
import { SpotCard } from "@/components/spot-card"
import { DashboardSection } from "@/components/dashboard-section"
import { getRecipesServer } from "@/lib/queries/recipes.server"
import { getSpotsServer } from "@/lib/queries/spots.server"
import {
  ArrowRight,
  MapPin,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Leaf
} from "lucide-react"

export default async function HomePage() {
  const [recipes, spots] = await Promise.all([
    getRecipesServer().catch(() => []),
    getSpotsServer().catch(() => []),
  ])
  const popularRecipes = recipes.slice(0, 3)
  const popularSpots = spots.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-12 sm:py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-warm-50 via-warm-100/60 to-background" />
          <div className="animate-float absolute -right-16 top-8 hidden h-64 w-64 rounded-full bg-primary/8 blur-3xl sm:block" />
          <div className="animate-float-delayed absolute -left-24 bottom-0 hidden h-80 w-80 rounded-full bg-warm-200/40 blur-3xl sm:block" />
          <div className="animate-pulse-warm absolute right-1/4 top-1/3 hidden h-32 w-32 rounded-full bg-sage/8 blur-2xl sm:block" />

          <div className="relative mx-auto max-w-7xl">
            <div className="text-center">
              <div className="animate-fade-in-up opacity-0">
                <Badge variant="secondary" className="mb-4 border-primary/15 bg-warm-50 px-4 py-1.5 text-xs text-primary sm:mb-5 sm:text-sm">
                  <Leaf className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                  減塩をポジティブに
                </Badge>
              </div>
              <h1 className="animate-fade-in-up animation-delay-100 mb-5 text-balance text-4xl font-bold tracking-tight text-foreground opacity-0 sm:mb-7 sm:text-5xl md:text-6xl lg:text-7xl">
                美味しさを
                <span className="text-gradient-warm">デザイン</span>
                する
              </h1>
              <p className="animate-fade-in-up animation-delay-200 mx-auto mb-8 max-w-2xl px-2 text-pretty text-base leading-relaxed text-muted-foreground opacity-0 sm:mb-10 sm:px-0 sm:text-lg lg:text-xl">
                減塩が必要な人のためのコミュニティプラットフォーム。
                <br className="hidden sm:block" />
                美味しい減塩レシピ、グルメスポット、仲間との交流を通じて、
                <br className="hidden sm:block" />
                減塩ライフを楽しみましょう。
              </p>
              <div className="animate-fade-in-up animation-delay-300 flex flex-col items-center justify-center gap-3 px-4 opacity-0 sm:flex-row sm:gap-4 sm:px-0">
                <Button size="lg" asChild className="w-full rounded-xl bg-gradient-to-r from-primary to-warm-600 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 sm:w-auto">
                  <Link href="/recipes">
                    <UtensilsCrossed className="mr-2 h-5 w-5" />
                    レシピを探す
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full rounded-xl border-primary/20 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80 hover:border-primary/30 sm:w-auto">
                  <Link href="/spots">
                    <MapPin className="mr-2 h-5 w-5" />
                    スポットを探す
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border/60 bg-card/50 px-4 py-8 backdrop-blur-sm sm:py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            {[
              { label: "レシピ数", value: String(recipes.length), icon: UtensilsCrossed, color: "from-primary/15 to-warm-200/50" },
              { label: "スポット数", value: String(spots.length), icon: MapPin, color: "from-sage/15 to-sage-light/50" },
              { label: "ユーザー数", value: "—", icon: Users, color: "from-blue-100/50 to-blue-50/30" },
              { label: "節約塩分量", value: "—", icon: TrendingUp, color: "from-amber-100/50 to-yellow-50/30" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} sm:mb-3 sm:h-14 sm:w-14`}>
                  <stat.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <p className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Dashboard */}
        <DashboardSection />

        {/* Popular Recipes */}
        <section className="bg-gradient-to-b from-warm-50/50 to-background px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">人気のレシピ</h2>
                <p className="text-sm text-muted-foreground sm:text-base">みんなが作っている減塩レシピ</p>
              </div>
              <Button variant="outline" asChild size="sm" className="w-fit rounded-xl border-primary/20 bg-transparent text-primary hover:bg-primary/8">
                <Link href="/recipes">
                  すべて見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {popularRecipes.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {popularRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">まだレシピがありません</p>
            )}
          </div>
        </section>

        {/* Popular Spots */}
        <section className="px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">人気のスポット</h2>
                <p className="text-sm text-muted-foreground sm:text-base">減塩でも美味しい外食店</p>
              </div>
              <Button variant="outline" asChild size="sm" className="w-fit rounded-xl border-primary/20 bg-transparent text-primary hover:bg-primary/8">
                <Link href="/spots">
                  すべて見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {popularSpots.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {popularSpots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">まだスポットがありません</p>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden px-4 py-12 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-warm-600 to-warm-700" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="mb-3 text-2xl font-bold text-white sm:mb-5 sm:text-3xl lg:text-4xl">
              減塩ライフを始めましょう
            </h2>
            <p className="mb-8 px-2 text-base text-white/80 sm:mb-10 sm:px-0 sm:text-lg">
              無料で登録して、美味しい減塩レシピやスポットを共有しましょう。
              <br className="hidden sm:block" />
              同じ悩みを持つ仲間との交流があなたを待っています。
            </p>
            <div className="flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4 sm:px-0">
              <Button size="lg" variant="secondary" asChild className="w-full rounded-xl bg-white text-primary shadow-lg hover:bg-white/90 sm:w-auto">
                <Link href="/register">
                  無料で始める
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto" asChild>
                <Link href="/about">
                  詳しく見る
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
