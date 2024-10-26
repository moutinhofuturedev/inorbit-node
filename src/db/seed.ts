import dayjs from 'dayjs'
import { connection, db } from './connection'
import { goals, goalsCompleted } from './schema'

const seed = async () => {
  await db.delete(goalsCompleted)
  await db.delete(goals)

  const goalsIds = await db
    .insert(goals)
    .values([{ title: 'Acordar cedo', desiredWeeklyFrequency: 5 }])
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
