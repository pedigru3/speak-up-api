import { EditJourneyUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/edit-journey'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import { z } from 'zod'
import { JourneyPresenter } from '../presenters/journey-presenter'

const updateJourneySchema = z.object({
  title: z.string(),
  description: z.string(),
})

type UpdateJourneySchema = z.infer<typeof updateJourneySchema>

@Controller('/journey/:id')
export class UpdateJourneyController {
  constructor(private editJourney: EditJourneyUseCase) {}

  @Put()
  async handler(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateJourneySchema))
    body: UpdateJourneySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const role = userPayload.role

    if (role !== 'ADMIN') {
      throw new ForbiddenException()
    }

    const { title, description } = body

    const result = await this.editJourney.execute({
      id,
      title,
      description,
    })

    if (result.isLeft()) {
      throw new BadRequestException('Generic error')
    }

    return JourneyPresenter.toHttp({
      journey: result.value,
    })
  }
}
