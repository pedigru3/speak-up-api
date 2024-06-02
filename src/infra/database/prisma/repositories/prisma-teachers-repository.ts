import { Teacher } from '@/domain/gamefication/enterprise/entities/teacher'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TeachersRepository } from '@/domain/gamefication/aplication/repositories/teachers-repository'
import { PrismaTeacherMapper } from '../../mappers/prisma-teacher-mapper'

@Injectable()
export class PrismaTeacherRepository implements TeachersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Teacher | null> {
    const teacher = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'ADMIN',
      },
    })

    if (!teacher) {
      return null
    }

    return PrismaTeacherMapper.toDomain(teacher)
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const teacher = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'ADMIN',
      },
    })

    if (!teacher) {
      return null
    }

    return PrismaTeacherMapper.toDomain(teacher)
  }
}
