import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import request from 'supertest'
import { vi } from 'vitest'

describe('Get Ranking (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
    vi.useFakeTimers()
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('[GET] /ranking', async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        points: {
          create: {
            pointCategory: {
              create: {
                text: 'qualquer',
                value: 100,
              },
            },
          },
        },
      },
    })

    await prisma.user.create({
      data: {
        name: 'John Doe 2',
        email: 'johndoe2@example.com',
        password: '123456',
        points: {
          create: {
            pointCategory: {
              create: {
                text: 'qualquer um',
                value: 0,
              },
            },
          },
        },
      },
    })

    const usersData = Array.from({ length: 18 }, () => ({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.url(),
        password: faker.internet.password(),
        points: {
          create: {
            pointCategory: {
              create: {
                text: randomUUID(),
                value: faker.number.int({ min: 1, max: 50 }),
              },
            },
          },
        },
      },
    }))

    const userCreations = usersData.map((userData) =>
      prisma.user.create(userData),
    )

    await Promise.all(userCreations)

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/ranking')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body[0].points).toBe(100)
    expect(response.body[19].points).toBe(0)
  })

  it('[GET] /ranking basead in period', async () => {
    vi.setSystemTime(dayjs().set('month', 0).toDate())

    const pointCategory = await prisma.pointCategory.create({
      data: {
        text: 'Comparecer aula',
        value: 1,
      },
    })

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        points: {
          create: {
            pointCategoryId: pointCategory.id,
            createdAt: new Date(),
          },
        },
      },
    })

    vi.setSystemTime(dayjs().set('month', 1).toDate())
    await prisma.point.createMany({
      data: [
        {
          userId: user.id,
          pointCategoryId: pointCategory.id,
          createdAt: new Date(),
        },
        {
          userId: user.id,
          pointCategoryId: pointCategory.id,
          createdAt: new Date(),
        },
      ],
    })

    vi.setSystemTime(dayjs().set('month', 2).toDate())
    await prisma.point.createMany({
      data: [
        {
          userId: user.id,
          pointCategoryId: pointCategory.id,
          createdAt: new Date(),
        },
        {
          userId: user.id,
          pointCategoryId: pointCategory.id,
          createdAt: new Date(),
        },
        {
          userId: user.id,
          pointCategoryId: pointCategory.id,
          createdAt: new Date(),
        },
      ],
    })

    vi.setSystemTime(dayjs().toDate())

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/ranking')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ date: '2024-3' })

    expect(response.statusCode).toBe(200)
    expect(response.body[0].points).toBe(3)
  })
})
