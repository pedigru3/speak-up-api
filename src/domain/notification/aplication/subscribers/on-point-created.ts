import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { PointCreatedEvent } from '@/domain/gamefication/enterprise/entities/events/point-created-event'
import { CategoryPointsRepository } from '@/domain/gamefication/aplication/repositories/category-points-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnPointCreated implements EventHandler {
  constructor(
    private categoriesRepository: CategoryPointsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewPointNotification.bind(this),
      PointCreatedEvent.name,
    )
  }

  private async sendNewPointNotification({ point }: PointCreatedEvent) {
    const categoryPoint = await this.categoriesRepository.findById(
      point.pointCategoryId.toString(),
    )

    if (categoryPoint) {
      await this.sendNotification.execute({
        title: `You got ${point.value} points`,
        content: `${categoryPoint.text}`,
        recipientId: point.studentId.toString(),
      })
    }
  }
}
