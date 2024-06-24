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
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'
import { GetJourneyByIdUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/get-journey'
import { JourneyPresenter } from '../presenters/journey-presenter'

@Controller('/journey')
@UseGuards(JwtAuthGuard)
export class GetJourneyController {
  constructor(private getJourneyUseCase: GetJourneyByIdUseCase) {}

  @Get()
  async handler(
    @Query('id') id: string,
    // @CurrentUser() userPayload: UserPayload,
  ) {
    const result = await this.getJourneyUseCase.execute({
      id,
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

    return JourneyPresenter.toHttp({
      journey: result.value,
    })
  }
}
