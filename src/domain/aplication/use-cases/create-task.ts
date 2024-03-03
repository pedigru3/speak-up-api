import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { TaskAttachmentList } from '@/domain/enterprise/entities/task-attachment-list'
import { TaskAttachment } from '@/domain/enterprise/entities/task-attachment'

interface CreateTaskUseCaseRequest {
  teacherId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateTaskUseCaseResponse = Either<UseCaseError, Task>

export class CreateTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    content,
    teacherId,
    title,
    attachmentsIds,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
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

    return rigth(task)
  }
}
