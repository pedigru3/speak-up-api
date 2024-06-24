import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { zodToOpenAPI } from 'nestjs-zod'
import { ApiBody, ApiTags } from '@nestjs/swagger'

const createCategoryPointBodySchema = z.object({
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

const createCategoryPointBodyOpenAPI = zodToOpenAPI(
  createCategoryPointBodySchema,
)

type CreateCategoryPointBodySchema = z.infer<
  typeof createCategoryPointBodySchema
>

@ApiTags('point')
@Controller('/category-point')
@UseGuards(JwtAuthGuard)
export class CreateCategoryPoint {
  constructor(private prisma: PrismaService) {}

  @ApiBody({ schema: createCategoryPointBodyOpenAPI })
  @Post()
  async handler(
    @Body(new ZodValidationPipe(createCategoryPointBodySchema))
    body: CreateCategoryPointBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userPayload.sub,
      },
    })

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException()
    }

    const { text, value, icon } = createCategoryPointBodySchema.parse(body)
    await this.prisma.pointCategory.create({
      data: {
        text,
        value,
        icon,
      },
    })
    return 'ok'
  }
}
