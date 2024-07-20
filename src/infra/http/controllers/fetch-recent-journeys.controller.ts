import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { FetchRecentJourneysUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/fetch-recent-journeys'
import { JourneyPresenter } from '../presenters/journey-presenter'

const pageQueryParamSchema = z
  .string()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
  .optional()

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/journeys')
export class FetchRecentJorneysController {
  constructor(private fetchRecentJorneys: FetchRecentJourneysUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchRecentJorneys.execute({
      page: page ?? 1,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    return {
      jorneys: result.value.map((journey) =>
        JourneyPresenter.toHttp({ journey }),
      ),
    }
  }
}
