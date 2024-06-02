import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { JourneysRepository } from '@/domain/gamefication/aplication/repositories/jorney-repository'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'
import { PrismaJourneyMapper } from '../../mappers/prisma-journey-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaJourneysRepository implements JourneysRepository {
  constructor(private prisma: PrismaService) {}

  async create(journey: Journey): Promise<void> {
    const data = PrismaJourneyMapper.toPrisma(journey)

    await this.prisma.journey.create({
      data,
    })
  }

  async findById(id: string): Promise<Journey | null> {
    const journey = await this.prisma.journey.findUnique({
      where: {
        id,
      },
      include: {
        jorneyDays: true,
      },
    })

    if (!journey) {
      return null
    }

    return PrismaJourneyMapper.toDomain(journey)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Journey[]> {
    const answers = await this.prisma.journey.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        jorneyDays: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaJourneyMapper.toDomain)
  }
}
