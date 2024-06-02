import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { TaskAttachmentList } from '@/domain/gamefication/enterprise/entities/task-attachment-list'
import { TaskAttachment } from '@/domain/gamefication/enterprise/entities/task-attachment'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../repositories/teachers-repository'
import { NotAllowedError } from './errors/not-allowed-error'

interface CreateTaskUseCaseRequest {
  teacherId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateTaskUseCaseResponse = Either<UseCaseError, Task>

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private teachersRepository: TeachersRepository,
  ) {}

  async execute({
    content,
    teacherId,
    title,
    attachmentsIds,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const task = Task.create({
      authorId: new UniqueEntityID(teacherId),
      content,
      title,
    })

    const taskAttachments = attachmentsIds.map((attachmentId) => {
      return TaskAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        taskId: task.id,
      })
    })

    task.attachments = new TaskAttachmentList(taskAttachments)

    await this.tasksRepository.create(task)

    return right(task)
  }
}
