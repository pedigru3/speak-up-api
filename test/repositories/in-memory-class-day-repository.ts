import { ClassDayRepository } from '@/domain/aplication/repositories/class-day-repository'
import { ClassDay } from '@/domain/enterprise/entities/class-day'

export class InMemoryClassDayRepository implements ClassDayRepository {
  public items: ClassDay[] = []

  async create(item: ClassDay): Promise<void> {
    this.items.push(item)
  }

  async findById(id: string): Promise<ClassDay | null> {
    const item = this.items.find((item) => item.id.toValue() === id)
    return item ?? null
  }

  async findMany(jorneyId: string): Promise<ClassDay[]> {
    const item = this.items.filter((item) => item.jorneyId === jorneyId)
    return item
  }
}
