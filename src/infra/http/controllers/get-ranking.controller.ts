import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRankingUseCase } from '@/domain/gamefication/aplication/use-cases/students/fetch-ranking'
import { StudentRankingPresenter } from '../presenters/student-ranking-presenter'

const pageQueryParamSchema = z
  .string()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
  .optional()

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/ranking')
export class GetRankingController {
  constructor(private fetchRanking: FetchRankingUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('date') date?: string,
  ) {
    const result = await this.fetchRanking.execute({
      page: page ?? 1,
      date,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.map(StudentRankingPresenter.toHttp)
  }
}
