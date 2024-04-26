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

const createCategoryPointBodySchema = z.object({
  text: z.string(),
  value: z.number(),
  icon: z.string().optional(),
})

type CreateCategoryPointBodySchema = z.infer<
  typeof createCategoryPointBodySchema
>

@Controller('/category-point')
@UseGuards(JwtAuthGuard)
export class CreateCategoryPoint {
  constructor(private prisma: PrismaService) {}

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

    if (!user || user.role !== 'admin') {
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
