import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/gamefication/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaUserMapper } from '@/infra/database/mappers/prisma-user-mapper'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.lorem.word(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'ADMIN',
      ...override,
    },
    id,
  )
  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}
