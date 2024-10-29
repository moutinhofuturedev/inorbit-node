import { db } from '@/db/connection'
import { users } from '@/db/schema'
import {
  getAccessTokenFromCode,
  getUserFromAccessToken,
} from '@/modules/github-oauth'
import { eq } from 'drizzle-orm'

interface AuthenticateFromGithubCodeRequest {
  code: string
}

export const authenticateFromGithubCode = async ({
  code,
}: AuthenticateFromGithubCodeRequest) => {
  const accessToken = await getAccessTokenFromCode(code)
  const githubUser = await getUserFromAccessToken(accessToken)

  const result = await db
    .select()
    .from(users)
    .where(eq(users.externalAccountId, githubUser.id))

  let userId: string | null

  const userAlreadyExists = result.length > 0

  if (userAlreadyExists) {
    userId = result[0].id
  } else {
    const [insertUsers] = await db
      .insert(users)
      .values({
        name: githubUser.name,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        externalAccountId: githubUser.id,
      })
      .returning()

    userId = insertUsers.id
  }
}
