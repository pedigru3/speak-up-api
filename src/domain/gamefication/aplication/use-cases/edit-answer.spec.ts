import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })
  it('shold be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        studantId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      url: 'new content',
    })

    expect(inMemoryAnswersRepository.answers[0].url).toEqual('new content')
  })

  it('shold not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      url: 'new content',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
