import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RefreshTokenRepository } from '@/domain/gamefication/aplication/repositories/refresh-token-repository'
import { RefreshToken } from '@/domain/gamefication/enterprise/entities/refresh-token'
import { PrismaRefreshTokenMapper } from '../../mappers/prisma.refresh-token-mapper'

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(refreshToken: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: refreshToken.userId.toString(),
      },
    })
    await this.prisma.refreshToken.create({
      data: PrismaRefreshTokenMapper.toPrisma(refreshToken),
    })
  }

  async findById(refreshTokenId: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        id: refreshTokenId,
      },
      include: {
        user: {
          select: {
            role: true,
          },
        },
      },
    })

    if (!refreshToken) {
      return null
    }

    return PrismaRefreshTokenMapper.toDomain(refreshToken)
  }
}
