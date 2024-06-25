import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
