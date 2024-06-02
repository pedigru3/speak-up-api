import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CardsRepository } from '../repositories/card-repository'
import { Either, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Card } from '../../enterprise/entities/card'

interface CreateCardUseCaseRequest {
  studentId: UniqueEntityID
  front: string
  back: string
}

type CreateCardUseCaseResponse = Either<UseCaseError, Card>

export class CreateCardUseCase {
  constructor(private cardsRepository: CardsRepository) {}

  async execute({
    back,
    front,
    studentId,
  }: CreateCardUseCaseRequest): Promise<CreateCardUseCaseResponse> {
    const card = Card.create({ back, front, studentId })
    await this.cardsRepository.create(card)

    return right(card)
  }
}
