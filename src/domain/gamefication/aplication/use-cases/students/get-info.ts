import { Student } from '@/domain/gamefication/enterprise/entities/student'
import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../../repositories/students-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { PointsRepository } from '../../repositories/points-repository'
import { Point } from '@/domain/gamefication/enterprise/entities/point'

interface GetInfoRequest {
  studentId: string
}

type GetInfoResponse = Either<
  NotAllowedError,
  {
    student: Student
    lastPoints: Point[]
  }
>

@Injectable()
export class GetInfoUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private pointsRepository: PointsRepository,
  ) {}

  async execute({ studentId }: GetInfoRequest): Promise<GetInfoResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new NotAllowedError())
    }

    const lastPoints = await this.pointsRepository.fetchLastPoints(studentId)

    return right({ student, lastPoints })
  }
}
