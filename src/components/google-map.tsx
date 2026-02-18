"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { MapPin, Navigation, ExternalLink, Minus, Plus, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Spot {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  saltLevel: "low" | "medium"
  category: string
  avgRating: number
}

interface GoogleMapProps {
  spots: Spot[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  showControls?: boolean
  selectedSpotId?: string
  onSpotSelect?: (spotId: string) => void
}

interface SingleSpotMapProps {
  lat: number
  lng: number
  name: string
  address: string
  height?: string
}

// Single spot map using Google Maps Embed
export function SingleSpotMap({ lat, lng, name, address, height = "300px" }: SingleSpotMapProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6CE-CxGDGi3eJ-Y&q=${encodeURIComponent(address)}&center=${lat},${lng}&zoom=16`
  
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${name}の地図`}
      />
    </div>
  )
}

// Multi-spot interactive map using custom markers
export function GoogleMap({ 
  spots, 
  center, 
  zoom = 13, 
  height = "500px",
  showControls = true,
  selectedSpotId,
  onSpotSelect 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [mapCenter, setMapCenter] = useState(center || calculateCenter(spots))
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null)

  // Calculate center from spots if not provided
  function calculateCenter(spots: Spot[]) {
    if (spots.length === 0) return { lat: 35.6812, lng: 139.7671 } // Tokyo default
    const avgLat = spots.reduce((sum, s) => sum + s.lat, 0) / spots.length
    const avgLng = spots.reduce((sum, s) => sum + s.lng, 0) / spots.length
    return { lat: avgLat, lng: avgLng }
  }

  // Convert lat/lng to pixel position
  const getMarkerPosition = useCallback((lat: number, lng: number) => {
    const scale = Math.pow(2, currentZoom)
    const worldCoordX = ((lng + 180) / 360) * 256 * scale
    const worldCoordY = ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * 256 * scale
    
    const centerX = ((mapCenter.lng + 180) / 360) * 256 * scale
    const centerY = ((1 - Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) / Math.PI) / 2) * 256 * scale
    
    const containerWidth = mapRef.current?.offsetWidth || 800
    const containerHeight = mapRef.current?.offsetHeight || 500
    
    return {
      x: (worldCoordX - centerX) + containerWidth / 2,
      y: (worldCoordY - centerY) + containerHeight / 2
    }
  }, [currentZoom, mapCenter])

  const handleZoomIn = () => setCurrentZoom(z => Math.min(z + 1, 18))
  const handleZoomOut = () => setCurrentZoom(z => Math.max(z - 1, 8))
  const handleRecenter = () => setMapCenter(calculateCenter(spots))

  const saltColors = {
    low: "#10B981",
    medium: "#F59E0B"
  }

  // Generate static map URL
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=${currentZoom}&size=800x500&scale=2&maptype=roadmap&key=AIzaSyBFw0Qbyq9zTFTd-tUY6CE-CxGDGi3eJ-Y${spots.map(s => `&markers=color:${s.saltLevel === 'low' ? 'green' : 'orange'}|${s.lat},${s.lng}`).join('')}`

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border" style={{ height }}>
      {/* Map Background - Using OpenStreetMap tiles */}
      <div 
        ref={mapRef}
        className="relative h-full w-full bg-secondary"
        style={{
          backgroundImage: `url('https://tile.openstreetmap.org/${Math.round(currentZoom)}/${Math.floor((mapCenter.lng + 180) / 360 * Math.pow(2, Math.round(currentZoom)))}/${Math.floor((1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, Math.round(currentZoom)))}.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-90" />
        
        {/* Map grid overlay for visual effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Spot Markers */}
        {spots.map((spot) => {
          const pos = getMarkerPosition(spot.lat, spot.lng)
          const isSelected = selectedSpotId === spot.id
          const isHovered = hoveredSpot === spot.id

          return (
            <div
              key={spot.id}
              className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
              style={{ 
                left: `${pos.x}px`, 
                top: `${pos.y}px`,
                zIndex: isSelected || isHovered ? 50 : 10
              }}
              onMouseEnter={() => setHoveredSpot(spot.id)}
              onMouseLeave={() => setHoveredSpot(null)}
              onClick={() => onSpotSelect?.(spot.id)}
            >
              {/* Marker */}
              <button
                type="button"
                className={`
                  flex items-center justify-center rounded-full shadow-lg transition-all cursor-pointer
                  ${isSelected ? 'h-12 w-12 ring-4 ring-white' : isHovered ? 'h-11 w-11' : 'h-9 w-9'}
                `}
                style={{ backgroundColor: saltColors[spot.saltLevel] }}
              >
                <MapPin className={`text-white ${isSelected ? 'h-6 w-6' : 'h-4 w-4'}`} />
              </button>

              {/* Info Popup */}
              {(isSelected || isHovered) && (
                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="rounded-lg bg-card p-3 shadow-xl border border-border">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground text-sm line-clamp-1">{spot.name}</h3>
                      <Badge 
                        className={`shrink-0 text-xs ${spot.saltLevel === 'low' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'} text-white`}
                      >
                        {spot.saltLevel === 'low' ? '低塩' : '中塩'}
                      </Badge>
                    </div>
                    <p className="mb-2 text-xs text-muted-foreground line-clamp-1">{spot.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{spot.category}</span>
                      <Link 
                        href={`/spots/${spot.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 border-8 border-transparent border-t-card" />
                </div>
              )}
            </div>
          )
        })}

        {/* Controls */}
        {showControls && (
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-9 w-9 bg-card shadow-md hover:bg-card/90"
              onClick={handleZoomIn}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-9 w-9 bg-card shadow-md hover:bg-card/90"
              onClick={handleZoomOut}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-9 w-9 bg-card shadow-md hover:bg-card/90"
              onClick={handleRecenter}
            >
              <Locate className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-card/95 px-3 py-2 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#10B981]" />
            <span className="text-xs text-foreground">低塩</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
            <span className="text-xs text-foreground">中塩</span>
          </div>
        </div>

        {/* Open in Google Maps */}
        <div className="absolute bottom-3 right-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-card shadow-md hover:bg-card/90"
            asChild
          >
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapCenter.lat},${mapCenter.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Google Mapsで開く
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
