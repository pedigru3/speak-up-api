import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factory/make-task'
import { DeleteTaskUseCase } from './delete-task'
import { NotAllowedError } from './errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryTasksRepository: InMemoryTasksRepository

describe('Delete Task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
  })
  it('shold be able to delete a task', async () => {
    const newTask = makeTask({}, new UniqueEntityID('task-1'))

    await inMemoryTasksRepository.create(newTask)

    const deleteTaskUseCase = new DeleteTaskUseCase(inMemoryTasksRepository)

    await deleteTaskUseCase.execute({
      authorId: newTask.authorId.toString(),
      taskId: 'task-1',
    })

    expect(inMemoryTasksRepository.tasks).toHaveLength(0)
  })

  it('shold not be able to delete a task from another user', async () => {
    const newTask = makeTask({}, new UniqueEntityID('task-1'))

    await inMemoryTasksRepository.create(newTask)

    const sut = new DeleteTaskUseCase(inMemoryTasksRepository)

    const result = await sut.execute({
      authorId: 'author-2',
      taskId: 'task-1',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
