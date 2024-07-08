import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryPointFactory } from 'test/factories/make-category-point'
import { TeacherFactory } from 'test/factories/make-teacher'

describe('Edit categorypoint (E2E)', () => {
  let app: INestApplication
  let categorypointFactory: CategoryPointFactory
  let teacherFactory: TeacherFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryPointFactory, TeacherFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    teacherFactory = moduleRef.get(TeacherFactory)
    categorypointFactory = moduleRef.get(CategoryPointFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /categorypoint', async () => {
    const categoryPoint = await categorypointFactory.makePrismaCategoryPoint({})

    const user1 = await teacherFactory.makePrismaTeacher({})

    const accessToken = jwt.sign({ sub: user1.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/category-point/${categoryPoint.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        text: 'Test',
        value: 10,
        icon: 'appointment',
      })

    expect(response.statusCode).toBe(200)

    const data = await prisma.pointCategory.findUnique({
      where: {
        id: categoryPoint.id.toString(),
      },
    })

    expect(data?.text).toBe('Test')
  })
})
