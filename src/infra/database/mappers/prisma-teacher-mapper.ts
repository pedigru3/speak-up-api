import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Teacher } from '@/domain/gamefication/enterprise/entities/teacher'
import { Prisma, User } from '@prisma/client'

export class PrismaTeacherMapper {
  static toDomain(raw: User): Teacher {
    if (raw.role !== 'ADMIN') {
      throw new Error('Teacher need admin role. Not Allowed.')
    }
    return Teacher.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        refreshToken: null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(teacher: Teacher): Prisma.UserUncheckedCreateInput {
    return {
      id: teacher.id.toString(),
      email: teacher.email,
      name: teacher.name,
      password: teacher.password,
      role: 'ADMIN',
    }
  }
}
