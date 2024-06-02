import { PaginationParams } from '@/core/repositories/pagination-params'
import { JourneysRepository } from '@/domain/gamefication/aplication/repositories/jorney-repository'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'

export class InMemoryJorneyRepository implements JourneysRepository {
  public items: Journey[] = []

  async create(item: Journey): Promise<void> {
    this.items.push(item)
  }

  async findById(id: string): Promise<Journey | null> {
    const item = this.items.find((item) => item.id.toValue() === id)
    return item ?? null
  }

  async findManyRecent({ page }: PaginationParams): Promise<Journey[]> {
    const journeys = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return journeys
  }
}
