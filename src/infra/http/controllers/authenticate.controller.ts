import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/gamefication/aplication/use-cases/students/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import {
  AuthControllerResponse,
  AuthenticateUserUseCase,
} from '@/domain/gamefication/aplication/use-cases/students/authenticate-user'
import {
  ApiProperty,
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
} from '@nestjs/swagger'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

class AuthenticateDto {
  @ApiProperty()
  email!: string

  @ApiProperty()
  password!: string
}

class ExampleAuthControllerResponse implements AuthControllerResponse {
  @ApiProperty({ example: 'yourAccessToken' })
  accessToken!: string

  @ApiProperty({ example: 'yourRefreshToken' })
  refreshToken!: string

  @ApiProperty({
    example: {
      name: 'Jonh Doe',
      email: 'jonhdoe@exemple.com',
      avatar: null,
      role: 'ADMIN',
    },
  })
  user!: {
    name: string
    email: string
    avatar?: string | null | undefined
    role: 'ADMIN' | 'USER'
  }
}

@ApiTags('auth')
@Controller('/auth')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Logs user' })
  @ApiResponse({
    status: 200,
    type: ExampleAuthControllerResponse,
    description: 'Successful response, avatar may be null',
  })
  @ApiUnauthorizedResponse()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handler(@Body() body: AuthenticateDto): Promise<{
    access_token: string
    refresh_token: string
    user: {
      name: string
      email: string
      avatar?: string | null | undefined
      role: 'ADMIN' | 'USER'
    }
  }> {
    const { email, password } = authenticateBodySchema.parse(body)

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken, refreshToken, user } = result.value

    return { access_token: accessToken, refresh_token: refreshToken, user }
  }
}
