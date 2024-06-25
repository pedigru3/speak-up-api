import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { DeleteStudentUseCase } from '@/domain/gamefication/aplication/use-cases/students/delete-student'
import { ResourceNotFoundError } from '@/domain/gamefication/aplication/use-cases/errors/resource-not-found-error'

const deleteAccountBodySchema = z.object({
  id: z.string(),
})

class deleteAccountDto {
  @ApiProperty()
  id!: string
}

@ApiTags('students')
@Controller('/student')
export class DeleteStudentController {
  constructor(private deleteStudent: DeleteStudentUseCase) {}

  @Delete()
  @ApiOperation({ summary: 'delete a student account' })
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(deleteAccountBodySchema))
  async handler(@Body() body: deleteAccountDto) {
    const { id } = deleteAccountBodySchema.parse(body)

    const result = await this.deleteStudent.execute({
      studentId: id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException('Resource not found')
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
