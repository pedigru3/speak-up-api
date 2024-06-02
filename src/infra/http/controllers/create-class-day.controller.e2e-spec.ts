import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'
import request from 'supertest'

describe('Create ClassDay (E2E)', () => {
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

  it('shold be able create a classday [POST]', async () => {
    const accessToken = jwt.sign({ sub: teacher.id })

    const journey = await prisma.journey.create({
      data: {
        title: 'New Journey',
        description: 'Description',
        maxDay: 20,
      },
    })

    await request(app.getHttpServer())
      .post('/classday')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        journey_id: journey.id,
      })

    const response = await request(app.getHttpServer())
      .post('/classday')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        journey_id: journey.id,
      })

    const lastJorneyDay = await prisma.journeyDay.findFirst({
      where: {
        jorneyId: journey.id,
      },
      orderBy: {
        date: 'desc',
      },
    })

    expect(response.status).toBe(201)
    expect(lastJorneyDay).toBeTruthy()
    expect(lastJorneyDay?.currentProgress).toEqual(2)
  })

  it('shold be return status 401', async () => {
    const response = await request(app.getHttpServer()).post('/classday').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(401)
  })
})
