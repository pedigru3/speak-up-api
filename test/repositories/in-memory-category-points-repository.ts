import { CategoryPointsRepository } from '@/domain/aplication/repositories/category-points-repository'
import { CategoryPoint } from '@/domain/enterprise/entities/category-point'

export class InMemoryCategoryPointsRepository
  implements CategoryPointsRepository
{
  public items: CategoryPoint[] = []

  async create(categoryPoint: CategoryPoint): Promise<void> {
    this.items.push(categoryPoint)
  }

  async save(categoryPoint: CategoryPoint): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === categoryPoint.id,
    )
    this.items[itemIndex] = categoryPoint
  }

  async findById(id: string): Promise<CategoryPoint | null> {
    const item = this.items.find((item) => item.id.toString() === id)
    return item ?? null
  }
}
