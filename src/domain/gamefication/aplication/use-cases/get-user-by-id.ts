import { User } from '@/domain/gamefication/enterprise/entities/user'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserByIdRequest {
  requesterId: string
  targetUserId: string
}

type GetUserByIdResponse = Either<UseCaseError, User>

@Injectable()
export class GetUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    requesterId,
    targetUserId,
  }: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const requesterUser = await this.usersRepository.findById(requesterId)

    if (requesterId === targetUserId) {
      if (!requesterUser) {
        return left(new ResourceNotFoundError())
      }
      return right(requesterUser)
    }

    if (requesterUser?.role !== 'ADMIN') {
      return left(new NotAllowedError())
    }

    const targetUser = await this.usersRepository.findById(targetUserId)

    if (!targetUser) {
      return left(new ResourceNotFoundError())
    }

    return right(targetUser)
  }
}
