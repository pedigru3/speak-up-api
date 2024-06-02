import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AddPresenceUseCase } from './add-presence'
import { AddPointUseCase } from '../points/add-points'
import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { makeStudent } from 'test/factories/make-student'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryClassDayStudentsRepository } from 'test/repositories/in-memory-class-day-students-repository'
import { InMemoryClassDayRepository } from 'test/repositories/in-memory-class-day-repository'
import { makeClassDay } from 'test/factories/make-class-day'
import { ClassDayStudentList } from '@/domain/gamefication/enterprise/entities/class-day-student-list'
import { ClassDayStudent } from '@/domain/gamefication/enterprise/entities/class-day-student'
import { InMemoryPointsRepository } from 'test/repositories/in-memory-points.repository'

let classDayStudentsRepository: InMemoryClassDayStudentsRepository
let studentsRepository: InMemoryStudentsRepository
let categoryPointsRepository: InMemoryCategoryPointsRepository
let classDayRepository: InMemoryClassDayRepository
let addPointUseCase: AddPointUseCase
let addPresenceUseCase: AddPresenceUseCase
let inMemoryPointsRepository: InMemoryPointsRepository

describe('Add Presence', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    classDayStudentsRepository = new InMemoryClassDayStudentsRepository()
    classDayRepository = new InMemoryClassDayRepository()
    studentsRepository = new InMemoryStudentsRepository()
    categoryPointsRepository = new InMemoryCategoryPointsRepository()
    inMemoryPointsRepository = new InMemoryPointsRepository()

    addPointUseCase = new AddPointUseCase(
      studentsRepository,
      inMemoryPointsRepository,
      categoryPointsRepository,
    )

    addPresenceUseCase = new AddPresenceUseCase(
      studentsRepository,
      classDayStudentsRepository,
      classDayRepository,
      addPointUseCase,
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shold be add presence to student in a row', async () => {
    const student = makeStudent({
      daysInARow: 4,
      points: 0,
    })

    await studentsRepository.create(student)

    classDayRepository.items = [
      makeClassDay(
        {
          currentDay: 1,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('1'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('1'),
      ),

      makeClassDay(
        {
          currentDay: 2,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('2'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('2'),
      ),

      makeClassDay(
        {
          currentDay: 3,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('3'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('3'),
      ),

      makeClassDay(
        {
          currentDay: 4,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('4'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('4'),
      ),
    ]

    await categoryPointsRepository.create(
      CategoryPoint.create(
        {
          icon: 'icon',
          text: 'text',
          value: 1,
        },
        new UniqueEntityID('category-id'),
      ),
    )

    classDayRepository.items.push(
      makeClassDay(
        {
          currentDay: 5,
        },
        new UniqueEntityID('5'),
      ),
    )

    const result = await addPresenceUseCase.execute({
      classDayId: '5',
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    expect(result.isright()).toBe(true)
    expect(studentsRepository.items[0].daysInARow).toEqual(5)
    expect(studentsRepository.items[0].points).toEqual(1)
    expect(studentsRepository.items[0].level).toEqual(1)
  })

  it('shold be block presences day in a row if ausent 1 day', async () => {
    const student = makeStudent({
      daysInARow: 4,
      points: 0,
    })

    await studentsRepository.create(student)

    classDayRepository.items = [
      makeClassDay(
        {
          currentDay: 1,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('1'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('1'),
      ),

      makeClassDay(
        {
          currentDay: 2,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('2'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('2'),
      ),

      makeClassDay(
        {
          currentDay: 3,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('3'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('3'),
      ),

      makeClassDay(
        {
          currentDay: 4,
          classDayStudentList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('4'),
              studentId: student.id,
            }),
          ]),
        },
        new UniqueEntityID('4'),
      ),
    ]

    await categoryPointsRepository.create(
      CategoryPoint.create(
        {
          icon: 'icon',
          text: 'text',
          value: 1,
        },
        new UniqueEntityID('category-id'),
      ),
    )

    classDayRepository.items.push(
      makeClassDay(
        {
          currentDay: 6,
        },
        new UniqueEntityID('5'),
      ),
    )

    const result = await addPresenceUseCase.execute({
      classDayId: '5',
      studentId: student.id.toString(),
      categoryPointId: 'category-id',
    })

    expect(result.isright()).toBe(true)
    expect(studentsRepository.items[0].daysInARow).toEqual(1)
    expect(studentsRepository.items[0].points).toEqual(1)
    expect(studentsRepository.items[0].level).toEqual(1)
  })
})
