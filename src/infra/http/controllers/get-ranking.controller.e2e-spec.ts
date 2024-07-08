import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import request from 'supertest'
import { CategoryPointFactory } from 'test/factories/make-category-point'
import { PointFactory } from 'test/factories/make-point'
import { StudentFactory } from 'test/factories/make-student'
import { vi } from 'vitest'

describe('Get Ranking (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let pointFactory: PointFactory
  let categoryFactory: CategoryPointFactory

  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, PointFactory, CategoryPointFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    pointFactory = moduleRef.get(PointFactory)
    categoryFactory = moduleRef.get(CategoryPointFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
    vi.useFakeTimers()
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('[GET] /ranking', async () => {
    const user = await studentFactory.makePrismaStudent({
      points: 100,
      name: 'Felipe',
    })

    await studentFactory.makePrismaStudent()

    const category = await categoryFactory.makePrismaCategoryPoint({
      value: 100,
    })
    await pointFactory.makePrismaPoint({
      studentId: user.id,
      pointCategoryId: category.id,
      value: 100,
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

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/ranking')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(20)
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
        avatar: faker.image.url(),
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
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        level: expect.any(Number),
        days_in_a_row: expect.any(Number),
        points: 3,
      }),
    )
  })
})
