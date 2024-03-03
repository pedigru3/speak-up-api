import {
  Body,
  Controller,
  Patch,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { MULTER } from '@/configs/upload'

import { DiskStorage } from '@/providers/DiskStorage'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
})

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('/user')
@UseGuards(JwtAuthGuard)
export class UpdateUserController {
  constructor(private prisma: PrismaService) {}

  @Patch()
  @UseInterceptors(FileInterceptor('avatar', MULTER))
  async handler(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: UpdateUserBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const userId = userPayload.sub

    let avatarFileName: string | null = null

    if (file) {
      avatarFileName = file.filename
    }
    const diskStorage = new DiskStorage()

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    if (file) {
      if (user.avatar) {
        await diskStorage.deleteFile(user.avatar)
      }
    }

    const fileName = avatarFileName
      ? await diskStorage.saveFile(avatarFileName)
      : undefined

    const { name, email } = body

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
        avatar: fileName,
      },
      select: {
        name: true,
        email: true,
        avatar: true,
      },
    })

    return updatedUser
  }
}
