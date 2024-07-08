import { PaginationParams } from '@/core/repositories/pagination-params'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'

export abstract class JourneysRepository {
  abstract create(classDay: Journey): Promise<void>
  abstract findById(id: string): Promise<Journey | null>
  abstract findManyRecent(params: PaginationParams): Promise<Journey[]>
  abstract update(journey: Journey): Promise<void>
}
