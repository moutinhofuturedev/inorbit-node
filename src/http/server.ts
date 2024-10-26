import { createCompletionRoute } from '@/http/routes/create-goals-completion-route'
import { createGoalsRoute } from '@/http/routes/create-goals-route'
import { createPendingGoalsRoute } from '@/http/routes/get-pending-goals-route'
import { getWeekSummaryRoute } from '@/http/routes/get-week-summary-route'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Registrando todas as minhas services
app.register(createGoalsRoute)
app.register(createCompletionRoute)
app.register(createPendingGoalsRoute)
app.register(getWeekSummaryRoute)

app
  .listen({
    port: 8001,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:8001')
  })
