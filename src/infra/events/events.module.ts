import { OnAnswerCreated } from '@/domain/notification/aplication/subscribers/on-answer-created'
import { OnPointCreated } from '@/domain/notification/aplication/subscribers/on-point-created'
import { SendNotificationUseCase } from '@/domain/notification/aplication/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnAnswerCreated, OnPointCreated, SendNotificationUseCase],
})
export class EventsModule {}
