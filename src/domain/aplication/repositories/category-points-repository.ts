import { CategoryPoint } from '@/domain/enterprise/entities/category-point'

export abstract class CategoryPointsRepository {
  abstract create(categoryPoint: CategoryPoint): Promise<void>
  abstract save(teacher: CategoryPoint): Promise<void>
  abstract findById(id: string): Promise<CategoryPoint | null>
}
