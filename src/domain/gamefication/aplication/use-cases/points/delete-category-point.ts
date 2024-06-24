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
    console.log('oi')
    const categorypoint =
      await this.categorypointRepository.findById(categorypointId)

    console.log('oi2')

    if (!categorypoint) {
      return left(new ResourceNotFoundError())
    }

    console.log('oi3')

    await this.categorypointRepository.delete(categorypoint)

    return right({})
  }
}
