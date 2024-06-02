import { FetchRankingUseCase } from './fetch-ranking'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchRankingUseCase

describe('Fetch ranking', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new FetchRankingUseCase(inMemoryStudentsRepository)
  })
  it('shold be able to return a list of students by Ranking', async () => {
    await inMemoryStudentsRepository.create(makeStudent({ points: 10 }))
    await inMemoryStudentsRepository.create(makeStudent({ points: 5 }))
    await inMemoryStudentsRepository.create(makeStudent({ points: 9 }))
    await inMemoryStudentsRepository.create(makeStudent({ points: 4 }))
    await inMemoryStudentsRepository.create(makeStudent({ points: 15 }))
    await inMemoryStudentsRepository.create(makeStudent({ points: 10 }))

    const { value } = await sut.execute({
      page: 1,
    })

    expect(value).toEqual([
      expect.objectContaining({ points: 15 }),
      expect.objectContaining({ points: 10 }),
      expect.objectContaining({ points: 10 }),
      expect.objectContaining({ points: 9 }),
      expect.objectContaining({ points: 5 }),
      expect.objectContaining({ points: 4 }),
    ])
  })

  it('shold be able to fetch pagination ranking', async () => {
    for (let i = 1; i <= 23; i++) {
      await inMemoryStudentsRepository.create(makeStudent())
    }

    const { value } = await sut.execute({
      page: 2,
    })

    expect(value).toHaveLength(3)
  })
})
