import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { getWeekSummaryRoute } from './routes//get-week-summary-route'
import { createCompletionRoute } from './routes/create-goals-completion-route'
import { createGoalsRoute } from './routes/create-goals-route'
import { createPendingGoalsRoute } from './routes/get-pending-goals-route'

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
