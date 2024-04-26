import {
  Point as PrismaPoint,
  Prisma,
  PointCategory as PrismaPointCategory,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Point } from '@/domain/enterprise/entities/point'

type PrismaPointWithCategory = PrismaPoint & {
  pointCategory: PrismaPointCategory
}

export class PrismaPointMapper {
  static toDomain(raw: PrismaPointWithCategory): Point {
    return Point.create(
      {
        created_at: raw.createdAt,
        studentId: new UniqueEntityID(raw.userId),
        pointCategoryId: new UniqueEntityID(raw.pointCategoryId),
        icon: raw.pointCategory.icon,
        text: raw.pointCategory.text,
        value: raw.pointCategory.value,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(raw: Point): Prisma.PointUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      createdAt: raw.createdAt,
      userId: raw.studentId.toString(),
      pointCategoryId: raw.pointCategoryId.toString(),
    }
  }
}
