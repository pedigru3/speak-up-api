import { Task } from '@/domain/gamefication/enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { TaskAttachment } from '@/domain/gamefication/enterprise/entities/task-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TaskAttachmentRepository } from '../repositories/task-attachment-repository'
import { TaskAttachmentList } from '@/domain/gamefication/enterprise/entities/task-attachment-list'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditTaskUseCaseRequest {
  authorId: string
  taskId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditTaskUseCaseResponse = Either<UseCaseError, Task>

export class EditTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private taskAttachmentRepository: TaskAttachmentRepository,
  ) {}

  async execute({
    authorId,
    taskId,
    title,
    content,
    attachmentsIds,
  }: EditTaskUseCaseRequest): Promise<EditTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    if (task.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentTasksAttachments =
      await this.taskAttachmentRepository.findManyByTaskId(taskId)

    const taskAttachmentList = new TaskAttachmentList(currentTasksAttachments)

    const tasksAttachments = attachmentsIds.map((attachmentId) => {
      return TaskAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        taskId: task.id,
      })
    })

    taskAttachmentList.update(tasksAttachments)

    task.title = title
    task.content = content
    task.attachments = taskAttachmentList

    return right(task)
  }
}
