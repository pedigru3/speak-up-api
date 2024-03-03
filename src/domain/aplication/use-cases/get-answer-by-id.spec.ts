import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { GetAnswerById } from './get-answer-by-id'
import { makeAnswer } from 'test/factory/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository

describe('Get Answer By Id', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
  })
  it('shold be able to get answer by id', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityID('testando-id'))

    await inMemoryAnswersRepository.create(newAnswer)

    const getAnswerById = new GetAnswerById(inMemoryAnswersRepository)

    const result = await getAnswerById.execute({
      id: 'testando-id',
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value.id).toBeTruthy()
  })
})
