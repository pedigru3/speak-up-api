import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { makeTask } from 'test/factories/make-task'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let inMemoryTasksRepository: InMemoryTasksRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnAnswerCreated(inMemoryTasksRepository, sendNotificationUseCase)
  })

  it('should  send a notification when an answer is created', async () => {
    const task = makeTask()
    const answer = makeAnswer({ taskId: task.id })

    inMemoryTasksRepository.create(task)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => expect(sendNotificationExecuteSpy).toBeCalled())
  })
})
