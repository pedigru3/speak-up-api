import {
  Controller,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  Patch,
  HttpCode,
  Param,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { ReadNotificationUseCase } from '@/domain/notification/aplication/use-cases/read-notification'

@Controller('/notifications/:notificationId/read')
@UseGuards(JwtAuthGuard)
export class ReadNotificationController {
  constructor(private readNotificationUseCase: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handler(
    @Param('notificationId') notificationId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const result = await this.readNotificationUseCase.execute({
      notificationId,
      recipientId: userPayload.sub,
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
  }
}
