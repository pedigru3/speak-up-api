import { Answer } from '@/domain/gamefication/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface GetAnswerByIdRequest {
  id: string
}

type GetAnswerByIdResponse = Either<UseCaseError, Answer>

export class GetAnswerById {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ id }: GetAnswerByIdRequest): Promise<GetAnswerByIdResponse> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      return left(new NotAllowedError())
    }

    return right(answer)
  }
}
