import { createClient } from '@/lib/supabase/server'
import type { Rating } from '@/lib/mock-data'

function rowToRating(row: Record<string, unknown>): Rating {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userNickname: row.user_nickname as string,
    userAvatar: row.user_avatar as string | undefined,
    targetType: row.target_type as 'recipe' | 'spot',
    targetId: row.target_id as string,
    score: row.score as number,
    comment: row.comment as string,
    createdAt: row.created_at as string,
  }
}

export async function getRatingsByTargetServer(targetType: 'recipe' | 'spot', targetId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToRating)
}
