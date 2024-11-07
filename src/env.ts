import zod from 'zod'

export const envSchema = zod.object({
  DATABASE_URL: zod.string().url(),

  GITHUB_CLIENT_ID: zod.string(),
  GITHUB_CLIENT_SECRET: zod.string(),

  JWT_SECRET: zod.string(),

  NODE_ENV: zod
    .enum(['development', 'production', 'test'])
    .optional()
    .default('production'),
})

export const env = envSchema.parse(process.env)
