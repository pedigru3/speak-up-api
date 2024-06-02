import { UseCaseError } from '@/core/errors/use-cases-error'
import { Either, left, right } from '@/core/either'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetClassDayByIdRequest {
  id: string
}

type GetClassDayByIdResponse = Either<UseCaseError, ClassDay>

export class GetClassDayByIdUseCase {
  constructor(private classdaysRepository: ClassDayRepository) {}

  async execute({
    id,
  }: GetClassDayByIdRequest): Promise<GetClassDayByIdResponse> {
    const classday = await this.classdaysRepository.findById(id)

    if (!classday) {
      return left(new ResourceNotFoundError())
    }

    return right(classday)
  }
}
