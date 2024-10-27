import zod from 'zod'

export const envSchema = zod.object({
  DATABASE_URL: zod.string().url(),

  GITHUB_CLIENT_ID: zod.string(),
  GITHUB_CLIENT_SECRET: zod.string(),
})

export const env = envSchema.parse(process.env)
