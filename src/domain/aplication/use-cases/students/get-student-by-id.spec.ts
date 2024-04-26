import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { GetStudentByIdUseCase } from './get-student-by-id'
import { InMemoryPresencesRepository } from 'test/repositories/in-memory-presences-repository'
import { Presence } from '@/domain/enterprise/entities/presence'
import dayjs from 'dayjs'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryPresencesRepository: InMemoryPresencesRepository
let sub: GetStudentByIdUseCase

describe('Get Student By Id', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryPresencesRepository = new InMemoryPresencesRepository()
    sub = new GetStudentByIdUseCase(
      inMemoryStudentsRepository,
      inMemoryPresencesRepository,
    )
  })
  it('shold be able to get student by id', async () => {
    const student = makeStudent({
      daysInARow: 5,
    })

    await inMemoryStudentsRepository.create(student)

    const presence = Presence.create({
      date: new Date(),
      studentId: student.id,
    })

    await inMemoryPresencesRepository.create(presence)

    const result = await sub.execute({
      id: student.id.toString(),
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value.daysInARow).toEqual(5)
  })

  it('shold be clean days in a row', async () => {
    const student = makeStudent({
      daysInARow: 5,
    })

    await inMemoryStudentsRepository.create(student)

    const presence = Presence.create({
      date: dayjs().subtract(1, 'day').toDate(),
      studentId: student.id,
    })

    await inMemoryPresencesRepository.create(presence)

    const result = await sub.execute({
      id: student.id.toString(),
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value.daysInARow).toEqual(0)
  })
})
