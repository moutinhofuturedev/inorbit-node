import { getUser } from '@/services/get-user'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const getUserRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/user',
    {
      schema: {
        tags: ['user'],
        description: 'Get authenticated user',
        response: {
          200: zod.object({
            user: zod.object({
              id: zod.string(),
              name: zod.string().nullable(),
              email: zod.string().nullable(),
              avatarUrl: zod.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const { user } = await getUser({ userId })

      return reply.status(200).send({ user: user })
    }
  )
}
