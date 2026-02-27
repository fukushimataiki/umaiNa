"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { deviceGuide, faqItems, type Recipe } from "@/lib/mock-data"
import { getRecipesClient } from "@/lib/queries/recipes"
import { createClient } from "@/lib/supabase/client"
import { 
  Crown, 
  BookOpen, 
  UtensilsCrossed, 
  Headphones, 
  Bell, 
  Zap,
  Star,
  ChevronRight,
  Send,
  HelpCircle,
  MessageSquare,
  Package
} from "lucide-react"

export default function OwnersLoungePage() {
  return (
    <AuthGuard requireDeviceOwner>
      <OwnersLoungeContent />
    </AuthGuard>
  )
}

function OwnersLoungeContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("home")
  const [supportCategory, setSupportCategory] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const [deviceRecipes, setDeviceRecipes] = useState<Recipe[]>([])
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)

  useEffect(() => {
    getRecipesClient()
      .then((recipes) => {
        setDeviceRecipes(recipes.filter((r) => r.isOfficial && r.currentLevel))
      })
      .catch(() => {})
  }, [])

  if (!user) return null

  const handleSupportSubmit = async () => {
    if (!supportCategory || !supportMessage) return
    setIsSubmittingTicket(true)
    try {
      const supabase = createClient()
      await supabase.from('support_tickets').insert({
        user_id: user.id,
        category: supportCategory,
        content: supportMessage,
        status: 'pending',
      })
      setSupportCategory("")
      setSupportMessage("")
    } catch {
      // silently fail
    }
    setIsSubmittingTicket(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/50 to-background">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          {/* Hero Banner */}
          <Card className="mb-8 overflow-hidden bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/40">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Crown className="h-8 w-8 text-[#FFD700]" />
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                      {"Owner's Lounge"}
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    ようこそ、{user.nickname}さん。
                    <br />
                    デバイス購入者限定の特別なエリアです。
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/60 p-4 dark:bg-black/20">
                  <Package className="h-10 w-10 text-[#FFD700]" />
                  <div>
                    <p className="text-sm text-muted-foreground">登録デバイス</p>
                    <p className="font-semibold text-foreground">umaiNa Standard</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="home" className="gap-2">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">ホーム</span>
              </TabsTrigger>
              <TabsTrigger value="guide" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">使い方</span>
              </TabsTrigger>
              <TabsTrigger value="recipes" className="gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                <span className="hidden sm:inline">専用レシピ</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2">
                <Headphones className="h-4 w-4" />
                <span className="hidden sm:inline">サポート</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">お知らせ</span>
              </TabsTrigger>
            </TabsList>

            {/* Home Tab */}
            <TabsContent value="home">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setActiveTab("guide")}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700]/20">
                      <BookOpen className="h-7 w-7 text-[#FFD700]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">使い方ガイド</h3>
                      <p className="text-sm text-muted-foreground">
                        デバイスの基本操作から活用法まで
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setActiveTab("recipes")}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <UtensilsCrossed className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">専用レシピ</h3>
                      <p className="text-sm text-muted-foreground">
                        推奨電流設定付きの公式レシピ
                      </p>
                    </div>
                    <Badge className="bg-primary">{deviceRecipes.length}</Badge>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setActiveTab("support")}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/10">
                      <Headphones className="h-7 w-7 text-[#10B981]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">公式サポート</h3>
                      <p className="text-sm text-muted-foreground">
                        お困りの際はこちらから
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setActiveTab("news")}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]/10">
                      <Bell className="h-7 w-7 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">お知らせ</h3>
                      <p className="text-sm text-muted-foreground">
                        最新情報をチェック
                      </p>
                    </div>
                    <Badge variant="secondary">2</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Tips */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#FFD700]" />
                    今日のヒント
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="font-medium text-foreground">
                      塩味を感じにくいときは、舌を軽く湿らせてみてください
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      唾液が少ない状態では電流が伝わりにくくなります。
                      水を少し含んでから使用すると、より効果的に塩味を感じられます。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Guide Tab */}
            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    使い方ガイド
                  </CardTitle>
                  <CardDescription>
                    デバイスを最大限に活用するためのガイドです
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deviceGuide.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 last:mb-0">
                      <h3 className="mb-4 text-lg font-semibold text-foreground">
                        {section.title}
                      </h3>
                      <Accordion type="single" collapsible className="w-full">
                        {section.items.map((item, itemIndex) => (
                          <AccordionItem key={itemIndex} value={`${sectionIndex}-${itemIndex}`}>
                            <AccordionTrigger className="text-left">
                              {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {item.content}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recipes Tab */}
            <TabsContent value="recipes">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5" />
                    デバイス専用レシピ
                  </CardTitle>
                  <CardDescription>
                    公式チームが検証した、推奨電流設定付きのレシピです
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-6 sm:grid-cols-2">
                {deviceRecipes.map((recipe) => (
                  <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={recipe.imageUrl || "/placeholder.svg"}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute left-3 top-3">
                          <Badge className="bg-[#FFD700] text-foreground">
                            <Crown className="mr-1 h-3 w-3" />
                            公式
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-primary text-primary-foreground">
                            <Zap className="mr-1 h-3 w-3" />
                            Lv.{recipe.currentLevel}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="mb-2 font-semibold text-foreground">
                          {recipe.title}
                        </h3>
                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>推定塩分 {recipe.estimatedSalt}g</span>
                          <span>|</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            {recipe.avgRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="rounded-lg bg-primary/5 p-3">
                          <p className="text-xs text-muted-foreground">推奨設定</p>
                          <p className="font-medium text-primary">
                            レベル {recipe.currentLevel} / {recipe.stimulusQuality}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      よくある質問
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger className="text-left text-sm">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      お問い合わせ
                    </CardTitle>
                    <CardDescription>
                      2営業日以内に回答いたします
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">カテゴリ</Label>
                      <Select value={supportCategory} onValueChange={setSupportCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usage">使い方について</SelectItem>
                          <SelectItem value="trouble">故障・トラブル</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">お問い合わせ内容</Label>
                      <Textarea
                        id="message"
                        placeholder="詳しい状況をお聞かせください"
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <Button className="w-full" onClick={handleSupportSubmit} disabled={isSubmittingTicket || !supportCategory || !supportMessage}>
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmittingTicket ? "送信中..." : "送信する"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Past Inquiries */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>お問い合わせ履歴</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-muted-foreground">
                    過去のお問い合わせはありません
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    お知らせ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">新機能</Badge>
                      <span className="text-sm text-muted-foreground">2026/01/20</span>
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      新しい専用レシピを追加しました
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      冬にぴったりの鍋料理レシピを3品追加しました。
                      推奨電流設定付きでお楽しみください。
                    </p>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>重要</Badge>
                      <span className="text-sm text-muted-foreground">2026/01/15</span>
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      メンテナンスのお知らせ
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      1月25日（土）午前2時〜6時にシステムメンテナンスを実施します。
                      この間、一部機能がご利用いただけません。
                    </p>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">お知らせ</Badge>
                      <span className="text-sm text-muted-foreground">2026/01/10</span>
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {"Owner's Lounge"} オープンのお知らせ
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {"デバイス購入者専用エリア「Owner's Lounge」がオープンしました。"}
                      使い方ガイド、専用レシピ、公式サポートをご利用いただけます。
                    </p>
                  </div>
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
