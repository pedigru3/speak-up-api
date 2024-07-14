import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryPointFactory } from 'test/factories/make-category-point'
import { PointFactory } from 'test/factories/make-point'
import { StudentFactory } from 'test/factories/make-student'
import { TeacherFactory } from 'test/factories/make-teacher'
import { waitFor } from 'test/utils/wait-for'

describe('On created point (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let pointFactory: PointFactory
  let studentFactory: StudentFactory
  let categoryPointFactory: CategoryPointFactory
  let teacherFactory: TeacherFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PointFactory,
        CategoryPointFactory,
        StudentFactory,
        TeacherFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    pointFactory = moduleRef.get(PointFactory)
    categoryPointFactory = moduleRef.get(CategoryPointFactory)
    studentFactory = moduleRef.get(StudentFactory)
    teacherFactory = moduleRef.get(TeacherFactory)

    DomainEvents.sholdRun = true

    await app.init()
  })

  it('shold be send a notification when point is created', async () => {
    const teacher = await teacherFactory.makePrismaTeacher()
    const accessToken = jwt.sign({
      sub: teacher.id.toString(),
      role: teacher.role,
    })

    const student = await studentFactory.makePrismaStudent()
    const categoryPoint = await categoryPointFactory.makePrismaCategoryPoint()

    await pointFactory.makePrismaPoint({
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

    console.log(response.body)

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: { recipientId: student.id.toString() },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
