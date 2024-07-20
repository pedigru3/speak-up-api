import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { JourneyFactory } from 'test/factories/make-jorney'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TeacherFactory } from 'test/factories/make-teacher'
import { ClassDayFactory } from 'test/factories/make-class-day'

describe('Edit Journey', () => {
  let app: INestApplication
  let journeyFactory: JourneyFactory
  let classDayFactory: ClassDayFactory
  let teacherFactory: TeacherFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClassDayFactory, TeacherFactory, JourneyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    teacherFactory = moduleRef.get(TeacherFactory)
    journeyFactory = moduleRef.get(JourneyFactory)
    classDayFactory = moduleRef.get(ClassDayFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('shold be able update content of Journey', async () => {
    const teacher = await teacherFactory.makePrismaTeacher()
    const journey = await journeyFactory.makePrismaJourney()
    const classDay = await classDayFactory.makePrismaClassDay({
      jorneyId: journey.id,
    })

    const token = jwt.sign({ sub: teacher.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .put(`/classday/content/${classDay.id.toString()}`)
      .send({
        content: 'This is the new content of the journey, baby',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)

    const updatedJourney = await prisma.journeyDay.findUnique({
      where: { id: classDay.id.toString() },
    })

    expect(updatedJourney?.content).toEqual(
      'This is the new content of the journey, baby',
    )
  })
})
