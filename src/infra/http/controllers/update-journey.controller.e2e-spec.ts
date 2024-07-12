import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { JourneyFactory } from 'test/factories/make-jorney'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit Journey', () => {
  let app: INestApplication
  let journeyFactory: JourneyFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [JourneyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    journeyFactory = moduleRef.get(JourneyFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('shold be able to edit a Journey', async () => {
    const journey = await journeyFactory.makePrismaJourney()

    const token = jwt.sign({ sub: journey.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .put(`/journey/${journey.id.toString()}`)
      .send({
        title: 'New title',
        description: 'New description',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      id: journey.id.toString(),
      title: 'New title',
      description: 'New description',
      max_day: expect.any(Number),
      class_days_ids: [],
      created_at: expect.any(String),
      current_day: expect.any(Number),
    })

    const updatedJourney = await prisma.journey.findUnique({
      where: { id: journey.id.toString() },
    })

    expect(updatedJourney).toEqual({
      id: journey.id.toString(),
      title: 'New title',
      description: 'New description',
      maxDay: expect.any(Number),
      createdAt: expect.any(Date),
    })
  })
})
