import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Category Point (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('shold be able create a category point [POST] /category-point', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        role: 'ADMIN',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/category-point')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        text: 'You attended all week',
        value: 10,
        point: 'chat',
      })

    console.log(response.body.errors)

    expect(response.statusCode).toBe(201)

    const categoryOnDatabase = await prisma.pointCategory.findUnique({
      where: {
        text: 'You attended all week',
        icon: 'chat',
      },
    })

    expect(categoryOnDatabase).toBeTruthy()
  })
})
