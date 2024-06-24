import {
  Controller,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Post,
  UsePipes,
  Body,
  HttpCode,
} from '@nestjs/common'
import { RefreshUseCase } from '@/domain/gamefication/aplication/use-cases/refresh'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { Public } from '@/infra/auth/public'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const refreshBodySchema = z.object({
  token: z.string().uuid(),
})

class RefreshDto extends createZodDto(refreshBodySchema) {}

class RefreshResponse {
  @ApiProperty()
  access_token!: string

  @ApiProperty()
  refresh_token!: string
}

@ApiTags('auth')
@Controller('/refresh')
@Public()
export class RefreshController {
  constructor(private refreshUseCase: RefreshUseCase) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: RefreshResponse,
  })
  @ApiOperation({ summary: 'Refresh token' })
  @UsePipes(new ZodValidationPipe(refreshBodySchema))
  async handler(@Body() body: RefreshDto): Promise<RefreshResponse> {
    const result = await this.refreshUseCase.execute({
      refreshTokenId: body.token,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      access_token: result.value.accessToken,
      refresh_token: result.value.refreshToken,
    }
  }
}
