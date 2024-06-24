import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchStudentsUseCase } from './fetch-studants'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchStudentsUseCase

describe('Fetch Students', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new FetchStudentsUseCase(inMemoryStudentsRepository)
  })
  it('should fetch all students', async () => {
    const student1 = makeStudent()
    const student2 = makeStudent()
    const student3 = makeStudent()

    inMemoryStudentsRepository.create(student1)
    inMemoryStudentsRepository.create(student2)
    inMemoryStudentsRepository.create(student3)

    const result = await sut.execute({ page: 1 })

    expect(result.value).toEqual([student1, student2, student3])
  })

  it('should fetch students with pagination', async () => {
    for (let i = 1; i <= 23; i++) {
      inMemoryStudentsRepository.create(makeStudent())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value).toHaveLength(3)
  })
})
