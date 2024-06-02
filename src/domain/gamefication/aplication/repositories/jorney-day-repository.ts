import { JorneyDay } from '@/domain/gamefication/enterprise/entities/jorney-day'

export abstract class JorneyDayRepository {
  abstract findManyByTaskId(taskId: string): Promise<JorneyDay[]>
}
