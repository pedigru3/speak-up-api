import {
  User as PrismaUser,
  Prisma,
  Point as PrismaPoint,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/enterprise/entities/student'

export type PrismaUserWithPoints = PrismaUser & {
  points: (PrismaPoint & { pointCategory: { value: number } })[]
}

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUserWithPoints): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        avatar: raw.avatar,
        daysInARow: raw.daysInARow,
        points: raw.points.reduce(
          (accumulator, point) => accumulator + point.pointCategory.value,
          0,
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      avatar: student.avatar,
      email: student.email,
      password: student.password,
      daysInARow: student.daysInARow,
      role: 'user',
    }
  }
}
