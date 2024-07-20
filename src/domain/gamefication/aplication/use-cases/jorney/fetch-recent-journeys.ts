import { Either, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Injectable } from '@nestjs/common'
import { JourneysRepository } from '../../repositories/jorney-repository'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'

interface FetchRecentJourneysRequest {
  page: number
}

type FetchJourneysResponse = Either<UseCaseError, Journey[]>

@Injectable()
export class FetchRecentJourneysUseCase {
  constructor(private journeysRepository: JourneysRepository) {}

  async execute({
    page,
  }: FetchRecentJourneysRequest): Promise<FetchJourneysResponse> {
    const journeys = await this.journeysRepository.findManyRecent({ page })

    return right(journeys)
  }
}
