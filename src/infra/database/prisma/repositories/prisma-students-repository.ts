import { Student } from '@/domain/gamefication/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { StudentsRepository } from '@/domain/gamefication/aplication/repositories/students-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaStudentMapper } from '../../mappers/prisma-student-mapper'
import {
  PrismaStudentRanking,
  PrismaStudentRankingMapper,
} from '../../mappers/prisma-student-ranking-mapper'
import { StudentRanking } from '@/domain/gamefication/enterprise/entities/student-ranking'

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(params: PaginationParams): Promise<Student[]> {
    const data = await this.prisma.user.findMany({
      where: {
        role: 'USER',
      },
      include: {
        points: {
          include: {
            pointCategory: {
              select: {
                value: true,
              },
            },
          },
        },
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    return data.map(PrismaStudentMapper.toDomain)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
      data,
    })
  }

  async save(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.update({
      data,
      where: {
        id: student.id.toString(),
      },
    })
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'USER',
      },
      include: {
        points: {
          include: {
            pointCategory: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async findManyByRanking(
    params: PaginationParams,
    date?: string,
  ): Promise<StudentRanking[]> {
    if (date) {
      const splitedDate = date.split('-')
      const year = Number(splitedDate[0])
      const month = Number(splitedDate[1])
      const students: PrismaStudentRanking[] = await this.prisma.$queryRaw`
      SELECT
          u.id,
          u.name,
          u.avatar,
          u.days_in_a_row,
          SUM(pc.value) AS total_points
      FROM
          users u
      JOIN
          "Point" p ON u.id = p.user_id
      JOIN
          points_categories pc ON p.point_category_id = pc.id
      WHERE
          EXTRACT(MONTH FROM p.created_at) = ${month}
          AND EXTRACT(YEAR FROM p.created_at) = ${year} -- Ano
      GROUP BY
          u.id, u.name, u.avatar, u.days_in_a_row
      ORDER BY
          total_points DESC
          OFFSET
          ${(params.page - 1) * 20}
      LIMIT
      20;
    `

      return students.map(PrismaStudentRankingMapper.toDomain)
    } else {
      const students: PrismaStudentRanking[] = await this.prisma.$queryRaw`
      SELECT
          u.id,
          u.name,
          u.avatar,
          u.days_in_a_row,
          SUM(pc.value) AS total_points
      FROM
          users u
      JOIN
          "Point" p ON u.id = p.user_id
      JOIN
          points_categories pc ON p.point_category_id = pc.id
      GROUP BY
          u.id, u.name, u.avatar, u.days_in_a_row
      ORDER BY
          total_points DESC
          OFFSET
          ${(params.page - 1) * 20}
      LIMIT
      20;
    `
      return students.map(PrismaStudentRankingMapper.toDomain)
    }
  }

  async findById(id: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'USER',
      },
      include: {
        points: {
          include: {
            pointCategory: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async delete(studentId: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: studentId,
      },
    })
  }
}
