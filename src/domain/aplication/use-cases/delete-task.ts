/* eslint-disable @typescript-eslint/ban-types */
import { Either, left, rigth } from '@/core/either'
import { TasksRepository } from '../repositories/tasks-repository'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteTaskUseCaseRequest {
  taskId: string
  authorId: string
}

type DeleteTaskUseCaseResponse = Either<UseCaseError, {}>

export class DeleteTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    taskId,
    authorId,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    if (task.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.tasksRepository.delete(task)

    return rigth({})
  }
}
