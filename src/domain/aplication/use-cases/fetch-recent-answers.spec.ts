import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factory/make-answer'
import { FetchRecentAnswers } from './fetch-recent-answers'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchRecentAnswers

describe('Fetch recent answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchRecentAnswers(inMemoryAnswersRepository)
  })
  it('shold be able to return a list of answers in crescent data', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ createdAt: new Date(2023, 0, 20) }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ createdAt: new Date(2023, 0, 18) }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ createdAt: new Date(2023, 0, 23) }),
    )

    const { value } = await sut.execute({
      page: 1,
    })

    expect(value).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 18) }),
    ])
  })

  it('shold be able to fetch pagination recent answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(makeAnswer())
    }

    const { value } = await sut.execute({
      page: 2,
    })

    expect(value).toHaveLength(2)
  })
})
