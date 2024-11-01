import dayjs from 'dayjs'
import { connection, db } from './connection'
import { goals, goalsCompleted, users } from './schema'

const seed = async () => {
  await db.delete(goalsCompleted)
  await db.delete(goals)
  await db.delete(users)

  const [user] = await db
    .insert(users)
    .values({
      name: 'John Doe',
      externalAccountId: 1243456,
      avatarUrl: 'https://avatars.githubusercontent.com/u/1234567?v=4',
    })
    .returning()

  const goalsIds = await db
    .insert(goals)
    .values([
      { userId: user.id, title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalsCompleted).values([
    { goalsId: goalsIds[0].id, createdAt: startOfWeek.toDate() },
    // { goalsId: goalsIds[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  connection.end()
})
