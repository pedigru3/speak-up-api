import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  patchNestJsSwagger()

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Journey Talks API')
    .setDescription('The Journey Talks API')
    .setVersion('1.0')
    .addTag('auth', 'Everything about auth')
    .addTag('journey', 'Everything about yours Journeys')
    .addTag('point', 'Everything about points')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.enableCors({
    origin: 'https://journey-folder.vercel.app/',
  })

  await app.listen(port)
}
bootstrap()
