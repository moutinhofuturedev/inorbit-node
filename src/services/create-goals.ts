import { db } from '@/db/connection'
import { goals } from '@/db/schema'

interface CreateGoalsRequest {
  userId: string
  title: string
  desiredWeeklyFrequency: number
}

export const createGoals = async ({
  userId,
  title,
  desiredWeeklyFrequency,
}: CreateGoalsRequest) => {
  const resultGoals = await db
    .insert(goals)
    .values({ userId, title, desiredWeeklyFrequency })
    .returning()

  const goal = resultGoals[0]

  return {
    goal,
  }
}
