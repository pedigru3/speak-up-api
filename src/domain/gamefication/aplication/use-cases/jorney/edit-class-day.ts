import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { AddPresenceUseCase } from '../students/add-presence'
import { ClassDayStudentList } from '@/domain/gamefication/enterprise/entities/class-day-student-list'
import { ClassDayStudent } from '@/domain/gamefication/enterprise/entities/class-day-student'
import { ClassDayStudentsRepository } from '../../repositories/class-day-students-repository'

interface EditClassDayUseCaseRequest {
  teacherId: string
  classDayId: string
  studentsIds: string[]
}

type EditClassDayUseCaseResponse = Either<NotAllowedError, ClassDay>

@Injectable()
export class EditClassDayUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private classdayRepository: ClassDayRepository,
    private classDayStudentsRepository: ClassDayStudentsRepository,
    private addPresence: AddPresenceUseCase,
  ) {}

  async execute({
    teacherId,
    classDayId,
    studentsIds,
  }: EditClassDayUseCaseRequest): Promise<EditClassDayUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const classday = await this.classdayRepository.findById(classDayId)

    if (!classday) {
      return left(new ResourceNotFoundError())
    }

    const currentAttendanceList =
      await this.classDayStudentsRepository.findManyByClassDayId(
        classday.id.toString(),
      )

    const classDayStudentList = new ClassDayStudentList(currentAttendanceList)

    const attendanceList = studentsIds.map((studentId) => {
      return ClassDayStudent.create({
        classDayId: classday.id,
        studentId: new UniqueEntityID(studentId),
      })
    })

    classDayStudentList.update(attendanceList)

    await Promise.all(
      classDayStudentList.getNewItems().map(async (item) => {
        const result = await this.addPresence.execute({
          classDayId: item.classDayId.toString(),
          studentId: item.studentId.toString(),
        })

        if (result.isLeft()) {
          throw result.value
        }
      }),
    )

    classday.attendanceList = classDayStudentList

    return right(classday)
  }
}
