import { env } from '@/env'
import { authenticateFromGithubRoute } from '@/http/routes/auth/auth-from-github-route'
import { getPendingGoalsRoute } from '@/http/routes/get/get-pending-goals-route'
import { getUserRoute } from '@/http/routes/get/get-user-route'
import { getWeekSummaryRoute } from '@/http/routes/get/get-week-summary-route'
import { createCompletionRoute } from '@/http/routes/post/create-goals-completion-route'
import { createGoalsRoute } from '@/http/routes/post/create-goals-route'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'in.Orbit',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Registrando todas as minhas services
app.register(createGoalsRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(authenticateFromGithubRoute)
app.register(getUserRoute)

app
  .listen({
    port: 8001,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:8001')
  })
