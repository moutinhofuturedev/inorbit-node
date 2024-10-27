import { getWeekSummary } from '@/services/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
    {
      schema: {
        tags: ['summary'],
        description: 'Get week summary',
        response: {
          200: zod.object({
            summary: zod.object({
              completed: zod.number(),
              total: zod.number(),
              goalsPerDay: zod.record(
                zod.string(),
                zod.array(
                  zod.object({
                    id: zod.string(),
                    title: zod.string(),
                    completedAt: zod.string(),
                  })
                )
              ),
            }),
          }),
        },
      },
    },

    async () => {
      const { summary } = await getWeekSummary()

      return {
        summary,
      }
    }
  )
}
