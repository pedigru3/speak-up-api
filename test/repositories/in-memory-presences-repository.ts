import { PresencesRepository } from '@/domain/aplication/repositories/presences-repository'
import { Presence } from '@/domain/enterprise/entities/presence'

export class InMemoryPresencesRepository implements PresencesRepository {
  public items: Presence[] = []

  async getLastPresence(studentId: string): Promise<Presence | null> {
    const reverseItems = this.items.slice().reverse()
    const item = reverseItems.find(
      (item) => item.studentId.toString() === studentId,
    )
    return item ?? null
  }

  async create(presence: Presence): Promise<void> {
    this.items.push(presence)
  }
}
