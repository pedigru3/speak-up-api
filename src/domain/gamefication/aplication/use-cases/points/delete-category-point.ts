/* eslint-disable @typescript-eslint/ban-types */
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { CategoryPointsRepository } from '../../repositories/category-points-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteCategoryPointUseCaseRequest {
  categorypointId: string
}

type DeleteCategoryPointUseCaseResponse = Either<UseCaseError, {}>

@Injectable()
export class DeleteCategoryPointUseCase {
  constructor(private categorypointRepository: CategoryPointsRepository) {}

  async execute({
    categorypointId,
  }: DeleteCategoryPointUseCaseRequest): Promise<DeleteCategoryPointUseCaseResponse> {
    const categorypoint =
      await this.categorypointRepository.findById(categorypointId)

    if (!categorypoint) {
      return left(new ResourceNotFoundError())
    }

    await this.categorypointRepository.delete(categorypoint)

    return right({})
  }
}
