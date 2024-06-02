import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Teacher,
  TeacherProps,
} from '@/domain/gamefication/enterprise/entities/teacher'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaTeacherMapper } from '@/infra/database/mappers/prisma-teacher-mapper'

export function makeTeacher(
  override: Partial<TeacherProps> = {},
  id?: UniqueEntityID,
) {
  const teacher = Teacher.create(
    {
      name: faker.lorem.word(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'ADMIN',
      refreshToken: null,
      ...override,
    },
    id,
  )
  return teacher
}

@Injectable()
export class TeacherFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTeacher(data: Partial<TeacherProps> = {}): Promise<Teacher> {
    const teacher = makeTeacher(data)

    await this.prisma.user.create({
      data: PrismaTeacherMapper.toPrisma(teacher),
    })

    return teacher
  }
}
