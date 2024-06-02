import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassDayStudent } from '@/domain/gamefication/enterprise/entities/class-day-student'
import { Prisma, Presence } from '@prisma/client'

export class PrismaClassDayStudentMapper {
  static toDomain(raw: Presence): ClassDayStudent {
    return ClassDayStudent.create(
      {
        classDayId: new UniqueEntityID(raw.journeyDayId),
        studentId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    classdaystudent: ClassDayStudent,
  ): Prisma.PresenceUncheckedCreateInput {
    return {
      journeyDayId: classdaystudent.classDayId.toString(),
      userId: classdaystudent.studentId.toString(),
    }
  }
}
