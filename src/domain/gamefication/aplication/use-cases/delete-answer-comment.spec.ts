import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswersCommentsRepository)
  })
  it('shold be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswersCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswersCommentsRepository.answersComments).toHaveLength(0)
  })

  it('shold not be able to delete a answer comment from another user', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswersCommentsRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'other-author-id',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

it('shold not be able to delete a answer comment that not exists', async () => {
  const result = await sut.execute({
    answerCommentId: 'comment-id',
    authorId: 'other-author-id',
  })

  expect(result.value).toBeInstanceOf(ResourceNotFoundError)
})
