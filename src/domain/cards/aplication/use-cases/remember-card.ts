import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CardsRepository } from '../repositories/card-repository'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Card } from '../../enterprise/entities/card'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'

interface RememberCardUseCaseRequest {
  id: UniqueEntityID
}

type RememberCardUseCaseResponse = Either<UseCaseError, Card>

export class RememberCardUseCase {
  constructor(private cardsRepository: CardsRepository) {}

  async execute({
    id,
  }: RememberCardUseCaseRequest): Promise<RememberCardUseCaseResponse> {
    const card = await this.cardsRepository.findById(id.toString())

    if (!card) {
      return left(new ResourceNotFoundError())
    }

    card.remember()

    this.cardsRepository.save(card)

    return right(card)
  }
}
