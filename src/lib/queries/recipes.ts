import { createClient } from '@/lib/supabase/client'
import type { Recipe } from '@/lib/mock-data'

function rowToRecipe(row: Record<string, unknown>): Recipe {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userNickname: row.user_nickname as string,
    userAvatar: row.user_avatar as string | undefined,
    title: row.title as string,
    category: row.category as string,
    tags: row.tags as string[],
    ingredients: row.ingredients as { name: string; amount: string }[],
    steps: row.steps as string[],
    estimatedSalt: Number(row.estimated_salt),
    imageUrl: row.image_url as string,
    views: row.views as number,
    avgRating: Number(row.avg_rating),
    ratingCount: row.rating_count as number,
    isOfficial: row.is_official as boolean,
    currentLevel: row.current_level as number | undefined,
    stimulusQuality: row.stimulus_quality as string | undefined,
    createdAt: row.created_at as string,
  }
}

export async function getRecipesClient() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToRecipe)
}

export async function createRecipe(recipe: {
  userId: string
  userNickname: string
  title: string
  category: string
  tags: string[]
  ingredients: { name: string; amount: string }[]
  steps: string[]
  estimatedSalt: number
  imageUrl: string
  isOfficial?: boolean
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      user_id: recipe.userId,
      user_nickname: recipe.userNickname,
      title: recipe.title,
      category: recipe.category,
      tags: recipe.tags,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      estimated_salt: recipe.estimatedSalt,
      image_url: recipe.imageUrl,
      is_official: recipe.isOfficial || false,
    })
    .select()
    .single()
  if (error) throw error
  return rowToRecipe(data)
}
