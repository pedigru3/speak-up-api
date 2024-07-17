import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { JWT } from 'google-auth-library'
import { EnvService } from '../env/env.service'
import axios from 'axios'

@Injectable()
export class NotificationService {
  constructor(
    private httpServer: HttpService,
    private envService: EnvService,
  ) {
    this.jwtClient = new JWT(
      this.envService.get('CLIENT_EMAIL'),
      undefined,
      this.envService.get('PRIVATE_KEY'),
      ['https://www.googleapis.com/auth/firebase.messaging'],
      undefined,
    )
  }

  private jwtClient: JWT

  private getAccessToken() {
    return new Promise((resolve, reject) => {
      this.jwtClient.authorize((err, tokens) => {
        if (err) {
          reject(err)
          return
        }
        resolve(tokens?.access_token)
      })
    })
  }

  async send(notification: Notification): Promise<void> {
    try {
      const myToken = await this.getAccessToken()

      const response = await firstValueFrom(
        this.httpServer.post(
          'https://fcm.googleapis.com/v1/projects/journey-talks/messages:send',
          {
            message: {
              token: notification.recipientId.toString(),
              notification: {
                body: notification.content,
                title: notification.title,
              },
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${myToken}`,
            },
          },
        ),
      )
      console.log(response.data.error)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Erro ao fazer a requisição:')
        if (error.response) {
          console.log(`Status: ${error.response.status}`)
          console.log(`Dados: ${JSON.stringify(error.response.data)}`)
          console.log(`Headers: ${JSON.stringify(error.response.headers)}`)
        } else if (error.request) {
          console.log('O pedido foi feito, mas não houve resposta')
        } else {
          console.log('Erro:', error.message)
        }
      } else if (error instanceof Error) {
        console.log('Erro:', error.message)
      } else {
        console.log('Erro desconhecido:', error)
      }
    }
  }
}
