import { JorneyDayRepository } from '@/domain/gamefication/aplication/repositories/jorney-day-repository'
import { JorneyDay } from '@/domain/gamefication/enterprise/entities/jorney-day'

export class InMemoryJorneyDayRepository implements JorneyDayRepository {
  public items: JorneyDay[] = []

  async findManyByTaskId(jorneyId: string): Promise<JorneyDay[]> {
    const tasksAttachments = this.items.filter(
      (item) => item.jorneyId.toString() === jorneyId,
    )

    return tasksAttachments
  }
}
