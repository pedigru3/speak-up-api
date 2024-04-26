import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PointsRepository } from '@/domain/aplication/repositories/points-repository'
import { Point } from '@/domain/enterprise/entities/point'
import { PrismaPointMapper } from '../../mappers/prisma-point-mapper'

@Injectable()
export class PrismaPointsRepository implements PointsRepository {
  constructor(private prisma: PrismaService) {}

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
