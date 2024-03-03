import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/enterprise/entities/answer'

export interface AnswersRepository {
  getById(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<void>
  findManyRecent(params: PaginationParams): Promise<Answer[]>
  save(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
