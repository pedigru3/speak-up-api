import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryPointFactory } from 'test/factories/make-category-point'
import { ClassDayFactory } from 'test/factories/make-class-day'
import { JourneyFactory } from 'test/factories/make-jorney'
import { StudentFactory } from 'test/factories/make-student'
import { TeacherFactory } from 'test/factories/make-teacher'
import { waitFor } from 'test/utils/wait-for'

describe('Edit classday (E2E)', () => {
  let app: INestApplication
  let classdayFactory: ClassDayFactory
  let teacherFactory: TeacherFactory
  let studentFactory: StudentFactory
  let journeyFactory: JourneyFactory
  let categoryFactory: CategoryPointFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClassDayFactory,
        TeacherFactory,
        JourneyFactory,
        StudentFactory,
        CategoryPointFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    journeyFactory = moduleRef.get(JourneyFactory)
    classdayFactory = moduleRef.get(ClassDayFactory)
    teacherFactory = moduleRef.get(TeacherFactory)
    categoryFactory = moduleRef.get(CategoryPointFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /classday', async () => {
    const journey = await journeyFactory.makePrismaJourney()
    const classDay = await classdayFactory.makePrismaClassDay({
      currentDay: 1,
      jorneyId: journey.id,
    })

    const category = await categoryFactory.makePrismaCategoryPoint({
      icon: 'appointment',
      text: 'Aula dada',
      value: 2,
    })

    const user1 = await studentFactory.makePrismaStudent({
      daysInARow: 0,
      points: 0,
    })

    const user2 = await studentFactory.makePrismaStudent()

    const teacher = await teacherFactory.makePrismaTeacher()

    const accessToken = jwt.sign({ sub: teacher.id.toString() })

    const response = await request(app.getHttpServer())
      .put('/classday')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classDayId: classDay.id.toString(),
        studentsIds: [user1.id.toString(), user2.id.toString()],
        categoryPointId: category.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const user = await prisma.user.findUnique({
      where: {
        id: user1.id.toString(),
      },
    })

    expect(user?.daysInARow).toBe(1)

    await waitFor(async () => {
      const notification = await prisma.notification.findFirst({
        where: {
          recipientId: user1.id.toString(),
        },
      })

      expect(notification?.title).toBe('Aula dada')
    })
  })
})
