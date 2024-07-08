import {
  Controller,
  UseGuards,
  Get,
  UnauthorizedException,
  Query,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Controller('/teacher')
@UseGuards(JwtAuthGuard)
export class GetTeacherController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  async handler(
    @Query('id') id: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const teacher = await this.prismaService.user.findUnique({
      where: {
        id: userPayload.sub,
        role: 'ADMIN',
      },
      include: {},
    })

    if (!teacher) {
      throw new UnauthorizedException()
    }

    const points = await this.prismaService.pointCategory.aggregate({
      _count: true,
    })

    const students = await this.prismaService.user.aggregate({
      where: {
        role: 'USER',
      },
      _count: true,
    })

    const journeyDay = await this.prismaService.journeyDay.findFirst({
      orderBy: {
        date: 'desc',
      },
    })

    return {
      current_progress: journeyDay?.currentProgress,
      category_points: points._count,
      students: students._count,
    }
  }
}
