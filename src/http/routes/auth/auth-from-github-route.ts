import { authenticateFromGithubCode } from '@/services/auth/auth-from-github-code'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import zod from 'zod'

export const authenticateFromGithubRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/auth/github',
    {
      schema: {
        tags: ['auth'],
        description: 'Authenticate user from github code',
        body: zod.object({
          code: zod.string(),
        }),
        response: {
          201: zod.object({ token: zod.string() }),
        },
      },
    },
    async (request, aply) => {
      const { code } = request.body

      const { token } = await authenticateFromGithubCode({ code })

      return aply.status(201).send({ token })
    }
  )
}
