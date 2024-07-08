import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { EditClassDayUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/edit-class-day'
import { ClassDayPresenter } from '../presenters/class-day-presenter'

import { z } from 'zod'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const updateClassDayBodySchema = z.object({
  classDayId: z.string().uuid(),
  studentsIds: z.array(z.string()),
  categoryPointId: z.string().optional(),
})

type UpdateClassDayBodySchema = z.infer<typeof updateClassDayBodySchema>

@Controller('/classday')
@UseGuards(JwtAuthGuard)
export class UpdateClassDayController {
  constructor(private editClassDay: EditClassDayUseCase) {}

  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async handler(
    @Body(new ZodValidationPipe(updateClassDayBodySchema))
    body: UpdateClassDayBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const teacherId = userPayload.sub

    const { studentsIds, classDayId, categoryPointId } = body

    const result = await this.editClassDay.execute({
      studentsIds,
      classDayId,
      teacherId,
      categoryPointId,
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

    return ClassDayPresenter.toHttp({ classDay: result.value })
  }
}
