import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Journey,
  JourneyProps,
} from '@/domain/gamefication/enterprise/entities/jorney'
import { PrismaJourneyMapper } from '@/infra/database/mappers/prisma-journey-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeJorney(
  override: Partial<JourneyProps> = {},
  id?: UniqueEntityID,
) {
  const jorney = Journey.create(
    {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      maxDay: 16,
      ...override,
    },
    id,
  )
  return jorney
}

@Injectable()
export class JourneyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaJourney(data: Partial<JourneyProps> = {}): Promise<Journey> {
    const jorney = makeJorney(data)

    await this.prisma.journey.create({
      data: PrismaJourneyMapper.toPrisma(jorney),
    })

    return jorney
  }
}
