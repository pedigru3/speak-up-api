import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ClassDayRepository } from '@/domain/gamefication/aplication/repositories/class-day-repository'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'
import { PrismaClassDayMapper } from '../../mappers/prisma-class-day-mapper'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaClassDaysRepository implements ClassDayRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async create(classDay: ClassDay): Promise<void> {
    const data = PrismaClassDayMapper.toPrisma(classDay)

    await this.prisma.journeyDay.create({
      data,
    })
  }

  async findById(id: string): Promise<ClassDay | null> {
    const cacheHit = await this.cache.get(`classday:${id}`)

    if (cacheHit) {
      const cacheData: ClassDay = ClassDay.fromJSON(cacheHit)

      return cacheData
    }

    const classday = await this.prisma.journeyDay.findUnique({
      where: {
        id,
      },
      include: {
        journey: {
          select: {
            maxDay: true,
          },
        },
      },
    })

    if (!classday) {
      return null
    }

    const classDayEntity = PrismaClassDayMapper.toDomain(classday)

    await this.cache.set(`classday:${id}`, classDayEntity.toJson())

    return classDayEntity
  }

  async findManyRecent({ page }: PaginationParams): Promise<ClassDay[]> {
    const classDays = await this.prisma.journeyDay.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        journey: {
          select: {
            maxDay: true,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return classDays.map(PrismaClassDayMapper.toDomain)
  }

  async findMany(jorneyId: string): Promise<ClassDay[]> {
    const classDays = await this.prisma.journeyDay.findMany({
      where: {
        jorneyId,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        journey: {
          select: {
            maxDay: true,
          },
        },
      },
    })

    return classDays.map(PrismaClassDayMapper.toDomain)
  }

  async getLastByStudentId(studentId: string): Promise<ClassDay | null> {
    const presence = await this.prisma.presence.findFirst({
      where: {
        userId: studentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        jorneyDay: {
          include: {
            journey: {
              select: {
                maxDay: true,
              },
            },
          },
        },
      },
    })

    if (!presence) {
      return null
    }

    return PrismaClassDayMapper.toDomain({
      id: presence.journeyDayId,
      currentProgress: presence.jorneyDay.currentProgress,
      date: presence.jorneyDay.date,
      journey: presence.jorneyDay.journey,
      jorneyId: presence.jorneyDay.jorneyId,
    })
  }
}
