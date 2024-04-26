import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AddPointUseCase } from './add-points'
import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { CategoryPoint } from '@/domain/enterprise/entities/category-point'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RegisterStudentUseCase } from '../students/register-student'
import { FakeHasher } from 'test/cryptograph/fakeHasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryCategoryPointsRepository: InMemoryCategoryPointsRepository
let fakeHasher: FakeHasher

let sub: AddPointUseCase

describe('Add point', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryCategoryPointsRepository = new InMemoryCategoryPointsRepository()
    fakeHasher = new FakeHasher()

    sub = new AddPointUseCase(
      inMemoryStudentsRepository,
      inMemoryCategoryPointsRepository,
    )
  })

  it('shold add points student', async () => {
    const createStudent = new RegisterStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
    )

    const result = await createStudent.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@exemple.com',
      password: 'jonhodoepassoword',
    })

    if (result.isLeft()) {
      return
    }

    inMemoryStudentsRepository.items[0].points = 4

    inMemoryCategoryPointsRepository.items[0] = CategoryPoint.create(
      {
        icon: 'icon',
        text: 'text-icon',
        value: 4,
      },
      new UniqueEntityID('category-point'),
    )

    await sub.execute({
      studentId: result.value.id.toString(),
      categoryPointId: 'category-point',
    })

    expect(result.isRigth()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].name).toEqual('Jonh Doe')
    expect(inMemoryStudentsRepository.items[0].points).toEqual(8)
    expect(inMemoryStudentsRepository.items[0].level).toEqual(3)
    expect(inMemoryStudentsRepository.items[0].daysInARow).toEqual(0)
  })
})
