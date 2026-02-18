import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"
import type { Spot } from "@/lib/mock-data"

interface SpotCardProps {
  spot: Spot
}

export function SpotCard({ spot }: SpotCardProps) {
  const saltLevelConfig = {
    low: { label: "低塩", color: "bg-gradient-to-r from-[#10B981] to-[#059669] text-white" },
    medium: { label: "中塩", color: "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white" },
    high: { label: "高塩", color: "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white" },
  }
  const saltConfig = saltLevelConfig[spot.saltLevel]

  return (
    <Link href={`/spots/${spot.id}`}>
      <Card className="group h-full overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1.5">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-video">
          <Image
            src={spot.imageUrl || "/placeholder.svg"}
            alt={spot.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Warm gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
            <Badge className={`${saltConfig.color} shadow-sm text-xs px-2.5 py-0.5`}>
              {saltConfig.label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3.5 sm:p-4">
          <Badge variant="outline" className="mb-2 border-primary/20 text-xs px-2 py-0 text-primary/80">
            {spot.category}
          </Badge>
          <h3 className="mb-2 line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
            {spot.name}
          </h3>
          <p className="mb-2.5 flex items-start gap-1.5 text-xs text-muted-foreground sm:mb-3 sm:text-sm">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/50 sm:h-4 sm:w-4" />
            <span className="line-clamp-1">{spot.address}</span>
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B] sm:h-4 sm:w-4" />
              {spot.avgRating.toFixed(1)}
              <span className="text-xs">({spot.ratingCount})</span>
            </span>
            <span className="text-xs truncate max-w-[80px]">{spot.userNickname}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
