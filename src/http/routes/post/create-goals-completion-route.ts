import { useAuthenticateUser } from '@/http/hooks/use-auth-user'
import { createGoalCompletion } from '@/services/create-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      onRequest: [useAuthenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Create goal completion',
        operationId: 'createGoalCompletion',
        body: zod.object({
          goalsId: zod.string(),
        }),
        response: {
          201: zod.null(),
        },
      },
    },

    async (request, reply) => {
      const userId = request.user.sub
      const { goalsId } = request.body

      await createGoalCompletion({
        userId,
        goalsId,
      })

      return reply.status(201).send()
    }
  )
}
