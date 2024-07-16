import {
  Controller,
  UseGuards,
  Get,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetInfoUseCase } from '@/domain/gamefication/aplication/use-cases/students/get-info'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { InfoPresenter } from '../presenters/info-presenter'
import { c } from 'vitest/dist/reporters-5f784f42'

@Controller('/info')
@UseGuards(JwtAuthGuard)
export class GetInfoController {
  constructor(private getInfoUseCase: GetInfoUseCase) {}

  @Get()
  async handler(@CurrentUser() userPayload: UserPayload) {
    const result = await this.getInfoUseCase.execute({
      studentId: userPayload.sub,
    })

    console.log('testing')

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return InfoPresenter.toHttp(result.value)
  }
}
