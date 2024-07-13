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
import { SharpService } from '@/infra/resize/sharp.service'

const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
})

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('/user')
@UseGuards(JwtAuthGuard)
export class UpdateUserController {
  constructor(
    private editStudents: EditStudentUseCase,
    private sharpService: SharpService,
  ) {}

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

    let sharpedImage: Buffer | undefined

    if (file) {
      sharpedImage = await this.sharpService
        .edit(file?.buffer)
        .resize(150, 150)
        .toBuffer()
    }

    const result = await this.editStudents.execute({
      userId: studentId,
      email,
      name,
      file: file
        ? {
            buffer: sharpedImage!,
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
