import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/account')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handler(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body)

    const userWithSomeEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSomeEmail) {
      throw new ConflictException(
        'User with same e-mail adress already exists.',
      )
    }

    const userQuantity = await this.prisma.user.count()
    const hashedPassword = await hash(password, 8)

    if (userQuantity === 0) {
      await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'admin',
        },
      })
    } else {
      await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })
    }
  }
}
