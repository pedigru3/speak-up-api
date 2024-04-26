import { Either, left, rigth } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassDay } from '@/domain/enterprise/entities/class-day'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { AddPresenceUseCase } from '../students/add-presence'
import { ClassDayStudentList } from '@/domain/enterprise/entities/class-day-student-list'
import { ClassDayStudent } from '@/domain/enterprise/entities/class-day-student'
import { ClassDayStudentsRepository } from '../../repositories/class-day-students-repository'

interface EditClassDayUseCaseRequest {
  teacherId: string
  classdayId: string
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
    classdayId,
    studentsIds,
  }: EditClassDayUseCaseRequest): Promise<EditClassDayUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const classday = await this.classdayRepository.findById(classdayId)

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

    console.log(currentAttendanceList.length)
    console.log(classDayStudentList.getNewItems().length)
    console.log(classDayStudentList.getRemovedItems().length)

    await Promise.all(
      classDayStudentList.getNewItems().map(async (item) => {
        const result = await this.addPresence.execute({
          date: classday.date.toISOString(),
          studentId: item.studentId.toString(),
        })

        if (result.isLeft()) {
          const error = result.value
          switch (error.constructor) {
            case ResourceNotFoundError:
              throw new ResourceNotFoundError()
            case NotAllowedError:
              throw new NotAllowedError()
            default:
              throw new Error(error.message)
          }
        }
      }),
    )

    classday.attendanceList = classDayStudentList

    return rigth(classday)
  }
}
