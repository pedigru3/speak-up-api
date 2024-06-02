import { Teacher } from '@/domain/gamefication/enterprise/entities/teacher'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { User, UserProps } from '@/domain/gamefication/enterprise/entities/user'
import { UsersRepository } from '@/domain/gamefication/aplication/repositories/users-repository'
import { PrismaUserMapper } from '../../mappers/prisma-user-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User<UserProps>): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data: PrismaUserMapper.toPrisma(user),
    })
  }

  async findById(id: string): Promise<Teacher | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }
}
