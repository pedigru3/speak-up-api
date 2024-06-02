import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'

export abstract class CategoryPointsRepository {
  abstract create(categoryPoint: CategoryPoint): Promise<void>
  abstract save(categoryPoint: CategoryPoint): Promise<void>
  abstract findById(id: string): Promise<CategoryPoint | null>
  abstract delete(category: CategoryPoint): Promise<void>
}
