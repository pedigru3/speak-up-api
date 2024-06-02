import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CardsRepository } from '../repositories/card-repository'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Card } from '../../enterprise/entities/card'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'

interface ForgotCardUseCaseRequest {
  id: UniqueEntityID
}

type ForgotCardUseCaseResponse = Either<UseCaseError, Card>

export class ForgotCardUseCase {
  constructor(private cardsRepository: CardsRepository) {}

  async execute({
    id,
  }: ForgotCardUseCaseRequest): Promise<ForgotCardUseCaseResponse> {
    const card = await this.cardsRepository.findById(id.toString())

    if (!card) {
      return left(new ResourceNotFoundError())
    }

    card.forgot()

    this.cardsRepository.save(card)

    return right(card)
  }
}
