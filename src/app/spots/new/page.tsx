"use client"

import { useSearchParams } from "next/navigation"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { spotCategories } from "@/lib/mock-data"
import { createSpot } from "@/lib/queries/spots"
import { addPoints } from "@/lib/queries/profiles"
import { toast } from "sonner"
import { 
  ChevronLeft, 
  Plus, 
  X, 
  Upload, 
  MapPin,
  Search,
  Sparkles
} from "lucide-react"

interface MenuItem {
  name: string
  description: string
  saltLevel: "low" | "medium" | "high"
}

export default function NewSpotPage() {
  return (
    <AuthGuard>
      <NewSpotContent />
    </AuthGuard>
  )
}

function NewSpotContent() {
  const router = useRouter()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [shopName, setShopName] = useState("")
  const [address, setAddress] = useState("")
  const [category, setCategory] = useState("")
  const [saltLevel, setSaltLevel] = useState<"low" | "medium" | "high">("low")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: "", description: "", saltLevel: "low" },
  ])
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: "", description: "", saltLevel: "low" }])
  }

  const removeMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index))
  }

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    const updated = [...menuItems]
    updated[index] = { ...updated[index], [field]: value }
    setMenuItems(updated)
  }

  const handleSubmit = async () => {
    if (!user) return
    setIsSubmitting(true)
    try {
      await createSpot({
        userId: user.id,
        userNickname: user.nickname,
        name: shopName,
        address,
        category,
        saltLevel,
        menuItems: menuItems.filter((m) => m.name),
        imageUrl: "/placeholder.svg",
      })
      await addPoints(user.id, 30)
      toast.success("スポットを投稿しました！", {
        description: "30ポイントを獲得しました。",
      })
      router.push("/spots")
    } catch {
      toast.error("投稿に失敗しました。もう一度お試しください。")
      setIsSubmitting(false)
    }
  }

  const canProceedStep1 = shopName && address && category
  const canProceedStep2 = menuItems.filter((m) => m.name).length >= 1

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Back button */}
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/spots">
              <ChevronLeft className="mr-1 h-4 w-4" />
              スポット一覧に戻る
            </Link>
          </Button>

          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>ステップ {step} / 3</span>
              <span>
                {step === 1 && "店舗情報"}
                {step === 2 && "メニュー"}
                {step === 3 && "写真・コメント"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Shop Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  店舗情報
                </CardTitle>
                <CardDescription>
                  店舗名と住所を入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName">店舗名 *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="shopName"
                      placeholder="店舗名を入力して検索"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Google Placesと連携すると自動補完されます
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">住所 *</Label>
                  <Input
                    id="address"
                    placeholder="例: 東京都千代田区丸の内1-9-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {spotCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>塩分レベル *</Label>
                  <RadioGroup 
                    value={saltLevel} 
                    onValueChange={(v) => setSaltLevel(v as "low" | "medium" | "high")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="flex cursor-pointer items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-[#10B981]" />
                        低塩（1.5g以下）
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="flex cursor-pointer items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-[#F59E0B]" />
                        中塩（1.5〜3g）
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="flex cursor-pointer items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-[#EF4444]" />
                        高塩（3g以上）
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                    次へ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Menu Items */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>おすすめメニュー</CardTitle>
                <CardDescription>
                  減塩でも美味しいメニューを教えてください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {menuItems.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          メニュー {index + 1}
                        </span>
                        {menuItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMenuItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="メニュー名"
                          value={item.name}
                          onChange={(e) => updateMenuItem(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder="おすすめポイント"
                          value={item.description}
                          onChange={(e) => updateMenuItem(index, "description", e.target.value)}
                        />
                        <RadioGroup 
                          value={item.saltLevel} 
                          onValueChange={(v) => updateMenuItem(index, "saltLevel", v)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id={`low-${index}`} />
                            <Label htmlFor={`low-${index}`} className="flex cursor-pointer items-center gap-2 text-sm">
                              <span className="inline-block h-2 w-2 rounded-full bg-[#10B981]" />
                              低塩
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id={`medium-${index}`} />
                            <Label htmlFor={`medium-${index}`} className="flex cursor-pointer items-center gap-2 text-sm">
                              <span className="inline-block h-2 w-2 rounded-full bg-[#F59E0B]" />
                              中塩
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addMenuItem} className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  メニューを追加
                </Button>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    戻る
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                    次へ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Photo & Comment */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>写真・コメント</CardTitle>
                <CardDescription>
                  写真やおすすめポイントを追加してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>写真</Label>
                  <div className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 transition-colors hover:border-primary hover:bg-secondary">
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        クリックまたはドラッグで写真をアップロード
                      </p>
                      <p className="text-xs text-muted-foreground">
                        最大3枚まで（任意）
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">おすすめポイント・コメント</Label>
                  <Textarea
                    id="comment"
                    placeholder="このお店のおすすめポイントや、減塩に役立つ情報を書いてください"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Preview */}
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">投稿プレビュー</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">店舗名:</span> {shopName}</p>
                    <p><span className="text-muted-foreground">住所:</span> {address}</p>
                    <p><span className="text-muted-foreground">カテゴリ:</span> {category}</p>
                    <p>
                      <span className="text-muted-foreground">塩分レベル:</span>{" "}
                      <span className={saltLevel === "low" ? "text-[#10B981]" : saltLevel === "medium" ? "text-[#F59E0B]" : "text-[#EF4444]"}>
                        {saltLevel === "low" ? "低塩" : saltLevel === "medium" ? "中塩" : "高塩"}
                      </span>
                    </p>
                    <p><span className="text-muted-foreground">メニュー数:</span> {menuItems.filter((m) => m.name).length}品</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    戻る
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "投稿中..."
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        投稿する（+30pt）
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export function Loading() {
  return null
}
