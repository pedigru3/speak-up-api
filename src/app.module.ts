import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCategoryPoint } from './controllers/create-category-point.controller'
import { GetInfoController } from './controllers/get-info.controller'
import { UpdateUserController } from './controllers/update-user.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import { UPLOADS_FOLDER } from './configs/upload'

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
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryPoint,
    GetInfoController,
    UpdateUserController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
