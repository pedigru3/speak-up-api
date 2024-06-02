import { Uploader } from '@/domain/gamefication/aplication/storage/uploader'
import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'
import { EnvService } from '../env/env.service'

@Module({
  providers: [{ provide: Uploader, useClass: R2Storage }, EnvService],
  exports: [Uploader],
})
export class StorageModule {}
