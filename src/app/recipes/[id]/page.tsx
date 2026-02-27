import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getRecipeByIdServer } from "@/lib/queries/recipes.server"
import { getRatingsByTargetServer } from "@/lib/queries/ratings.server"
import { 
  Star, 
  Eye, 
  Heart, 
  Share2, 
  Clock, 
  Users, 
  Zap, 
  Award,
  ChevronLeft,
  MessageSquare
} from "lucide-react"

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recipe = await getRecipeByIdServer(id)

  if (!recipe) {
    notFound()
  }

  const recipeRatings = await getRatingsByTargetServer("recipe", recipe.id)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Back button */}
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recipes">
              <ChevronLeft className="mr-1 h-4 w-4" />
              レシピ一覧に戻る
            </Link>
          </Button>
        </div>

        <article className="mx-auto max-w-4xl px-4 py-6">
          {/* Hero Image */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={recipe.imageUrl || "/placeholder.svg"}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
            {recipe.isOfficial && (
              <div className="absolute left-4 top-4">
                <Badge className="bg-[#FFD700] text-foreground">
                  <Award className="mr-1 h-4 w-4" />
                  公式レシピ
                </Badge>
              </div>
            )}
          </div>

          {/* Title and Meta */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="outline">{recipe.category}</Badge>
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {recipe.currentLevel && (
                <Badge className="bg-primary/10 text-primary">
                  <Zap className="mr-1 h-3 w-3" />
                  推奨レベル {recipe.currentLevel}
                </Badge>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              {recipe.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {recipe.userNickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{recipe.userNickname}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-medium text-foreground">{recipe.avgRating.toFixed(1)}</span>
                <span className="text-sm">({recipe.ratingCount}件)</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-5 w-5" />
                <span>{recipe.views.toLocaleString()}回</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg">🧂</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">推定塩分</p>
                  <p className="text-lg font-bold text-foreground">{recipe.estimatedSalt}g</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">調理時間</p>
                  <p className="text-lg font-bold text-foreground">20分</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">分量</p>
                  <p className="text-lg font-bold text-foreground">2人分</p>
                </div>
              </CardContent>
            </Card>
            {recipe.currentLevel && (
              <Card className="bg-primary/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">推奨電流</p>
                    <p className="text-lg font-bold text-primary">Lv.{recipe.currentLevel}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Device Instructions (if official) */}
          {recipe.isOfficial && recipe.stimulusQuality && (
            <Card className="mb-8 border-[#FFD700]/50 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#FFD700]" />
                  デバイス使用ガイド
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">推奨電流レベル</p>
                    <p className="text-lg font-bold text-foreground">レベル {recipe.currentLevel}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">刺激の質</p>
                    <p className="text-lg font-bold text-foreground">{recipe.stimulusQuality}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  このレシピは公式チームが実際にデバイスで検証しています。
                  上記の設定で塩味を増強することで、より満足感のある味わいになります。
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Ingredients */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>材料</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-foreground">{ingredient.name}</span>
                      <span className="text-muted-foreground">{ingredient.amount}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>作り方</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-6">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-foreground">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" size="lg">
              <Heart className="mr-2 h-5 w-5" />
              お気に入り
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="mr-2 h-5 w-5" />
              シェア
            </Button>
          </div>

          <Separator className="my-12" />

          {/* Comments Section */}
          <section>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
              <MessageSquare className="h-6 w-6" />
              みんなの声 ({recipeRatings.length}件)
            </h2>

            {recipeRatings.length > 0 ? (
              <div className="space-y-4">
                {recipeRatings.map((rating) => (
                  <Card key={rating.id}>
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {rating.userNickname.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{rating.userNickname}</p>
                            <p className="text-sm text-muted-foreground">{rating.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.score
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-foreground">{rating.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    まだコメントがありません。最初のコメントを投稿してみましょう。
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">コメントを投稿</h3>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="rounded p-1 transition-colors hover:bg-secondary"
                    >
                      <Star className="h-6 w-6 text-muted-foreground hover:fill-primary hover:text-primary" />
                    </button>
                  ))}
                </div>
                <textarea
                  className="mb-4 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  placeholder="このレシピの感想を書いてください..."
                />
                <Button>コメントを投稿</Button>
              </CardContent>
            </Card>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
