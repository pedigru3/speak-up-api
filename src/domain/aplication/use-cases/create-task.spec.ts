import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateTaskUseCase } from '@/domain/aplication/use-cases/create-task'
import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'

let inMemoryTasksRepository: InMemoryTasksRepository

describe('Create Task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
  })

  it('shold be create a task', async () => {
    const createTask = new CreateTaskUseCase(inMemoryTasksRepository)
    const result = await createTask.execute({
      content: 'Deve enviar um audio descrevendo a paisagem',
      teacherId: '1',
      title: 'Seed a voice message',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRigth()).toBe(true)
    expect(inMemoryTasksRepository.tasks[0]).toEqual(result.value)
    expect(
      inMemoryTasksRepository.tasks[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryTasksRepository.tasks[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
