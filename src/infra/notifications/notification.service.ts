import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class NotificationService {
  constructor(private httpServer: HttpService) {}

  async send(notification: Notification): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpServer.post('/notifications', {
          message: {
            token: 'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...',
            notification: {
              body: notification.content,
              title: notification.title,
            },
          },
        }),
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
}
