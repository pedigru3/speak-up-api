import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AuthModule } from './auth/auth.module'
import { UPLOADS_FOLDER } from '@/configs/upload'
import { HttpModule } from './http/http.module'
import { envSchema } from './env/env'
import { EnvService } from './env/env.service'
import { EventsModule } from './events/events.module'
import { EmailModule } from './email/email.module'
import { PrismaService } from './database/prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/file',
      rootPath: UPLOADS_FOLDER,
    }),
    AuthModule,
    HttpModule,
    EventsModule,
    EmailModule,
  ],
  providers: [EnvService, PrismaService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private envService: EnvService,
    private prismaService: PrismaService,
  ) {}

  async onModuleInit() {
    const users = await this.prismaService.user.aggregate({
      _count: true,
    })

    const hasUsers = users._count > 0

    if (!hasUsers) {
      await this.prismaService.user.create({
        data: {
          email: this.envService.get('ADMIN_EMAIL'),
          password: this.envService.get('ADMIN_PASSWORD'),
          role: 'ADMIN',
          name: 'Admin',
        },
      })
    }
  }
}
