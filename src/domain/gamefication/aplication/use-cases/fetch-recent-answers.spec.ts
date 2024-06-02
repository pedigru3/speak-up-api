import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { FetchRecentAnswersUseCase } from './fetch-recent-answers'
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { makeTeacher } from 'test/factories/make-teacher'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository
let sut: FetchRecentAnswersUseCase

describe('Fetch recent answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
    sut = new FetchRecentAnswersUseCase(
      inMemoryAnswersRepository,
      inMemoryTeachersRepository,
    )
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

    inMemoryTeachersRepository.create(makeTeacher({}, new UniqueEntityID('1')))

    const { value } = await sut.execute({
      page: 1,
      teacherId: '1',
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

    inMemoryTeachersRepository.create(makeTeacher({}, new UniqueEntityID('1')))

    const { value } = await sut.execute({
      page: 2,
      teacherId: '1',
    })

    expect(value).toHaveLength(2)
  })
})
