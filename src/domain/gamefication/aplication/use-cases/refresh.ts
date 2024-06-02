import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Encrypter } from '../cryptography/encrypter'
import { RefreshToken } from '../../enterprise/entities/refresh-token'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import dayjs from 'dayjs'

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
      return left(new UnauthorizedException())
    }

    const refreshTokenHasExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresIn),
    )

    if (refreshTokenHasExpired) {
      return left(new UnauthorizedException())
    }

    const expTime = Math.floor(Date.now() / 1000) + 60 * 60 // Token expira em 1 hora

    const accessToken = await this.encrypter.encrypt({
      sub: refreshToken.id.toString(),
      role: refreshToken.role,
      exp: expTime,
    })

    const newRefreshToken = RefreshToken.create({
      role: refreshToken.role,
      userId: refreshToken.userId,
      expiresIn: dayjs().add(7, 'days').unix(), // 7 dias,
    })

    await this.refreshTokenRepository.create(newRefreshToken)

    return right({
      accessToken,
      refreshToken: newRefreshToken.id.toString(),
    })
  }
}
