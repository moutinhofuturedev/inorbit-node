import { createGoalCompletion } from '@/services/create-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        body: zod.object({
          goalsId: zod.string(),
        }),
      },
    },
    async request => {
      const { goalsId } = request.body

      await createGoalCompletion({
        goalsId,
      })
    }
  )
}
