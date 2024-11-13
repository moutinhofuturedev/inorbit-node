import { env } from '@/env'

interface AccessTokenResponse {
  access_token: string
}

interface GetUserReposnse {
  id: number
  name: string | null
  email: string | null
  avatar_url: string
}

export const getAccessTokenFromCode = async (code: string) => {
  const accessTokenUrl = new URL('https://github.com/login/oauth/access_token')

  accessTokenUrl.searchParams.append('client_id', env.GITHUB_CLIENT_ID)
  accessTokenUrl.searchParams.append('client_secret', env.GITHUB_CLIENT_SECRET)
  accessTokenUrl.searchParams.append('code', code)

  const response = await fetch(accessTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })

  const { access_token }: AccessTokenResponse = await response.json()

  return access_token
}

export const getUserFromAccessToken = async (accessToken: string) => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data: GetUserReposnse = await response.json()

  return data
}
