import { getWeekPendingGoals } from '@/services/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      schema: {
        tags: ['pending goals'],
        description: 'Get pending goals',
        response: {
          200: zod.object({
            pendingGoals: zod.array(
              zod.object({
                id: zod.string(),
                title: zod.string(),
                desiredWeeklyFrequency: zod.number(),
                completionCount: zod.number(),
              })
            ),
          }),
        },
      },
    },

    async () => {
      const { pendingGoals } = await getWeekPendingGoals()

      return {
        pendingGoals,
      }
    }
  )
}
