import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { makeTeacher } from 'test/factories/make-teacher'
import { NotAllowedError } from '../errors/not-allowed-error'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { CreateClassDayUseCase } from './create-class-day'
import { InMemoryClassDayRepository } from 'test/repositories/in-memory-class-day-repository'
import { InMemoryJorneyRepository } from 'test/repositories/in-memory-jorney-repository'
import { makeJorney } from 'test/factories/make-jorney'

let inMemoryClassDayRepository: InMemoryClassDayRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryJorneyRepository: InMemoryJorneyRepository
let sut: CreateClassDayUseCase

describe('Create ClassDay', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryClassDayRepository = new InMemoryClassDayRepository()
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
    inMemoryClassDayRepository = new InMemoryClassDayRepository()
    inMemoryJorneyRepository = new InMemoryJorneyRepository()

    sut = new CreateClassDayUseCase(
      inMemoryClassDayRepository,
      inMemoryTeachersRepository,
      inMemoryJorneyRepository,
    )
  })

  it('shold be create a classday', async () => {
    const teacher = makeTeacher()
    await inMemoryTeachersRepository.create(teacher)

    const jorney = makeJorney()
    await inMemoryJorneyRepository.create(jorney)

    const result = await sut.execute({
      jorneyId: jorney.id.toString(),
      teacherId: teacher.id.toString(),
    })

    await sut.execute({
      jorneyId: jorney.id.toString(),
      teacherId: teacher.id.toString(),
    })

    expect(result.isright()).toBe(true)
    expect(inMemoryClassDayRepository.items[0]).toEqual(result.value)
    expect(inMemoryClassDayRepository.items[0].currentDay).toEqual(1)
    expect(inMemoryJorneyRepository.items[0].currentDay).toEqual(2)
    expect(inMemoryClassDayRepository.items[1].currentDay).toEqual(2)
  })

  it('shold be not able create a classday from students', async () => {
    const student = makeStudent()
    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      jorneyId: '1',
      teacherId: student.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
