import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'
import {
  Prisma,
  Journey as PrismaJourney,
  JourneyDay as PrismaJorneyDay,
} from '@prisma/client'

type PrismaJourneyWithJourneysDays = PrismaJourney & {
  jorneyDays: PrismaJorneyDay[]
}

export class PrismaJourneyMapper {
  static toDomain(raw: PrismaJourneyWithJourneysDays): Journey {
    return Journey.create(
      {
        title: raw.title,
        description: raw.description,
        maxDay: raw.maxDay,
        createdAt: raw.createdAt,
        classDays: raw.jorneyDays.map((classDay) =>
          ClassDay.create(
            {
              date: classDay.date,
              currentDay: classDay.currentProgress,
              jorneyId: new UniqueEntityID(classDay.jorneyId),
              maxDay: raw.maxDay,
            },
            new UniqueEntityID(classDay.id),
          ),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(journey: Journey): Prisma.JourneyUncheckedCreateInput {
    return {
      id: journey.id.toString(),
      description: journey.description,
      maxDay: journey.maxDay,
      title: journey.title,
      createdAt: journey.createdAt,
    }
  }
}
