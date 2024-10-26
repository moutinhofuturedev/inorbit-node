import zod from 'zod'

export const envSchema = zod.object({
  DATABASE_URL: zod.string().url(),
})

export const env = envSchema.parse(process.env)
