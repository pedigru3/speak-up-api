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
import { CreateJourneyUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/create-jorney'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { JourneyPresenter } from '../presenters/journey-presenter'

import { createZodDto } from 'nestjs-zod'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

const createJourneyBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  max_day: z.number(),
})

class CreateJourneyDto extends createZodDto(createJourneyBodySchema) {}

@ApiTags('journey')
@ApiBearerAuth()
@Controller('/journey')
export class CreateJourneyController {
  constructor(private createJourney: CreateJourneyUseCase) {}

  @Post()
  async handler(
    @Body(new ZodValidationPipe(createJourneyBodySchema))
    body: CreateJourneyDto,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const {
      max_day: maxDay,
      description,
      title,
    } = createJourneyBodySchema.parse(body)

    const result = await this.createJourney.execute({
      title,
      description,
      maxDay,
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

    return JourneyPresenter.toHttp({
      journey: result.value,
    })
  }
}
