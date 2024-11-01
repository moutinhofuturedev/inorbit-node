import type { FastifyReply, FastifyRequest } from 'fastify'

export const useAuthenticateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
