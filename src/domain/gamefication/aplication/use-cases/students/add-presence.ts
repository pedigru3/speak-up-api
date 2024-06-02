import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { StudentsRepository } from '../../repositories/students-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AddPointUseCase } from '../points/add-points'
import { ClassDayStudent } from '@/domain/gamefication/enterprise/entities/class-day-student'
import { ClassDayStudentsRepository } from '../../repositories/class-day-students-repository'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { Injectable } from '@nestjs/common'
import { ClassDayStudentList } from '@/domain/gamefication/enterprise/entities/class-day-student-list'

interface AddPresenceUseCaseRequest {
  classDayId: string
  studentId: string
  categoryPointId?: string
}

type AddPresenceUseCaseResponse = Either<UseCaseError, object>

@Injectable()
export class AddPresenceUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private classDayStudentRepository: ClassDayStudentsRepository,
    private classDayRepository: ClassDayRepository,
    private addPointUseCase: AddPointUseCase,
  ) {}

  async execute({
    classDayId,
    studentId,
    categoryPointId,
  }: AddPresenceUseCaseRequest): Promise<AddPresenceUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    if (student.id.toString() !== studentId) {
      return left(new NotAllowedError())
    }

    const classDay = await this.classDayRepository.findById(classDayId)

    if (!classDay) {
      return left(new ResourceNotFoundError())
    }

    const lastPresence =
      await this.classDayRepository.getLastByStudentId(studentId)

    if (lastPresence) {
      if (
        lastPresence.currentDay === lastPresence.maxDay &&
        classDay.currentDay !== 1
      ) {
        student.daysInARow = 0
      }
      const lastDay = lastPresence.currentDay
      if (classDay.currentDay - lastDay !== 1) {
        student.daysInARow = 0
      }
    }

    const classDayStudent = ClassDayStudent.create({
      classDayId: new UniqueEntityID(classDayId),
      studentId: new UniqueEntityID(studentId),
    })

    classDay.attendanceList = new ClassDayStudentList([classDayStudent])

    await this.classDayStudentRepository.create(classDayStudent)

    if (categoryPointId) {
      await this.addPointUseCase.execute({ categoryPointId, studentId })
    }

    student.daysInARow += 1
    await this.studentsRepository.save(student)

    return right({})
  }
}
