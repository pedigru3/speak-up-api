import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  RefreshToken,
  RefreshTokenProps,
} from '@/domain/gamefication/enterprise/entities/refresh-token'
import { PrismaRefreshTokenMapper } from '@/infra/database/mappers/prisma.refresh-token-mapper'

export function makeRefreshToken(
  override: Partial<RefreshTokenProps> = {},
  id?: UniqueEntityID,
) {
  const refreshtoken = RefreshToken.create(
    {
      userId: new UniqueEntityID(),
      role: 'USER',
      expiresIn: Math.floor(Date.now() / 1000) + 60,
      ...override,
    },
    id,
  )
  return refreshtoken
}

@Injectable()
export class RefreshTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRefreshToken(
    data: Partial<RefreshTokenProps> = {},
  ): Promise<RefreshToken> {
    const refreshtoken = makeRefreshToken(data)

    await this.prisma.refreshToken.create({
      data: PrismaRefreshTokenMapper.toPrisma(refreshtoken),
    })

    return refreshtoken
  }
}
