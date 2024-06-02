import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { InMemoryJorneyRepository } from 'test/repositories/in-memory-jorney-repository'
import { makeTeacher } from 'test/factories/make-teacher'
import { CreateJourneyUseCase } from './create-jorney'
import { NotAllowedError } from '../errors/not-allowed-error'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryJorneyRepository: InMemoryJorneyRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: CreateJourneyUseCase

describe('Create Jorney', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryJorneyRepository = new InMemoryJorneyRepository()
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
    sut = new CreateJourneyUseCase(
      inMemoryTeachersRepository,
      inMemoryJorneyRepository,
    )
  })

  it('shold be create a jorney', async () => {
    const teacher = makeTeacher()
    await inMemoryTeachersRepository.create(teacher)

    const result = await sut.execute({
      title: 'New Jorney',
      description: 'description of journey',
      maxDay: 20,
      teacherId: teacher.id.toString(),
    })

    expect(result.isright()).toBe(true)
    expect(inMemoryJorneyRepository.items[0]).toEqual(result.value)
    expect(inMemoryJorneyRepository.items[0].currentDay).toEqual(0)
  })

  it('shold be not able create a jorney from students', async () => {
    const student = makeStudent()
    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      title: 'New Jorney',
      description: 'description of journey',
      maxDay: 20,
      teacherId: student.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
