import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptograph/fakeHasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

describe('Create Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
  })

  it('shold be create a student', async () => {
    const createStudent = new RegisterStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
    )
    const result = await createStudent.execute({
      name: 'Jonh Doe',
      email: 'jonhDoe@gmail.com',
      password: '1234556',
    })

    expect(result.isright()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].name).toEqual('Jonh Doe')
    expect(inMemoryStudentsRepository.items[0].points).toEqual(0)
    expect(inMemoryStudentsRepository.items[0].level).toEqual(1)
    expect(inMemoryStudentsRepository.items[0].daysInARow).toEqual(0)
  })
})
