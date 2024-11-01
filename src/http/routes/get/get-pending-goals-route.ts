import { useAuthenticateUser } from '@/http/hooks/use-auth-user'
import { getWeekPendingGoals } from '@/services/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      onRequest: [useAuthenticateUser],
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

    async request => {
      const userId = request.user.sub
      const { pendingGoals } = await getWeekPendingGoals({ userId })

      return {
        pendingGoals,
      }
    }
  )
}
