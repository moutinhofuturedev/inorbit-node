import { useAuthenticateUser } from '@/http/hooks/use-auth-user'
import { getWeekSummary } from '@/services/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
    {
      onRequest: [useAuthenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Get week summary',
        operationId: 'getWeekSummary',
        response: {
          200: zod.object({
            summary: zod.object({
              completed: zod.number(),
              total: zod.number().nullable(),
              goalsPerDay: zod
                .record(
                  zod.string(),
                  zod.array(
                    zod.object({
                      id: zod.string(),
                      title: zod.string(),
                      completedAt: zod.string(),
                    })
                  )
                )
                .nullable(),
            }),
          }),
        },
      },
    },

    async request => {
      const userId = request.user.sub
      const { summary } = await getWeekSummary({ userId })

      return {
        summary,
      }
    }
  )
}
