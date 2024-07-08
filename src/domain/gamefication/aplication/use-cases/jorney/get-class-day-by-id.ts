import { UseCaseError } from '@/core/errors/use-cases-error'
import { Either, left, right } from '@/core/either'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { ClassDayStudentsRepository } from '../../repositories/class-day-students-repository'
import { ClassDayStudentList } from '@/domain/gamefication/enterprise/entities/class-day-student-list'

interface GetClassDayByIdRequest {
  id: string
}

type GetClassDayByIdResponse = Either<UseCaseError, ClassDay>

@Injectable()
export class GetClassDayByIdUseCase {
  constructor(
    private classdaysRepository: ClassDayRepository,
    private classDayStudentsRepository: ClassDayStudentsRepository,
  ) {}

  async execute({
    id,
  }: GetClassDayByIdRequest): Promise<GetClassDayByIdResponse> {
    const classday = await this.classdaysRepository.findById(id)

    if (!classday) {
      return left(new ResourceNotFoundError())
    }

    const currentAttendanceList =
      await this.classDayStudentsRepository.findManyByClassDayId(id)

    const classDayStudentList = new ClassDayStudentList(currentAttendanceList)

    classday.attendanceList = classDayStudentList

    return right(classday)
  }
}
