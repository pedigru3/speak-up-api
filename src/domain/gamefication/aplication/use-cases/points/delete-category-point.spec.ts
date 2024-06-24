import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { DeleteCategoryPointUseCase } from './delete-category-point'
import { makeCategoryPoint } from 'test/factories/make-category-point'

let inMemoryCategoryPointsRepository: InMemoryCategoryPointsRepository
let sut: DeleteCategoryPointUseCase

describe('Delete CategoryPoint', () => {
  beforeEach(() => {
    inMemoryCategoryPointsRepository = new InMemoryCategoryPointsRepository()
    sut = new DeleteCategoryPointUseCase(inMemoryCategoryPointsRepository)
  })
  it('should be able to delete a categorypoint', async () => {
    const newCategoryPoint = makeCategoryPoint(
      { icon: 'calendar' },
      new UniqueEntityID('categorypoint-1'),
    )

    await inMemoryCategoryPointsRepository.create(newCategoryPoint)

    console.log(inMemoryCategoryPointsRepository.items)

    await sut.execute({
      categorypointId: 'categorypoint-1',
    })

    console.log(inMemoryCategoryPointsRepository.items)

    expect(inMemoryCategoryPointsRepository.items).toHaveLength(0)
  })
})
