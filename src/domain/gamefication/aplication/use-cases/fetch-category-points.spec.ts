import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { makeTeacher } from 'test/factories/make-teacher'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchCategoryPointsUseCase } from './fetch-category-points'
import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { makeCategoryPoint } from 'test/factories/make-category-point'

let inMemoryCategoryPointsRepository: InMemoryCategoryPointsRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository
let sut: FetchCategoryPointsUseCase

describe('Fetch categorypoints', () => {
  beforeEach(() => {
    inMemoryCategoryPointsRepository = new InMemoryCategoryPointsRepository()
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
    sut = new FetchCategoryPointsUseCase(
      inMemoryCategoryPointsRepository,
      inMemoryTeachersRepository,
    )
  })
  it('shold be able to return a list of categorypoints in crescent data', async () => {
    await inMemoryCategoryPointsRepository.create(makeCategoryPoint({}))
    await inMemoryCategoryPointsRepository.create(makeCategoryPoint({}))
    await inMemoryCategoryPointsRepository.create(makeCategoryPoint({}))

    inMemoryTeachersRepository.create(makeTeacher({}, new UniqueEntityID('1')))

    const { value } = await sut.execute({
      page: 1,
      teacherId: '1',
    })

    expect(value).toEqual([
      expect.objectContaining({}),
      expect.objectContaining({}),
      expect.objectContaining({}),
    ])
  })

  it('shold be able to fetch pagination recent categorypoints', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCategoryPointsRepository.create(makeCategoryPoint())
    }

    inMemoryTeachersRepository.create(makeTeacher({}, new UniqueEntityID('1')))

    const { value } = await sut.execute({
      page: 2,
      teacherId: '1',
    })

    expect(value).toHaveLength(2)
  })
})
