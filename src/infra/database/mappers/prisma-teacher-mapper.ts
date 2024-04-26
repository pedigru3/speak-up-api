import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Teacher } from '@/domain/enterprise/entities/teacher'
import { User } from '@prisma/client'

export class PrismaTeacherMapper {
  static toDomain(raw: User): Teacher {
    if (raw.role !== 'admin') {
      throw new Error('Teacher need admin role. Not Allowed.')
    }
    return Teacher.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
