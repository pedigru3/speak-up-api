import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'

import { z } from 'zod'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { compare } from 'bcryptjs'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  admin: z.boolean().default(false),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/auth')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handler(@Body() body: AuthenticateBodySchema) {
    const { email, password, admin } = authenticateBodySchema.parse(body)

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials not match.')
    }

    if (admin && user?.role !== 'admin') {
      throw new ForbiddenException('User does not have access')
    }

    const accessToken = this.jwt.sign({ sub: user.id })
    return { access_token: accessToken, type: 'Bearer' }
  }
}
