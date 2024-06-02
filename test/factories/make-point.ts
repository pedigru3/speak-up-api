import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Point,
  PointProps,
} from '@/domain/gamefication/enterprise/entities/point'

import { PrismaPointMapper } from '@/infra/database/mappers/prisma-point-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makePoint(
  override: Partial<PointProps> = {},
  id?: UniqueEntityID,
) {
  const point = Point.create(
    {
      pointCategoryId: new UniqueEntityID(),
      studentId: new UniqueEntityID(),
      text: faker.string.alpha(),
      value: faker.number.int({ max: 20 }),
      icon: 'chat',
      ...override,
    },
    id,
  )
  return point
}

@Injectable()
export class PointFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPoint(data: Partial<PointProps> = {}): Promise<Point> {
    const point = makePoint(data)

    await this.prisma.point.create({
      data: PrismaPointMapper.toPrisma(point),
    })

    return point
  }
}
