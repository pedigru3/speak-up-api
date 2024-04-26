import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { makeTeacher } from 'test/factories/make-teacher'
import { InMemoryClassDayRepository } from 'test/repositories/in-memory-class-day-repository'
import { EditClassDayUseCase } from './edit-class-day'
import { InMemoryClassDayStudentsRepository } from 'test/repositories/in-memory-class-day-students-repository'
import { AddPresenceUseCase } from '../students/add-presence'
import { makeClassDay } from 'test/factories/make-class-day'
import { makeJorney } from 'test/factories/make-jorney'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryPresencesRepository } from 'test/repositories/in-memory-presences-repository'
import { AddPointUseCase } from '../points/add-points'
import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { ClassDayStudentList } from '@/domain/enterprise/entities/class-day-student-list'
import { ClassDayStudent } from '@/domain/enterprise/entities/class-day-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryClassDaysRepository: InMemoryClassDayRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository
let inMemoryClassDayStudentsRepository: InMemoryClassDayStudentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryPresencesRepository: InMemoryPresencesRepository
let categoryPointRepository: InMemoryCategoryPointsRepository
let addPointUseCase: AddPointUseCase
let addPresence: AddPresenceUseCase
let sut: EditClassDayUseCase

describe('Edit ClassDay', () => {
  beforeEach(async () => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
    inMemoryClassDaysRepository = new InMemoryClassDayRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryPresencesRepository = new InMemoryPresencesRepository()
    categoryPointRepository = new InMemoryCategoryPointsRepository()
    addPointUseCase = new AddPointUseCase(
      inMemoryStudentsRepository,
      categoryPointRepository,
    )
    addPresence = new AddPresenceUseCase(
      inMemoryStudentsRepository,
      inMemoryPresencesRepository,
      addPointUseCase,
    )
    inMemoryClassDayStudentsRepository =
      new InMemoryClassDayStudentsRepository()
    sut = new EditClassDayUseCase(
      inMemoryTeachersRepository,
      inMemoryClassDaysRepository,
      inMemoryClassDayStudentsRepository,
      addPresence,
    )

    await inMemoryStudentsRepository.create(
      makeStudent({}, new UniqueEntityID('1')),
    )
    await inMemoryStudentsRepository.create(
      makeStudent({}, new UniqueEntityID('2')),
    )
    await inMemoryStudentsRepository.create(
      makeStudent({}, new UniqueEntityID('3')),
    )
  })
  it('shold be able to edit a classday', async () => {
    const teacher = makeTeacher({}, new UniqueEntityID('teacher-1'))
    const jorney = makeJorney()

    await inMemoryTeachersRepository.create(teacher)

    inMemoryClassDaysRepository.items.push(
      makeClassDay(
        {
          jorneyId: jorney.id,
          currentDay: 1,
          attendanceList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('1'),
              studentId: new UniqueEntityID('3'),
            }),
          ]),
        },
        new UniqueEntityID('1'),
      ),
    )

    await sut.execute({
      classdayId: '1',
      studentsIds: ['1', '2', '3'],
      teacherId: teacher.id.toString(),
    })

    expect(inMemoryClassDaysRepository.items[0].currentDay).toEqual(1)
    expect(
      inMemoryClassDaysRepository.items[0].attendanceList.currentItems,
    ).toHaveLength(3)
    expect(
      inMemoryClassDaysRepository.items[0].attendanceList.currentItems,
    ).toEqual([
      expect.objectContaining({ studentId: new UniqueEntityID('1') }),
      expect.objectContaining({ studentId: new UniqueEntityID('2') }),
      expect.objectContaining({ studentId: new UniqueEntityID('3') }),
    ])
  })

  it('shold be able to check the presence', async () => {
    const teacher = makeTeacher({}, new UniqueEntityID('teacher-1'))
    const jorney = makeJorney()

    await inMemoryTeachersRepository.create(teacher)

    inMemoryClassDaysRepository.items.push(
      makeClassDay(
        {
          jorneyId: jorney.id,
          currentDay: 1,
          attendanceList: new ClassDayStudentList([
            ClassDayStudent.create({
              classDayId: new UniqueEntityID('1'),
              studentId: new UniqueEntityID('3'),
            }),
          ]),
        },
        new UniqueEntityID('1'),
      ),
    )

    await sut.execute({
      classdayId: '1',
      studentsIds: ['1', '2', '3'],
      teacherId: teacher.id.toString(),
    })

    await sut.execute({
      classdayId: '1',
      studentsIds: ['1', '2', '3'],
      teacherId: teacher.id.toString(),
    })

    expect(inMemoryPresencesRepository.items).toHaveLength(3)
  })

  it('shold not be able to delete a classday from another user', async () => {
    const newClassDay = makeClassDay({}, new UniqueEntityID('classday-1'))

    await inMemoryClassDaysRepository.create(newClassDay)

    const result = await sut.execute({
      classdayId: '1',
      studentsIds: ['1', '2', '3'],
      teacherId: '2',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
