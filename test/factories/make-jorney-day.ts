import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  JorneyDay,
  JorneyDayProps,
} from '@/domain/gamefication/enterprise/entities/jorney-day'
import { randomUUID } from 'crypto'

export function makeJorneyDay(
  override: Partial<JorneyDayProps> = {},
  id?: UniqueEntityID,
) {
  const jorneyDay = JorneyDay.create(
    {
      classDayId: new UniqueEntityID(randomUUID()),
      jorneyId: new UniqueEntityID(randomUUID()),
      ...override,
    },
    id,
  )
  return jorneyDay
}
