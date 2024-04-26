import { Jorney } from '@/domain/enterprise/entities/jorney'

export abstract class JorneyRepository {
  abstract create(classDay: Jorney): Promise<void>
  abstract findById(id: string): Promise<Jorney | null>
}
