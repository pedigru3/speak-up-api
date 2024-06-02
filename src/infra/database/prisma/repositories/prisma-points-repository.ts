import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PointsRepository } from '@/domain/gamefication/aplication/repositories/points-repository'
import { Point } from '@/domain/gamefication/enterprise/entities/point'
import { PrismaPointMapper } from '../../mappers/prisma-point-mapper'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaPointsRepository implements PointsRepository {
  constructor(private prisma: PrismaService) {}

  async create(point: Point): Promise<void> {
    const data = PrismaPointMapper.toPrisma(point)

    await this.prisma.point.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(point.id)
  }

  async findById(id: string): Promise<Point | null> {
    const point = await this.prisma.point.findUnique({
      where: {
        id,
      },
      include: {
        pointCategory: true,
      },
    })

    if (!point) {
      return null
    }

    return Point.create({
      pointCategoryId: new UniqueEntityID(point.pointCategoryId),
      studentId: new UniqueEntityID(point.userId),
      text: point.pointCategory.text,
      value: point.pointCategory.value,
      icon: point.pointCategory.icon,
      created_at: point.createdAt,
    })
  }

  async fetchLastPoints(userId: string): Promise<Point[]> {
    const lastPoints = await this.prisma.point.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        pointCategory: true,
      },
    })

    return lastPoints.map(PrismaPointMapper.toDomain)
  }
}
