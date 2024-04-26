import { Answer } from '@/domain/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../repositories/teachers-repository'
import { NotAllowedError } from './errors/not-allowed-error'

interface FetchRecentAnswersRequest {
  page: number
  teacherId: string
}

type FetchAnswersResponse = Either<UseCaseError, Answer[]>

@Injectable()
export class FetchRecentAnswersUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private teachersRepository: TeachersRepository,
  ) {}

  async execute({
    page,
    teacherId,
  }: FetchRecentAnswersRequest): Promise<FetchAnswersResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const answers = await this.answersRepository.findManyRecent({ page })

    if (!answers) {
      return rigth([])
    }

    return rigth(answers)
  }
}
