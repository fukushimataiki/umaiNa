import { createClient } from '@/lib/supabase/client'

export async function getProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateProfile(userId: string, updates: {
  nickname?: string
  age_group?: string
  reduction_reason?: string
  points?: number
  rank?: string
  is_device_owner?: boolean
  device_number?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function addPoints(userId: string, points: number) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single()

  if (!profile) return

  const newPoints = profile.points + points
  let newRank = 'beginner'
  if (newPoints >= 1000) newRank = 'master'
  else if (newPoints >= 500) newRank = 'expert'
  else if (newPoints >= 100) newRank = 'regular'

  await supabase
    .from('profiles')
    .update({ points: newPoints, rank: newRank })
    .eq('id', userId)
}
