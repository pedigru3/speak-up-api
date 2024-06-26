import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CategoryPointsRepository } from '@/domain/gamefication/aplication/repositories/category-points-repository'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'
import { PrismaCategoryPointMapper } from '../../mappers/prisma-category-point-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaCategoryPointsRepository
  implements CategoryPointsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(categorypoint: CategoryPoint): Promise<void> {
    const data = PrismaCategoryPointMapper.toPrisma(categorypoint)

    await this.prisma.pointCategory.create({
      data,
    })
  }

  async save(categorypoint: CategoryPoint): Promise<void> {
    const data = PrismaCategoryPointMapper.toPrisma(categorypoint)

    await this.prisma.pointCategory.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async fetch({ page }: PaginationParams): Promise<CategoryPoint[]> {
    const categoryPoints = await this.prisma.pointCategory.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return categoryPoints.map(PrismaCategoryPointMapper.toDomain)
  }

  async findById(id: string): Promise<CategoryPoint | null> {
    const categorypoint = await this.prisma.pointCategory.findUnique({
      where: {
        id,
      },
    })

    if (!categorypoint) {
      return null
    }

    return PrismaCategoryPointMapper.toDomain(categorypoint)
  }

  async delete(categorypoint: CategoryPoint): Promise<void> {
    await this.prisma.pointCategory.delete({
      where: {
        id: categorypoint.id.toString(),
      },
    })
  }
}
