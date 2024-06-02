import { TeachersRepository } from '@/domain/gamefication/aplication/repositories/teachers-repository'
import { Teacher } from '@/domain/gamefication/enterprise/entities/teacher'

export class InMemoryTeachersRepository implements TeachersRepository {
  public items: Teacher[] = []

  async create(teacher: Teacher): Promise<void> {
    this.items.push(teacher)
  }

  async save(teacher: Teacher): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === teacher.id)
    this.items[itemIndex] = teacher
  }

  async findById(id: string): Promise<Teacher | null> {
    const item = this.items.find((item) => item.id.toString() === id)
    return item ?? null
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const item = this.items.find((item) => item.email === email)
    return item ?? null
  }
}
