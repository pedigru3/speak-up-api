import { Answer } from '@/domain/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AnswerTaskUseCaseRequest {
  studantId: string
  taskId: string
  content: string
}

type AnswerTaskUseCaseResponse = Either<UseCaseError, Answer>

export class AswerTaskUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    content,
    studantId,
    taskId,
  }: AnswerTaskUseCaseRequest): Promise<AnswerTaskUseCaseResponse> {
    const answer = Answer.create({
      content,
      studantId: new UniqueEntityID(studantId),
      taskId: new UniqueEntityID(taskId),
    })

    await this.answerRepository.create(answer)

    return rigth(answer)
  }
}
