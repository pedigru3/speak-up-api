import { right } from '@/core/either'
import { InvalidAttachmentTypeError } from '@/domain/gamefication/aplication/use-cases/errors/invalid-attachment-type-error'
import { UploadAndCreateAnswerUseCase } from '@/domain/gamefication/aplication/use-cases/upload-and-create-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/audio-attachments')
export class UploadAudioController {
  constructor(private uploadAndCreateAnswer: UploadAndCreateAnswerUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @CurrentUser() userPayload: UserPayload,
    @Body('taskId')
    taskId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 10, // 5mb
          }),
          new FileTypeValidator({
            fileType: 'audio/*',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!taskId) {
      return new BadRequestException('Invalid taskId')
    }

    const result = await this.uploadAndCreateAnswer.execute({
      studentId: userPayload.sub,
      taskId,
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return right(result.value)
  }
}
