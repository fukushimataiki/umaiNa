import { createClient } from '@/lib/supabase/server'
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

export async function getSpotsServer() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToSpot)
}

export async function getSpotByIdServer(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return rowToSpot(data)
}
