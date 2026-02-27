import { createClient } from '@/lib/supabase/client'
import type { Spot } from '@/lib/mock-data'

function rowToSpot(row: Record<string, unknown>): Spot {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userNickname: row.user_nickname as string,
    placeId: row.place_id as string,
    name: row.name as string,
    address: row.address as string,
    lat: row.lat as number,
    lng: row.lng as number,
    category: row.category as string,
    saltLevel: row.salt_level as 'low' | 'medium' | 'high',
    menuItems: row.menu_items as { name: string; description: string; saltLevel: 'low' | 'medium' | 'high' }[],
    imageUrl: row.image_url as string,
    avgRating: Number(row.avg_rating),
    ratingCount: row.rating_count as number,
    createdAt: row.created_at as string,
  }
}

export async function getSpotsClient() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToSpot)
}

export async function createSpot(spot: {
  userId: string
  userNickname: string
  name: string
  address: string
  category: string
  saltLevel: 'low' | 'medium' | 'high'
  menuItems: { name: string; description: string; saltLevel: string }[]
  imageUrl?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('spots')
    .insert({
      user_id: spot.userId,
      user_nickname: spot.userNickname,
      name: spot.name,
      address: spot.address,
      category: spot.category,
      salt_level: spot.saltLevel,
      menu_items: spot.menuItems,
      image_url: spot.imageUrl || '',
    })
    .select()
    .single()
  if (error) throw error
  return rowToSpot(data)
}
