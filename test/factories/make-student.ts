import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/gamefication/enterprise/entities/student'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaStudentMapper } from '@/infra/database/mappers/prisma-student-mapper'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      daysInARow: faker.number.int({ max: 10 }),
      points: faker.number.int({ max: 20 }),
      avatar: faker.image.url(),
      role: 'USER',
      refreshToken: null,
      ...override,
    },
    id,
  )
  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }
}
