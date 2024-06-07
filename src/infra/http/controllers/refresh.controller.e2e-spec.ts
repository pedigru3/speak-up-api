import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('POST Refresh (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[POST] /refresh', async () => {
    await request(app.getHttpServer()).post('/account').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // const accessToken = jwt.sign({ sub: user.id })

    const authResponse = await request(app.getHttpServer()).post('/auth').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer())
      .post('/refresh')
      .set('Authorization', `Bearer ${authResponse.body.access_token}`)
      .send({
        token: authResponse.body.refresh_token,
      })

    expect(response.statusCode).toBe(200)
  })
})
