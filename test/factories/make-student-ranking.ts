import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student, StudentProps } from '@/domain/enterprise/entities/student'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { StudentRankingProps } from '@/domain/enterprise/entities/student-ranking'
import { PrismaStudentRankingMapper } from '@/infra/database/mappers/prisma-student-ranking-mapper'

export function makeStudent(
  override: Partial<StudentRankingProps> = {},
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
      data: PrismaStudentRankingMapper.toPrisma(student),
    })

    return student
  }
}
