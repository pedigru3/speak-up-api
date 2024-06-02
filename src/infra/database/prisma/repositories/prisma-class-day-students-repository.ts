import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ClassDayStudentsRepository } from '@/domain/gamefication/aplication/repositories/class-day-students-repository'
import { ClassDayStudent } from '@/domain/gamefication/enterprise/entities/class-day-student'
import { PrismaClassDayStudentMapper } from '../../mappers/prisma-class-day-student-mapper'

@Injectable()
export class PrismaClassDaysStudentsRepository
  implements ClassDayStudentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(classDayStudent: ClassDayStudent): Promise<void> {
    const data = PrismaClassDayStudentMapper.toPrisma(classDayStudent)

    await this.prisma.presence.create({
      data,
    })
  }

  async findManyByClassDayId(id: string): Promise<ClassDayStudent[]> {
    const classDays = await this.prisma.presence.findMany({
      where: {
        journeyDayId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return classDays.map(PrismaClassDayStudentMapper.toDomain)
  }
}
