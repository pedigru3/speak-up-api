import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'
import request from 'supertest'
import { CategoryPointFactory } from 'test/factories/make-category-point'

describe('Delete Category Point (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let teacher: User
  let categoryFactory: CategoryPointFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryPointFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    categoryFactory = moduleRef.get(CategoryPointFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    teacher = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        role: 'ADMIN',
      },
    })

    await app.init()
  })

  it('shold be able delete a categorypoint [POST]', async () => {
    const accessToken = jwt.sign({ sub: teacher.id, role: 'ADMIN' })

    const categoryPoint = await categoryFactory.makePrismaCategoryPoint()

    const response = await request(app.getHttpServer())
      .delete(`/category-point/${categoryPoint.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const categorypointOnDatabase = await prisma.pointCategory.findFirst({
      where: {
        id: categoryPoint.id.toString(),
      },
    })

    expect(response.status).toBe(200)
    expect(categorypointOnDatabase).toBeNull()
  })

  it('shold be return status 401', async () => {
    const categoryPoint = await categoryFactory.makePrismaCategoryPoint()

    const response = await request(app.getHttpServer()).delete(
      `/category-point/${categoryPoint.id.toString()}`,
    )

    expect(response.statusCode).toBe(401)
  })
})
