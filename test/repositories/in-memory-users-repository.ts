import { UsersRepository } from '@/domain/gamefication/aplication/repositories/users-repository'
import { User } from '@/domain/gamefication/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)
    this.items[itemIndex] = user
  }

  async findById(id: string): Promise<User | null> {
    const item = this.items.find((item) => item.id.toString() === id)
    return item ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const item = this.items.find((item) => item.email === email)
    return item ?? null
  }
}
