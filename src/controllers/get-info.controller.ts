import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'

@Controller('/info')
@UseGuards(JwtAuthGuard)
export class GetInfoController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handler(@CurrentUser() userPayload: UserPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userPayload.sub,
      },
    })

    if (!user) {
      throw new ForbiddenException()
    }

    return {
      name: user.name,
      email: user.email,
      image: user.avatar,
      days_in_a_row: 10,
      pending_tasks: 2,
      level: 3,
      points: 290,
      last_points: [
        {
          text: 'You attended class!',
          value: 10,
        },
        {
          text: 'Attended all week!',
          value: 15,
        },
      ],
    }
  }
}
