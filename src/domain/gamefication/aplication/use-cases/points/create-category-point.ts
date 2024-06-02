import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { CategoryPointsRepository } from '../../repositories/category-points-repository'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { $Enums } from '@prisma/client'

interface CreateCategoryPointUseCaseRequest {
  teacherId: string
  text: string
  value: number
  icon: $Enums.Icon
}

type CreateCategoryPointUseCaseResponse = Either<UseCaseError, object>

export class CreateCategoryPointUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private categoryPointsRepository: CategoryPointsRepository,
  ) {}

  async execute({
    value,
    icon,
    text,
    teacherId,
  }: CreateCategoryPointUseCaseRequest): Promise<CreateCategoryPointUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new ResourceNotFoundError())
    }

    if (teacher.id.toString() !== teacherId) {
      return left(new NotAllowedError())
    }

    const categoryPoint = CategoryPoint.create({
      icon,
      text,
      value,
    })

    await this.categoryPointsRepository.create(categoryPoint)

    return right({})
  }
}
