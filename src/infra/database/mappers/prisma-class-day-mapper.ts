import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'
import { Prisma, JourneyDay } from '@prisma/client'

type PrismaClassDayWithMaxDay = JourneyDay & {
  journey: {
    maxDay: number
  }
}

export class PrismaClassDayMapper {
  static toDomain(raw: PrismaClassDayWithMaxDay): ClassDay {
    return ClassDay.create(
      {
        currentDay: raw.currentProgress,
        date: raw.date,
        maxDay: raw.journey.maxDay,
        jorneyId: new UniqueEntityID(raw.jorneyId),
        content: raw.content,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(classday: ClassDay): Prisma.JourneyDayUncheckedCreateInput {
    return {
      id: classday.id.toString(),
      date: classday.date,
      jorneyId: classday.jorneyId.toString(),
      currentProgress: classday.currentDay,
      content: classday.content,
    }
  }
}
