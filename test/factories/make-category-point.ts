import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CategoryPoint,
  CategoryPointProps,
} from '@/domain/gamefication/enterprise/entities/category-point'
import { PrismaCategoryPointMapper } from '@/infra/database/mappers/prisma-category-point-mapper'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCategoryPoint(
  override: Partial<CategoryPointProps> = {},
  id?: UniqueEntityID,
) {
  const categorypoint = CategoryPoint.create(
    {
      icon: 'appointment',
      text: faker.lorem.lines(),
      value: faker.number.int({ max: 20 }),
      ...override,
    },
    id,
  )
  return categorypoint
}

@Injectable()
export class CategoryPointFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategoryPoint(
    data: Partial<CategoryPointProps> = {},
  ): Promise<CategoryPoint> {
    const categorypoint = makeCategoryPoint(data)

    await this.prisma.pointCategory.create({
      data: PrismaCategoryPointMapper.toPrisma(categorypoint),
    })

    return categorypoint
  }
}
