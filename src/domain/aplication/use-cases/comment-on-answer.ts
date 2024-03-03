import { AnswerComment } from '@/domain/enterprise/entities/answer-comment'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'
import { Either, left, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<UseCaseError, AnswerComment>

export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answersCommentsRepository: AnswersCommentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.getById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      content,
      answerId: new UniqueEntityID(answerId),
    })

    await this.answersCommentsRepository.create(answerComment)

    return rigth(answerComment)
  }
}
