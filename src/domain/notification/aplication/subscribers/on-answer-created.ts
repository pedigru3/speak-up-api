import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { TasksRepository } from '@/domain/gamefication/aplication/repositories/tasks-repository'
import { AnswerCreatedEvent } from '@/domain/gamefication/enterprise/entities/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private tasksRepository: TasksRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const task = await this.tasksRepository.findById(answer.taskId.toString())

    if (task) {
      await this.sendNotification.execute({
        content: `Responda seu aluno`,
        recipientId: task.id.toString(),
        title: `Nova resposta em "${task?.title.substring(0, 40).concat('...')}"`,
      })
    }
  }
}
