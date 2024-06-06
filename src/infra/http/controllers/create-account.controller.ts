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
import { Public } from '@/infra/auth/public'
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

class createAccountDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  password!: string
}

@ApiTags('auth')
@Controller('/account')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create an account' })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handler(@Body() body: createAccountDto) {
    const { name, email, password } = createAccountBodySchema.parse(body)

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
