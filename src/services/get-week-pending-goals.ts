import { db } from '@/db/connection'
import { goals, goalsCompleted } from '@/db/schema'
import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import type { UserIdRequest } from './types/type'

export async function getWeekPendingGoals({ userId }: UserIdRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(and(lte(goals.createdAt, lastDayOfWeek), eq(goals.userId, userId)))
  )

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalsCompleted.goalsId,
        completionCount: count(goalsCompleted.id).as('completionCount'),
      })
      .from(goalsCompleted)
      .innerJoin(goals, eq(goals.id, goalsCompleted.goalsId))
      .where(
        and(
          gte(goalsCompleted.createdAt, firstDayOfWeek),
          lte(goalsCompleted.createdAt, lastDayOfWeek),
          eq(goals.userId, userId)
        )
      )
      .groupBy(goalsCompleted.goalsId)
  )

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    )

  return { pendingGoals }
}
