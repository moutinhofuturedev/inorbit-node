import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'
import { createGoals } from '../../services/create-goals'

export const createGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        body: zod.object({
          title: zod.string(),
          desiredWeeklyFrequency: zod.number().int().min(1).max(7),
        }),
      },
    },
    async request => {
      const { title, desiredWeeklyFrequency } = request.body

      await createGoals({
        title,
        desiredWeeklyFrequency,
      })

      return {
        title,
        desiredWeeklyFrequency,
      }
    }
  )
}
