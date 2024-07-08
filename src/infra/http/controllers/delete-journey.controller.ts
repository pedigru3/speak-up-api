import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Controller('/journey/:id')
export class DeleteJourneyController {
  constructor(private prismaService: PrismaService) {}

  @Delete()
  async handler(
    @Param('id') id: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const role = userPayload.role

    if (role !== 'ADMIN') {
      throw new ForbiddenException()
    }

    try {
      await this.prismaService.journey.delete({
        where: {
          id,
        },
      })
      return {}
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error.code)
        if (error.code === 'P2025') {
          throw new NotFoundException('Journey not found')
        }
        if (error.code === 'P2003') {
          throw new ConflictException('Generic error')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
