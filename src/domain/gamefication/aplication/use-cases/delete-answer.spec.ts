import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })
  it('shold be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        studantId: new UniqueEntityID('student-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'student-1',
      answerId: 'answer-1',
    })

    expect(inMemoryAnswersRepository.answers).toHaveLength(0)
  })

  it('shold not be able to delete a task from another user', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
