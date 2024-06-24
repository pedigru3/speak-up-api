import { PaginationParams } from '@/core/repositories/pagination-params'
import { CategoryPointsRepository } from '@/domain/gamefication/aplication/repositories/category-points-repository'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'

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

  async fetch({ page }: PaginationParams): Promise<CategoryPoint[]> {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async delete(category: CategoryPoint): Promise<void> {
    const items = this.items.filter(
      (item) => item.id.toString() !== category.id.toString(),
    )
    this.items = items
  }
}
