import { env } from '@/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Create a connection to the PostgreSQL database using the environment variable DATABASE_URL.
 */
export const connection = postgres(env.DATABASE_URL)

export const db = drizzle(connection, { schema, logger: true })
