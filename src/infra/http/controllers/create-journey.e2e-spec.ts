import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'
import request from 'supertest'

describe('Create Journey (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let teacher: User

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    teacher = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        role: 'ADMIN',
      },
    })

    await app.init()
  })

  it('shold be able create a journey [POST]', async () => {
    const accessToken = jwt.sign({ sub: teacher.id })

    const response = await request(app.getHttpServer())
      .post('/journey')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Adventures in streets',
        description: 'What is the story about?',
        max_day: 30,
      })

    const journeyOnDatabase = await prisma.journey.findFirst({
      where: {
        title: 'Adventures in streets',
      },
    })

    expect(response.status).toBe(201)
    expect(journeyOnDatabase).toBeTruthy()
    expect(journeyOnDatabase?.maxDay).toEqual(30)
  })

  it('shold be return status 401', async () => {
    const response = await request(app.getHttpServer()).post('/journey').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(401)
  })
})
