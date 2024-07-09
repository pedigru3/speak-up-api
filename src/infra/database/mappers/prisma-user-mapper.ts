import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/gamefication/enterprise/entities/user'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        avatar: raw.avatar,
        password: raw.password,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
    }
  }
}
