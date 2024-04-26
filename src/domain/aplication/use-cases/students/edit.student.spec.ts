import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeStudent } from 'test/factories/make-student'
import { EditStudentUseCase } from './edit-student'
import { FakeUploader } from 'test/storage/fake-uploader'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let uploader: FakeUploader
let sut: EditStudentUseCase

describe('Edit Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    uploader = new FakeUploader()
    sut = new EditStudentUseCase(inMemoryStudentsRepository, uploader)
  })
  it('shold be able to edit a student avatar', async () => {
    const student = makeStudent({}, new UniqueEntityID('student-1'))
    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      studentId: 'student-1',
      file: {
        buffer: Buffer.from(''),
        mimetype: 'image/jpg',
        originalname: 'file.jpg',
      },
    })
    console.log(result.value)

    expect(result.isRigth()).toBe(true)
    expect(inMemoryStudentsRepository.items).toHaveLength(1)
    expect(inMemoryStudentsRepository.items[0].avatar).toBeTruthy()
    expect(uploader.uploads).toHaveLength(1)
  })
})
