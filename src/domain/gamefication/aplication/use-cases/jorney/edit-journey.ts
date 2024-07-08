import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '../errors/not-allowed-error'
import { JourneysRepository } from '../../repositories/jorney-repository'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'

interface EditJorneyUseCaseRequest {
  id: string
  title: string
  description: string
}

type EditJorneyUseCaseResponse = Either<NotAllowedError, Journey>

@Injectable()
export class EditJourneyUseCase {
  constructor(private jorneyRepository: JourneysRepository) {}

  async execute({
    id,
    title,
    description,
  }: EditJorneyUseCaseRequest): Promise<EditJorneyUseCaseResponse> {
    const journey = await this.jorneyRepository.findById(id)

    if (!journey) {
      return left(new NotAllowedError())
    }

    journey.title = title
    journey.description = description

    return right(journey)
  }
}
