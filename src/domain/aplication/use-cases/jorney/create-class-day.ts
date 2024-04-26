import { Either, left, rigth } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ClassDay } from '@/domain/enterprise/entities/class-day'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { StudentsPresencesRepository } from '../../repositories/students-presences-repository'
import { JorneyRepository } from '../../repositories/jorney-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { NotAllowedCreateClassError } from './errors/not-allowed-create-class-error'
import { ClassDayStudent } from '@/domain/enterprise/entities/class-day-student'
import { ClassDayStudentList } from '@/domain/enterprise/entities/class-day-student-list'

interface CreateClassDayUseCaseRequest {
  teacherId: string
  jorneyId: string
}

type CreateClassDayUseCaseResponse = Either<UseCaseError, ClassDay>

@Injectable()
export class CreateClassDayUseCase {
  constructor(
    private classDayRepository: ClassDayRepository,
    private teachersRepository: TeachersRepository,
    private studentsPresencesRepository: StudentsPresencesRepository,
    private jorneyRepository: JorneyRepository,
  ) {}

  async execute({
    teacherId,
    jorneyId,
  }: CreateClassDayUseCaseRequest): Promise<CreateClassDayUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const jorney = await this.jorneyRepository.findById(jorneyId)

    if (!jorney) {
      return left(new ResourceNotFoundError())
    }

    if (jorney.currentDay + 1 > jorney.maxDay) {
      return left(new NotAllowedCreateClassError())
    }

    const classDay = ClassDay.create({
      jorneyId: jorney.id,
      currentDay: jorney.currentDay + 1,
      date: new Date(),
    })

    const studentsPresences = await this.studentsPresencesRepository.getAll()

    const dayStudentsPresences = studentsPresences.map((studentPresence) => {
      return ClassDayStudent.create({
        classDayId: classDay.id,
        studentId: studentPresence.id,
      })
    })

    classDay.attendanceList = new ClassDayStudentList(dayStudentsPresences)

    await this.classDayRepository.create(classDay)

    return rigth(classDay)
  }
}
