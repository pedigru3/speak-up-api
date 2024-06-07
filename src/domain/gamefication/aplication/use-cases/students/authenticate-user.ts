import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../../repositories/users-repository'
import { HashCompare } from '../../cryptography/hash-compare'
import { Encrypter } from '../../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { RefreshToken } from '@/domain/gamefication/enterprise/entities/refresh-token'
import { RefreshTokenRepository } from '../../repositories/refresh-token-repository'
import { $Enums } from '@prisma/client'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

export interface AuthControllerResponse {
  accessToken: string
  refreshToken: string
  user: {
    name: string
    email: string
    avatar?: string | null
    role: $Enums.Role
  }
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  AuthControllerResponse
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPassowordValid = await this.hashCompare.compare(
      password,
      user.password,
    )

    if (!isPassowordValid) {
      return left(new WrongCredentialsError())
    }

    const now = new Date()

    now.setHours(now.getHours() + 1) // add 1 hour

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role,
      exp: Math.floor(now.getTime() / 1000),
    })

    now.setDate(now.getDate() + 7) // add 7 days

    const refreshToken = RefreshToken.create({
      role: user.role,
      userId: user.id,
      expiresIn: Math.floor(now.getTime() / 1000), // 7 dias,
    })

    await this.refreshTokenRepository.createOrUpdate(refreshToken)

    return right({
      accessToken,
      refreshToken: refreshToken.id.toString(),
      user: {
        name: user.name,
        email,
        role: user.role,
        avatar: user.avatar,
      },
    })
  }
}
