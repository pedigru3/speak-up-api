import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'
import { Prisma, PointCategory as PrismaCategoryPoint } from '@prisma/client'

export class PrismaCategoryPointMapper {
  static toDomain(raw: PrismaCategoryPoint): CategoryPoint {
    return CategoryPoint.create(
      {
        icon: raw.icon,
        text: raw.text,
        value: raw.value,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    categorypoint: CategoryPoint,
  ): Prisma.PointCategoryUncheckedCreateInput {
    return {
      text: categorypoint.text,
      value: categorypoint.value,
      icon: categorypoint.icon,
      id: categorypoint.id.toString(),
    }
  }
}
