import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchCategoryPointsUseCase } from '@/domain/gamefication/aplication/use-cases/fetch-category-points'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'
import { CategoryPointPresenter } from '../presenters/category-point-presenter'

const pageQueryParamSchema = z
  .string()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
  .optional()

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/category-points')
export class FetchCategoryPointsController {
  constructor(private fetchCategoryPoints: FetchCategoryPointsUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const result = await this.fetchCategoryPoints.execute({
      page: page ?? 1,
      teacherId: userPayload.sub,
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

    return { category_points: result.value.map(CategoryPointPresenter.toHttp) }
  }
}
