import { createClient } from '@/lib/supabase/client'
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

export async function createRating(rating: {
  userId: string
  userNickname: string
  targetType: 'recipe' | 'spot'
  targetId: string
  score: number
  comment: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ratings')
    .insert({
      user_id: rating.userId,
      user_nickname: rating.userNickname,
      target_type: rating.targetType,
      target_id: rating.targetId,
      score: rating.score,
      comment: rating.comment,
    })
    .select()
    .single()
  if (error) throw error
  return rowToRating(data)
}
