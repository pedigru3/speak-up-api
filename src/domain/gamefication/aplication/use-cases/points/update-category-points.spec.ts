import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { UpdateCategoryPointUseCase } from './update-category-point'
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTeacher } from 'test/factories/make-teacher'

let inMemoryCategoryPointsRepository: InMemoryCategoryPointsRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository

describe('Update Category Point', () => {
  beforeEach(() => {
    inMemoryCategoryPointsRepository = new InMemoryCategoryPointsRepository()
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
  })

  it('shold update a category point', async () => {
    const updateCategoryPoint = new UpdateCategoryPointUseCase(
      inMemoryTeachersRepository,
      inMemoryCategoryPointsRepository,
    )

    inMemoryCategoryPointsRepository.create(
      CategoryPoint.create(
        {
          icon: 'taskList',
          text: 'You Got extra points',
          value: 10,
        },
        new UniqueEntityID('category-1'),
      ),
    )

    inMemoryTeachersRepository.create(
      makeTeacher({}, new UniqueEntityID('teacher-1')),
    )

    const result = await updateCategoryPoint.execute({
      categoryPointId: 'category-1',
      icon: 'calendar',
      teacherId: 'teacher-1',
      text: 'changed',
      value: 100,
    })

    expect(result.isright()).toBeTruthy()

    expect(result.value).toEqual({})

    const point = await inMemoryCategoryPointsRepository.findById('category-1')

    expect(point?.text).toBe('changed')
    expect(point?.value).toBe(100)
    expect(point?.icon).toBe('calendar')
  })
})
