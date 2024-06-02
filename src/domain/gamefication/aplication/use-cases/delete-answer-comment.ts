import { Either, left, right } from '@/core/either'
import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string
  authorId: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
type DeleteAnswerCommentUseCaseResponse = Either<UseCaseError, {}>

export class DeleteAnswerCommentUseCase {
  constructor(private answersCommentsRepository: AnswersCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answersCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answersCommentsRepository.delete(answerComment)

    return right({})
  }
}
