import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factory/make-task'
import { EditTaskUseCase } from './edit-task'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryTaskAttachmentRepository } from 'test/repositories/in-memory-task-attachment-repository'
import { makeTaskAttachment } from 'test/factory/make-task-attachment'

let inMemoryTasksRepository: InMemoryTasksRepository
let inMemoryTaskAttachmentRepository: InMemoryTaskAttachmentRepository
let sut: EditTaskUseCase

describe('Edit Task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
    inMemoryTaskAttachmentRepository = new InMemoryTaskAttachmentRepository()
    sut = new EditTaskUseCase(
      inMemoryTasksRepository,
      inMemoryTaskAttachmentRepository,
    )
  })
  it('shold be able to edit a task', async () => {
    const newTask = makeTask(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('task-1'),
    )

    await inMemoryTasksRepository.create(newTask)

    inMemoryTaskAttachmentRepository.items.push(
      makeTaskAttachment({
        taskId: newTask.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeTaskAttachment({
        taskId: newTask.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      content: 'content-test',
      taskId: 'task-1',
      title: 'title-test',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryTasksRepository.tasks[0].content).toEqual('content-test')
    expect(
      inMemoryTasksRepository.tasks[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryTasksRepository.tasks[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('shold not be able to delete a task from another user', async () => {
    const newTask = makeTask({}, new UniqueEntityID('task-1'))

    await inMemoryTasksRepository.create(newTask)

    expect(
      async () =>
        await sut.execute({
          authorId: 'author-1',
          taskId: 'task-1',
          content: 'new content',
          title: 'new title',
          attachmentsIds: [],
        }),
    ).rejects.toBeInstanceOf(Error)
  })
})
