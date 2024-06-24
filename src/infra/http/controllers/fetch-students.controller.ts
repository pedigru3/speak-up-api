import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchStudentsUseCase } from '@/domain/gamefication/aplication/use-cases/students/fetch-studants'

const pageQueryParamSchema = z
  .string()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
  .optional()

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/students')
export class FetchStudentsController {
  constructor(private fetchStudents: FetchStudentsUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    if (userPayload.role !== 'ADMIN') {
      throw new ForbiddenException()
    }

    const result = await this.fetchStudents.execute({
      page: page ?? 1,
    })

    if (result.isLeft()) {
      throw new BadRequestException('Generic error when fetching students.')
    }

    return {
      students: result.value.map((student) => {
        return {
          id: student.id.toString(),
          name: student.name,
          email: student.email,
          level: student.level,
          points: student.points,
        }
      }),
    }
  }
}
