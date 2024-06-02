import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateTaskUseCase } from '@/domain/gamefication/aplication/use-cases/create-task'
import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { Teacher } from '@/domain/gamefication/enterprise/entities/teacher'

let inMemoryTasksRepository: InMemoryTasksRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository

describe('Create Task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
  })

  it('shold be create a task', async () => {
    const createTask = new CreateTaskUseCase(
      inMemoryTasksRepository,
      inMemoryTeachersRepository,
    )

    await inMemoryTeachersRepository.create(
      Teacher.create(
        {
          name: 'Teacher',
        },
        new UniqueEntityID('1'),
      ),
    )

    const result = await createTask.execute({
      content: 'Deve enviar um audio descrevendo a paisagem',
      teacherId: '1',
      title: 'Seed a voice message',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isright()).toBe(true)
    expect(inMemoryTasksRepository.tasks[0]).toEqual(result.value)
    expect(
      inMemoryTasksRepository.tasks[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryTasksRepository.tasks[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('shold be not able create a task from students', async () => {
    const createTask = new CreateTaskUseCase(
      inMemoryTasksRepository,
      inMemoryTeachersRepository,
    )

    const result = await createTask.execute({
      content: 'Deve enviar um audio descrevendo a paisagem',
      teacherId: '1',
      title: 'Seed a voice message',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
