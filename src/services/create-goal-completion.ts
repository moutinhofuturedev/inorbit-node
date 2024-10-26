import { db } from '@/db/connection'
import { goals, goalsCompleted } from '@/db/schema'
import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

interface CreateGoalCompletionRequest {
  goalsId: string
}

export const createGoalCompletion = async ({
  goalsId,
}: CreateGoalCompletionRequest) => {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCompletionCounts = db.$with('goals_completion_up_to_counts').as(
    db
      .select({
        goalId: goalsCompleted.goalsId,
        completionCount: count(goalsCompleted.id).as('completionCount'),
      })
      .from(goalsCompleted)
      .where(
        and(
          gte(goalsCompleted.createdAt, firstDayOfWeek),
          lte(goalsCompleted.createdAt, lastDayOfWeek),
          eq(goalsCompleted.goalsId, goalsId)
        )
      )
      .groupBy(goalsCompleted.goalsId)
  )

  const resultGoal = await db
    .with(goalsCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalsCompletionCounts.completionCount}, 0)`.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalsCompletionCounts, eq(goalsCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalsId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = resultGoal[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed')
  }

  const insertResultGoal = await db
    .insert(goalsCompleted)
    .values({ goalsId })
    .returning()

  const goalCompletion = insertResultGoal[0]

  return {
    goalCompletion,
  }
}
