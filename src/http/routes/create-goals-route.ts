import { createGoals } from '@/services/create-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const createGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        tags: ['goals'],
        description: 'Create goal',
        body: zod.object({
          title: zod.string(),
          desiredWeeklyFrequency: zod.number().int().min(1).max(7),
        }),
        response: {
          201: zod.null(),
        },
      },
    },

    async (request, reply) => {
      const { title, desiredWeeklyFrequency } = request.body

      await createGoals({
        title,
        desiredWeeklyFrequency,
      })

      return reply.status(201).send()
    }
  )
}
