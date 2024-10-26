import { db } from '../db/connection'
import { goals } from '../db/schema'

interface CreateGoalsRequest {
  title: string
  desiredWeeklyFrequency: number
}

export const createGoals = async ({
  title,
  desiredWeeklyFrequency,
}: CreateGoalsRequest) => {
  const resultGoals = await db
    .insert(goals)
    .values({ title, desiredWeeklyFrequency })
    .returning()

  const goal = resultGoals[0]

  return {
    goal,
  }
}
