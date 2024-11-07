import { useAuthenticateUser } from '@/http/hooks/use-auth-user'
import { createGoals } from '@/services/create-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const createGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      onRequest: [useAuthenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Create goal',
        operationId: 'createGoals',
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
      const userId = request.user.sub
      const { title, desiredWeeklyFrequency } = request.body

      await createGoals({
        userId,
        title,
        desiredWeeklyFrequency,
      })

      return reply.status(201).send()
    }
  )
}
