import { SignJWT } from 'jose'

export const authenticateUser = async (userId: string) => {
  const secret = new TextEncoder().encode(userId)

  const token = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret)

  return token
}
