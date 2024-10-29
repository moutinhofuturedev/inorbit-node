import { createGoalCompletion } from '@/services/create-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        tags: ['goals completions'],
        description: 'Create goal completion',
        body: zod.object({
          goalsId: zod.string(),
        }),
        response: {
          201: zod.null(),
        },
      },
    },

    async (request, reply) => {
      const { goalsId } = request.body

      await createGoalCompletion({
        goalsId,
      })

      return reply.status(201).send()
    }
  )
}