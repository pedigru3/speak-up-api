import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../repositories/teachers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { CategoryPointsRepository } from '../repositories/category-points-repository'
import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'

interface FetchCategoryPointsRequest {
  page: number
  teacherId: string
}

type FetchAnswersResponse = Either<UseCaseError, CategoryPoint[]>

@Injectable()
export class FetchCategoryPointsUseCase {
  constructor(
    private categoryPointsRepository: CategoryPointsRepository,
    private teachersRepository: TeachersRepository,
  ) {}

  async execute({
    page,
    teacherId,
  }: FetchCategoryPointsRequest): Promise<FetchAnswersResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const categoryPoints = await this.categoryPointsRepository.fetch({ page })

    return right(categoryPoints)
  }
}
