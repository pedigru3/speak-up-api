import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Roles } from '@/infra/auth/roles'

const updateContentBodySchema = z.object({
  content: z.string(),
})

type UpdateContentBodySchema = z.infer<typeof updateContentBodySchema>

@Controller('/classday/content/:id')
@Roles('ADMIN')
export class UpdateContentController {
  constructor(private prismaService: PrismaService) {}

  @Put()
  async handler(
    @Body(new ZodValidationPipe(updateContentBodySchema))
    body: UpdateContentBodySchema,
    @Param('id') classDayId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    if (userPayload.role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to do this action')
    }

    const { content } = body

    try {
      await this.prismaService.journeyDay.update({
        where: { id: classDayId },
        data: {
          content,
        },
      })
      return {}
    } catch (error) {
      throw new BadRequestException('Error updating content')
    }
  }
}
