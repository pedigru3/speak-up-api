import {
  Controller,
  UseGuards,
  Get,
  UnauthorizedException,
  BadRequestException,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { GetUserByIdUseCase } from '@/domain/gamefication/aplication/use-cases/get-user-by-id'
import { UserPresenter } from '../presenters/user-presenter'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'

@Controller('/user')
@UseGuards(JwtAuthGuard)
export class GetUserController {
  constructor(private getUserUseCase: GetUserByIdUseCase) {}

  @Get()
  async handler(
    @Query('id') id: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const result = await this.getUserUseCase.execute({
      requesterId: userPayload.sub,
      targetUserId: id,
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

    return UserPresenter.toHttp({
      user: result.value,
    })
  }
}
