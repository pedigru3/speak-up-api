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
import { AuthenticateUserUseCase } from '@/domain/gamefication/aplication/use-cases/students/authenticate-user'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  // admin: z.boolean().default(false),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/auth')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handler(@Body() body: AuthenticateBodySchema) {
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
