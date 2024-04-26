import { JorneyRepository } from '@/domain/aplication/repositories/jorney-repository'
import { Jorney } from '@/domain/enterprise/entities/jorney'

export class InMemoryJorneyRepository implements JorneyRepository {
  public items: Jorney[] = []

  async create(item: Jorney): Promise<void> {
    this.items.push(item)
  }

  async findById(id: string): Promise<Jorney | null> {
    const item = this.items.find((item) => item.id.toValue() === id)
    return item ?? null
  }
}
