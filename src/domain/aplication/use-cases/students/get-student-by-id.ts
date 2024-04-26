import { Student } from '@/domain/enterprise/entities/student'
import { Either, left, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { StudentsRepository } from '../../repositories/students-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { PresencesRepository } from '../../repositories/presences-repository'
import dayjs from 'dayjs'
import { Injectable } from '@nestjs/common'

interface GetStudentByIdRequest {
  id: string
}

type GetStudentByIdResponse = Either<UseCaseError, Student>

@Injectable()
export class GetStudentByIdUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private presencesRepository: PresencesRepository,
  ) {}

  async execute({
    id,
  }: GetStudentByIdRequest): Promise<GetStudentByIdResponse> {
    const student = await this.studentsRepository.findById(id)

    if (!student) {
      return left(new NotAllowedError())
    }

    const presence = await this.presencesRepository.getLastPresence(id)

    if (presence) {
      const currentDate = dayjs().startOf('date').toDate().getTime()
      const presenceDate = dayjs(presence.date)
        .startOf('date')
        .toDate()
        .getTime()
      if (currentDate - presenceDate >= 24 * 60 * 60 * 1000) {
        student.daysInARow = 0
        await this.studentsRepository.save(student)
      }
    }

    return rigth(student)
  }
}
