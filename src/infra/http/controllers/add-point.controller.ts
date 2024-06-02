import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AddPointUseCase } from '@/domain/gamefication/aplication/use-cases/points/add-points'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles'

const addPointBodySchema = z.object({
  categoryPointId: z.string(),
  studentId: z.string(),
})

type AddPointBodySchema = z.infer<typeof addPointBodySchema>

@Controller('/point')
export class AddPointController {
  constructor(private addPoint: AddPointUseCase) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async handler(
    @Body(new ZodValidationPipe(addPointBodySchema))
    body: AddPointBodySchema,
  ) {
    const { categoryPointId, studentId } = addPointBodySchema.parse(body)

    const result = await this.addPoint.execute({
      categoryPointId,
      studentId,
    })

    if (result.isLeft()) {
      throw new ForbiddenException(result.value.message)
    } else {
      return result.value
    }
  }
}
