import {
  Controller,
  UseGuards,
  Get,
  UnauthorizedException,
  BadRequestException,
  Query,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { GetClassDayByIdUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/get-class-day-by-id'
import { ClassDayPresenter } from '../presenters/class-day-presenter'

@Controller('/classday')
@UseGuards(JwtAuthGuard)
export class GetClassDayController {
  constructor(private getClassDayById: GetClassDayByIdUseCase) {}

  @Get()
  async handler(@Query('id') classDayId: string) {
    const result = await this.getClassDayById.execute({
      id: classDayId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return ClassDayPresenter.toHttp({ classDay: result.value })
  }
}
