import { Teacher } from '@/domain/enterprise/entities/teacher'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TeachersRepository } from '@/domain/aplication/repositories/teachers-repository'
import { PrismaTeacherMapper } from '../../mappers/prisma-teacher-mapper'

@Injectable()
export class PrismaTeacherRepository implements TeachersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Teacher | null> {
    const teacher = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'admin',
      },
    })

    if (!teacher) {
      return null
    }

    return PrismaTeacherMapper.toDomain(teacher)
  }
}
