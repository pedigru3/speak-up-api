import { UseCaseError } from '@/core/errors/use-cases-error'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Task } from '@/domain/gamefication/enterprise/entities/task'

interface GetTaskByIdRequest {
  id: string
}

type GetTaskByIdResponse = Either<UseCaseError, Task>

export class GetTaskById {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({ id }: GetTaskByIdRequest): Promise<GetTaskByIdResponse> {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    return right(task)
  }
}
