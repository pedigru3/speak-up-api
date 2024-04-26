import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAnswerUseCase } from './upload-and-create-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryTasksRepository: InMemoryTasksRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAnswerUseCase

describe.skip('Upload and create answer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryTasksRepository = new InMemoryTasksRepository()

    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAnswerUseCase(
      inMemoryStudentsRepository,
      inMemoryAnswersRepository,
      inMemoryTasksRepository,
      fakeUploader,
    )
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able to upload and create an answer', async () => {
    vi.setSystemTime(new Date('2024-01-01'))
    inMemoryStudentsRepository.create(makeStudent({}, new UniqueEntityID('1')))
    inMemoryTasksRepository.create(makeTask({}, new UniqueEntityID('1')))

    const result = await sut.execute({
      studentId: '1',
      taskId: '1',
      fileName: 'test.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isRigth()).toBe(true)
    expect(result.value).toEqual(inMemoryAnswersRepository.answers[0])
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'test.mp3',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    inMemoryStudentsRepository.create(makeStudent({}, new UniqueEntityID('1')))
    inMemoryTasksRepository.create(makeTask({}, new UniqueEntityID('1')))

    const result = await sut.execute({
      studentId: '1',
      taskId: '1',
      fileName: 'image.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })

  it('should not be able to upload without correct taskId', async () => {
    inMemoryStudentsRepository.create(makeStudent({}, new UniqueEntityID('1')))

    const result = await sut.execute({
      studentId: '1',
      taskId: '1',
      fileName: 'som.wav',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
