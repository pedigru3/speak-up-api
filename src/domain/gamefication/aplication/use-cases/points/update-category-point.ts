import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { CategoryPointsRepository } from '../../repositories/category-points-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { $Enums } from '@prisma/client'
import { Injectable } from '@nestjs/common'

interface UpdateCategoryPointUseCaseRequest {
  teacherId: string
  categoryPointId: string
  text: string
  value: number
  icon: $Enums.Icon
}

type UpdateCategoryPointUseCaseResponse = Either<UseCaseError, object>

@Injectable()
export class UpdateCategoryPointUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private categoryPointsRepository: CategoryPointsRepository,
  ) {}

  async execute({
    value,
    icon,
    text,
    categoryPointId,
    teacherId,
  }: UpdateCategoryPointUseCaseRequest): Promise<UpdateCategoryPointUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new ResourceNotFoundError())
    }

    if (teacher.id.toString() !== teacherId) {
      return left(new NotAllowedError())
    }

    const categoryPoint =
      await this.categoryPointsRepository.findById(categoryPointId)

    if (!categoryPoint) {
      return left(new ResourceNotFoundError())
    }

    categoryPoint.icon = icon
    categoryPoint.value = value
    categoryPoint.text = text

    console.log('categoryPoint')
    console.log(categoryPoint)

    await this.categoryPointsRepository.save(categoryPoint)

    return right({})
  }
}
