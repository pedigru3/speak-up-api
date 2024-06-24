import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ClassDay,
  ClassDayProps,
} from '@/domain/gamefication/enterprise/entities/class-day'
import { ClassDayStudentList } from '@/domain/gamefication/enterprise/entities/class-day-student-list'
import {} from '@/domain/gamefication/enterprise/entities/jorney-day'
import { PrismaClassDayMapper } from '@/infra/database/mappers/prisma-class-day-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeClassDay(
  override: Partial<ClassDayProps> = {},
  id?: UniqueEntityID,
) {
  const classDay = ClassDay.create(
    {
      maxDay: 16,
      jorneyId: new UniqueEntityID('1'),
      currentDay: 1,
      date: new Date(),
      classDayStudentList: new ClassDayStudentList(),
      ...override,
    },
    id,
  )
  return classDay
}

@Injectable()
export class ClassDayFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaClassDay(
    data: Partial<ClassDayProps> = {},
  ): Promise<ClassDay> {
    const classDay = makeClassDay(data)

    await this.prisma.journeyDay.create({
      data: PrismaClassDayMapper.toPrisma(classDay),
    })

    return classDay
  }
}
