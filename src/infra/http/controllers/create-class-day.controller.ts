import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { CreateClassDayUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/create-class-day'
import { ClassDayPresenter } from '../presenters/class-day-presenter'

const createClassDayBodySchema = z.object({
  journey_id: z.string(),
})

type CreateClassDayBodySchema = z.infer<typeof createClassDayBodySchema>

@Controller('/classday')
export class CreateClassDayController {
  constructor(private createClassDay: CreateClassDayUseCase) {}

  @Post()
  async handler(
    @Body(new ZodValidationPipe(createClassDayBodySchema))
    body: CreateClassDayBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { journey_id: jorneyId } = createClassDayBodySchema.parse(body)

    const result = await this.createClassDay.execute({
      jorneyId,
      teacherId: userPayload.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return ClassDayPresenter.toHttp({
      classDay: result.value,
    })
  }
}
