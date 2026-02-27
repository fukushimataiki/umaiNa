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
import { SingleSpotMap } from "@/components/google-map"
import { getSpotByIdServer } from "@/lib/queries/spots.server"
import { getRatingsByTargetServer } from "@/lib/queries/ratings.server"
import { 
  Star, 
  MapPin, 
  Heart, 
  Share2, 
  Phone,
  Clock,
  ExternalLink,
  ChevronLeft,
  MessageSquare,
  Navigation
} from "lucide-react"

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const spot = await getSpotByIdServer(id)

  if (!spot) {
    notFound()
  }

  const spotRatings = await getRatingsByTargetServer("spot", spot.id)

  const saltLevelConfig = {
    low: { label: "低塩", color: "bg-[#10B981] text-white", description: "塩分1.5g以下のメニューあり" },
    medium: { label: "中塩", color: "bg-[#F59E0B] text-white", description: "塩分1.5〜3gのメニューあり" },
    high: { label: "高塩", color: "bg-[#EF4444] text-white", description: "塩分3g以上のメニュー" },
  }
  const saltConfig = saltLevelConfig[spot.saltLevel]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Back button */}
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/spots">
              <ChevronLeft className="mr-1 h-4 w-4" />
              スポット一覧に戻る
            </Link>
          </Button>
        </div>

        <article className="mx-auto max-w-4xl px-4 py-6">
          {/* Hero Image */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={spot.imageUrl || "/placeholder.svg"}
              alt={spot.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute left-4 top-4">
              <Badge className={saltConfig.color}>
                {saltConfig.label}
              </Badge>
            </div>
          </div>

          {/* Title and Meta */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="outline">{spot.category}</Badge>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              {spot.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {spot.userNickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>投稿: {spot.userNickname}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-medium text-foreground">{spot.avgRating.toFixed(1)}</span>
                <span className="text-sm">({spot.ratingCount}件)</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Menu Items */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>おすすめメニュー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spot.menuItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between rounded-lg border border-border p-4"
                      >
                        <div>
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Badge className={saltLevelConfig[item.saltLevel].color}>
                          {saltLevelConfig[item.saltLevel].label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>アクセス</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-secondary">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Google Maps APIを連携すると地図が表示されます
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{spot.address}</p>
                      <Button variant="link" className="h-auto p-0 text-primary" asChild>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Google Mapsで開く
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Info Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>店舗情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">営業時間</p>
                      <p className="font-medium text-foreground">11:00 - 22:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">電話番号</p>
                      <p className="font-medium text-foreground">03-1234-5678</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">塩分レベル</p>
                    <Badge className={saltConfig.color}>{saltConfig.label}</Badge>
                    <p className="mt-1 text-sm text-muted-foreground">{saltConfig.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="mr-2 h-5 w-5" />
                    ルート案内
                  </a>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  行きたい
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Share2 className="mr-2 h-5 w-5" />
                  シェア
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Comments Section */}
          <section>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
              <MessageSquare className="h-6 w-6" />
              口コミ ({spotRatings.length}件)
            </h2>

            {spotRatings.length > 0 ? (
              <div className="space-y-4">
                {spotRatings.map((rating) => (
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
                    まだ口コミがありません。最初の口コミを投稿してみましょう。
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">口コミを投稿</h3>
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
                  placeholder="このスポットの感想を書いてください..."
                />
                <Button>口コミを投稿</Button>
              </CardContent>
            </Card>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
