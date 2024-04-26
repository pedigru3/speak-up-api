import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryPresencesRepository } from 'test/repositories/in-memory-presences-repository'
import { AddPresenceUseCase } from './add-presence'
import { AddPointUseCase } from '../points/add-points'
import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { makeStudent } from 'test/factories/make-student'
import { CategoryPoint } from '@/domain/enterprise/entities/category-point'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import dayjs from 'dayjs'

let inMemoryPresencesRepository: InMemoryPresencesRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemorycategoryPointsRepository: InMemoryCategoryPointsRepository
let addPointUseCase: AddPointUseCase
let addPresenceUseCase: AddPresenceUseCase

describe('Add Presence', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    inMemoryPresencesRepository = new InMemoryPresencesRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemorycategoryPointsRepository = new InMemoryCategoryPointsRepository()

    addPointUseCase = new AddPointUseCase(
      inMemoryStudentsRepository,
      inMemorycategoryPointsRepository,
    )

    addPresenceUseCase = new AddPresenceUseCase(
      inMemoryStudentsRepository,
      inMemoryPresencesRepository,
      addPointUseCase,
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shold be add presence to student', async () => {
    const student = makeStudent({
      daysInARow: 10,
      points: 0,
    })

    await inMemoryStudentsRepository.create(student)

    await inMemorycategoryPointsRepository.create(
      CategoryPoint.create(
        {
          icon: 'icon',
          text: 'text',
          value: 1,
        },
        new UniqueEntityID('category-id'),
      ),
    )

    await addPresenceUseCase.execute({
      date: dayjs().subtract(1, 'day').toISOString(),
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    const result = await addPresenceUseCase.execute({
      date: new Date().toISOString(),
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    expect(result.isRigth()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].daysInARow).toEqual(12)
    expect(inMemoryStudentsRepository.items[0].points).toEqual(2)
    expect(inMemoryStudentsRepository.items[0].level).toEqual(1)
  })

  it('shold be add presences day in a row', async () => {
    const student = makeStudent({
      daysInARow: 10,
      points: 0,
    })

    await inMemoryStudentsRepository.create(student)

    await inMemorycategoryPointsRepository.create(
      CategoryPoint.create(
        {
          icon: 'icon',
          text: 'text',
          value: 1,
        },
        new UniqueEntityID('category-id'),
      ),
    )

    vi.setSystemTime(dayjs().subtract(3, 'day').toDate())
    await addPresenceUseCase.execute({
      date: new Date().toISOString(),
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    vi.setSystemTime(dayjs().subtract(2, 'day').toDate())
    await addPresenceUseCase.execute({
      date: new Date().toISOString(),
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    vi.setSystemTime(dayjs().subtract(1, 'day').toDate())
    await addPresenceUseCase.execute({
      date: new Date().toISOString(),
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    vi.setSystemTime(dayjs().toDate())
    const result = await addPresenceUseCase.execute({
      date: new Date().toISOString(),
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    expect(result.isRigth()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].daysInARow).toEqual(14)
    expect(inMemoryStudentsRepository.items[0].points).toEqual(4)
    expect(inMemoryStudentsRepository.items[0].level).toEqual(2)
  })
})
