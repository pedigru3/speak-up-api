import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Edit student (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /user', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .set({
        name: 'Jéssica',
        email: 'Jessica@gmail.com',
      })
      .attach('avatar', './test/e2e/sample-upload.jpg')

    expect(response.statusCode).toBe(200)

    const responseUserInfo = await request(app.getHttpServer())
      .get('/info')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(responseUserInfo.statusCode).toBe(200)
  })
})
