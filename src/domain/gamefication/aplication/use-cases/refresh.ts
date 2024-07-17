import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Encrypter } from '../cryptography/encrypter'
import { RefreshToken } from '../../enterprise/entities/refresh-token'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'

interface RefreshRequest {
  refreshTokenId: string
}

type RefreshResponse = Either<
  UseCaseError,
  {
    accessToken: string
    refreshToken: string
  }
>

@Injectable()
export class RefreshUseCase {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({ refreshTokenId }: RefreshRequest): Promise<RefreshResponse> {
    const refreshToken =
      await this.refreshTokenRepository.findById(refreshTokenId)

    if (!refreshToken) {
      return left(new UnauthorizedException('Token not found'))
    }

    const todayInTimestamp = Math.floor(Date.now() / 1000)

    const refreshTokenHasExpired = todayInTimestamp > refreshToken.expiresIn

    if (refreshTokenHasExpired) {
      return left(new UnauthorizedException('Token has expired'))
    }

    const accessToken = await this.encrypter.encrypt({
      sub: refreshToken.userId.toString(),
      role: refreshToken.role,
      exp: todayInTimestamp + 60 * 60 * 24, // 24 hours
    })

    const newRefreshToken = RefreshToken.create(
      {
        role: refreshToken.role,
        userId: refreshToken.userId,
        expiresIn: todayInTimestamp + 60 * 60 * 24 * 7, // 7 days,
      },
      refreshToken.id,
    )

    await this.refreshTokenRepository.createOrUpdate(newRefreshToken)

    return right({
      accessToken,
      refreshToken: newRefreshToken.id.toString(),
    })
  }
}
