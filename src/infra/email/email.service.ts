import { EnvService } from '../env/env.service'
import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

@Injectable()
export class EmailService {
  constructor(private envService: EnvService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.envService.get('EMAIL_USER'),
        pass: this.envService.get('EMAIL_PASS'),
      },
    })
  }

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

  async sendEmail(to: string[], subject: string, html: string) {
    const mailOptions = {
      from: `Journey Talks <${this.envService.get('EMAIL_USER')}>`,
      to,
      subject,
      html,
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error(error)
    }
  }
}
