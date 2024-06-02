import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RefreshToken } from '@/domain/gamefication/enterprise/entities/refresh-token'
import {
  $Enums,
  Prisma,
  RefreshToken as PrismaRefreshToken,
} from '@prisma/client'

type PrismaRefreshTokenWithRole = PrismaRefreshToken & {
  user: {
    role: $Enums.Role
  }
}

export class PrismaRefreshTokenMapper {
  static toDomain(raw: PrismaRefreshTokenWithRole): RefreshToken {
    return RefreshToken.create(
      {
        expiresIn: raw.expiresIn,
        userId: new UniqueEntityID(raw.userId),
        role: raw.user.role,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    refresh: RefreshToken,
  ): Prisma.RefreshTokenUncheckedCreateInput {
    return {
      id: refresh.id.toString(),
      expiresIn: refresh.expiresIn,
      userId: refresh.userId.toString(),
    }
  }
}
