import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { GetTaskById } from './get-task-by-id'
import { makeTask } from 'test/factories/make-task'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryTasksRepository: InMemoryTasksRepository

describe('Get Task By Id', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
  })
  it('shold be able to get task by id', async () => {
    const newTask = makeTask(
      {
        title: 'test-title',
      },
      new UniqueEntityID('testando-id'),
    )

    await inMemoryTasksRepository.create(newTask)

    const getTaskById = new GetTaskById(inMemoryTasksRepository)

    const result = await getTaskById.execute({
      id: 'testando-id',
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value.id).toBeTruthy()
    expect(result.value.title).toEqual('test-title')
  })
})
