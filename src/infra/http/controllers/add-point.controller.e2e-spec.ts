import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'
import request from 'supertest'
import { CategoryPointFactory } from 'test/factories/make-category-point'
import { PointFactory } from 'test/factories/make-point'
import { StudentFactory } from 'test/factories/make-student'

describe('Add point (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let teacher: User
  let pointFactory: PointFactory
  let studentFactory: StudentFactory
  let categoryPointFactory: CategoryPointFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PointFactory, CategoryPointFactory, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    pointFactory = moduleRef.get(PointFactory)
    categoryPointFactory = moduleRef.get(CategoryPointFactory)
    studentFactory = moduleRef.get(StudentFactory)

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

  it('shold be able give a point to user [POST]', async () => {
    const accessToken = jwt.sign({ sub: teacher.id, role: teacher.role })

    const student = await studentFactory.makePrismaStudent()
    const categoryPoint = await categoryPointFactory.makePrismaCategoryPoint()

    const point = await pointFactory.makePrismaPoint({
      studentId: student.id,
      pointCategoryId: categoryPoint.id,
    })

    const response = await request(app.getHttpServer())
      .post('/point')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        categoryPointId: categoryPoint.id.toString(),
        studentId: student.id.toString(),
      })

    const pointOnDatabase = await prisma.point.findFirst({
      where: {
        id: point.id.toString(),
      },
    })

    expect(response.status).toBe(201)
    expect(pointOnDatabase).toBeTruthy()
  })

  it('shold be return status 401 if student add point', async () => {
    const student = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({
      sub: student.id.toString(),
      role: student.role,
    })

    const categoryPoint = await categoryPointFactory.makePrismaCategoryPoint()

    const response = await request(app.getHttpServer())
      .post('/point')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        categoryPointId: categoryPoint.id.toString(),
        studentId: student.id.toString(),
      })

    expect(response.statusCode).toBe(403)
  })
})
