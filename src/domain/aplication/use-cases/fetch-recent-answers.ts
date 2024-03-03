import { Answer } from '@/domain/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchRecentAnswersRequest {
  page: number
}

type FetchAnswersResponse = Either<UseCaseError, Answer[]>

export class FetchRecentAnswers {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
  }: FetchRecentAnswersRequest): Promise<FetchAnswersResponse> {
    const answers = await this.answersRepository.findManyRecent({ page })

    if (!answers) {
      return left(new ResourceNotFoundError())
    }

    return rigth(answers)
  }
}
