import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'
import { TaskFactory } from 'test/factories/make-task'

describe.skip('Upload audio attachment (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let tasksFactory: TaskFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, TaskFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    tasksFactory = moduleRef.get(TaskFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /audio-attachments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const task = await tasksFactory.makePrismaTask({
      authorId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/audio-attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('taskId', task.id.toString())
      .attach('file', './test/e2e/sample-upload.m4a')

    expect(response.statusCode).toBe(201)
  })

  test('[POST] /audio-attachments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/audio-attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpg')

    expect(response.statusCode).toBe(400)
  })
})
