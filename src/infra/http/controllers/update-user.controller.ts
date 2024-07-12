import {
  BadRequestException,
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { z } from 'zod'
import { EditStudentUseCase } from '@/domain/gamefication/aplication/use-cases/students/edit-student'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'
import { InvalidAttachmentTypeError } from '@/domain/gamefication/aplication/use-cases/errors/invalid-attachment-type-error'
import { UserPresenter } from '../presenters/user-presenter'

const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
})

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('/user')
@UseGuards(JwtAuthGuard)
export class UpdateUserController {
  constructor(private editStudents: EditStudentUseCase) {}

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  async handler(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File | undefined,
    @Body()
    body: UpdateUserBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const studentId = userPayload.sub

    const { email, name } = body

    const result = await this.editStudents.execute({
      userId: studentId,
      email,
      name,
      file: file
        ? {
            buffer: file.buffer,
            mimetype: file.mimetype,
            originalname: file.originalname,
          }
        : undefined,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return UserPresenter.toHttp({ user: result.value })
  }
}
