import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassDay, ClassDayProps } from '@/domain/enterprise/entities/class-day'
import { ClassDayStudentList } from '@/domain/enterprise/entities/class-day-student-list'
import {} from '@/domain/enterprise/entities/jorney-day'
import { randomUUID } from 'crypto'

export function makeClassDay(
  override: Partial<ClassDayProps> = {},
  id?: UniqueEntityID,
) {
  const classDay = ClassDay.create(
    {
      jorneyId: new UniqueEntityID(randomUUID()),
      currentDay: 1,
      date: new Date(),
      attendanceList: new ClassDayStudentList(),
      ...override,
    },
    id,
  )
  return classDay
}
