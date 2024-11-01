import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface UserIdRequest {
  userId: string
}

export const getUser = async ({ userId }: UserIdRequest) => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId))

  const user = result[0]

  return {
    user,
  }
}
