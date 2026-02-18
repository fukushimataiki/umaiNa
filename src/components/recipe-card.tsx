import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Eye, Zap, Award } from "lucide-react"
import type { Recipe } from "@/lib/mock-data"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="group h-full overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1.5">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-video">
          <Image
            src={recipe.imageUrl || "/placeholder.svg"}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Warm gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {recipe.isOfficial && (
            <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
              <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-sm text-xs px-2 py-0.5">
                <Award className="mr-1 h-3 w-3" />
                公式
              </Badge>
            </div>
          )}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-md text-xs px-2.5 py-0.5 shadow-sm">
              塩分 {recipe.estimatedSalt}g
            </Badge>
          </div>
        </div>
        <CardContent className="p-3.5 sm:p-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="border-primary/20 text-xs px-2 py-0 text-primary/80">
              {recipe.category}
            </Badge>
            {recipe.currentLevel && (
              <Badge variant="secondary" className="bg-primary/8 text-primary text-xs px-2 py-0">
                <Zap className="mr-0.5 h-3 w-3" />
                Lv.{recipe.currentLevel}
              </Badge>
            )}
          </div>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
            {recipe.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B] sm:h-4 sm:w-4" />
                {recipe.avgRating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {recipe.views.toLocaleString()}
              </span>
            </div>
            <span className="text-xs truncate max-w-[80px]">{recipe.userNickname}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
