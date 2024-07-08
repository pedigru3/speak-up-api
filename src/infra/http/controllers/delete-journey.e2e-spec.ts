import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { JourneyFactory } from 'test/factories/make-jorney'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'

describe('Delete Journey', () => {
  let app: INestApplication
  let journeyFactory: JourneyFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [JourneyFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    journeyFactory = moduleRef.get(JourneyFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('shold be able to delete a Journey', async () => {
    const journey = await journeyFactory.makePrismaJourney()

    const token = jwt.sign({ sub: journey.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .delete(`/journey/${journey.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })
})
