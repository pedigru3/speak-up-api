import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClassDayFactory } from 'test/factories/make-class-day'
import { JourneyFactory } from 'test/factories/make-jorney'
import { StudentFactory } from 'test/factories/make-student'
import { makeUser } from 'test/factories/make-user'

describe('Get ClassDay (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let journeyFactory: JourneyFactory
  let classDayFactory: ClassDayFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, ClassDayFactory, JourneyFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    journeyFactory = moduleRef.get(JourneyFactory)
    classDayFactory = moduleRef.get(ClassDayFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /classday', async () => {
    const user = makeUser({ role: 'ADMIN' })
    await studentFactory.makePrismaStudent()
    const journey = await journeyFactory.makePrismaJourney()
    const classDay = await classDayFactory.makePrismaClassDay({
      jorneyId: journey.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    await request(app.getHttpServer())
      .get('/classday')
      .query({ id: classDay.id.toString() })
      .set('Authorization', `Bearer ${accessToken}`)

    const response2 = await request(app.getHttpServer())
      .get('/classday')
      .query({ id: classDay.id.toString() })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response2.statusCode).toBe(200)
    expect(response2.body.id).toEqual(classDay.id.toString())
  })
})
