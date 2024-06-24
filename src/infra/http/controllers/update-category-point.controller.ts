import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { zodToOpenAPI } from 'nestjs-zod'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UpdateCategoryPointUseCase } from '@/domain/gamefication/aplication/use-cases/points/update-category-point'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/gamefication/aplication/use-cases/errors/not-allowed-error'

const updateCategoryPointBodySchema = z.object({
  text: z.string(),
  value: z.number(),
  icon: z
    .enum([
      'appointment',
      'calendar',
      'calendar2',
      'chat',
      'journey',
      'onlineMeeting',
      'order',
      'pendingTask',
      'taskList',
      'toDoList',
    ])
    .optional(),
})

const updateCategoryPointBodyOpenAPI = zodToOpenAPI(
  updateCategoryPointBodySchema,
)

type UpdateCategoryPointBodySchema = z.infer<
  typeof updateCategoryPointBodySchema
>

@ApiTags('point')
@Controller('/category-point/:id')
@UseGuards(JwtAuthGuard)
export class UpdateCategoryPointController {
  constructor(private updateCategoryPoint: UpdateCategoryPointUseCase) {}

  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'Update a Point Category ' })
  @ApiBody({ schema: updateCategoryPointBodyOpenAPI })
  @Put()
  async handler(
    @Body(new ZodValidationPipe(updateCategoryPointBodySchema))
    body: UpdateCategoryPointBodySchema,
    @Param('id') id: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { text, value, icon } = updateCategoryPointBodySchema.parse(body)

    if (!icon) {
      return new BadRequestException('Icon is required')
    }

    const result = await this.updateCategoryPoint.execute({
      categoryPointId: id,
      icon,
      text,
      value,
      teacherId: userPayload.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ForbiddenException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
      }
    }
  }
}
