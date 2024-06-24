import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/gamefication/aplication/use-cases/students/register-student'
import { StudentAlreadyExistsError } from '@/domain/gamefication/aplication/use-cases/students/errors/student-already-exists-error'
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { randomBytes } from 'crypto'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

class createAccountDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string
}

@ApiTags('auth')
@Controller('/create-student')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a student account' })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handler(@Body() body: createAccountDto) {
    const { name, email } = createAccountBodySchema.parse(body)

    const password = randomBytes(8).toString('hex')

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
