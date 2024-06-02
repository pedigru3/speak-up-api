import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Injectable } from '@nestjs/common'
import { JourneysRepository } from '../../repositories/jorney-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'

interface FetchRecentJourneysRequest {
  page: number
  teacherId: string
}

type FetchJourneysResponse = Either<UseCaseError, Journey[]>

@Injectable()
export class FetchRecentJourneysUseCase {
  constructor(
    private journeysRepository: JourneysRepository,
    private teachersRepository: TeachersRepository,
  ) {}

  async execute({
    page,
    teacherId,
  }: FetchRecentJourneysRequest): Promise<FetchJourneysResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const journeys = await this.journeysRepository.findManyRecent({ page })

    return right(journeys)
  }
}
