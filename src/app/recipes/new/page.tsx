"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { recipeCategories, recipeTags } from "@/lib/mock-data"
import { createRecipe } from "@/lib/queries/recipes"
import { addPoints } from "@/lib/queries/profiles"
import { toast } from "sonner"
import { 
  ChevronLeft, 
  Plus, 
  X, 
  Upload, 
  UtensilsCrossed,
  Sparkles
} from "lucide-react"

interface Ingredient {
  name: string
  amount: string
}

export default function NewRecipePage() {
  return (
    <AuthGuard>
      <NewRecipeContent />
    </AuthGuard>
  )
}

function NewRecipeContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
  ])
  const [steps, setSteps] = useState<string[]>(["", ""])
  const [estimatedSalt, setEstimatedSalt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients]
    updated[index][field] = value
    setIngredients(updated)
  }

  const addStep = () => {
    setSteps([...steps, ""])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index: number, value: string) => {
    const updated = [...steps]
    updated[index] = value
    setSteps(updated)
  }

  const handleSubmit = async () => {
    if (!user) return
    setIsSubmitting(true)
    try {
      await createRecipe({
        userId: user.id,
        userNickname: user.nickname,
        title,
        category,
        tags: selectedTags,
        ingredients: ingredients.filter((i) => i.name && i.amount),
        steps: steps.filter((s) => s),
        estimatedSalt: estimatedSalt ? parseFloat(estimatedSalt) : 0,
        imageUrl: "/placeholder.svg",
      })
      await addPoints(user.id, 50)
      toast.success("レシピを投稿しました！", {
        description: "50ポイントを獲得しました。",
      })
      router.push("/recipes")
    } catch {
      toast.error("投稿に失敗しました。もう一度お試しください。")
      setIsSubmitting(false)
    }
  }

  const canProceedStep1 = title && category
  const canProceedStep2 = ingredients.filter((i) => i.name && i.amount).length >= 2
  const canProceedStep3 = steps.filter((s) => s).length >= 1

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Back button */}
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/recipes">
              <ChevronLeft className="mr-1 h-4 w-4" />
              レシピ一覧に戻る
            </Link>
          </Button>

          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>ステップ {step} / 3</span>
              <span>
                {step === 1 && "基本情報"}
                {step === 2 && "材料"}
                {step === 3 && "作り方"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  基本情報
                </CardTitle>
                <CardDescription>
                  レシピのタイトルとカテゴリを入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">レシピ名 *</Label>
                  <Input
                    id="title"
                    placeholder="例: 出汁香る減塩味噌汁"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipeCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>タグ（複数選択可）</Label>
                  <div className="flex flex-wrap gap-2">
                    {recipeTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
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

                <div className="space-y-2">
                  <Label htmlFor="salt">推定塩分量（g）</Label>
                  <Input
                    id="salt"
                    type="number"
                    step="0.1"
                    placeholder="例: 0.8"
                    value={estimatedSalt}
                    onChange={(e) => setEstimatedSalt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    一人分の推定塩分量を入力してください（任意）
                  </p>
                </div>

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

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                    次へ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Ingredients */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>材料</CardTitle>
                <CardDescription>
                  必要な材料と分量を入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="材料名"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="分量"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                        className="w-32"
                      />
                      {ingredients.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addIngredient} className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  材料を追加
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

          {/* Step 3: Steps */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>作り方</CardTitle>
                <CardDescription>
                  調理手順を順番に入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {steps.map((s, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Textarea
                          placeholder={`手順 ${index + 1}`}
                          value={s}
                          onChange={(e) => updateStep(index, e.target.value)}
                          rows={2}
                        />
                      </div>
                      {steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addStep} className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  手順を追加
                </Button>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    戻る
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!canProceedStep3 || isSubmitting}
                  >
                    {isSubmitting ? (
                      "投稿中..."
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        投稿する（+50pt）
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
