import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryPointsRepository } from 'test/repositories/in-memory-points.repository'
import { OnPointCreated } from './on-point-created'
import { InMemoryCategoryPointsRepository } from 'test/repositories/in-memory-category-points-repository'
import { makePoint } from 'test/factories/make-point'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'

let inMemoryPointsRepository: InMemoryPointsRepository
let inMemoryCategoryPointsRepository: InMemoryCategoryPointsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance

describe('On Point Created', () => {
  beforeEach(() => {
    inMemoryPointsRepository = new InMemoryPointsRepository()
    inMemoryCategoryPointsRepository = new InMemoryCategoryPointsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnPointCreated(
      inMemoryCategoryPointsRepository,
      sendNotificationUseCase,
    )
  })

  it('should  send a notification when a point is created', async () => {
    const categoryPoint = CategoryPoint.create({
      icon: 'appointment',
      text: 'text',
      value: 10,
    })

    const point = makePoint({
      pointCategoryId: categoryPoint.id,
    })

    inMemoryCategoryPointsRepository.create(categoryPoint)
    inMemoryPointsRepository.create(point)

    await waitFor(() => expect(sendNotificationExecuteSpy).toBeCalled())
  })
})
