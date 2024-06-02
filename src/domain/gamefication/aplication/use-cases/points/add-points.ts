import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { StudentsRepository } from '../../repositories/students-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { CategoryPointsRepository } from '../../repositories/category-points-repository'
import { PointsRepository } from '../../repositories/points-repository'
import { Point } from '@/domain/gamefication/enterprise/entities/point'
import { Injectable } from '@nestjs/common'

interface AddPointUseCaseRequest {
  categoryPointId: string
  studentId: string
}

type AddPointUseCaseResponse = Either<UseCaseError, object>

@Injectable()
export class AddPointUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private pointsRepository: PointsRepository,
    private categoryPointsRepository: CategoryPointsRepository,
  ) {}

  async execute({
    categoryPointId,
    studentId,
  }: AddPointUseCaseRequest): Promise<AddPointUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    if (student.id.toString() !== studentId) {
      return left(new NotAllowedError())
    }

    const categoryPoint =
      await this.categoryPointsRepository.findById(categoryPointId)

    if (!categoryPoint) {
      return left(new ResourceNotFoundError())
    }

    student.points = student.points + categoryPoint.value

    await this.studentsRepository.save(student)

    await this.pointsRepository.create(
      Point.create({
        pointCategoryId: categoryPoint.id,
        studentId: student.id,
        text: categoryPoint.text,
        value: categoryPoint.value,
        icon: categoryPoint.icon,
      }),
    )

    return right({})
  }
}
