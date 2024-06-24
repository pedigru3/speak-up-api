import { UseCaseError } from '@/core/errors/use-cases-error'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { JourneysRepository } from '../../repositories/jorney-repository'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'
import { Injectable } from '@nestjs/common'

interface GetJourneyByIdRequest {
  id: string
}

type GetJourneyByIdResponse = Either<UseCaseError, Journey>

@Injectable()
export class GetJourneyByIdUseCase {
  constructor(private journeysRepository: JourneysRepository) {}

  async execute({
    id,
  }: GetJourneyByIdRequest): Promise<GetJourneyByIdResponse> {
    const journey = await this.journeysRepository.findById(id)

    if (!journey) {
      return left(new ResourceNotFoundError())
    }

    return right(journey)
  }
}
