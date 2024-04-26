import { Either, left, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { StudentsRepository } from '../../repositories/students-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { CategoryPointsRepository } from '../../repositories/category-points-repository'

interface AddPointUseCaseRequest {
  categoryPointId: string
  studentId: string
}

type AddPointUseCaseResponse = Either<UseCaseError, object>

export class AddPointUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
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

    return rigth({})
  }
}
